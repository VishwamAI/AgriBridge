#!/bin/bash

# Set the API base URL
API_URL="http://localhost:3001"

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Function to generate a unique email
function generate_unique_email() {
    local timestamp=$(date +%s)
    echo "user_${timestamp}@example.com"
}

# Generate a unique email for this test run
TEST_EMAIL=$(generate_unique_email)

# Function to make a POST request
function post_request() {
    local endpoint="$1"
    local data="$2"
    local auth_header="$3"
    if [ -n "$auth_header" ]; then
        curl -s -X POST -H "Content-Type: application/json" -H "Authorization: Bearer $auth_header" -d "$data" "${API_URL}${endpoint}"
    else
        curl -s -X POST -H "Content-Type: application/json" -d "$data" "${API_URL}${endpoint}"
    fi
}

# Function to print test result
function print_result() {
    local test_name="$1"
    local response="$2"
    local expected_status="$3"

    if echo "$response" | grep -q "\"message\":\"$expected_status\""; then
        echo -e "${GREEN}[PASS]${NC} $test_name"
    else
        echo -e "${RED}[FAIL]${NC} $test_name"
        echo "Response: $response"
    fi
}

# Function to generate TOTP code
function generate_totp() {
    local secret="$1"
    oathtool --totp -b "$secret"
}

echo "Starting authentication tests..."

# Test user registration
echo -e "\nTesting user registration..."
register_response=$(post_request "/register" "{\"firstName\":\"John\",\"lastName\":\"Doe\",\"email\":\"$TEST_EMAIL\",\"password\":\"password123\",\"userType\":\"farmer\"}")
print_result "User Registration" "$register_response" "User registered successfully"

# Extract token and 2FA secret from registration response
token=$(echo $register_response | grep -o '"token":"[^"]*' | grep -o '[^"]*$')
twofa_secret=$(echo $register_response | grep -o '"secret":"[^"]*' | grep -o '[^"]*$')

# Test user login
echo -e "\nTesting user login..."
login_response=$(post_request "/login" "{\"email\":\"$TEST_EMAIL\",\"password\":\"password123\"}")
print_result "User Login" "$login_response" "Login successful"

# Test invalid login
echo -e "\nTesting invalid login..."
invalid_login_response=$(post_request "/login" "{\"email\":\"$TEST_EMAIL\",\"password\":\"wrongpassword\"}")
print_result "Invalid Login" "$invalid_login_response" "Invalid credentials"

# Test protected route (dashboard)
echo -e "\nTesting protected route (dashboard)..."
dashboard_response=$(curl -s -X GET -H "Authorization: Bearer $token" "${API_URL}/dashboard")
print_result "Access Dashboard" "$dashboard_response" "Farmer dashboard"

# Test 2FA verification
echo -e "\nTesting 2FA verification..."
totp_code=$(generate_totp "$twofa_secret")
twofa_response=$(post_request "/verify-2fa" "{\"token\":\"$totp_code\"}" "$token")
print_result "2FA Verification" "$twofa_response" "2FA verified successfully"

# Test password reset request
echo -e "\nTesting password reset request..."
reset_request_response=$(post_request "/forgot-password" "{\"email\":\"$TEST_EMAIL\"}")
print_result "Password Reset Request" "$reset_request_response" "Password reset email sent"

# Extract reset token (in a real scenario, this would be sent via email)
reset_token=$(echo $reset_request_response | grep -o '"resetToken":"[^"]*' | grep -o '[^"]*$')

# Test password reset
echo -e "\nTesting password reset..."
reset_response=$(post_request "/reset-password" "{\"token\":\"$reset_token\",\"newPassword\":\"newpassword123\"}" "$token")
print_result "Password Reset" "$reset_response" "Password reset successful"

echo -e "\nAuthentication tests completed."
