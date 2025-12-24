"""
Carvatoo - Warenkorb Routes
Warenkorb-Management
"""

from fastapi import APIRouter, HTTPException, status, Depends, Header
from typing import List, Optional
from pydantic import BaseModel
import logging
import uuid

from models import Cart, CartItem
from auth import get_current_user
from database import db

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/cart", tags=["Warenkorb"])


class AddToCartRequest(BaseModel):
    product_id: str
    quantity: int = 1


class UpdateCartItemRequest(BaseModel):
    quantity: int


async def get_or_create_cart(user_id: Optional[str] = None, session_id: Optional[str] = None) -> dict:
    """Holt oder erstellt einen Warenkorb."""
    if user_id:
        cart = await db.carts.find_one({"user_id": user_id})
    elif session_id:
        cart = await db.carts.find_one({"session_id": session_id})
    else:
        return None
    
    if not cart:
        cart = Cart(
            user_id=user_id,
            session_id=session_id if not user_id else None
        ).dict()
        await db.carts.insert_one(cart)
    
    return cart


@router.get("")
async def get_cart(
    session_id: Optional[str] = Header(None, alias="X-Session-ID"),
    current_user: Optional[dict] = None
):
    """Gibt den aktuellen Warenkorb zurück."""
    # Versuche Token zu dekodieren (optional)
    user_id = current_user["user_id"] if current_user else None
    
    cart = await get_or_create_cart(user_id, session_id)
    
    if not cart:
        return {"items": [], "total": 0, "item_count": 0}
    
    # Produkt-Details laden
    items_with_details = []
    total = 0
    
    for item in cart.get("items", []):
        product = await db.products.find_one({"id": item["product_id"]})
        if product:
            item_total = item["quantity"] * item["price"]
            total += item_total
            items_with_details.append({
                "product_id": item["product_id"],
                "quantity": item["quantity"],
                "price": item["price"],
                "total": item_total,
                "product": {
                    "name": product["name"],
                    "brand": product["brand"],
                    "image": product["images"][0] if product.get("images") else None,
                    "sku": product["sku"],
                    "stock": product["stock"]
                }
            })
    
    cart.pop("_id", None)
    return {
        "id": cart["id"],
        "items": items_with_details,
        "item_count": sum(item["quantity"] for item in items_with_details),
        "subtotal": total,
        "shipping": 0 if total >= 120 else 5.99,
        "total": total + (0 if total >= 120 else 5.99)
    }


@router.post("/items")
async def add_to_cart(
    request: AddToCartRequest,
    session_id: Optional[str] = Header(None, alias="X-Session-ID")
):
    """Fügt ein Produkt zum Warenkorb hinzu."""
    # Produkt prüfen
    product = await db.products.find_one({"id": request.product_id, "is_active": True})
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Produkt nicht gefunden"
        )
    
    if product["stock"] < request.quantity:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Nicht genügend Lagerbestand"
        )
    
    # Session-ID generieren falls nicht vorhanden
    if not session_id:
        session_id = str(uuid.uuid4())
    
    cart = await get_or_create_cart(session_id=session_id)
    
    # Prüfen ob Produkt bereits im Warenkorb
    existing_item = None
    for i, item in enumerate(cart.get("items", [])):
        if item["product_id"] == request.product_id:
            existing_item = (i, item)
            break
    
    if existing_item:
        # Menge erhöhen
        new_quantity = existing_item[1]["quantity"] + request.quantity
        if new_quantity > product["stock"]:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Nicht genügend Lagerbestand"
            )
        
        await db.carts.update_one(
            {"id": cart["id"], "items.product_id": request.product_id},
            {"$set": {"items.$.quantity": new_quantity}}
        )
    else:
        # Neues Item hinzufügen
        new_item = CartItem(
            product_id=request.product_id,
            quantity=request.quantity,
            price=product["price"]
        ).dict()
        
        await db.carts.update_one(
            {"id": cart["id"]},
            {"$push": {"items": new_item}}
        )
    
    logger.info(f"Produkt {request.product_id} zum Warenkorb hinzugefügt")
    return {"message": "Produkt hinzugefügt", "session_id": session_id}


@router.put("/items/{product_id}")
async def update_cart_item(
    product_id: str,
    request: UpdateCartItemRequest,
    session_id: Optional[str] = Header(None, alias="X-Session-ID")
):
    """Aktualisiert die Menge eines Warenkorb-Items."""
    if request.quantity < 1:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Menge muss mindestens 1 sein"
        )
    
    # Lagerbestand prüfen
    product = await db.products.find_one({"id": product_id})
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Produkt nicht gefunden"
        )
    
    if request.quantity > product["stock"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Nicht genügend Lagerbestand"
        )
    
    result = await db.carts.update_one(
        {"session_id": session_id, "items.product_id": product_id},
        {"$set": {"items.$.quantity": request.quantity}}
    )
    
    if result.modified_count == 0:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Produkt nicht im Warenkorb gefunden"
        )
    
    return {"message": "Menge aktualisiert"}


@router.delete("/items/{product_id}")
async def remove_from_cart(
    product_id: str,
    session_id: Optional[str] = Header(None, alias="X-Session-ID")
):
    """Entfernt ein Produkt aus dem Warenkorb."""
    result = await db.carts.update_one(
        {"session_id": session_id},
        {"$pull": {"items": {"product_id": product_id}}}
    )
    
    if result.modified_count == 0:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Produkt nicht im Warenkorb gefunden"
        )
    
    return {"message": "Produkt entfernt"}


@router.delete("")
async def clear_cart(
    session_id: Optional[str] = Header(None, alias="X-Session-ID")
):
    """Leert den Warenkorb."""
    await db.carts.update_one(
        {"session_id": session_id},
        {"$set": {"items": []}}
    )
    
    return {"message": "Warenkorb geleert"}


@router.post("/coupon")
async def apply_coupon(
    code: str,
    session_id: Optional[str] = Header(None, alias="X-Session-ID")
):
    """Wendet einen Gutscheincode an."""
    coupon = await db.coupons.find_one({"code": code.upper(), "is_active": True})
    
    if not coupon:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Gutscheincode nicht gefunden oder abgelaufen"
        )
    
    # Warenkorb holen
    cart = await db.carts.find_one({"session_id": session_id})
    if not cart or not cart.get("items"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Warenkorb ist leer"
        )
    
    # Mindestbestellwert prüfen
    total = sum(item["quantity"] * item["price"] for item in cart["items"])
    if total < coupon.get("min_order_value", 0):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Mindestbestellwert von {coupon['min_order_value']}€ nicht erreicht"
        )
    
    # Rabatt berechnen
    if coupon["type"] == "percentage":
        discount = total * (coupon["value"] / 100)
    else:
        discount = coupon["value"]
    
    return {
        "code": coupon["code"],
        "type": coupon["type"],
        "value": coupon["value"],
        "discount": round(discount, 2),
        "message": f"Gutschein angewendet: {coupon['value']}{'%' if coupon['type'] == 'percentage' else '€'} Rabatt"
    }
