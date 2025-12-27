
import sys
import os

# Test 1: Library Check
try:
    import bcrypt
    from passlib.context import CryptContext
    print(f"Bcrypt version: {bcrypt.__version__}")
    
    pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
    hash_str = pwd_context.hash("admin")
    print(f"Generated Hash for 'admin': {hash_str}")
    
    verify = pwd_context.verify("admin", hash_str)
    print(f"Verify 'admin' (fresh hash): {verify}")
except Exception as e:
    print(f"LIBRARY ERROR: {e}")
    import traceback
    traceback.print_exc()

# Test 2: DB Check
import asyncio
from motor.motor_asyncio import AsyncIOMotorClient

async def check_admin():
    try:
        mongo_url = os.environ.get("MONGO_URL")
        print(f"Connecting to Mongo: {mongo_url}")
        client = AsyncIOMotorClient(mongo_url)
        db_name = os.environ.get("DB_NAME", "carvatoo")
        db = client[db_name]
        
        user = await db.users.find_one({"email": "admin@carvatoo.at"})
        if user:
            print(f"Admin found: {user['email']}")
            stored_hash = user.get('hashed_password')
            print(f"Stored Hash: {stored_hash}")
            
            # Try to verify against stored hash if library works
            try:
                if 'pwd_context' in globals():
                    is_valid_admin = pwd_context.verify("admin", stored_hash)
                    print(f"Verify 'admin' vs Stored Hash: {is_valid_admin}")
                    
                    is_valid_default = pwd_context.verify("Carvatoo2025!", stored_hash)
                    print(f"Verify 'Carvatoo2025!' vs Stored Hash: {is_valid_default}")
            except Exception as e:
                print(f"Verification Error: {e}")
        else:
            print("Admin user not found in DB")
            
    except Exception as e:
        print(f"DB ERROR: {e}")

if __name__ == "__main__":
    asyncio.run(check_admin())
