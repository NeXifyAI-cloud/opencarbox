"""
Carvatoo - Vehicle Routes
Fahrzeughandel-API
"""

from fastapi import APIRouter, HTTPException, status, Depends
from typing import List, Optional
from models import UserRole
from auth import get_current_admin
from database import db
from datetime import datetime
import uuid

router = APIRouter(prefix="/vehicles", tags=["Fahrzeuge"])

@router.get("/", response_model=List[dict])
async def get_vehicles(
    type: Optional[str] = None, # new, used
    brand: Optional[str] = None,
    min_price: Optional[float] = None,
    max_price: Optional[float] = None,
    search: Optional[str] = None
):
    """Gibt verfügbare Fahrzeuge zurück."""
    query = {"is_sold": False}
    
    if type == "new":
        query["is_new"] = True
    elif type == "used":
        query["is_new"] = False
        
    if brand and brand != "all":
        query["brand"] = brand
        
    if min_price or max_price:
        query["price"] = {}
        if min_price:
            query["price"]["$gte"] = min_price
        if max_price:
            query["price"]["$lte"] = max_price
            
    if search:
        query["$or"] = [
            {"brand": {"$regex": search, "$options": "i"}},
            {"model": {"$regex": search, "$options": "i"}},
            {"variant": {"$regex": search, "$options": "i"}}
        ]
            
    vehicles = await db.vehicles_sales.find(query).to_list(100)
    for v in vehicles:
        v.pop("_id", None)
    return vehicles

@router.post("/", status_code=status.HTTP_201_CREATED)
async def create_vehicle(vehicle_data: dict, current_admin: dict = Depends(get_current_admin)):
    """Erstellt ein neues Fahrzeug (Nur Admin)."""
    vehicle = {
        "id": str(uuid.uuid4()),
        **vehicle_data,
        "created_at": datetime.utcnow(),
        "is_sold": False
    }
    await db.vehicles_sales.insert_one(vehicle)
    vehicle.pop("_id", None)
    return vehicle

@router.delete("/{vehicle_id}")
async def delete_vehicle(vehicle_id: str, current_admin: dict = Depends(get_current_admin)):
    """Löscht ein Fahrzeug (Nur Admin)."""
    result = await db.vehicles_sales.delete_one({"id": vehicle_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Fahrzeug nicht gefunden")
    return {"message": "Fahrzeug gelöscht"}
