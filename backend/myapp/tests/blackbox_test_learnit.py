import requests

BASE_URL = "http://localhost:8000/api"  # Ensure Django server is running

def safe_print_json(response):
    try:
        print("Message:", response.json())
    except Exception:
        print("Raw Response:", response.text)

def test_signup():
    print("🔹 Test: Signup with valid data")
    response = requests.post(f"{BASE_URL}/signup/", json={
        "username": "testuser1",
        "email": "testuser1@example.com",
        "password": "Testpass123!",
        "confirmPassword": "Testpass123!"
    })
    print(f"Status: {response.status_code}")
    safe_print_json(response)

def test_signup_mismatch_password():
    print("🔹 Test: Signup with mismatched passwords")
    response = requests.post(f"{BASE_URL}/signup/", json={
        "username": "testuser2",
        "email": "testuser2@example.com",
        "password": "pass123",
        "confirmPassword": "pass999"
    })
    print(f"Status: {response.status_code}")
    safe_print_json(response)

def test_login_success():
    print("🔹 Test: Login with correct credentials")
    response = requests.post(f"{BASE_URL}/login/", json={
        "username": "testuser1",
        "password": "Testpass123!"
    })
    print(f"Status: {response.status_code}")
    safe_print_json(response)
    try:
        return response.json().get("access")
    except:
        return None

def test_login_failure():
    print("🔹 Test: Login with wrong password")
    response = requests.post(f"{BASE_URL}/login/", json={
        "username": "testuser1",
        "password": "WrongPass"
    })
    print(f"Status: {response.status_code}")
    safe_print_json(response)

def test_profile_fetch(token):
    print("🔹 Test: Fetch profile with valid token")
    headers = {"Authorization": f"Bearer {token}"}
    response = requests.get(f"{BASE_URL}/profile/", headers=headers)
    print(f"Status: {response.status_code}")
    safe_print_json(response)

def test_fetch_all_courses(token):
    print("🔹 Test: Fetch all available courses")
    headers = {"Authorization": f"Bearer {token}"}
    response = requests.get(f"{BASE_URL}/courses/", headers=headers)
    print(f"Status: {response.status_code}")
    courses = []
    if response.status_code == 200:
        courses = response.json()
    safe_print_json(response)
    return courses

def test_enroll_course(token, course_id=1):
    print(f"🔹 Test: Enroll in course ID {course_id}")
    headers = {"Authorization": f"Bearer {token}"}
    response = requests.post(f"{BASE_URL}/courses/{course_id}/enroll/", headers=headers)
    print(f"Status: {response.status_code}")
    safe_print_json(response)

def test_lesson_completion(token, lesson_id):
    print(f"🔹 Test: Mark lesson {lesson_id} as completed")
    headers = {"Authorization": f"Bearer {token}"}
    response = requests.post(f"{BASE_URL}/lesson/{lesson_id}/complete/", headers=headers)
    print(f"Status: {response.status_code}")
    safe_print_json(response)

def test_profile_update(token):
    print("🔹 Test: Update profile credentials (mock password change)")
    headers = {"Authorization": f"Bearer {token}"}
    response = requests.put(f"{BASE_URL}/profile/update/", json={
        "username": "testuser1",
        "current_password": "Testpass123!",
        "new_password": "NewTestpass123!"
    }, headers=headers)
    print(f"Status: {response.status_code}")
    safe_print_json(response)

# ✅ Run all tests
if __name__ == "__main__":
    test_signup()
    test_signup_mismatch_password()
    token = test_login_success()
    test_login_failure()

    if token:
        test_profile_fetch(token)

        # Fetch and enroll in all available courses
        courses = test_fetch_all_courses(token)
        for course in courses:
            test_enroll_course(token, course['id'])

        # Simulate lesson completion (use lesson_id = 1 for demo, update if needed)
        test_lesson_completion(token, lesson_id=1)

        # Attempt profile update (username/password)
        test_profile_update(token)