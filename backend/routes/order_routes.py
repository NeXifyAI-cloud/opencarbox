"""
Carvatoo - Order Routes
Bestellverwaltung
"""

from fastapi import APIRouter, HTTPException, status, Depends
from typing import List, Optional
from datetime import datetime
from database import db
from auth import get_current_user, get_current_admin
from models import UserRole
import uuid

router = APIRouter(prefix="/orders", tags=["Bestellungen"])

@router.post("/", status_code=status.HTTP_201_CREATED)
async def create_order(order_data: dict, current_user: dict = Depends(get_current_user)):
    """Erstellt eine neue Bestellung."""
    # Validiere Warenkorb/Items (vereinfacht)
    if not order_data.get("items"):
        raise HTTPException(status_code=400, detail="Keine Artikel in der Bestellung")

    # Bestellung erstellen
    order = {
        "id": str(uuid.uuid4()),
        "order_number": f"CT-{datetime.utcnow().strftime('%Y%m%d')}-{str(uuid.uuid4())[:8].upper()}",
        "user_id": current_user["user_id"],
        "created_at": datetime.utcnow(),
        "status": "pending",
        "payment_status": "paid", # Mock: Direkt bezahlt
        **order_data
    }
    
    # Berechne Total (Sicherheitscheck sollte hier stattfinden)
    total = sum(item["price"] * item["quantity"] for item in order["items"])
    shipping = 5.99 if total < 120 else 0
    order["subtotal"] = total
    order["shipping_cost"] = shipping
    order["total"] = total + shipping

    await db.orders.insert_one(order)
    
    # Update Product Stock
    for item in order["items"]:
        await db.products.update_one(
            {"id": item["product_id"]},
            {"$inc": {"stock": -item["quantity"], "sold_count": item["quantity"]}}
        )

    order.pop("_id", None)
    return order

@router.get("/me")
async def get_my_orders(current_user: dict = Depends(get_current_user)):
    """Gibt die Bestellungen des aktuellen Benutzers zurück."""
    orders = await db.orders.find({"user_id": current_user["user_id"]}).sort("created_at", -1).to_list(100)
    for order in orders:
        order.pop("_id", None)
    return orders

@router.get("/")
async def get_all_orders(
    page: int = 1, 
    limit: int = 20, 
    status: Optional[str] = None,
    current_admin: dict = Depends(get_current_admin)
):
    """Admin: Gibt alle Bestellungen zurück."""
    query = {}
    if status:
        query["status"] = status
        
    skip = (page - 1) * limit
    orders = await db.orders.find(query).sort("created_at", -1).skip(skip).limit(limit).to_list(limit)
    total = await db.orders.count_documents(query)
    
    for order in orders:
        order.pop("_id", None)
        
    return {
        "orders": orders,
        "total": total,
        "page": page,
        "pages": (total + limit - 1) // limit
    }

@router.get("/{order_id}")
async def get_order_details(order_id: str, current_user: dict = Depends(get_current_user)):
    """Gibt Details einer Bestellung zurück."""
    order = await db.orders.find_one({"id": order_id})
    if not order:
        order = await db.orders.find_one({"order_number": order_id})
        
    if not order:
        raise HTTPException(status_code=404, detail="Bestellung nicht gefunden")
        
    # Check Berechtigung
    if order["user_id"] != current_user["user_id"] and current_user["role"] != "admin":
        raise HTTPException(status_code=403, detail="Keine Berechtigung")
        
    order.pop("_id", None)
    return order

@router.put("/{order_id}/status")
async def update_order_status(
    order_id: str, 
    new_status: str,
    current_admin: dict = Depends(get_current_admin)
):
    """Admin: Aktualisiert den Status."""
    result = await db.orders.update_one(
        {"id": order_id},
        {"$set": {"status": new_status}}
    )
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="Bestellung nicht gefunden")
    return {"message": "Status aktualisiert"}
