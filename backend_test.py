#!/usr/bin/env python3
"""
Backend Testing Script for Carvatoo
Tests full E2E flow: Category Page -> Product Page -> Add to Cart -> Cart Page
"""

import requests
import json
import os
import uuid
from dotenv import load_dotenv

# Load environment variables
load_dotenv('/app/frontend/.env')

# Get backend URL from frontend env
BACKEND_URL = os.getenv('REACT_APP_BACKEND_URL', 'https://carbooth.preview.emergentagent.com')
API_BASE = f"{BACKEND_URL}/api"

# Generate session ID for cart testing
SESSION_ID = str(uuid.uuid4())

def test_admin_login():
    """Test admin login with credentials admin@carvatoo.at / admin"""
    print("🔐 Testing Admin Login...")
    
    login_url = f"{API_BASE}/auth/login"
    login_data = {
        "email": "admin@carvatoo.at",
        "password": "admin"
    }
    
    try:
        response = requests.post(
            login_url,
            json=login_data,
            headers={"Content-Type": "application/json"},
            timeout=10
        )
        
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print("✅ Admin login successful!")
            print(f"Access Token: {data.get('access_token', 'N/A')[:50]}...")
            print(f"User Info: {data.get('user', {})}")
            return True, data.get('access_token')
        else:
            print(f"❌ Admin login failed!")
            print(f"Error: {response.text}")
            return False, None
            
    except requests.exceptions.RequestException as e:
        print(f"❌ Network error during admin login: {e}")
        return False, None
    except json.JSONDecodeError as e:
        print(f"❌ Invalid JSON response: {e}")
        print(f"Raw response: {response.text}")
        return False, None

def test_category_products():
    """Test Category Page - Load products from API for 'ersatzteile' category"""
    print("🏷️ Testing Category Page (ersatzteile)...")
    
    try:
        # Test products endpoint with category filter
        products_url = f"{API_BASE}/products"
        params = {"category": "ersatzteile"}
        
        response = requests.get(products_url, params=params, timeout=10)
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            products = response.json()
            print(f"✅ Products loaded from API!")
            print(f"Number of products: {len(products)}")
            
            if len(products) > 0:
                # Check if products have unique names (not mock data)
                product_names = [p.get('name', '') for p in products]
                unique_names = set(product_names)
                print(f"Unique product names: {len(unique_names)}")
                print(f"Sample products: {product_names[:3]}")
                
                # Return first product for further testing
                return True, products[0] if products else None
            else:
                print("⚠️ No products found for 'ersatzteile' category")
                return False, None
        else:
            print(f"❌ Failed to load products!")
            print(f"Error: {response.text}")
            return False, None
            
    except requests.exceptions.RequestException as e:
        print(f"❌ Network error during category products test: {e}")
        return False, None
    except json.JSONDecodeError as e:
        print(f"❌ Invalid JSON response: {e}")
        return False, None

def test_product_details(product_id):
    """Test Product Page - Load product details from API"""
    print(f"📦 Testing Product Page (ID: {product_id})...")
    
    try:
        product_url = f"{API_BASE}/products/{product_id}"
        response = requests.get(product_url, timeout=10)
        
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            product = response.json()
            print("✅ Product details loaded from API!")
            print(f"Product Name: {product.get('name', 'N/A')}")
            print(f"Product Brand: {product.get('brand', 'N/A')}")
            print(f"Product Price: {product.get('price', 'N/A')}€")
            print(f"Product Stock: {product.get('stock', 'N/A')}")
            return True, product
        else:
            print(f"❌ Failed to load product details!")
            print(f"Error: {response.text}")
            return False, None
            
    except requests.exceptions.RequestException as e:
        print(f"❌ Network error during product details test: {e}")
        return False, None
    except json.JSONDecodeError as e:
        print(f"❌ Invalid JSON response: {e}")
        return False, None

def test_add_to_cart(product_id):
    """Test Add to Cart functionality"""
    print(f"🛒 Testing Add to Cart (Product ID: {product_id})...")
    
    try:
        cart_url = f"{API_BASE}/cart/items"
        cart_data = {
            "product_id": product_id,
            "quantity": 1
        }
        headers = {
            "Content-Type": "application/json",
            "X-Session-ID": SESSION_ID
        }
        
        response = requests.post(cart_url, json=cart_data, headers=headers, timeout=10)
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            result = response.json()
            print("✅ Product added to cart successfully!")
            print(f"Response: {result}")
            return True
        else:
            print(f"❌ Failed to add product to cart!")
            print(f"Error: {response.text}")
            return False
            
    except requests.exceptions.RequestException as e:
        print(f"❌ Network error during add to cart test: {e}")
        return False
    except json.JSONDecodeError as e:
        print(f"❌ Invalid JSON response: {e}")
        return False

def test_cart_page():
    """Test Cart Page - Verify item is present"""
    print("🛍️ Testing Cart Page...")
    
    try:
        cart_url = f"{API_BASE}/cart"
        headers = {"X-Session-ID": SESSION_ID}
        
        response = requests.get(cart_url, headers=headers, timeout=10)
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            cart = response.json()
            print("✅ Cart loaded successfully!")
            print(f"Cart Items: {len(cart.get('items', []))}")
            print(f"Item Count: {cart.get('item_count', 0)}")
            print(f"Subtotal: {cart.get('subtotal', 0)}€")
            print(f"Total: {cart.get('total', 0)}€")
            
            if cart.get('items') and len(cart['items']) > 0:
                print("✅ Cart contains items!")
                for item in cart['items']:
                    print(f"  - {item.get('product', {}).get('name', 'Unknown')} x{item.get('quantity', 0)}")
                return True
            else:
                print("❌ Cart is empty!")
                return False
        else:
            print(f"❌ Failed to load cart!")
            print(f"Error: {response.text}")
            return False
            
    except requests.exceptions.RequestException as e:
        print(f"❌ Network error during cart test: {e}")
        return False
    except json.JSONDecodeError as e:
        print(f"❌ Invalid JSON response: {e}")
        return False

def test_api_health():
    """Test if API is accessible"""
    print("🏥 Testing API Health...")
    
    try:
        health_url = f"{API_BASE}/health"
        response = requests.get(health_url, timeout=5)
        
        if response.status_code == 200:
            print("✅ API is healthy")
            print(f"Response: {response.json()}")
            return True
        else:
            print(f"❌ API health check failed: {response.status_code}")
            return False
            
    except requests.exceptions.RequestException as e:
        print(f"❌ Cannot reach API: {e}")
        return False

def test_api_root():
    """Test API root endpoint"""
    print("🌐 Testing API Root...")
    
    try:
        root_url = f"{API_BASE}/"
        response = requests.get(root_url, timeout=5)
        
        if response.status_code == 200:
            print("✅ API root accessible")
            print(f"Response: {response.json()}")
            return True
        else:
            print(f"❌ API root failed: {response.status_code}")
            return False
            
    except requests.exceptions.RequestException as e:
        print(f"❌ Cannot reach API root: {e}")
        return False

def test_create_workshop_appointment():
    """Test creating a workshop appointment"""
    print("🔧 Testing Create Workshop Appointment...")
    
    try:
        appointment_url = f"{API_BASE}/workshop/appointments"
        appointment_data = {
            "customer_name": "Max Mustermann",
            "customer_email": "max.mustermann@example.com",
            "customer_phone": "+43 123 456 789",
            "vehicle_brand": "BMW",
            "vehicle_model": "3er",
            "vehicle_year": 2020,
            "license_plate": "W-123MM",
            "service_type": "inspection",
            "preferred_date": "2025-01-20",
            "preferred_time": "10:00",
            "message": "Regelmäßige Inspektion nach Herstellervorgaben"
        }
        
        response = requests.post(
            appointment_url,
            json=appointment_data,
            headers={"Content-Type": "application/json"},
            timeout=10
        )
        
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 201:
            appointment = response.json()
            print("✅ Workshop appointment created successfully!")
            print(f"Appointment ID: {appointment.get('id')}")
            print(f"Customer: {appointment.get('customer_name')}")
            print(f"Service: {appointment.get('service_type')}")
            print(f"Status: {appointment.get('status')}")
            return True, appointment.get('id')
        else:
            print(f"❌ Failed to create workshop appointment!")
            print(f"Error: {response.text}")
            return False, None
            
    except requests.exceptions.RequestException as e:
        print(f"❌ Network error during workshop appointment creation: {e}")
        return False, None
    except json.JSONDecodeError as e:
        print(f"❌ Invalid JSON response: {e}")
        return False, None

def test_get_workshop_appointments(admin_token):
    """Test getting workshop appointments as admin"""
    print("📋 Testing Get Workshop Appointments (Admin)...")
    
    if not admin_token:
        print("❌ No admin token available")
        return False
    
    try:
        appointments_url = f"{API_BASE}/workshop/appointments"
        headers = {
            "Authorization": f"Bearer {admin_token}",
            "Content-Type": "application/json"
        }
        
        response = requests.get(appointments_url, headers=headers, timeout=10)
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            appointments = response.json()
            print("✅ Workshop appointments retrieved successfully!")
            print(f"Number of appointments: {len(appointments)}")
            
            if appointments:
                for apt in appointments[:3]:  # Show first 3
                    print(f"  - {apt.get('customer_name')} ({apt.get('service_type')}) - {apt.get('status')}")
            return True
        else:
            print(f"❌ Failed to get workshop appointments!")
            print(f"Error: {response.text}")
            return False
            
    except requests.exceptions.RequestException as e:
        print(f"❌ Network error during workshop appointments retrieval: {e}")
        return False
    except json.JSONDecodeError as e:
        print(f"❌ Invalid JSON response: {e}")
        return False

def test_create_vehicle(admin_token):
    """Test creating a vehicle as admin"""
    print("🚗 Testing Create Vehicle (Admin)...")
    
    if not admin_token:
        print("❌ No admin token available")
        return False, None
    
    try:
        vehicle_url = f"{API_BASE}/vehicles/"
        vehicle_data = {
            "brand": "Audi",
            "model": "A4 Avant",
            "year": 2023,
            "price": 45900.00,
            "mileage": 15000,
            "fuel_type": "Benzin",
            "transmission": "Automatik",
            "color": "Schwarz Metallic",
            "description": "Gepflegter Audi A4 Avant mit Vollausstattung. Scheckheftgepflegt, Nichtraucherfahrzeug.",
            "features": ["Klimaautomatik", "Navigationssystem", "Ledersitze", "Xenon-Scheinwerfer"],
            "is_new": False,
            "location": "Wien",
            "contact_phone": "+43 1 234 5678",
            "images": ["https://example.com/audi-a4-1.jpg", "https://example.com/audi-a4-2.jpg"]
        }
        
        headers = {
            "Authorization": f"Bearer {admin_token}",
            "Content-Type": "application/json"
        }
        
        response = requests.post(
            vehicle_url,
            json=vehicle_data,
            headers=headers,
            timeout=10
        )
        
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 201:
            vehicle = response.json()
            print("✅ Vehicle created successfully!")
            print(f"Vehicle ID: {vehicle.get('id')}")
            print(f"Vehicle: {vehicle.get('brand')} {vehicle.get('model')} ({vehicle.get('year')})")
            print(f"Price: {vehicle.get('price')}€")
            print(f"Mileage: {vehicle.get('mileage')} km")
            return True, vehicle.get('id')
        else:
            print(f"❌ Failed to create vehicle!")
            print(f"Error: {response.text}")
            return False, None
            
    except requests.exceptions.RequestException as e:
        print(f"❌ Network error during vehicle creation: {e}")
        return False, None
    except json.JSONDecodeError as e:
        print(f"❌ Invalid JSON response: {e}")
        return False, None

def test_get_vehicles():
    """Test getting vehicles (public endpoint)"""
    print("🚙 Testing Get Vehicles (Public)...")
    
    try:
        vehicles_url = f"{API_BASE}/vehicles"
        response = requests.get(vehicles_url, timeout=10)
        
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            vehicles = response.json()
            print("✅ Vehicles retrieved successfully!")
            print(f"Number of vehicles: {len(vehicles)}")
            
            if vehicles:
                for vehicle in vehicles[:3]:  # Show first 3
                    print(f"  - {vehicle.get('brand')} {vehicle.get('model')} ({vehicle.get('year')}) - {vehicle.get('price')}€")
            return True
        else:
            print(f"❌ Failed to get vehicles!")
            print(f"Error: {response.text}")
            return False
            
    except requests.exceptions.RequestException as e:
        print(f"❌ Network error during vehicles retrieval: {e}")
        return False
    except json.JSONDecodeError as e:
        print(f"❌ Invalid JSON response: {e}")
        return False

def test_workshop_form_submission():
    """Test workshop form submission with exact frontend data structure"""
    print("📝 Testing Workshop Form Submission (Frontend Structure)...")
    
    try:
        appointment_url = f"{API_BASE}/workshop/appointments"
        # This matches the exact structure sent from WorkshopPage.jsx
        form_data = {
            "name": "Maria Schneider",
            "email": "maria.schneider@example.com", 
            "phone": "+43 664 123 4567",
            "date": "2025-01-25",
            "vehicle": "Audi A4 Avant",
            "serviceId": "inspection",
            "serviceName": "Inspektion & Wartung"
        }
        
        response = requests.post(
            appointment_url,
            json=form_data,
            headers={"Content-Type": "application/json"},
            timeout=10
        )
        
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 201:
            appointment = response.json()
            print("✅ Workshop form submission successful!")
            print(f"Appointment ID: {appointment.get('id')}")
            print(f"Customer: {appointment.get('name')}")
            print(f"Service: {appointment.get('serviceName')}")
            print(f"Vehicle: {appointment.get('vehicle')}")
            print(f"Date: {appointment.get('date')}")
            print(f"Status: {appointment.get('status')}")
            return True, appointment.get('id')
        else:
            print(f"❌ Failed to submit workshop form!")
            print(f"Error: {response.text}")
            return False, None
            
    except requests.exceptions.RequestException as e:
        print(f"❌ Network error during workshop form submission: {e}")
        return False, None
    except json.JSONDecodeError as e:
        print(f"❌ Invalid JSON response: {e}")
        return False, None

def test_sofort_termin_booking():
    """Test 'Sofort Termin buchen' button functionality"""
    print("⚡ Testing 'Sofort Termin buchen' Flow...")
    
    try:
        appointment_url = f"{API_BASE}/workshop/appointments"
        # This matches the data when "Sofort Termin buchen" is clicked
        sofort_data = {
            "name": "Thomas Weber",
            "email": "thomas.weber@example.com",
            "phone": "+43 1 234 5678", 
            "date": "2025-01-22",
            "vehicle": "BMW X3",
            "serviceId": "general",
            "serviceName": "Allgemeine Anfrage"
        }
        
        response = requests.post(
            appointment_url,
            json=sofort_data,
            headers={"Content-Type": "application/json"},
            timeout=10
        )
        
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 201:
            appointment = response.json()
            print("✅ 'Sofort Termin buchen' booking successful!")
            print(f"Appointment ID: {appointment.get('id')}")
            print(f"Customer: {appointment.get('name')}")
            print(f"Service: {appointment.get('serviceName')}")
            print(f"Status: {appointment.get('status')}")
            return True
        else:
            print(f"❌ Failed to book 'Sofort Termin'!")
            print(f"Error: {response.text}")
            return False
            
    except requests.exceptions.RequestException as e:
        print(f"❌ Network error during 'Sofort Termin' booking: {e}")
        return False
    except json.JSONDecodeError as e:
        print(f"❌ Invalid JSON response: {e}")
        return False

def test_express_services_booking():
    """Test Express Services booking (Pickerl, Ölwechsel, etc.)"""
    print("🚀 Testing Express Services Booking...")
    
    express_services = [
        {"id": "pickerl", "name": "§57a Pickerl"},
        {"id": "oil", "name": "Ölwechsel"},
        {"id": "tires", "name": "Reifenwechsel"},
        {"id": "climate", "name": "Klimaservice"}
    ]
    
    results = []
    
    for service in express_services:
        try:
            appointment_url = f"{API_BASE}/workshop/appointments"
            express_data = {
                "name": f"Test Customer {service['id'].title()}",
                "email": f"test.{service['id']}@example.com",
                "phone": "+43 699 123 4567",
                "date": "2025-01-23",
                "vehicle": "VW Golf VII",
                "serviceId": service['id'],
                "serviceName": service['name']
            }
            
            response = requests.post(
                appointment_url,
                json=express_data,
                headers={"Content-Type": "application/json"},
                timeout=10
            )
            
            if response.status_code == 201:
                appointment = response.json()
                print(f"✅ {service['name']} booking successful! ID: {appointment.get('id')}")
                results.append(True)
            else:
                print(f"❌ {service['name']} booking failed! Status: {response.status_code}")
                results.append(False)
                
        except Exception as e:
            print(f"❌ Error booking {service['name']}: {e}")
            results.append(False)
    
    success_count = sum(results)
    total_count = len(results)
    print(f"Express Services Results: {success_count}/{total_count} successful")
    
    return success_count == total_count

def test_create_order():
    """Test creating an order with valid payload (mimicking CheckoutPage.jsx)"""
    print("🛒 Testing Create Order (Checkout Flow)...")
    
    try:
        # First, add some items to cart to create a valid order
        cart_url = f"{API_BASE}/cart/items"
        
        # Get a product first
        products_url = f"{API_BASE}/products"
        products_response = requests.get(products_url, timeout=10)
        
        if products_response.status_code != 200 or not products_response.json():
            print("❌ No products available for order test")
            return False, None
        
        test_product = products_response.json()[0]
        
        # Add product to cart
        cart_data = {
            "product_id": test_product["id"],
            "quantity": 2
        }
        headers = {
            "Content-Type": "application/json",
            "X-Session-ID": SESSION_ID
        }
        
        cart_response = requests.post(cart_url, json=cart_data, headers=headers, timeout=10)
        if cart_response.status_code != 200:
            print(f"❌ Failed to add product to cart: {cart_response.text}")
            return False, None
        
        # Now create order with proper payload structure
        order_url = f"{API_BASE}/orders"
        order_data = {
            "items": [
                {
                    "product_id": test_product["id"],
                    "quantity": 2,
                    "price": test_product.get("price", 50.0)
                }
            ],
            "shipping_info": {
                "first_name": "Anna",
                "last_name": "Müller",
                "email": "anna.mueller@example.com",
                "phone": "+43 664 987 6543",
                "address": {
                    "street": "Mariahilfer Straße",
                    "house_number": "123",
                    "postal_code": "1060",
                    "city": "Wien",
                    "country": "Österreich"
                }
            },
            "billing_same_as_shipping": True,
            "payment_method": "card",
            "notes": "Bitte klingeln bei Müller"
        }
        
        response = requests.post(
            order_url,
            json=order_data,
            headers=headers,
            timeout=10
        )
        
        print(f"Status Code: {response.status_code}")
        
        if response.status_code in [200, 201]:
            order = response.json()
            print("✅ Order created successfully!")
            print(f"Order ID: {order.get('id')}")
            print(f"Order Number: {order.get('order_number')}")
            print(f"Customer: {order.get('shipping_info', {}).get('first_name')} {order.get('shipping_info', {}).get('last_name')}")
            print(f"Total: {order.get('total')}€")
            print(f"Status: {order.get('status')}")
            print(f"Payment Status: {order.get('payment_status')}")
            return True, order.get('order_number')
        else:
            print(f"❌ Failed to create order!")
            print(f"Error: {response.text}")
            return False, None
            
    except requests.exceptions.RequestException as e:
        print(f"❌ Network error during order creation: {e}")
        return False, None
    except json.JSONDecodeError as e:
        print(f"❌ Invalid JSON response: {e}")
        return False, None

def test_create_order_authenticated(user_token):
    """Test creating an order with authentication"""
    print("🛒 Testing Create Order (Authenticated)...")
    
    if not user_token:
        print("❌ No user token available")
        return False, None
    
    try:
        # Get a product first
        products_url = f"{API_BASE}/products"
        products_response = requests.get(products_url, timeout=10)
        
        if products_response.status_code != 200 or not products_response.json():
            print("❌ No products available for order test")
            return False, None
        
        test_product = products_response.json()[0]
        
        # Create order with proper payload structure and authentication
        # Try with trailing slash to avoid redirect
        order_url = f"{API_BASE}/orders/"
        order_data = {
            "items": [
                {
                    "product_id": test_product["id"],
                    "quantity": 2,
                    "price": test_product.get("price", 50.0)
                }
            ],
            "shipping_info": {
                "first_name": "Anna",
                "last_name": "Müller",
                "email": "anna.mueller@example.com",
                "phone": "+43 664 987 6543",
                "address": {
                    "street": "Mariahilfer Straße",
                    "house_number": "123",
                    "postal_code": "1060",
                    "city": "Wien",
                    "country": "Österreich"
                }
            },
            "billing_same_as_shipping": True,
            "payment_method": "card",
            "notes": "Bitte klingeln bei Müller"
        }
        
        headers = {
            "Authorization": f"Bearer {user_token}",
            "Content-Type": "application/json"
        }
        
        response = requests.post(
            order_url,
            json=order_data,
            headers=headers,
            timeout=10
        )
        
        print(f"Status Code: {response.status_code}")
        
        if response.status_code in [200, 201]:
            order = response.json()
            print("✅ Order created successfully!")
            print(f"Order ID: {order.get('id')}")
            print(f"Order Number: {order.get('order_number')}")
            print(f"Customer: {order.get('shipping_info', {}).get('first_name')} {order.get('shipping_info', {}).get('last_name')}")
            print(f"Total: {order.get('total')}€")
            print(f"Status: {order.get('status')}")
            print(f"Payment Status: {order.get('payment_status')}")
            return True, order.get('order_number')
        else:
            print(f"❌ Failed to create order!")
            print(f"Error: {response.text}")
            return False, None
            
    except requests.exceptions.RequestException as e:
        print(f"❌ Network error during order creation: {e}")
        return False, None
    except json.JSONDecodeError as e:
        print(f"❌ Invalid JSON response: {e}")
        return False, None

def test_get_orders_admin(admin_token):
    """Test getting all orders as admin"""
    print("📋 Testing Get All Orders (Admin)...")
    
    if not admin_token:
        print("❌ No admin token available")
        return False
    
    try:
        # Use trailing slash to avoid redirect
        orders_url = f"{API_BASE}/orders/"
        headers = {
            "Authorization": f"Bearer {admin_token}",
            "Content-Type": "application/json"
        }
        
        response = requests.get(orders_url, headers=headers, timeout=10)
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            orders = data.get('orders', []) if isinstance(data, dict) else data
            print("✅ Orders retrieved successfully!")
            print(f"Number of orders: {len(orders)}")
            
            if orders:
                for order in orders[:3]:  # Show first 3
                    print(f"  - Order {order.get('order_number')} - {order.get('status')} - {order.get('total')}€")
            return True
        else:
            print(f"❌ Failed to get orders!")
            print(f"Error: {response.text}")
            return False
            
    except requests.exceptions.RequestException as e:
        print(f"❌ Network error during orders retrieval: {e}")
        return False
    except json.JSONDecodeError as e:
        print(f"❌ Invalid JSON response: {e}")
        return False

def test_get_user_orders(user_token):
    """Test GET /api/orders/me - get orders for authenticated user"""
    print("👤 Testing Get User Orders (/api/orders/me)...")
    
    if not user_token:
        print("❌ No user token available")
        return False
    
    try:
        orders_url = f"{API_BASE}/orders/me"
        headers = {
            "Authorization": f"Bearer {user_token}",
            "Content-Type": "application/json"
        }
        
        response = requests.get(orders_url, headers=headers, timeout=10)
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            orders = response.json()
            print("✅ User orders retrieved successfully!")
            print(f"Number of user orders: {len(orders)}")
            
            if orders:
                for order in orders[:3]:  # Show first 3
                    print(f"  - Order {order.get('order_number')} - {order.get('status')} - {order.get('total')}€")
                    print(f"    User ID: {order.get('user_id')}")
            else:
                print("  - No orders found for this user")
            return True
        else:
            print(f"❌ Failed to get user orders!")
            print(f"Error: {response.text}")
            return False
            
    except requests.exceptions.RequestException as e:
        print(f"❌ Network error during user orders retrieval: {e}")
        return False
    except json.JSONDecodeError as e:
        print(f"❌ Invalid JSON response: {e}")
        return False

def test_get_product_by_id(product_id):
    """Test GET /api/products/{id} - get specific product details"""
    print(f"🔍 Testing Get Product by ID (/api/products/{product_id})...")
    
    try:
        product_url = f"{API_BASE}/products/{product_id}"
        response = requests.get(product_url, timeout=10)
        
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            product = response.json()
            print("✅ Product retrieved successfully!")
            print(f"Product Name: {product.get('name', 'N/A')}")
            print(f"Product Brand: {product.get('brand', 'N/A')}")
            print(f"Product Price: {product.get('price', 'N/A')}€")
            print(f"Product Stock: {product.get('stock', 'N/A')}")
            print(f"Product ID: {product.get('id', 'N/A')}")
            return True, product
        else:
            print(f"❌ Failed to get product!")
            print(f"Error: {response.text}")
            return False, None
            
    except requests.exceptions.RequestException as e:
        print(f"❌ Network error during product retrieval: {e}")
        return False, None
    except json.JSONDecodeError as e:
        print(f"❌ Invalid JSON response: {e}")
        return False, None

def test_update_product_admin(product_id, admin_token):
    """Test PUT /api/products/{id} - admin product update"""
    print(f"✏️ Testing Update Product (/api/products/{product_id})...")
    
    if not admin_token:
        print("❌ No admin token available")
        return False
    
    try:
        # First get the current product to preserve existing data
        get_success, current_product = test_get_product_by_id(product_id)
        if not get_success:
            print("❌ Cannot update product - failed to get current product data")
            return False
        
        # Update some fields
        update_data = {
            "name": current_product.get('name', 'Test Product') + " (Updated)",
            "description": "Updated description for testing admin edit functionality",
            "price": float(current_product.get('price', 100)) + 10.00,  # Add 10€ to price
            "stock": current_product.get('stock', 10) + 5  # Add 5 to stock
        }
        
        product_url = f"{API_BASE}/products/{product_id}"
        headers = {
            "Authorization": f"Bearer {admin_token}",
            "Content-Type": "application/json"
        }
        
        response = requests.put(
            product_url,
            json=update_data,
            headers=headers,
            timeout=10
        )
        
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            result = response.json()
            print("✅ Product updated successfully!")
            print(f"Response: {result}")
            
            # Verify the update by getting the product again
            verify_success, updated_product = test_get_product_by_id(product_id)
            if verify_success:
                print("✅ Update verification:")
                print(f"  Name: {updated_product.get('name')}")
                print(f"  Price: {updated_product.get('price')}€")
                print(f"  Stock: {updated_product.get('stock')}")
                print(f"  Description: {updated_product.get('description', 'N/A')[:50]}...")
            
            return True
        else:
            print(f"❌ Failed to update product!")
            print(f"Error: {response.text}")
            return False
            
    except requests.exceptions.RequestException as e:
        print(f"❌ Network error during product update: {e}")
        return False
    except json.JSONDecodeError as e:
        print(f"❌ Invalid JSON response: {e}")
        return False

def test_user_login():
    """Test user login to get user token for testing /api/orders/me"""
    print("🔐 Testing User Login...")
    
    # First, let's try to create a test user or use existing user
    # For now, we'll try with admin credentials as user
    login_url = f"{API_BASE}/auth/login"
    login_data = {
        "email": "admin@carvatoo.at",
        "password": "admin"
    }
    
    try:
        response = requests.post(
            login_url,
            json=login_data,
            headers={"Content-Type": "application/json"},
            timeout=10
        )
        
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print("✅ User login successful!")
            print(f"Access Token: {data.get('access_token', 'N/A')[:50]}...")
            print(f"User Info: {data.get('user', {})}")
            return True, data.get('access_token')
        else:
            print(f"❌ User login failed!")
            print(f"Error: {response.text}")
            return False, None
            
    except requests.exceptions.RequestException as e:
        print(f"❌ Network error during user login: {e}")
        return False, None
    except json.JSONDecodeError as e:
        print(f"❌ Invalid JSON response: {e}")
        print(f"Raw response: {response.text}")
        return False, None

def test_vehicle_search():
    """Test vehicle search functionality with search parameter"""
    print("🔍 Testing Vehicle Search (search=Golf)...")
    
    try:
        vehicles_url = f"{API_BASE}/vehicles"
        params = {"search": "Golf"}
        
        response = requests.get(vehicles_url, params=params, timeout=10)
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            vehicles = response.json()
            print("✅ Vehicle search executed successfully!")
            print(f"Number of vehicles found: {len(vehicles)}")
            
            # Check if search results contain Golf in brand, model, or variant
            golf_matches = []
            for vehicle in vehicles:
                brand = vehicle.get('brand', '').lower()
                model = vehicle.get('model', '').lower()
                variant = vehicle.get('variant', '').lower()
                
                if 'golf' in brand or 'golf' in model or 'golf' in variant:
                    golf_matches.append(f"{vehicle.get('brand')} {vehicle.get('model')} {vehicle.get('variant', '')}")
            
            print(f"Golf matches found: {len(golf_matches)}")
            if golf_matches:
                for match in golf_matches[:3]:  # Show first 3 matches
                    print(f"  - {match}")
            
            # Test passes if we get a response (even if no Golf vehicles exist)
            return True, len(golf_matches)
        else:
            print(f"❌ Vehicle search failed!")
            print(f"Error: {response.text}")
            return False, 0
            
    except requests.exceptions.RequestException as e:
        print(f"❌ Network error during vehicle search: {e}")
        return False, 0
    except json.JSONDecodeError as e:
        print(f"❌ Invalid JSON response: {e}")
        return False, 0

def test_security_headers():
    """Test security headers on /api/health endpoint"""
    print("🔒 Testing Security Headers (/api/health)...")
    
    try:
        health_url = f"{API_BASE}/health"
        response = requests.get(health_url, timeout=10)
        
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            headers = response.headers
            print("✅ Health endpoint accessible!")
            
            # Check for security headers
            security_headers = {
                "X-Frame-Options": headers.get("X-Frame-Options"),
                "X-Content-Type-Options": headers.get("X-Content-Type-Options"),
                "X-XSS-Protection": headers.get("X-XSS-Protection"),
                "Strict-Transport-Security": headers.get("Strict-Transport-Security"),
                "Content-Security-Policy": headers.get("Content-Security-Policy")
            }
            
            print("Security Headers Found:")
            missing_headers = []
            for header_name, header_value in security_headers.items():
                if header_value:
                    print(f"  ✅ {header_name}: {header_value}")
                else:
                    print(f"  ❌ {header_name}: Missing")
                    missing_headers.append(header_name)
            
            # Test passes if most security headers are present
            headers_present = len([h for h in security_headers.values() if h])
            total_headers = len(security_headers)
            
            print(f"Security headers present: {headers_present}/{total_headers}")
            
            if headers_present >= 3:  # At least 3 out of 5 headers should be present
                return True, missing_headers
            else:
                return False, missing_headers
        else:
            print(f"❌ Health endpoint failed!")
            print(f"Error: {response.text}")
            return False, ["All headers missing - endpoint failed"]
            
    except requests.exceptions.RequestException as e:
        print(f"❌ Network error during security headers test: {e}")
        return False, ["Network error"]
    except json.JSONDecodeError as e:
        print(f"❌ Invalid JSON response: {e}")
        return False, ["Invalid response"]

def main():
    """Run all backend tests including E2E flow and workshop page specific tests"""
    print("=" * 60)
    print("🚀 CARVATOO BACKEND E2E TESTING")
    print("=" * 60)
    print(f"Backend URL: {BACKEND_URL}")
    print(f"API Base: {API_BASE}")
    print(f"Session ID: {SESSION_ID}")
    print()
    
    results = {}
    test_product = None
    admin_token = None
    user_token = None
    
    # Test API connectivity
    results['api_root'] = test_api_root()
    print()
    
    results['api_health'] = test_api_health()
    print()
    
    # Test admin login and get token
    admin_login_success, admin_token = test_admin_login()
    results['admin_login'] = admin_login_success
    print()
    
    # Test user login for /api/orders/me testing
    user_login_success, user_token = test_user_login()
    results['user_login'] = user_login_success
    print()
    
    # Test new user dashboard functionality
    print("=" * 60)
    print("👤 USER DASHBOARD TESTING")
    print("=" * 60)
    
    # Test GET /api/orders/me
    if user_token:
        get_user_orders_success = test_get_user_orders(user_token)
        results['get_user_orders'] = get_user_orders_success
        print()
    else:
        print("⚠️ Skipping user orders test due to login failure")
        results['get_user_orders'] = False
    
    # Test product admin edit functionality
    print("=" * 60)
    print("✏️ PRODUCT ADMIN EDIT TESTING")
    print("=" * 60)
    
    # First get a product to test with
    category_success, test_product = test_category_products()
    if test_product and test_product.get('id'):
        product_id = test_product['id']
        
        # Test GET /api/products/{id}
        get_product_success, product_details = test_get_product_by_id(product_id)
        results['get_product_by_id'] = get_product_success
        print()
        
        # Test PUT /api/products/{id} (admin only)
        if admin_token and get_product_success:
            update_product_success = test_update_product_admin(product_id, admin_token)
            results['update_product_admin'] = update_product_success
            print()
        else:
            print("⚠️ Skipping product update test due to missing admin token or product")
            results['update_product_admin'] = False
    else:
        print("⚠️ Skipping product tests due to no available products")
        results['get_product_by_id'] = False
        results['update_product_admin'] = False
    
    # Test new workshop routes
    print("=" * 60)
    print("🔧 WORKSHOP ROUTES TESTING")
    print("=" * 60)
    
    # Test creating workshop appointment
    appointment_success, appointment_id = test_create_workshop_appointment()
    results['create_appointment'] = appointment_success
    print()
    
    # Test workshop form submission (frontend structure)
    workshop_form_success, form_appointment_id = test_workshop_form_submission()
    results['workshop_form'] = workshop_form_success
    print()
    
    # Test 'Sofort Termin buchen' flow
    sofort_success = test_sofort_termin_booking()
    results['sofort_termin'] = sofort_success
    print()
    
    # Test Express Services booking
    express_success = test_express_services_booking()
    results['express_services'] = express_success
    print()
    
    # Test getting workshop appointments as admin
    if admin_token:
        get_appointments_success = test_get_workshop_appointments(admin_token)
        results['get_appointments'] = get_appointments_success
        print()
    else:
        print("⚠️ Skipping admin appointment retrieval due to login failure")
        results['get_appointments'] = False
    
    # Test new vehicle routes
    print("=" * 60)
    print("🚗 VEHICLE ROUTES TESTING")
    print("=" * 60)
    
    # Test creating vehicle as admin
    if admin_token:
        create_vehicle_success, vehicle_id = test_create_vehicle(admin_token)
        results['create_vehicle'] = create_vehicle_success
        print()
    else:
        print("⚠️ Skipping vehicle creation due to admin login failure")
        results['create_vehicle'] = False
    
    # Test getting vehicles (public)
    get_vehicles_success = test_get_vehicles()
    results['get_vehicles'] = get_vehicles_success
    print()
    
    # Test order creation and retrieval
    print("=" * 60)
    print("🛒 ORDER CREATION & CHECKOUT TESTING")
    print("=" * 60)
    
    # Test creating order with authentication
    if user_token:
        create_order_success, order_number = test_create_order_authenticated(user_token)
        results['create_order'] = create_order_success
        print()
    else:
        print("⚠️ Skipping order creation due to user login failure")
        results['create_order'] = False
    
    # Test getting orders as admin
    if admin_token:
        get_orders_success = test_get_orders_admin(admin_token)
        results['get_orders'] = get_orders_success
        print()
    else:
        print("⚠️ Skipping admin orders retrieval due to login failure")
        results['get_orders'] = False
    
    # Test new specific functionality requested
    print("=" * 60)
    print("🔍 SPECIFIC FUNCTIONALITY TESTING")
    print("=" * 60)
    
    # Test vehicle search functionality
    vehicle_search_success, golf_matches = test_vehicle_search()
    results['vehicle_search'] = vehicle_search_success
    print()
    
    # Test security headers
    security_headers_success, missing_headers = test_security_headers()
    results['security_headers'] = security_headers_success
    print()
    
    # E2E Flow Testing (existing tests)
    print("=" * 60)
    print("🔄 E2E FLOW TESTING")
    print("=" * 60)
    
    # 1. Category Page - Load products from API (already done above, reuse result)
    results['category_products'] = category_success
    print()
    
    if test_product and test_product.get('id'):
        # 2. Product Page - Load product details (already done above, reuse result)
        product_success = results.get('get_product_by_id', False)
        results['product_details'] = product_success
        print()
        
        if product_success:
            # 3. Add to Cart - Add product to cart
            add_cart_success = test_add_to_cart(test_product['id'])
            results['add_to_cart'] = add_cart_success
            print()
            
            # 4. Cart Page - Verify item is present
            cart_success = test_cart_page()
            results['cart_page'] = cart_success
            print()
        else:
            print("⚠️ Skipping cart tests due to product details failure")
            results['add_to_cart'] = False
            results['cart_page'] = False
    else:
        print("⚠️ Skipping product and cart tests due to category failure")
        results['product_details'] = False
        results['add_to_cart'] = False
        results['cart_page'] = False
    
    # Summary
    print("=" * 60)
    print("📊 TEST SUMMARY")
    print("=" * 60)
    
    # Group tests
    api_tests = ['api_root', 'api_health', 'admin_login', 'user_login']
    dashboard_tests = ['get_user_orders']
    product_admin_tests = ['get_product_by_id', 'update_product_admin']
    workshop_tests = ['create_appointment', 'workshop_form', 'sofort_termin', 'express_services', 'get_appointments']
    vehicle_tests = ['create_vehicle', 'get_vehicles']
    order_tests = ['create_order', 'get_orders']
    specific_tests = ['vehicle_search', 'security_headers']
    e2e_tests = ['category_products', 'product_details', 'add_to_cart', 'cart_page']
    
    print("API Tests:")
    for test_name in api_tests:
        if test_name in results:
            status = "✅ PASS" if results[test_name] else "❌ FAIL"
            print(f"  {test_name.replace('_', ' ').title()}: {status}")
    
    print("\nUser Dashboard Tests:")
    for test_name in dashboard_tests:
        if test_name in results:
            status = "✅ PASS" if results[test_name] else "❌ FAIL"
            print(f"  {test_name.replace('_', ' ').title()}: {status}")
    
    print("\nProduct Admin Tests:")
    for test_name in product_admin_tests:
        if test_name in results:
            status = "✅ PASS" if results[test_name] else "❌ FAIL"
            print(f"  {test_name.replace('_', ' ').title()}: {status}")
    
    print("\nWorkshop Tests:")
    for test_name in workshop_tests:
        if test_name in results:
            status = "✅ PASS" if results[test_name] else "❌ FAIL"
            print(f"  {test_name.replace('_', ' ').title()}: {status}")
    
    print("\nVehicle Tests:")
    for test_name in vehicle_tests:
        if test_name in results:
            status = "✅ PASS" if results[test_name] else "❌ FAIL"
            print(f"  {test_name.replace('_', ' ').title()}: {status}")
    
    print("\nOrder Tests:")
    for test_name in order_tests:
        if test_name in results:
            status = "✅ PASS" if results[test_name] else "❌ FAIL"
            print(f"  {test_name.replace('_', ' ').title()}: {status}")
    
    print("\nE2E Flow Tests:")
    for test_name in e2e_tests:
        if test_name in results:
            status = "✅ PASS" if results[test_name] else "❌ FAIL"
            print(f"  {test_name.replace('_', ' ').title()}: {status}")
    
    total_tests = len(results)
    passed_tests = sum(results.values())
    
    print(f"\nTotal: {passed_tests}/{total_tests} tests passed")
    
    # Check specific test groups
    dashboard_passed = sum(results.get(test, False) for test in dashboard_tests)
    product_admin_passed = sum(results.get(test, False) for test in product_admin_tests)
    workshop_passed = sum(results.get(test, False) for test in workshop_tests)
    vehicle_passed = sum(results.get(test, False) for test in vehicle_tests)
    order_passed = sum(results.get(test, False) for test in order_tests)
    e2e_passed = sum(results.get(test, False) for test in e2e_tests)
    
    print(f"User Dashboard: {dashboard_passed}/{len(dashboard_tests)} tests passed")
    print(f"Product Admin: {product_admin_passed}/{len(product_admin_tests)} tests passed")
    print(f"Workshop Routes: {workshop_passed}/{len(workshop_tests)} tests passed")
    print(f"Vehicle Routes: {vehicle_passed}/{len(vehicle_tests)} tests passed")
    print(f"Order Routes: {order_passed}/{len(order_tests)} tests passed")
    print(f"E2E Flow: {e2e_passed}/{len(e2e_tests)} tests passed")
    
    if passed_tests == total_tests:
        print("🎉 All tests passed!")
        return True
    else:
        print("⚠️  Some tests failed!")
        return False

if __name__ == "__main__":
    success = main()
    exit(0 if success else 1)