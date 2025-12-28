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

def main():
    """Run all backend tests including E2E flow and new workshop/vehicle routes"""
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
    
    # Test API connectivity
    results['api_root'] = test_api_root()
    print()
    
    results['api_health'] = test_api_health()
    print()
    
    # Test admin login and get token
    admin_login_success, admin_token = test_admin_login()
    results['admin_login'] = admin_login_success
    print()
    
    # Test new workshop routes
    print("=" * 60)
    print("🔧 WORKSHOP ROUTES TESTING")
    print("=" * 60)
    
    # Test creating workshop appointment
    appointment_success, appointment_id = test_create_workshop_appointment()
    results['create_appointment'] = appointment_success
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
    
    # E2E Flow Testing (existing tests)
    print("=" * 60)
    print("🔄 E2E FLOW TESTING")
    print("=" * 60)
    
    # 1. Category Page - Load products from API
    category_success, test_product = test_category_products()
    results['category_products'] = category_success
    print()
    
    if test_product and test_product.get('id'):
        # 2. Product Page - Load product details
        product_success, product_details = test_product_details(test_product['id'])
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
    api_tests = ['api_root', 'api_health', 'admin_login']
    workshop_tests = ['create_appointment', 'get_appointments']
    vehicle_tests = ['create_vehicle', 'get_vehicles']
    e2e_tests = ['category_products', 'product_details', 'add_to_cart', 'cart_page']
    
    print("API Tests:")
    for test_name in api_tests:
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
    
    print("\nE2E Flow Tests:")
    for test_name in e2e_tests:
        if test_name in results:
            status = "✅ PASS" if results[test_name] else "❌ FAIL"
            print(f"  {test_name.replace('_', ' ').title()}: {status}")
    
    total_tests = len(results)
    passed_tests = sum(results.values())
    
    print(f"\nTotal: {passed_tests}/{total_tests} tests passed")
    
    # Check specific test groups
    workshop_passed = sum(results.get(test, False) for test in workshop_tests)
    vehicle_passed = sum(results.get(test, False) for test in vehicle_tests)
    e2e_passed = sum(results.get(test, False) for test in e2e_tests)
    
    print(f"Workshop Routes: {workshop_passed}/{len(workshop_tests)} tests passed")
    print(f"Vehicle Routes: {vehicle_passed}/{len(vehicle_tests)} tests passed")
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