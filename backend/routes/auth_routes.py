"""
Carvatoo - Auth Routes
Registrierung, Login, Passwort-Reset
"""

from fastapi import APIRouter, HTTPException, status, Depends
from pydantic import BaseModel, EmailStr
from datetime import timedelta
from typing import Optional
import logging

from models import User, UserCreate, UserInDB, UserRole
from auth import (
    get_password_hash, 
    verify_password, 
    create_access_token,
    get_current_user,
    ACCESS_TOKEN_EXPIRE_MINUTES
)
from database import db

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/auth", tags=["Authentifizierung"])


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: dict


class RegisterResponse(BaseModel):
    message: str
    user_id: str


@router.post("/register", response_model=RegisterResponse)
async def register(user_data: UserCreate):
    """Registriert einen neuen Benutzer."""
    # Prüfen ob E-Mail bereits existiert
    existing_user = await db.users.find_one({"email": user_data.email})
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="E-Mail-Adresse bereits registriert"
        )
    
    # Benutzer erstellen
    user = UserInDB(
        email=user_data.email,
        first_name=user_data.first_name,
        last_name=user_data.last_name,
        phone=user_data.phone,
        hashed_password=get_password_hash(user_data.password),
        role=UserRole.CUSTOMER
    )
    
    await db.users.insert_one(user.dict())
    logger.info(f"Neuer Benutzer registriert: {user.email}")
    
    return RegisterResponse(
        message="Registrierung erfolgreich",
        user_id=user.id
    )


@router.post("/login", response_model=TokenResponse)
async def login(credentials: LoginRequest):
    """Meldet einen Benutzer an."""
    user = await db.users.find_one({"email": credentials.email})
    
    if not user or not verify_password(credentials.password, user["hashed_password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="E-Mail oder Passwort falsch"
        )
    
    if not user.get("is_active", True):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Konto deaktiviert"
        )
    
    # Token erstellen
    access_token = create_access_token(
        data={
            "sub": user["id"],
            "email": user["email"],
            "role": user["role"]
        },
        expires_delta=timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    )
    
    return TokenResponse(
        access_token=access_token,
        user={
            "id": user["id"],
            "email": user["email"],
            "first_name": user["first_name"],
            "last_name": user["last_name"],
            "role": user["role"]
        }
    )


@router.get("/me")
async def get_me(current_user: dict = Depends(get_current_user)):
    """Gibt den aktuellen Benutzer zurück."""
    user = await db.users.find_one({"id": current_user["user_id"]})
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Benutzer nicht gefunden"
        )
    
    # Passwort-Hash nicht zurückgeben
    user.pop("hashed_password", None)
    user.pop("_id", None)
    
    return user


@router.put("/me")
async def update_me(updates: dict, current_user: dict = Depends(get_current_user)):
    """Aktualisiert den aktuellen Benutzer."""
    # Nur erlaubte Felder aktualisieren
    allowed_fields = ["first_name", "last_name", "phone", "addresses"]
    update_data = {k: v for k, v in updates.items() if k in allowed_fields}
    
    if not update_data:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Keine gültigen Felder zum Aktualisieren"
        )
    
    await db.users.update_one(
        {"id": current_user["user_id"]},
        {"$set": update_data}
    )
    
    return {"message": "Profil aktualisiert"}


@router.post("/change-password")
async def change_password(
    old_password: str,
    new_password: str,
    current_user: dict = Depends(get_current_user)
):
    """Ändert das Passwort des aktuellen Benutzers."""
    user = await db.users.find_one({"id": current_user["user_id"]})
    
    if not verify_password(old_password, user["hashed_password"]):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Altes Passwort falsch"
        )
    
    await db.users.update_one(
        {"id": current_user["user_id"]},
        {"$set": {"hashed_password": get_password_hash(new_password)}}
    )
    
    return {"message": "Passwort geändert"}
