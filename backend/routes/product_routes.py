"""
Carvatoo - Product Routes
Produktverwaltung
"""

from fastapi import APIRouter, HTTPException, status, Depends
from typing import List, Optional
from database import db
from auth import get_current_admin
from datetime import datetime
import uuid

router = APIRouter(prefix="/products", tags=["Produkte"])

@router.get("/")
async def get_products(
    category: Optional[str] = None,
    search: Optional[str] = None,
    page: int = 1,
    limit: int = 20
):
    """Gibt Produkte gefiltert zurück."""
    query = {"is_active": True}
    
    if category:
        # Finde Kategorie-ID anhand Slug oder ID
        cat = await db.categories.find_one({"$or": [{"id": category}, {"slug": category}]})
        if cat:
            # Suche auch in Subkategorien (vereinfacht)
            query["$or"] = [
                {"category_id": cat["id"]},
                {"subcategory_id": cat["id"]},
                {"category_slug": cat.get("slug")} # Fallback für alte Daten
            ]
    
    if search:
        query["$or"] = [
            {"name": {"$regex": search, "$options": "i"}},
            {"brand": {"$regex": search, "$options": "i"}},
            {"sku": {"$regex": search, "$options": "i"}}
        ]

    skip = (page - 1) * limit
    products = await db.products.find(query).skip(skip).limit(limit).to_list(limit)
    
    for p in products:
        p.pop("_id", None)
        
    return products

@router.get("/count")
async def count_products(search: Optional[str] = None):
    query = {"is_active": True}
    if search:
        query["$or"] = [
            {"name": {"$regex": search, "$options": "i"}},
            {"brand": {"$regex": search, "$options": "i"}}
        ]
    count = await db.products.count_documents(query)
    return {"count": count}

@router.get("/{product_id}")
async def get_product(product_id: str):
    """Gibt ein einzelnes Produkt zurück."""
    product = await db.products.find_one({"id": product_id})
    if not product:
        raise HTTPException(status_code=404, detail="Produkt nicht gefunden")
    product.pop("_id", None)
    return product

@router.post("/", status_code=status.HTTP_201_CREATED)
async def create_product(product_data: dict, current_admin: dict = Depends(get_current_admin)):
    """Admin: Erstellt ein Produkt."""
    product = {
        "id": str(uuid.uuid4()),
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow(),
        "is_active": True,
        **product_data
    }
    await db.products.insert_one(product)
    product.pop("_id", None)
    return product

@router.put("/{product_id}")
async def update_product(
    product_id: str, 
    product_data: dict, 
    current_admin: dict = Depends(get_current_admin)
):
    """Admin: Aktualisiert ein Produkt."""
    product_data["updated_at"] = datetime.utcnow()
    
    # Entferne nicht updatebare Felder
    product_data.pop("id", None)
    product_data.pop("created_at", None)
    
    result = await db.products.update_one(
        {"id": product_id},
        {"$set": product_data}
    )
    
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Produkt nicht gefunden")
        
    return {"message": "Produkt aktualisiert", "id": product_id}

@router.delete("/{product_id}")
async def delete_product(product_id: str, current_admin: dict = Depends(get_current_admin)):
    """Admin: Löscht ein Produkt (Soft Delete bevorzugt, hier Hard Delete für Demo)."""
    result = await db.products.delete_one({"id": product_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Produkt nicht gefunden")
    return {"message": "Produkt gelöscht"}
