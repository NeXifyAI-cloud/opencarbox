"""
Carvatoo - Workshop Routes
Werkstatt-API
"""

from fastapi import APIRouter, HTTPException, status, Depends
from typing import List, Optional
from auth import get_current_admin
from database import db
from datetime import datetime
import uuid

router = APIRouter(prefix="/workshop", tags=["Werkstatt"])

@router.get("/services")
async def get_services():
    """Gibt verfügbare Werkstatt-Services zurück."""
    # Hardcoded or from DB
    return [
        {
            "id": "inspection",
            "name": "Inspektion & Wartung",
            "description": "Regelmäßige Wartung nach Herstellervorgaben zum Erhalt der Garantie.",
            "priceFrom": 89.00,
            "duration": "1-2 Stunden",
            "icon": "ClipboardList"
        },
        # ... other services (can be moved to DB later)
    ]

@router.post("/appointments", status_code=status.HTTP_201_CREATED)
async def create_appointment(appointment_data: dict):
    """Erstellt eine neue Terminanfrage."""
    appointment = {
        "id": str(uuid.uuid4()),
        **appointment_data,
        "status": "pending",
        "created_at": datetime.utcnow()
    }
    await db.appointments.insert_one(appointment)
    appointment.pop("_id", None)
    return appointment

@router.get("/appointments")
async def get_appointments(current_admin: dict = Depends(get_current_admin)):
    """Gibt alle Termine zurück (Nur Admin)."""
    appointments = await db.appointments.find().sort("created_at", -1).to_list(100)
    for apt in appointments:
        apt.pop("_id", None)
    return appointments

@router.put("/appointments/{apt_id}/status")
async def update_appointment_status(
    apt_id: str, 
    status_update: dict,
    current_admin: dict = Depends(get_current_admin)
):
    """Aktualisiert den Status eines Termins (Nur Admin)."""
    new_status = status_update.get("status")
    if not new_status:
        raise HTTPException(status_code=400, detail="Status fehlt")
        
    result = await db.appointments.update_one(
        {"id": apt_id},
        {"$set": {"status": new_status}}
    )
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="Termin nicht gefunden")
    return {"message": "Status aktualisiert"}
