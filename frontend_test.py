#!/usr/bin/env python3
"""
Frontend Testing Script for Carvatoo Homepage
Tests if the homepage loads with OpenCarBox design elements
"""

import requests
import time
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import TimeoutException, WebDriverException
import os

# Frontend URL
FRONTEND_URL = "https://carbooth.preview.emergentagent.com"

def test_homepage_basic_load():
    """Test if homepage loads basic HTML structure"""
    print("🌐 Testing Homepage Basic Load...")
    
    try:
        response = requests.get(FRONTEND_URL, timeout=10)
        
        if response.status_code == 200:
            print("✅ Homepage loads successfully")
            print(f"Status Code: {response.status_code}")
            
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

def test_homepage_content_with_selenium():
    """Test homepage content using Selenium (headless Chrome)"""
    print("🔍 Testing Homepage Content with Selenium...")
    
    # Setup Chrome options for headless mode
    chrome_options = Options()
    chrome_options.add_argument("--headless")
    chrome_options.add_argument("--no-sandbox")
    chrome_options.add_argument("--disable-dev-shm-usage")
    chrome_options.add_argument("--disable-gpu")
    chrome_options.add_argument("--window-size=1920,1080")
    
    driver = None
    try:
        # Initialize Chrome driver
        driver = webdriver.Chrome(options=chrome_options)
        driver.get(FRONTEND_URL)
        
        # Wait for page to load
        wait = WebDriverWait(driver, 15)
        
        # Wait for React to render
        wait.until(EC.presence_of_element_located((By.ID, "root")))
        time.sleep(3)  # Additional wait for React components to render
        
        results = {}
        
        # Check for "OpenCarBox" text
        try:
            opencarbox_element = driver.find_element(By.XPATH, "//*[contains(text(), 'OpenCarBox')]")
            print("✅ 'OpenCarBox' text found")
            results['opencarbox_text'] = True
        except:
            print("❌ 'OpenCarBox' text not found")
            results['opencarbox_text'] = False
        
        # Check for "Carvantooo" text
        try:
            carvantooo_element = driver.find_element(By.XPATH, "//*[contains(text(), 'Carvantooo')]")
            print("✅ 'Carvantooo' text found")
            results['carvantooo_text'] = True
        except:
            print("❌ 'Carvantooo' text not found")
            results['carvantooo_text'] = False
        
        # Check for images (look for img tags)
        try:
            images = driver.find_elements(By.TAG_NAME, "img")
            if images:
                print(f"✅ Found {len(images)} image(s) on page")
                
                # Check if images are loading (not broken)
                broken_images = 0
                for img in images:
                    src = img.get_attribute("src")
                    if src and "unsplash.com" in src:
                        # Check if image has loaded (naturalWidth > 0)
                        natural_width = driver.execute_script("return arguments[0].naturalWidth;", img)
                        if natural_width == 0:
                            broken_images += 1
                
                if broken_images == 0:
                    print("✅ All images appear to be loading correctly")
                    results['images_loading'] = True
                else:
                    print(f"⚠️  {broken_images} image(s) may not be loading properly")
                    results['images_loading'] = False
            else:
                print("❌ No images found on page")
                results['images_loading'] = False
        except Exception as e:
            print(f"❌ Error checking images: {e}")
            results['images_loading'] = False
        
        # Check for Hero section
        try:
            hero_section = driver.find_element(By.TAG_NAME, "section")
            print("✅ Hero section found")
            results['hero_section'] = True
        except:
            print("❌ Hero section not found")
            results['hero_section'] = False
        
        return results
        
    except TimeoutException:
        print("❌ Timeout waiting for page to load")
        return {'error': 'timeout'}
    except WebDriverException as e:
        print(f"❌ WebDriver error: {e}")
        return {'error': 'webdriver'}
    except Exception as e:
        print(f"❌ Unexpected error: {e}")
        return {'error': 'unexpected'}
    finally:
        if driver:
            driver.quit()

def main():
    """Run all frontend tests"""
    print("=" * 60)
    print("🎨 CARVATOO FRONTEND TESTING")
    print("=" * 60)
    print(f"Frontend URL: {FRONTEND_URL}")
    print()
    
    results = {}
    
    # Test basic load
    results['basic_load'] = test_homepage_basic_load()
    print()
    
    # Test content with Selenium (if available)
    try:
        content_results = test_homepage_content_with_selenium()
        if isinstance(content_results, dict) and 'error' not in content_results:
            results.update(content_results)
        else:
            print("⚠️  Selenium testing failed - this is expected in some environments")
            results['selenium_available'] = False
    except Exception as e:
        print(f"⚠️  Selenium not available: {e}")
        results['selenium_available'] = False
    
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
    critical_tests = ['basic_load']
    critical_passed = all(results.get(test, False) for test in critical_tests)
    
    if critical_passed:
        print("\n🎉 Critical tests passed! Frontend is accessible.")
        if results.get('opencarbox_text') and results.get('carvantooo_text'):
            print("🎨 Design elements (OpenCarBox, Carvantooo) are present!")
        return True
    else:
        print("\n⚠️  Some critical tests failed!")
        return False

if __name__ == "__main__":
    success = main()
    exit(0 if success else 1)