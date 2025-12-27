#!/usr/bin/env python3
"""
Backend Testing Script for Carvatoo
Tests admin login functionality
"""

import requests
import json
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv('/app/frontend/.env')

# Get backend URL from frontend env
BACKEND_URL = os.getenv('REACT_APP_BACKEND_URL', 'https://carbooth.preview.emergentagent.com')
API_BASE = f"{BACKEND_URL}/api"

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
        print(f"Response Headers: {dict(response.headers)}")
        
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