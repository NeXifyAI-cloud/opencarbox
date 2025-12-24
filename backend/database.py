"""
Carvatoo - Datenbank-Konfiguration
"""

from motor.motor_asyncio import AsyncIOMotorClient
import os

mongo_url = os.environ.get('MONGO_URL')
db_name = os.environ.get('DB_NAME', 'carvatoo')

client = AsyncIOMotorClient(mongo_url)
db = client[db_name]

# Collections
# db.users
# db.products
# db.categories
# db.carts
# db.orders
# db.reviews
# db.coupons
# db.vehicles
