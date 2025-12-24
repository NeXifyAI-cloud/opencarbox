"""
Carvatoo - Produkt Routes
Produkt-CRUD und Suche
"""

from fastapi import APIRouter, HTTPException, status, Depends, Query
from typing import List, Optional
import logging
import re

from models import Product, ProductCreate, ProductUpdate
from auth import get_current_admin
from database import db

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/products", tags=["Produkte"])


@router.get("", response_model=List[Product])
async def get_products(
    category_id: Optional[str] = None,
    subcategory_id: Optional[str] = None,
    brand: Optional[str] = None,
    min_price: Optional[float] = None,
    max_price: Optional[float] = None,
    in_stock: Optional[bool] = None,
    search: Optional[str] = None,
    sort_by: str = "created_at",
    sort_order: str = "desc",
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100)
):
    """Gibt eine Liste von Produkten zurück mit Filterung und Pagination."""
    
    # Filter aufbauen
    filter_query = {"is_active": True}
    
    if category_id:
        filter_query["category_id"] = category_id
    if subcategory_id:
        filter_query["subcategory_id"] = subcategory_id
    if brand:
        filter_query["brand"] = brand
    if min_price is not None:
        filter_query["price"] = {"$gte": min_price}
    if max_price is not None:
        if "price" in filter_query:
            filter_query["price"]["$lte"] = max_price
        else:
            filter_query["price"] = {"$lte": max_price}
    if in_stock:
        filter_query["stock"] = {"$gt": 0}
    if search:
        # Textsuche in Name, Beschreibung, SKU, OEM-Nummern
        search_regex = re.compile(search, re.IGNORECASE)
        filter_query["$or"] = [
            {"name": {"$regex": search_regex}},
            {"description": {"$regex": search_regex}},
            {"sku": {"$regex": search_regex}},
            {"oem_numbers": {"$in": [search_regex]}},
            {"brand": {"$regex": search_regex}}
        ]
    
    # Sortierung
    sort_direction = -1 if sort_order == "desc" else 1
    sort_field = sort_by if sort_by in ["price", "created_at", "name", "rating", "sold_count"] else "created_at"
    
    # Pagination
    skip = (page - 1) * limit
    
    products = await db.products.find(filter_query).sort(sort_field, sort_direction).skip(skip).limit(limit).to_list(limit)
    
    # _id entfernen
    for product in products:
        product.pop("_id", None)
    
    return products


@router.get("/count")
async def get_products_count(
    category_id: Optional[str] = None,
    subcategory_id: Optional[str] = None,
    brand: Optional[str] = None,
    search: Optional[str] = None
):
    """Gibt die Anzahl der Produkte zurück."""
    filter_query = {"is_active": True}
    
    if category_id:
        filter_query["category_id"] = category_id
    if subcategory_id:
        filter_query["subcategory_id"] = subcategory_id
    if brand:
        filter_query["brand"] = brand
    if search:
        search_regex = re.compile(search, re.IGNORECASE)
        filter_query["$or"] = [
            {"name": {"$regex": search_regex}},
            {"sku": {"$regex": search_regex}},
            {"brand": {"$regex": search_regex}}
        ]
    
    count = await db.products.count_documents(filter_query)
    return {"count": count}


@router.get("/featured", response_model=List[Product])
async def get_featured_products(limit: int = Query(6, ge=1, le=20)):
    """Gibt die Featured-Produkte zurück."""
    products = await db.products.find(
        {"is_active": True, "is_featured": True}
    ).sort("sold_count", -1).limit(limit).to_list(limit)
    
    for product in products:
        product.pop("_id", None)
    
    return products


@router.get("/brands")
async def get_brands():
    """Gibt alle verfügbaren Marken zurück."""
    brands = await db.products.distinct("brand", {"is_active": True})
    return brands


@router.get("/{product_id}", response_model=Product)
async def get_product(product_id: str):
    """Gibt ein einzelnes Produkt zurück."""
    product = await db.products.find_one({"id": product_id, "is_active": True})
    
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Produkt nicht gefunden"
        )
    
    product.pop("_id", None)
    return product


@router.get("/{product_id}/related", response_model=List[Product])
async def get_related_products(product_id: str, limit: int = Query(4, ge=1, le=10)):
    """Gibt ähnliche Produkte zurück."""
    product = await db.products.find_one({"id": product_id})
    
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Produkt nicht gefunden"
        )
    
    # Ähnliche Produkte aus gleicher Kategorie
    related = await db.products.find({
        "is_active": True,
        "id": {"$ne": product_id},
        "category_id": product["category_id"]
    }).limit(limit).to_list(limit)
    
    for p in related:
        p.pop("_id", None)
    
    return related


# ============== ADMIN ROUTES ==============

@router.post("", response_model=Product)
async def create_product(
    product_data: ProductCreate,
    current_admin: dict = Depends(get_current_admin)
):
    """Erstellt ein neues Produkt (Admin only)."""
    
    # Prüfen ob SKU bereits existiert
    existing = await db.products.find_one({"sku": product_data.sku})
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="SKU bereits vorhanden"
        )
    
    # Rabatt berechnen
    discount_percent = None
    if product_data.original_price and product_data.original_price > product_data.price:
        discount_percent = int(((product_data.original_price - product_data.price) / product_data.original_price) * 100)
    
    product = Product(
        **product_data.dict(),
        discount_percent=discount_percent
    )
    
    await db.products.insert_one(product.dict())
    
    # Kategorie-Zähler aktualisieren
    await db.categories.update_one(
        {"id": product_data.category_id},
        {"$inc": {"product_count": 1}}
    )
    
    logger.info(f"Produkt erstellt: {product.name} (SKU: {product.sku})")
    return product


@router.put("/{product_id}", response_model=Product)
async def update_product(
    product_id: str,
    updates: ProductUpdate,
    current_admin: dict = Depends(get_current_admin)
):
    """Aktualisiert ein Produkt (Admin only)."""
    
    product = await db.products.find_one({"id": product_id})
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Produkt nicht gefunden"
        )
    
    update_data = {k: v for k, v in updates.dict().items() if v is not None}
    
    # Rabatt neu berechnen wenn Preis geändert
    if "price" in update_data or "original_price" in update_data:
        price = update_data.get("price", product["price"])
        original_price = update_data.get("original_price", product.get("original_price"))
        if original_price and original_price > price:
            update_data["discount_percent"] = int(((original_price - price) / original_price) * 100)
        else:
            update_data["discount_percent"] = None
    
    await db.products.update_one(
        {"id": product_id},
        {"$set": update_data}
    )
    
    updated_product = await db.products.find_one({"id": product_id})
    updated_product.pop("_id", None)
    
    logger.info(f"Produkt aktualisiert: {product_id}")
    return updated_product


@router.delete("/{product_id}")
async def delete_product(
    product_id: str,
    current_admin: dict = Depends(get_current_admin)
):
    """Löscht ein Produkt (soft delete) (Admin only)."""
    
    result = await db.products.update_one(
        {"id": product_id},
        {"$set": {"is_active": False}}
    )
    
    if result.modified_count == 0:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Produkt nicht gefunden"
        )
    
    logger.info(f"Produkt gelöscht: {product_id}")
    return {"message": "Produkt gelöscht"}
