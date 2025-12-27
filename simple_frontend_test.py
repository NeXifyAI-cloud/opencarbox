#!/usr/bin/env python3
"""
Simple Frontend Testing Script for Carvatoo Homepage
Tests basic homepage accessibility and structure
"""

import requests
import json
import os

# Frontend URL
FRONTEND_URL = "https://carbooth.preview.emergentagent.com"

def test_homepage_accessibility():
    """Test if homepage is accessible"""
    print("🌐 Testing Homepage Accessibility...")
    
    try:
        response = requests.get(FRONTEND_URL, timeout=10)
        
        if response.status_code == 200:
            print("✅ Homepage loads successfully")
            print(f"Status Code: {response.status_code}")
            print(f"Content Length: {len(response.text)} bytes")
            
            # Check if it's a React app (should have root div)
            if 'id="root"' in response.text:
                print("✅ React app structure detected")
                return True
            else:
                print("❌ React app structure not found")
                return False
        else:
            print(f"❌ Homepage failed to load: {response.status_code}")
            return False
            
    except requests.exceptions.RequestException as e:
        print(f"❌ Network error: {e}")
        return False

def test_static_assets():
    """Test if static assets are accessible"""
    print("📦 Testing Static Assets...")
    
    # Test if we can access the main JS bundle (React app)
    try:
        # First get the main page to find script tags
        response = requests.get(FRONTEND_URL, timeout=10)
        
        if response.status_code == 200:
            # Look for script tags in the HTML
            if '<script' in response.text:
                print("✅ JavaScript files are referenced")
                return True
            else:
                print("❌ No JavaScript files found")
                return False
        else:
            return False
            
    except requests.exceptions.RequestException as e:
        print(f"❌ Error checking static assets: {e}")
        return False

def test_api_connectivity_from_frontend():
    """Test if frontend can reach the backend API"""
    print("🔗 Testing API Connectivity from Frontend perspective...")
    
    # Get the backend URL that frontend uses
    try:
        with open('/app/frontend/.env', 'r') as f:
            env_content = f.read()
            
        backend_url = None
        for line in env_content.split('\n'):
            if line.startswith('REACT_APP_BACKEND_URL='):
                backend_url = line.split('=', 1)[1]
                break
        
        if not backend_url:
            print("❌ Backend URL not found in frontend .env")
            return False
        
        print(f"Backend URL from frontend config: {backend_url}")
        
        # Test API health endpoint
        api_url = f"{backend_url}/api/health"
        response = requests.get(api_url, timeout=5)
        
        if response.status_code == 200:
            print("✅ Frontend can reach backend API")
            return True
        else:
            print(f"❌ API not reachable: {response.status_code}")
            return False
            
    except Exception as e:
        print(f"❌ Error testing API connectivity: {e}")
        return False

def check_component_files():
    """Check if key component files exist"""
    print("📁 Checking Component Files...")
    
    key_files = [
        '/app/frontend/src/pages/HomePage.jsx',
        '/app/frontend/src/components/shared/Hero.jsx',
        '/app/frontend/src/components/shared/CategoryOverview.jsx',
        '/app/frontend/src/data/mockData.js'
    ]
    
    all_exist = True
    for file_path in key_files:
        if os.path.exists(file_path):
            print(f"✅ {os.path.basename(file_path)} exists")
        else:
            print(f"❌ {os.path.basename(file_path)} missing")
            all_exist = False
    
    return all_exist

def check_design_content_in_files():
    """Check if design content exists in component files"""
    print("🎨 Checking Design Content in Files...")
    
    results = {}
    
    # Check Hero component for OpenCarBox and Carvantooo text
    try:
        with open('/app/frontend/src/components/shared/Hero.jsx', 'r') as f:
            hero_content = f.read()
        
        if 'OpenCarBox' in hero_content:
            print("✅ 'OpenCarBox' text found in Hero component")
            results['opencarbox_in_hero'] = True
        else:
            print("❌ 'OpenCarBox' text not found in Hero component")
            results['opencarbox_in_hero'] = False
        
        if 'Carvantooo' in hero_content:
            print("✅ 'Carvantooo' text found in Hero component")
            results['carvantooo_in_hero'] = True
        else:
            print("❌ 'Carvantooo' text not found in Hero component")
            results['carvantooo_in_hero'] = False
            
    except Exception as e:
        print(f"❌ Error reading Hero component: {e}")
        results['opencarbox_in_hero'] = False
        results['carvantooo_in_hero'] = False
    
    # Check mockData for Unsplash images
    try:
        with open('/app/frontend/src/data/mockData.js', 'r') as f:
            mockdata_content = f.read()
        
        if 'unsplash.com' in mockdata_content:
            print("✅ Unsplash images found in mockData")
            results['unsplash_images'] = True
        else:
            print("❌ Unsplash images not found in mockData")
            results['unsplash_images'] = False
            
    except Exception as e:
        print(f"❌ Error reading mockData: {e}")
        results['unsplash_images'] = False
    
    return results

def main():
    """Run all frontend tests"""
    print("=" * 60)
    print("🎨 CARVATOO FRONTEND TESTING")
    print("=" * 60)
    print(f"Frontend URL: {FRONTEND_URL}")
    print()
    
    results = {}
    
    # Test basic accessibility
    results['homepage_accessible'] = test_homepage_accessibility()
    print()
    
    # Test static assets
    results['static_assets'] = test_static_assets()
    print()
    
    # Test API connectivity
    results['api_connectivity'] = test_api_connectivity_from_frontend()
    print()
    
    # Check component files
    results['component_files'] = check_component_files()
    print()
    
    # Check design content
    design_results = check_design_content_in_files()
    results.update(design_results)
    print()
    
    # Summary
    print("=" * 60)
    print("📊 FRONTEND TEST SUMMARY")
    print("=" * 60)
    
    for test_name, passed in results.items():
        if isinstance(passed, bool):
            status = "✅ PASS" if passed else "❌ FAIL"
            print(f"{test_name.replace('_', ' ').title()}: {status}")
    
    # Determine overall success
    critical_tests = ['homepage_accessible', 'component_files']
    critical_passed = all(results.get(test, False) for test in critical_tests)
    
    design_tests = ['opencarbox_in_hero', 'carvantooo_in_hero', 'unsplash_images']
    design_passed = all(results.get(test, False) for test in design_tests)
    
    print()
    if critical_passed:
        print("🎉 Critical tests passed! Frontend is accessible.")
        if design_passed:
            print("🎨 All design elements are properly implemented!")
        else:
            print("⚠️  Some design elements may need verification in browser.")
        return True
    else:
        print("⚠️  Some critical tests failed!")
        return False

if __name__ == "__main__":
    success = main()
    exit(0 if success else 1)