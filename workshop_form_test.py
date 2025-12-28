#!/usr/bin/env python3
"""
Workshop Form Specific Testing
Tests the exact form submission from WorkshopPage.jsx
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

def test_workshop_form_submission():
    """Test workshop appointment form submission with exact frontend data structure"""
    print("🔧 Testing Workshop Form Submission (Frontend Format)...")
    
    try:
        appointment_url = f"{API_BASE}/workshop/appointments"
        
        # This matches the exact data structure sent from WorkshopPage.jsx
        form_data = {
            "name": "Maria Schneider",
            "email": "maria.schneider@example.com", 
            "phone": "+43 664 123 4567",
            "date": "2025-01-25",
            "vehicle": "BMW X3 2021",
            "serviceId": "dpf",
            "serviceName": "DPF-Reinigung Spezial"
        }
        
        response = requests.post(
            appointment_url,
            json=form_data,
            headers={"Content-Type": "application/json"},
            timeout=10
        )
        
        print(f"Status Code: {response.status_code}")
        print(f"Request Data: {json.dumps(form_data, indent=2)}")
        
        if response.status_code == 201:
            appointment = response.json()
            print("✅ Workshop form submission successful!")
            print(f"Response: {json.dumps(appointment, indent=2, default=str)}")
            
            # Verify all form fields are saved
            required_fields = ['name', 'email', 'phone', 'date', 'vehicle', 'serviceId', 'serviceName']
            missing_fields = []
            
            for field in required_fields:
                if field not in appointment:
                    missing_fields.append(field)
            
            if missing_fields:
                print(f"⚠️ Missing fields in response: {missing_fields}")
                return False
            else:
                print("✅ All form fields properly saved and returned")
                return True
                
        else:
            print(f"❌ Workshop form submission failed!")
            print(f"Error: {response.text}")
            return False
            
    except requests.exceptions.RequestException as e:
        print(f"❌ Network error during workshop form submission: {e}")
        return False
    except json.JSONDecodeError as e:
        print(f"❌ Invalid JSON response: {e}")
        return False

def test_sofort_termin_buchen_flow():
    """Test the 'Sofort Termin buchen' button flow"""
    print("🚀 Testing 'Sofort Termin buchen' Flow...")
    
    try:
        appointment_url = f"{API_BASE}/workshop/appointments"
        
        # This simulates clicking "Sofort Termin buchen" button (general inquiry)
        sofort_data = {
            "name": "Hans Weber",
            "email": "hans.weber@example.com",
            "phone": "+43 1 234 5678", 
            "date": "2025-01-30",
            "vehicle": "Audi A4 2019",
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
        print(f"Request Data: {json.dumps(sofort_data, indent=2)}")
        
        if response.status_code == 201:
            appointment = response.json()
            print("✅ 'Sofort Termin buchen' flow successful!")
            print(f"Appointment ID: {appointment.get('id')}")
            print(f"Service: {appointment.get('serviceName')}")
            print(f"Status: {appointment.get('status')}")
            return True
        else:
            print(f"❌ 'Sofort Termin buchen' flow failed!")
            print(f"Error: {response.text}")
            return False
            
    except requests.exceptions.RequestException as e:
        print(f"❌ Network error during 'Sofort Termin buchen' flow: {e}")
        return False
    except json.JSONDecodeError as e:
        print(f"❌ Invalid JSON response: {e}")
        return False

def test_express_service_booking():
    """Test express service booking (like Pickerl, Ölwechsel, etc.)"""
    print("⚡ Testing Express Service Booking...")
    
    express_services = [
        {"id": "pickerl", "name": "§57a Pickerl"},
        {"id": "oil_change", "name": "Ölwechsel"},
        {"id": "tire_change", "name": "Reifenwechsel"},
        {"id": "climate", "name": "Klimaservice"}
    ]
    
    results = []
    
    for service in express_services:
        try:
            appointment_url = f"{API_BASE}/workshop/appointments"
            
            express_data = {
                "name": f"Test Customer {service['id']}",
                "email": f"test.{service['id']}@example.com",
                "phone": "+43 123 456 789",
                "date": "2025-02-01",
                "vehicle": "VW Golf 2020",
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
    
    success_rate = sum(results) / len(results) * 100
    print(f"Express Services Success Rate: {success_rate:.1f}% ({sum(results)}/{len(results)})")
    
    return all(results)

def main():
    """Run workshop-specific tests"""
    print("=" * 60)
    print("🔧 WORKSHOP PAGE BACKEND TESTING")
    print("=" * 60)
    print(f"Backend URL: {BACKEND_URL}")
    print(f"API Base: {API_BASE}")
    print()
    
    results = {}
    
    # Test workshop form submission
    results['form_submission'] = test_workshop_form_submission()
    print()
    
    # Test "Sofort Termin buchen" flow
    results['sofort_termin'] = test_sofort_termin_buchen_flow()
    print()
    
    # Test express service bookings
    results['express_services'] = test_express_service_booking()
    print()
    
    # Summary
    print("=" * 60)
    print("📊 WORKSHOP TESTING SUMMARY")
    print("=" * 60)
    
    for test_name, result in results.items():
        status = "✅ PASS" if result else "❌ FAIL"
        print(f"  {test_name.replace('_', ' ').title()}: {status}")
    
    total_tests = len(results)
    passed_tests = sum(results.values())
    
    print(f"\nTotal: {passed_tests}/{total_tests} workshop tests passed")
    
    if passed_tests == total_tests:
        print("🎉 All workshop tests passed!")
        return True
    else:
        print("⚠️ Some workshop tests failed!")
        return False

if __name__ == "__main__":
    success = main()
    exit(0 if success else 1)