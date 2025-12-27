"""
Carvatoo - Hauptserver
Vollständiger E-Commerce Backend
"""

from fastapi import FastAPI, APIRouter
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
import os
import logging
from pathlib import Path
from contextlib import asynccontextmanager

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# Routen importieren
from routes.auth_routes import router as auth_router
from routes.product_routes import router as product_router
from routes.category_routes import router as category_router
from routes.cart_routes import router as cart_router
from routes.order_routes import router as order_router
from routes.admin_routes import router as admin_router
from routes.workshop_routes import router as workshop_router
from routes.vehicle_routes import router as vehicle_router
from database import client


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Lifecycle-Management für die App."""
    # Startup
    logging.info("Carvatoo Backend gestartet")
    yield
    # Shutdown
    client.close()
    logging.info("Carvatoo Backend beendet")


# App erstellen
app = FastAPI(
    title="Carvatoo API",
    description="E-Commerce Backend für Carvatoo - Weil dein Auto zur Familie gehört.",
    version="1.0.0",
    lifespan=lifespan
)

# API Router mit Prefix
api_router = APIRouter(prefix="/api")


# Root-Endpunkt
@api_router.get("/")
async def root():
    return {
        "message": "Willkommen bei Carvatoo API",
        "version": "1.0.0",
        "status": "online"
    }


# Health-Check
@api_router.get("/health")
async def health_check():
    return {"status": "healthy"}


# Routen einbinden
api_router.include_router(auth_router)
api_router.include_router(product_router)
api_router.include_router(category_router)
api_router.include_router(cart_router)
api_router.include_router(workshop_router)
api_router.include_router(vehicle_router)
api_router.include_router(order_router)
api_router.include_router(admin_router)

# Router zur App hinzufügen
app.include_router(api_router)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Logging konfigurieren
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)
