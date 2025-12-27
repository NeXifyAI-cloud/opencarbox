"""
Carvatoo - Seed-Daten
Initiale Daten für die Datenbank
"""

import asyncio
from datetime import datetime
import uuid
from database import db
from auth import get_password_hash


async def seed_categories():
    """Erstellt initiale Kategorien."""
    
    categories = [
        {
            "id": str(uuid.uuid4()),
            "name": "Ersatz- und Verschleißteile",
            "slug": "ersatzteile",
            "description": "Hochwertige Ersatz- und Verschleißteile für alle Fahrzeugtypen",
            "icon": "Settings",
            "image": "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=300&h=200&fit=crop",
            "is_active": True,
            "product_count": 0,
            "created_at": datetime.utcnow(),
            "subcategories": [
                {"id": str(uuid.uuid4()), "name": "Bremsanlage", "slug": "bremsanlage", "product_count": 0},
                {"id": str(uuid.uuid4()), "name": "Abgasanlage", "slug": "abgasanlage", "product_count": 0},
                {"id": str(uuid.uuid4()), "name": "Filter", "slug": "filter", "product_count": 0},
                {"id": str(uuid.uuid4()), "name": "Stoßdämpfer", "slug": "stossdaempfer", "product_count": 0},
                {"id": str(uuid.uuid4()), "name": "Kühlung", "slug": "kuehlung", "product_count": 0},
                {"id": str(uuid.uuid4()), "name": "Zündung", "slug": "zuendung", "product_count": 0},
                {"id": str(uuid.uuid4()), "name": "Lenkung", "slug": "lenkung", "product_count": 0},
                {"id": str(uuid.uuid4()), "name": "Kupplung", "slug": "kupplung", "product_count": 0},
            ]
        },
        {
            "id": str(uuid.uuid4()),
            "name": "Reifen, Felgen, Kompletträder",
            "slug": "reifen",
            "description": "Reifen, Felgen und Kompletträder für jede Saison",
            "icon": "Circle",
            "image": "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=200&fit=crop",
            "is_active": True,
            "product_count": 0,
            "created_at": datetime.utcnow(),
            "subcategories": [
                {"id": str(uuid.uuid4()), "name": "Sommerreifen", "slug": "sommerreifen", "product_count": 0},
                {"id": str(uuid.uuid4()), "name": "Winterreifen", "slug": "winterreifen", "product_count": 0},
                {"id": str(uuid.uuid4()), "name": "Ganzjahresreifen", "slug": "ganzjahresreifen", "product_count": 0},
                {"id": str(uuid.uuid4()), "name": "Felgen", "slug": "felgen", "product_count": 0},
            ]
        },
        {
            "id": str(uuid.uuid4()),
            "name": "Batterien und Ladegeräte",
            "slug": "batterien",
            "description": "Autobatterien, Ladegeräte und Starthilfe",
            "icon": "Battery",
            "image": "https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=300&h=200&fit=crop",
            "is_active": True,
            "product_count": 0,
            "created_at": datetime.utcnow(),
            "subcategories": [
                {"id": str(uuid.uuid4()), "name": "Autobatterien", "slug": "autobatterien", "product_count": 0},
                {"id": str(uuid.uuid4()), "name": "Ladegeräte", "slug": "ladegeraete", "product_count": 0},
                {"id": str(uuid.uuid4()), "name": "Starthilfe", "slug": "starthilfe", "product_count": 0},
            ]
        },
        {
            "id": str(uuid.uuid4()),
            "name": "Öle, Schmierung, Additive",
            "slug": "oele",
            "description": "Motoröle, Getriebeöle und Additive",
            "icon": "Droplet",
            "image": "https://images.unsplash.com/photo-1635784458812-1d4c2c3e8f8b?w=300&h=200&fit=crop",
            "is_active": True,
            "product_count": 0,
            "created_at": datetime.utcnow(),
            "subcategories": [
                {"id": str(uuid.uuid4()), "name": "Motoröl", "slug": "motoroel", "product_count": 0},
                {"id": str(uuid.uuid4()), "name": "Getriebeöl", "slug": "getriebeoel", "product_count": 0},
                {"id": str(uuid.uuid4()), "name": "Bremsflüssigkeit", "slug": "bremsfluessigkeit", "product_count": 0},
                {"id": str(uuid.uuid4()), "name": "Additive", "slug": "additive", "product_count": 0},
            ]
        },
        {
            "id": str(uuid.uuid4()),
            "name": "Pflege und Lackierung",
            "slug": "pflege",
            "description": "Autopflege, Lackpflege und Reinigungsmittel",
            "icon": "Sparkles",
            "image": "https://images.unsplash.com/photo-1607860108855-64acf2078ed9?w=300&h=200&fit=crop",
            "is_active": True,
            "product_count": 0,
            "created_at": datetime.utcnow(),
            "subcategories": [
                {"id": str(uuid.uuid4()), "name": "Autopflege", "slug": "autopflege", "product_count": 0},
                {"id": str(uuid.uuid4()), "name": "Lackpflege", "slug": "lackpflege", "product_count": 0},
                {"id": str(uuid.uuid4()), "name": "Innenraumpflege", "slug": "innenraumpflege", "product_count": 0},
            ]
        },
        {
            "id": str(uuid.uuid4()),
            "name": "Zubehör und Pannenhilfe",
            "slug": "zubehoer",
            "description": "Autozubehör und Pannenhilfe-Sets",
            "icon": "Wrench",
            "image": "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=300&h=200&fit=crop",
            "is_active": True,
            "product_count": 0,
            "created_at": datetime.utcnow(),
            "subcategories": [
                {"id": str(uuid.uuid4()), "name": "Warndreieck & Warnweste", "slug": "warndreieck", "product_count": 0},
                {"id": str(uuid.uuid4()), "name": "Verbandskasten", "slug": "verbandskasten", "product_count": 0},
                {"id": str(uuid.uuid4()), "name": "Pannenhilfe-Sets", "slug": "pannenhilfe", "product_count": 0},
            ]
        },
        {
            "id": str(uuid.uuid4()),
            "name": "Werkzeuge und Werkstatt",
            "slug": "werkzeug",
            "description": "Professionelle Werkzeuge für die Autowerkstatt",
            "icon": "Hammer",
            "image": "https://images.unsplash.com/photo-1530124566582-a618bc2615dc?w=300&h=200&fit=crop",
            "is_active": True,
            "product_count": 0,
            "created_at": datetime.utcnow(),
            "subcategories": [
                {"id": str(uuid.uuid4()), "name": "Handwerkzeug", "slug": "handwerkzeug", "product_count": 0},
                {"id": str(uuid.uuid4()), "name": "Wagenheber", "slug": "wagenheber", "product_count": 0},
                {"id": str(uuid.uuid4()), "name": "Diagnosegeräte", "slug": "diagnose", "product_count": 0},
            ]
        },
    ]
    
    # Bestehende löschen und neu einfügen
    await db.categories.delete_many({})
    await db.categories.insert_many(categories)
    print(f"  ✓ {len(categories)} Kategorien erstellt")
    return categories


async def seed_products(categories):
    """Erstellt initiale Produkte."""
    
    products = []
    
    # Produkte für jede Kategorie
    product_templates = [
        # Ersatzteile
        {"name": "BOSCH Bremsscheiben Set Vorderachse", "brand": "BOSCH", "price": 89.99, "original_price": 129.99, "category_slug": "ersatzteile"},
        {"name": "ATE Bremsbeläge Premium Ceramic", "brand": "ATE", "price": 54.99, "original_price": 79.99, "category_slug": "ersatzteile"},
        {"name": "BREMBO Bremsscheiben Sport", "brand": "BREMBO", "price": 149.99, "original_price": 199.99, "category_slug": "ersatzteile"},
        {"name": "MANN-FILTER Ölfilter W 712/95", "brand": "MANN-FILTER", "price": 12.49, "original_price": 18.99, "category_slug": "ersatzteile"},
        {"name": "BOSCH Luftfilter S 0124", "brand": "BOSCH", "price": 24.99, "original_price": 34.99, "category_slug": "ersatzteile"},
        {"name": "MAHLE Innenraumfilter LAK 181", "brand": "MAHLE", "price": 19.99, "original_price": 29.99, "category_slug": "ersatzteile"},
        {"name": "SKF Radlager Kit Hinterachse", "brand": "SKF", "price": 67.99, "original_price": 99.99, "category_slug": "ersatzteile"},
        {"name": "SACHS Stoßdämpfer Satz", "brand": "SACHS", "price": 189.99, "original_price": 259.99, "category_slug": "ersatzteile"},
        # Öle
        {"name": "LIQUI MOLY 5W-30 Motoröl 5L", "brand": "LIQUI MOLY", "price": 42.99, "original_price": 59.99, "category_slug": "oele"},
        {"name": "Castrol EDGE 5W-40 4L", "brand": "Castrol", "price": 49.99, "original_price": 69.99, "category_slug": "oele"},
        {"name": "Mobil 1 ESP 5W-30 5L", "brand": "Mobil", "price": 54.99, "original_price": 74.99, "category_slug": "oele"},
        # Batterien
        {"name": "VARTA Blue Dynamic 60Ah", "brand": "VARTA", "price": 89.99, "original_price": 119.99, "category_slug": "batterien"},
        {"name": "BOSCH S4 Autobatterie 74Ah", "brand": "BOSCH", "price": 109.99, "original_price": 149.99, "category_slug": "batterien"},
        {"name": "CTEK MXS 5.0 Ladegerät", "brand": "CTEK", "price": 79.99, "original_price": 99.99, "category_slug": "batterien"},
        # Pflege
        {"name": "Meguiar's Ultimate Wash & Wax", "brand": "Meguiar's", "price": 19.99, "original_price": 27.99, "category_slug": "pflege"},
        {"name": "SONAX Xtreme Brilliant Wax 1", "brand": "SONAX", "price": 24.99, "original_price": 34.99, "category_slug": "pflege"},
        # Werkzeug
        {"name": "HAZET Ratschenkasten 172-teilig", "brand": "HAZET", "price": 299.99, "original_price": 399.99, "category_slug": "werkzeug"},
        {"name": "KS Tools Wagenheber 3t", "brand": "KS Tools", "price": 89.99, "original_price": 119.99, "category_slug": "werkzeug"},
    ]
    
    for i, template in enumerate(product_templates):
        category = next((c for c in categories if c["slug"] == template["category_slug"]), categories[0])
        
        discount_percent = int(((template["original_price"] - template["price"]) / template["original_price"]) * 100) if template.get("original_price") else None
        
        product = {
            "id": str(uuid.uuid4()),
            "name": template["name"],
            "slug": template["name"].lower().replace(" ", "-").replace("ö", "oe").replace("ä", "ae").replace("ü", "ue"),
            "description": f"Hochwertiges {template['name']} vom Markenhersteller {template['brand']}. Passend für viele Fahrzeugtypen.",
            "short_description": f"{template['brand']} - Qualität die überzeugt",
            "brand": template["brand"],
            "sku": f"CT-{template['brand'][:3].upper()}-{1000 + i}",
            "ean": f"400000000{1000 + i}",
            "oem_numbers": [f"OE-{1000 + i}"],
            "category_id": category["id"],
            "subcategory_id": category["subcategories"][0]["id"] if category.get("subcategories") else None,
            "price": template["price"],
            "original_price": template.get("original_price"),
            "discount_percent": discount_percent,
            "images": [
                "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=400&h=400&fit=crop",
                "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop"
            ],
            "specifications": [
                {"label": "Hersteller", "value": template["brand"]},
                {"label": "Artikelnummer", "value": f"CT-{template['brand'][:3].upper()}-{1000 + i}"},
            ],
            "compatibility": [
                {"brand": "Volkswagen", "model": "Golf", "year_from": 2012, "year_to": 2020},
                {"brand": "Audi", "model": "A3", "year_from": 2012, "year_to": 2020},
            ],
            "stock": 50 + (i * 10),
            "weight": 1.5,
            "rating": 4.5 + (i % 5) * 0.1,
            "review_count": 100 + (i * 23),
            "sold_count": 50 + (i * 17),
            "is_active": True,
            "is_featured": i < 6,
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        }
        products.append(product)
    
    await db.products.delete_many({})
    await db.products.insert_many(products)
    print(f"  ✓ {len(products)} Produkte erstellt")


async def seed_admin():
    """Erstellt den initialen Admin-Benutzer."""
    
    admin = {
        "id": str(uuid.uuid4()),
        "email": "admin@carvatoo.at",
        "first_name": "Admin",
        "last_name": "Carvatoo",
        "phone": "+43 1 987 65 43",
        "hashed_password": get_password_hash("admin"),
        "role": "admin",
        "is_active": True,
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow(),
        "addresses": [],
        "wishlist": []
    }
    
    # Prüfen ob Admin bereits existiert
    existing = await db.users.find_one({"email": admin["email"]})
    if not existing:
        await db.users.insert_one(admin)
        print(f"  ✓ Admin erstellt: admin@carvatoo.at / Carvatoo2025!")
    else:
        print(f"  ✓ Admin existiert bereits")


async def seed_coupons():
    """Erstellt initiale Gutscheine."""
    
    coupons = [
        {
            "id": str(uuid.uuid4()),
            "code": "WILLKOMMEN10",
            "type": "percentage",
            "value": 10,
            "min_order_value": 50,
            "max_uses": 1000,
            "used_count": 0,
            "valid_from": datetime.utcnow(),
            "valid_until": None,
            "is_active": True
        },
        {
            "id": str(uuid.uuid4()),
            "code": "SPAR20",
            "type": "fixed",
            "value": 20,
            "min_order_value": 100,
            "max_uses": 500,
            "used_count": 0,
            "valid_from": datetime.utcnow(),
            "valid_until": None,
            "is_active": True
        }
    ]
    
    await db.coupons.delete_many({})
    await db.coupons.insert_many(coupons)
    print(f"  ✓ {len(coupons)} Gutscheine erstellt")


async def run_seed():
    """Führt alle Seed-Funktionen aus."""
    print("\n🌱 Carvatoo Datenbank wird initialisiert...\n")
    
    categories = await seed_categories()
    await seed_products(categories)
    await seed_admin()
    await seed_coupons()
    
    print("\n✅ Datenbank erfolgreich initialisiert!\n")


if __name__ == "__main__":
    asyncio.run(run_seed())
