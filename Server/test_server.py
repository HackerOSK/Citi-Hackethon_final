import requests
import json

def test_get_testcase():
    """Test the get_testcase endpoint"""
    gst_in = "09AAACH7409R1ZZ"  # Replace with a valid GST_IN from your database
    url = f"http://localhost:5000/get_testcase?gst_in={gst_in}"
    
    try:
        response = requests.get(url)
        print(f"Status Code: {response.status_code}")
        print(f"Response: {json.dumps(response.json(), indent=2)}")
        
        # Print the keys to help debug column name issues
        if response.status_code == 200:
            data = response.json()
            print("\nColumn names in response:")
            for key in data.keys():
                print(f"  - {key}")
                
        return response.json()
    except Exception as e:
        print(f"Error: {str(e)}")
        return None

def test_get_credit_score():
    """Test the get_credit_score endpoint"""
    gst_in = "09AAACH7409R1ZZ"  # Replace with a valid GST_IN from your database
    url = f"http://localhost:5000/get_credit_score?gst_in={gst_in}"
    
    try:
        response = requests.get(url)
        print(f"Status Code: {response.status_code}")
        print(f"Response: {json.dumps(response.json(), indent=2)}")
    except Exception as e:
        print(f"Error: {str(e)}")

if __name__ == "__main__":
    print("Testing get_testcase endpoint...")
    test_case_data = test_get_testcase()
    
    print("\nTesting get_credit_score endpoint...")
    test_get_credit_score() 