#!/usr/bin/env python3

import requests
import json
import sys
from datetime import datetime
from typing import Dict, Any, Optional

class TaskFlowAPITester:
    def __init__(self, base_url="https://full-stack-tasks-2.preview.emergentagent.com"):
        self.base_url = base_url
        self.access_token = None
        self.refresh_token = None
        self.tests_run = 0
        self.tests_passed = 0
        self.user_data = None
        
        print(f"🚀 TaskFlow API Testing Started")
        print(f"📡 Base URL: {self.base_url}")
        print(f"⏰ Timestamp: {datetime.now().isoformat()}")
        print("=" * 60)

    def run_test(self, name: str, method: str, endpoint: str, expected_status: int, 
                 data: Optional[Dict] = None, headers: Optional[Dict] = None) -> tuple:
        """Run a single API test"""
        url = f"{self.base_url}/api/{endpoint}" if not endpoint.startswith('/') else f"{self.base_url}{endpoint}"
        
        if headers is None:
            headers = {'Content-Type': 'application/json'}
        
        if self.access_token and 'Authorization' not in headers:
            headers['Authorization'] = f'Bearer {self.access_token}'

        self.tests_run += 1
        print(f"\n🔍 Test {self.tests_run}: {name}")
        print(f"   URL: {method} {url}")
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=headers, timeout=10)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=headers, timeout=10)
            elif method == 'PUT':
                response = requests.put(url, json=data, headers=headers, timeout=10)
            elif method == 'DELETE':
                response = requests.delete(url, headers=headers, timeout=10)
            else:
                raise ValueError(f"Unsupported method: {method}")

            success = response.status_code == expected_status
            
            try:
                response_data = response.json() if response.text else {}
            except json.JSONDecodeError:
                response_data = {"raw_response": response.text}

            if success:
                self.tests_passed += 1
                print(f"   ✅ PASSED - Status: {response.status_code}")
                if response_data and isinstance(response_data, dict):
                    if 'message' in response_data:
                        print(f"   📝 Message: {response_data['message']}")
            else:
                print(f"   ❌ FAILED - Expected {expected_status}, got {response.status_code}")
                if response_data:
                    print(f"   📝 Response: {json.dumps(response_data, indent=2)}")

            return success, response_data, response.status_code

        except requests.exceptions.RequestException as e:
            print(f"   ❌ FAILED - Network Error: {str(e)}")
            return False, {}, 0
        except Exception as e:
            print(f"   ❌ FAILED - Error: {str(e)}")
            return False, {}, 0

    def test_health_check(self):
        """Test application health endpoint"""
        print("\n📊 Testing Application Health")
        success, data, _ = self.run_test("Health Check", "GET", "/health", 200)
        return success

    def test_api_root(self):
        """Test API root endpoint"""
        success, data, _ = self.run_test("API Root", "GET", "api", 200)
        return success

    def test_demo_login(self):
        """Test login with demo credentials"""
        print("\n🔐 Testing Authentication")
        
        login_data = {
            "email": "demo@todo.com",
            "password": "Demo@1234"
        }
        
        success, data, status_code = self.run_test(
            "Demo User Login",
            "POST", 
            "auth/login",
            200,
            data=login_data
        )
        
        if success and data:
            if 'access_token' in data:
                self.access_token = data['access_token']
                print(f"   🎟️ Access Token: {self.access_token[:20]}...")
            if 'refresh_token' in data:
                self.refresh_token = data['refresh_token']
                print(f"   🔄 Refresh Token: {self.refresh_token[:20]}...")
            if 'user' in data:
                self.user_data = data['user']
                print(f"   👤 User: {self.user_data.get('email', 'N/A')}")
        
        return success

    def test_get_profile(self):
        """Test getting user profile"""
        if not self.access_token:
            print("   ⚠️ SKIPPED - No access token available")
            return False
            
        success, data, _ = self.run_test("Get Profile", "GET", "users/profile", 200)
        return success

    def test_get_tasks(self):
        """Test getting user tasks"""
        if not self.access_token:
            print("   ⚠️ SKIPPED - No access token available")
            return False
            
        print("\n📋 Testing Task Management")
        success, data, _ = self.run_test("Get All Tasks", "GET", "tasks", 200)
        
        if success and data:
            total_tasks = data.get('total', 0)
            tasks_count = len(data.get('items', []))
            print(f"   📊 Total tasks in DB: {total_tasks}")
            print(f"   📄 Tasks returned: {tasks_count}")
            
            if total_tasks >= 10:
                print(f"   ✅ Expected sample tasks found (≥10)")
            else:
                print(f"   ⚠️ Expected 10+ sample tasks, found {total_tasks}")
        
        return success

    def test_get_task_stats(self):
        """Test getting task statistics"""
        if not self.access_token:
            print("   ⚠️ SKIPPED - No access token available")
            return False
            
        success, data, _ = self.run_test("Get Task Stats", "GET", "tasks/stats", 200)
        
        if success and data:
            print(f"   📊 Stats - Total: {data.get('total', 0)}, Completed: {data.get('completed', 0)}")
            print(f"   📈 Completion Rate: {data.get('completion_rate', 0):.1f}%")
        
        return success

    def test_task_filtering(self):
        """Test task filtering functionality"""
        if not self.access_token:
            print("   ⚠️ SKIPPED - No access token available")
            return False
            
        filters = [
            ("status=PENDING", "Pending Tasks"),
            ("status=COMPLETED", "Completed Tasks"),
            ("priority=HIGH", "High Priority Tasks"),
            ("pinned=true", "Pinned Tasks"),
            ("due_date=today", "Today's Tasks"),
            ("due_date=overdue", "Overdue Tasks")
        ]
        
        all_passed = True
        for filter_param, filter_name in filters:
            success, data, _ = self.run_test(
                f"Filter: {filter_name}", 
                "GET", 
                f"tasks?{filter_param}", 
                200
            )
            if success and data:
                count = len(data.get('items', []))
                print(f"   📊 {filter_name}: {count} tasks")
            all_passed = all_passed and success
        
        return all_passed

    def test_categories(self):
        """Test category management"""
        if not self.access_token:
            print("   ⚠️ SKIPPED - No access token available")
            return False
            
        print("\n🏷️ Testing Category Management")
        success, data, _ = self.run_test("Get Categories", "GET", "categories", 200)
        
        if success and data:
            categories_count = len(data)
            print(f"   📊 Categories found: {categories_count}")
            
            expected_categories = ["Work", "Personal", "Shopping", "Health"]
            found_categories = [cat.get('name', '') for cat in data]
            
            for expected in expected_categories:
                if expected in found_categories:
                    print(f"   ✅ Found category: {expected}")
                else:
                    print(f"   ⚠️ Missing category: {expected}")
        
        return success

    def test_notifications(self):
        """Test notification functionality"""
        if not self.access_token:
            print("   ⚠️ SKIPPED - No access token available")
            return False
            
        print("\n🔔 Testing Notifications")
        success, data, _ = self.run_test("Get Notifications", "GET", "notifications", 200)
        
        if success and data:
            total = data.get('total', 0)
            unread = data.get('unread_count', 0)
            print(f"   📊 Total notifications: {total}")
            print(f"   📬 Unread notifications: {unread}")
        
        return success

    def test_create_task(self):
        """Test creating a new task"""
        if not self.access_token:
            print("   ⚠️ SKIPPED - No access token available")
            return False
            
        print("\n➕ Testing Task Creation")
        
        # First get categories to use one
        cat_success, cat_data, _ = self.run_test("Get Categories for Task", "GET", "categories", 200)
        category_id = None
        if cat_success and cat_data and len(cat_data) > 0:
            category_id = cat_data[0].get('id')
        
        new_task = {
            "title": "Test Task from API",
            "description": "This is a test task created during API testing",
            "priority": "MEDIUM",
            "category_id": category_id,
            "due_date": datetime.now().isoformat()
        }
        
        success, data, _ = self.run_test(
            "Create New Task",
            "POST", 
            "tasks",
            201,
            data=new_task
        )
        
        if success and data:
            task_id = data.get('id')
            print(f"   🆔 Created task ID: {task_id}")
            
            # Test updating the task
            if task_id:
                update_data = {"title": "Updated Test Task", "status": "IN_PROGRESS"}
                update_success, _, _ = self.run_test(
                    "Update Task",
                    "PUT",
                    f"tasks/{task_id}",
                    200,
                    data=update_data
                )
                
                # Test deleting the task
                if update_success:
                    delete_success, _, _ = self.run_test(
                        "Delete Task",
                        "DELETE",
                        f"tasks/{task_id}",
                        200
                    )
                    return delete_success
                
                return update_success
        
        return success

    def test_token_refresh(self):
        """Test token refresh functionality"""
        if not self.refresh_token:
            print("   ⚠️ SKIPPED - No refresh token available")
            return False
            
        print("\n🔄 Testing Token Refresh")
        
        refresh_data = {"refresh_token": self.refresh_token}
        success, data, _ = self.run_test(
            "Refresh Access Token",
            "POST",
            "auth/refresh",
            200,
            data=refresh_data
        )
        
        if success and data:
            new_access_token = data.get('access_token')
            if new_access_token:
                print(f"   🎟️ New Access Token: {new_access_token[:20]}...")
                # Update token for subsequent tests
                self.access_token = new_access_token
        
        return success

    def test_logout(self):
        """Test user logout"""
        if not self.access_token:
            print("   ⚠️ SKIPPED - No access token available")
            return False
            
        print("\n🚪 Testing Logout")
        success, data, _ = self.run_test("User Logout", "POST", "auth/logout", 200)
        
        if success:
            # Clear tokens after successful logout
            self.access_token = None
            self.refresh_token = None
        
        return success

    def run_comprehensive_test(self):
        """Run all tests in sequence"""
        print("🧪 Starting Comprehensive API Testing...")
        
        # Health and basic connectivity
        health_ok = self.test_health_check()
        api_root_ok = self.test_api_root()
        
        # Authentication flow
        login_ok = self.test_demo_login()
        profile_ok = self.test_get_profile()
        
        # Core functionality
        tasks_ok = self.test_get_tasks()
        stats_ok = self.test_get_task_stats()
        filtering_ok = self.test_task_filtering()
        categories_ok = self.test_categories()
        notifications_ok = self.test_notifications()
        
        # CRUD operations
        crud_ok = self.test_create_task()
        
        # Advanced auth
        refresh_ok = self.test_token_refresh()
        logout_ok = self.test_logout()
        
        return {
            'health': health_ok,
            'api_root': api_root_ok,
            'login': login_ok,
            'profile': profile_ok,
            'tasks': tasks_ok,
            'stats': stats_ok,
            'filtering': filtering_ok,
            'categories': categories_ok,
            'notifications': notifications_ok,
            'crud': crud_ok,
            'refresh': refresh_ok,
            'logout': logout_ok
        }

    def print_summary(self, results):
        """Print test summary"""
        print("\n" + "=" * 60)
        print("📊 TEST SUMMARY")
        print("=" * 60)
        
        passed_tests = sum(1 for result in results.values() if result)
        total_tests = len(results)
        success_rate = (self.tests_passed / self.tests_run * 100) if self.tests_run > 0 else 0
        
        print(f"📈 Overall Success Rate: {self.tests_passed}/{self.tests_run} ({success_rate:.1f}%)")
        print(f"🎯 Test Categories Passed: {passed_tests}/{total_tests}")
        
        print(f"\n📋 Test Results:")
        for test_name, passed in results.items():
            status = "✅ PASS" if passed else "❌ FAIL"
            print(f"   {status} {test_name.replace('_', ' ').title()}")
        
        # Critical issues
        critical_failures = []
        if not results.get('health'):
            critical_failures.append("Application health check failed")
        if not results.get('login'):
            critical_failures.append("Demo login failed - authentication broken")
        if not results.get('tasks'):
            critical_failures.append("Cannot fetch tasks - core functionality broken")
        
        if critical_failures:
            print(f"\n🚨 CRITICAL ISSUES:")
            for issue in critical_failures:
                print(f"   ❌ {issue}")
        else:
            print(f"\n✅ No critical issues detected")
        
        print("=" * 60)
        
        return success_rate >= 80 and len(critical_failures) == 0


def main():
    """Main testing function"""
    tester = TaskFlowAPITester()
    
    try:
        results = tester.run_comprehensive_test()
        success = tester.print_summary(results)
        
        if success:
            print("🎉 Backend API tests completed successfully!")
            return 0
        else:
            print("⚠️ Backend API tests completed with issues!")
            return 1
            
    except KeyboardInterrupt:
        print("\n🛑 Testing interrupted by user")
        return 2
    except Exception as e:
        print(f"\n💥 Testing failed with error: {e}")
        import traceback
        traceback.print_exc()
        return 3


if __name__ == "__main__":
    sys.exit(main())