"""
Carvatoo - Bestellungen Routes
Bestellungs-Management
"""

from fastapi import APIRouter, HTTPException, status, Depends, Header
from typing import List, Optional
from pydantic import BaseModel, EmailStr
from datetime import datetime
import logging

from models import Order, OrderCreate, OrderItem, OrderStatus, PaymentStatus, ShippingInfo, Address
from auth import get_current_user, get_current_admin
from database import db

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/orders", tags=["Bestellungen"])


class CheckoutRequest(BaseModel):
    shipping_info: ShippingInfo
    billing_same_as_shipping: bool = True
    billing_address: Optional[Address] = None
    payment_method: str
    coupon_code: Optional[str] = None
    notes: Optional[str] = None


@router.post("", response_model=Order)
async def create_order(
    checkout: CheckoutRequest,
    session_id: Optional[str] = Header(None, alias="X-Session-ID")
):
    """Erstellt eine neue Bestellung."""
    # Warenkorb holen
    cart = await db.carts.find_one({"session_id": session_id})
    
    if not cart or not cart.get("items"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Warenkorb ist leer"
        )
    
    # Produkte validieren und Order Items erstellen
    order_items = []
    subtotal = 0
    
    for item in cart["items"]:
        product = await db.products.find_one({"id": item["product_id"]})
        
        if not product:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Produkt {item['product_id']} nicht mehr verfügbar"
            )
        
        if product["stock"] < item["quantity"]:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Nicht genügend Lagerbestand für {product['name']}"
            )
        
        item_total = item["quantity"] * item["price"]
        subtotal += item_total
        
        order_items.append(OrderItem(
            product_id=item["product_id"],
            product_name=product["name"],
            product_sku=product["sku"],
            product_image=product["images"][0] if product.get("images") else None,
            quantity=item["quantity"],
            unit_price=item["price"],
            total_price=item_total
        ))
    
    # Versandkosten
    shipping_cost = 0 if subtotal >= 120 else 5.99
    
    # Rabatt berechnen
    discount = 0
    if checkout.coupon_code:
        coupon = await db.coupons.find_one({"code": checkout.coupon_code.upper(), "is_active": True})
        if coupon:
            if coupon["type"] == "percentage":
                discount = subtotal * (coupon["value"] / 100)
            else:
                discount = coupon["value"]
            # Coupon-Nutzung erhöhen
            await db.coupons.update_one(
                {"code": checkout.coupon_code.upper()},
                {"$inc": {"used_count": 1}}
            )
    
    total = subtotal + shipping_cost - discount
    
    # Bestellung erstellen
    order = Order(
        shipping_info=checkout.shipping_info,
        billing_same_as_shipping=checkout.billing_same_as_shipping,
        billing_address=checkout.billing_address,
        notes=checkout.notes,
        items=[item.dict() for item in order_items],
        subtotal=subtotal,
        shipping_cost=shipping_cost,
        discount=discount,
        discount_code=checkout.coupon_code,
        total=total,
        payment_method=checkout.payment_method
    )
    
    await db.orders.insert_one(order.dict())
    
    # Lagerbestand reduzieren
    for item in cart["items"]:
        await db.products.update_one(
            {"id": item["product_id"]},
            {
                "$inc": {
                    "stock": -item["quantity"],
                    "sold_count": item["quantity"]
                }
            }
        )
    
    # Warenkorb leeren
    await db.carts.update_one(
        {"session_id": session_id},
        {"$set": {"items": []}}
    )
    
    logger.info(f"Bestellung erstellt: {order.order_number}")
    return order


@router.get("/{order_id}")
async def get_order(order_id: str):
    """Gibt eine Bestellung zurück."""
    order = await db.orders.find_one({"$or": [{"id": order_id}, {"order_number": order_id}]})
    
    if not order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Bestellung nicht gefunden"
        )
    
    order.pop("_id", None)
    return order


@router.get("/user/my-orders")
async def get_my_orders(current_user: dict = Depends(get_current_user)):
    """Gibt alle Bestellungen des aktuellen Benutzers zurück."""
    orders = await db.orders.find(
        {"user_id": current_user["user_id"]}
    ).sort("created_at", -1).to_list(100)
    
    for order in orders:
        order.pop("_id", None)
    
    return orders


# ============== ADMIN ROUTES ==============

@router.get("")
async def get_all_orders(
    status: Optional[str] = None,
    page: int = 1,
    limit: int = 20,
    current_admin: dict = Depends(get_current_admin)
):
    """Gibt alle Bestellungen zurück (Admin only)."""
    filter_query = {}
    if status:
        filter_query["status"] = status
    
    skip = (page - 1) * limit
    orders = await db.orders.find(filter_query).sort("created_at", -1).skip(skip).limit(limit).to_list(limit)
    
    for order in orders:
        order.pop("_id", None)
    
    total = await db.orders.count_documents(filter_query)
    
    return {
        "orders": orders,
        "total": total,
        "page": page,
        "pages": (total + limit - 1) // limit
    }


@router.put("/{order_id}/status")
async def update_order_status(
    order_id: str,
    new_status: str,
    tracking_number: Optional[str] = None,
    current_admin: dict = Depends(get_current_admin)
):
    """Aktualisiert den Status einer Bestellung (Admin only)."""
    valid_statuses = [s.value for s in OrderStatus]
    if new_status not in valid_statuses:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Ungültiger Status. Erlaubt: {valid_statuses}"
        )
    
    update_data = {
        "status": new_status,
        "updated_at": datetime.utcnow()
    }
    
    if tracking_number:
        update_data["tracking_number"] = tracking_number
    
    result = await db.orders.update_one(
        {"id": order_id},
        {"$set": update_data}
    )
    
    if result.modified_count == 0:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Bestellung nicht gefunden"
        )
    
    logger.info(f"Bestellstatus aktualisiert: {order_id} -> {new_status}")
    return {"message": "Status aktualisiert"}


@router.put("/{order_id}/payment")
async def update_payment_status(
    order_id: str,
    payment_status: str,
    current_admin: dict = Depends(get_current_admin)
):
    """Aktualisiert den Zahlungsstatus (Admin only)."""
    valid_statuses = [s.value for s in PaymentStatus]
    if payment_status not in valid_statuses:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Ungültiger Zahlungsstatus. Erlaubt: {valid_statuses}"
        )
    
    result = await db.orders.update_one(
        {"id": order_id},
        {"$set": {"payment_status": payment_status, "updated_at": datetime.utcnow()}}
    )
    
    if result.modified_count == 0:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Bestellung nicht gefunden"
        )
    
    return {"message": "Zahlungsstatus aktualisiert"}
