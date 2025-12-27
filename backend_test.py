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
            return True
        else:
            print(f"❌ Admin login failed!")
            print(f"Error: {response.text}")
            return False
            
    except requests.exceptions.RequestException as e:
        print(f"❌ Network error during admin login: {e}")
        return False
    except json.JSONDecodeError as e:
        print(f"❌ Invalid JSON response: {e}")
        print(f"Raw response: {response.text}")
        return False

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

def main():
    """Run all backend tests"""
    print("=" * 60)
    print("🚀 CARVATOO BACKEND TESTING")
    print("=" * 60)
    print(f"Backend URL: {BACKEND_URL}")
    print(f"API Base: {API_BASE}")
    print()
    
    results = {}
    
    # Test API connectivity
    results['api_root'] = test_api_root()
    print()
    
    results['api_health'] = test_api_health()
    print()
    
    # Test admin login
    results['admin_login'] = test_admin_login()
    print()
    
    # Summary
    print("=" * 60)
    print("📊 TEST SUMMARY")
    print("=" * 60)
    
    for test_name, passed in results.items():
        status = "✅ PASS" if passed else "❌ FAIL"
        print(f"{test_name.replace('_', ' ').title()}: {status}")
    
    total_tests = len(results)
    passed_tests = sum(results.values())
    
    print(f"\nTotal: {passed_tests}/{total_tests} tests passed")
    
    if passed_tests == total_tests:
        print("🎉 All tests passed!")
        return True
    else:
        print("⚠️  Some tests failed!")
        return False

if __name__ == "__main__":
    success = main()
    exit(0 if success else 1)