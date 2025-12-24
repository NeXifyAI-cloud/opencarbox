"""
Carvatoo - Admin Routes
Admin-Dashboard und Verwaltung
"""

from fastapi import APIRouter, HTTPException, status, Depends
from datetime import datetime, timedelta
from typing import List, Optional
import logging

from models import DashboardStats, User, UserRole
from auth import get_current_admin, get_password_hash
from database import db

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/admin", tags=["Admin"])


@router.get("/dashboard")
async def get_dashboard(current_admin: dict = Depends(get_current_admin)):
    """Gibt Dashboard-Statistiken zurück."""
    
    today = datetime.utcnow().replace(hour=0, minute=0, second=0, microsecond=0)
    
    # Gesamt-Statistiken
    total_orders = await db.orders.count_documents({})
    total_customers = await db.users.count_documents({"role": "customer"})
    total_products = await db.products.count_documents({"is_active": True})
    
    # Ausstehende Bestellungen
    pending_orders = await db.orders.count_documents({"status": "pending"})
    
    # Low-Stock Produkte (unter 10)
    low_stock = await db.products.count_documents({"stock": {"$lt": 10}, "is_active": True})
    
    # Heutige Statistiken
    orders_today = await db.orders.count_documents({"created_at": {"$gte": today}})
    
    # Umsatz berechnen
    revenue_pipeline = [
        {"$group": {"_id": None, "total": {"$sum": "$total"}}}
    ]
    revenue_result = await db.orders.aggregate(revenue_pipeline).to_list(1)
    total_revenue = revenue_result[0]["total"] if revenue_result else 0
    
    revenue_today_pipeline = [
        {"$match": {"created_at": {"$gte": today}}},
        {"$group": {"_id": None, "total": {"$sum": "$total"}}}
    ]
    revenue_today_result = await db.orders.aggregate(revenue_today_pipeline).to_list(1)
    revenue_today = revenue_today_result[0]["total"] if revenue_today_result else 0
    
    # Letzte Bestellungen
    recent_orders = await db.orders.find().sort("created_at", -1).limit(5).to_list(5)
    for order in recent_orders:
        order.pop("_id", None)
    
    # Top-Produkte
    top_products = await db.products.find({"is_active": True}).sort("sold_count", -1).limit(5).to_list(5)
    for product in top_products:
        product.pop("_id", None)
    
    return {
        "stats": {
            "total_orders": total_orders,
            "total_revenue": round(total_revenue, 2),
            "total_customers": total_customers,
            "total_products": total_products,
            "pending_orders": pending_orders,
            "low_stock_products": low_stock,
            "orders_today": orders_today,
            "revenue_today": round(revenue_today, 2)
        },
        "recent_orders": recent_orders,
        "top_products": top_products
    }


@router.get("/customers")
async def get_customers(
    page: int = 1,
    limit: int = 20,
    search: Optional[str] = None,
    current_admin: dict = Depends(get_current_admin)
):
    """Gibt alle Kunden zurück."""
    filter_query = {"role": "customer"}
    
    if search:
        filter_query["$or"] = [
            {"email": {"$regex": search, "$options": "i"}},
            {"first_name": {"$regex": search, "$options": "i"}},
            {"last_name": {"$regex": search, "$options": "i"}}
        ]
    
    skip = (page - 1) * limit
    customers = await db.users.find(filter_query).skip(skip).limit(limit).to_list(limit)
    
    for customer in customers:
        customer.pop("_id", None)
        customer.pop("hashed_password", None)
    
    total = await db.users.count_documents(filter_query)
    
    return {
        "customers": customers,
        "total": total,
        "page": page,
        "pages": (total + limit - 1) // limit
    }


@router.get("/customers/{customer_id}")
async def get_customer(
    customer_id: str,
    current_admin: dict = Depends(get_current_admin)
):
    """Gibt einen einzelnen Kunden zurück."""
    customer = await db.users.find_one({"id": customer_id})
    
    if not customer:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Kunde nicht gefunden"
        )
    
    customer.pop("_id", None)
    customer.pop("hashed_password", None)
    
    # Bestellhistorie laden
    orders = await db.orders.find({"user_id": customer_id}).sort("created_at", -1).to_list(100)
    for order in orders:
        order.pop("_id", None)
    
    customer["orders"] = orders
    customer["order_count"] = len(orders)
    customer["total_spent"] = sum(order["total"] for order in orders)
    
    return customer


@router.put("/customers/{customer_id}/status")
async def update_customer_status(
    customer_id: str,
    is_active: bool,
    current_admin: dict = Depends(get_current_admin)
):
    """Aktiviert/Deaktiviert einen Kunden."""
    result = await db.users.update_one(
        {"id": customer_id},
        {"$set": {"is_active": is_active}}
    )
    
    if result.modified_count == 0:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Kunde nicht gefunden"
        )
    
    return {"message": f"Kunde {'aktiviert' if is_active else 'deaktiviert'}"}


@router.post("/create-admin")
async def create_admin(
    email: str,
    password: str,
    first_name: str,
    last_name: str,
    current_admin: dict = Depends(get_current_admin)
):
    """Erstellt einen neuen Admin-Benutzer."""
    existing = await db.users.find_one({"email": email})
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="E-Mail bereits registriert"
        )
    
    admin = {
        "id": str(__import__('uuid').uuid4()),
        "email": email,
        "first_name": first_name,
        "last_name": last_name,
        "hashed_password": get_password_hash(password),
        "role": UserRole.ADMIN.value,
        "is_active": True,
        "created_at": datetime.utcnow(),
        "addresses": [],
        "wishlist": []
    }
    
    await db.users.insert_one(admin)
    logger.info(f"Admin erstellt: {email}")
    
    return {"message": "Admin erstellt", "id": admin["id"]}


@router.get("/coupons")
async def get_coupons(current_admin: dict = Depends(get_current_admin)):
    """Gibt alle Gutscheine zurück."""
    coupons = await db.coupons.find().to_list(100)
    for coupon in coupons:
        coupon.pop("_id", None)
    return coupons


@router.post("/coupons")
async def create_coupon(
    code: str,
    coupon_type: str,
    value: float,
    min_order_value: float = 0,
    max_uses: Optional[int] = None,
    valid_until: Optional[datetime] = None,
    current_admin: dict = Depends(get_current_admin)
):
    """Erstellt einen neuen Gutschein."""
    existing = await db.coupons.find_one({"code": code.upper()})
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Gutscheincode bereits vorhanden"
        )
    
    coupon = {
        "id": str(__import__('uuid').uuid4()),
        "code": code.upper(),
        "type": coupon_type,
        "value": value,
        "min_order_value": min_order_value,
        "max_uses": max_uses,
        "used_count": 0,
        "valid_from": datetime.utcnow(),
        "valid_until": valid_until,
        "is_active": True
    }
    
    await db.coupons.insert_one(coupon)
    return {"message": "Gutschein erstellt", "coupon": coupon}


@router.delete("/coupons/{coupon_id}")
async def delete_coupon(
    coupon_id: str,
    current_admin: dict = Depends(get_current_admin)
):
    """Löscht einen Gutschein."""
    result = await db.coupons.delete_one({"id": coupon_id})
    
    if result.deleted_count == 0:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Gutschein nicht gefunden"
        )
    
    return {"message": "Gutschein gelöscht"}
