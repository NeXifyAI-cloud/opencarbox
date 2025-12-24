"""
Carvatoo - Kategorie Routes
Kategorie-CRUD
"""

from fastapi import APIRouter, HTTPException, status, Depends
from typing import List
import logging

from models import Category, CategoryCreate, CategoryUpdate, Subcategory
from auth import get_current_admin
from database import db

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/categories", tags=["Kategorien"])


@router.get("", response_model=List[Category])
async def get_categories(include_inactive: bool = False):
    """Gibt alle Kategorien zurück."""
    filter_query = {} if include_inactive else {"is_active": True}
    categories = await db.categories.find(filter_query).to_list(100)
    
    for category in categories:
        category.pop("_id", None)
    
    return categories


@router.get("/{category_id}", response_model=Category)
async def get_category(category_id: str):
    """Gibt eine einzelne Kategorie zurück."""
    category = await db.categories.find_one({"id": category_id})
    
    if not category:
        # Versuche es mit slug
        category = await db.categories.find_one({"slug": category_id})
    
    if not category:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Kategorie nicht gefunden"
        )
    
    category.pop("_id", None)
    return category


@router.get("/{category_id}/products")
async def get_category_products(category_id: str, page: int = 1, limit: int = 20):
    """Gibt alle Produkte einer Kategorie zurück."""
    # Kategorie finden
    category = await db.categories.find_one({"$or": [{"id": category_id}, {"slug": category_id}]})
    
    if not category:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Kategorie nicht gefunden"
        )
    
    skip = (page - 1) * limit
    products = await db.products.find(
        {"category_id": category["id"], "is_active": True}
    ).skip(skip).limit(limit).to_list(limit)
    
    for product in products:
        product.pop("_id", None)
    
    return {
        "category": {k: v for k, v in category.items() if k != "_id"},
        "products": products,
        "total": await db.products.count_documents({"category_id": category["id"], "is_active": True})
    }


# ============== ADMIN ROUTES ==============

@router.post("", response_model=Category)
async def create_category(
    category_data: CategoryCreate,
    current_admin: dict = Depends(get_current_admin)
):
    """Erstellt eine neue Kategorie (Admin only)."""
    
    # Prüfen ob Slug bereits existiert
    existing = await db.categories.find_one({"slug": category_data.slug})
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Kategorie-Slug bereits vorhanden"
        )
    
    # Unterkategorien mit IDs versehen
    subcategories = [
        Subcategory(**sub.dict()).dict() 
        for sub in category_data.subcategories
    ]
    
    category = Category(
        name=category_data.name,
        slug=category_data.slug,
        description=category_data.description,
        icon=category_data.icon,
        image=category_data.image,
        subcategories=subcategories
    )
    
    await db.categories.insert_one(category.dict())
    logger.info(f"Kategorie erstellt: {category.name}")
    
    return category


@router.put("/{category_id}", response_model=Category)
async def update_category(
    category_id: str,
    updates: CategoryUpdate,
    current_admin: dict = Depends(get_current_admin)
):
    """Aktualisiert eine Kategorie (Admin only)."""
    
    category = await db.categories.find_one({"id": category_id})
    if not category:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Kategorie nicht gefunden"
        )
    
    update_data = {k: v for k, v in updates.dict().items() if v is not None}
    
    await db.categories.update_one(
        {"id": category_id},
        {"$set": update_data}
    )
    
    updated_category = await db.categories.find_one({"id": category_id})
    updated_category.pop("_id", None)
    
    logger.info(f"Kategorie aktualisiert: {category_id}")
    return updated_category


@router.delete("/{category_id}")
async def delete_category(
    category_id: str,
    current_admin: dict = Depends(get_current_admin)
):
    """Löscht eine Kategorie (soft delete) (Admin only)."""
    
    result = await db.categories.update_one(
        {"id": category_id},
        {"$set": {"is_active": False}}
    )
    
    if result.modified_count == 0:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Kategorie nicht gefunden"
        )
    
    logger.info(f"Kategorie gelöscht: {category_id}")
    return {"message": "Kategorie gelöscht"}


@router.post("/{category_id}/subcategories")
async def add_subcategory(
    category_id: str,
    subcategory_data: dict,
    current_admin: dict = Depends(get_current_admin)
):
    """Fügt eine Unterkategorie hinzu (Admin only)."""
    
    subcategory = Subcategory(
        name=subcategory_data["name"],
        slug=subcategory_data["slug"],
        description=subcategory_data.get("description")
    )
    
    result = await db.categories.update_one(
        {"id": category_id},
        {"$push": {"subcategories": subcategory.dict()}}
    )
    
    if result.modified_count == 0:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Kategorie nicht gefunden"
        )
    
    return {"message": "Unterkategorie hinzugefügt", "subcategory": subcategory.dict()}
