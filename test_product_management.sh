#!/bin/bash
set -e

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

# Function to make a GET request
function get_request() {
    local endpoint="$1"
    local auth_header="$2"
    curl -s -X GET -H "Authorization: Bearer $auth_header" "${API_URL}${endpoint}"
}

# Function to make a PUT request
function put_request() {
    local endpoint="$1"
    local data="$2"
    local auth_header="$3"
    curl -s -X PUT -H "Content-Type: application/json" -H "Authorization: Bearer $auth_header" -d "$data" "${API_URL}${endpoint}"
}

# Function to make a DELETE request
function delete_request() {
    local endpoint="$1"
    local auth_header="$2"
    curl -s -X DELETE -H "Authorization: Bearer $auth_header" "${API_URL}${endpoint}"
}

# Function to print test result
function print_result() {
    local test_name="$1"
    local response="$2"
    local expected_status="$3"
    local expected_message="$4"

    local actual_status
    local actual_message

    if ! actual_status=$(echo "$response" | jq -r '.status // 200' 2>/dev/null); then
        echo -e "${RED}[FAIL]${NC} $test_name - Error parsing JSON response"
        echo "Response: $response"
        return
    fi

    if ! actual_message=$(echo "$response" | jq -r '.message // ""' 2>/dev/null); then
        echo -e "${RED}[FAIL]${NC} $test_name - Error parsing JSON response"
        echo "Response: $response"
        return
    fi

    if [[ "$actual_status" == "$expected_status" && "$actual_message" == "$expected_message" ]]; then
        echo -e "${GREEN}[PASS]${NC} $test_name"
    else
        echo -e "${RED}[FAIL]${NC} $test_name"
        echo "Response: $response"
        echo "Expected status: $expected_status, Actual status: $actual_status"
        echo "Expected message: $expected_message, Actual message: $actual_message"
    fi
}

# Function to validate product object
function validate_product() {
    local product="$1"
    if [[ $product == *"\"_id\""* && $product == *"\"name\""* && $product == *"\"description\""* &&
          $product == *"\"price\""* && $product == *"\"quantity\""* && $product == *"\"category\""* &&
          $product == *"\"imageUrl\""* && $product == *"\"farmerId\""* && $product == *"\"createdAt\""* &&
          $product == *"\"updatedAt\""* ]]; then
        return 0
    else
        return 1
    fi
}

echo "Starting product management tests..."

# Test user registration and login to get JWT token
echo -e "\nRegistering test user..."
register_response=$(post_request "/register" "{\"firstName\":\"John\",\"lastName\":\"Doe\",\"email\":\"$TEST_EMAIL\",\"password\":\"password123\",\"userType\":\"farmer\"}")
token=$(echo "$register_response" | jq -r '.token // empty')
if [[ -z "$token" ]]; then
    echo "Failed to extract token from registration response"
    echo "Response: $register_response"
    exit 1
fi

echo -e "\nTesting product creation..."
create_product_response=$(post_request "/products" "{\"name\":\"Organic Apples\",\"description\":\"Fresh organic apples\",\"price\":2.99,\"quantity\":100,\"category\":\"Fruits\",\"imageUrl\":\"http://example.com/apple.jpg\"}" "$token")
if ! jq -e . >/dev/null 2>&1 <<<"$create_product_response"; then
    print_result "Create Product" "$create_product_response" 500 "Invalid JSON response"
else
    message=$(echo "$create_product_response" | jq -r '.message // empty')
    product_id=$(echo "$create_product_response" | jq -r '.productId // empty')
    status=$(echo "$create_product_response" | jq -r '.status // 200')
    if [[ "$message" == "Product created successfully" && -n "$product_id" ]]; then
        print_result "Create Product" "$create_product_response" "$status" "Product created successfully"
    else
        print_result "Create Product" "$create_product_response" "$status" "Failed to create product"
    fi
fi

# Extract product ID from the response
product_id=$(echo "$create_product_response" | jq -r '.productId // empty')

echo -e "\nTesting get all products..."
get_products_response=$(get_request "/products" "$token")

if ! jq -e . >/dev/null 2>&1 <<< "$get_products_response"; then
    print_result "Get All Products" "$get_products_response" "500" "Invalid JSON response"
else
    product_count=$(jq '. | if type == "array" then length else 1 end' <<< "$get_products_response")

    if [ "$product_count" -eq 0 ]; then
        print_result "Get All Products" "$get_products_response" "200" "No products found"
    else
        valid_products=$(jq '
            if type == "array" then
                [.[] | select(
                    has("_id") and
                    has("name") and
                    has("description") and
                    has("price") and
                    has("quantity") and
                    has("category") and
                    has("farmerId") and
                    has("createdAt") and
                    has("updatedAt") and
                    (._id | type == "string") and
                    (.price | type == "number") and
                    (.quantity | type == "number") and
                    (.name | type == "string") and
                    (.description | type == "string") and
                    (.category | type == "string") and
                    (.farmerId | type == "string") and
                    (.createdAt | type == "string") and
                    (.updatedAt | type == "string") and
                    (.imageUrl | type == "string" or . == null)
                )] | length
            else
                if (
                    has("_id") and
                    has("name") and
                    has("description") and
                    has("price") and
                    has("quantity") and
                    has("category") and
                    has("farmerId") and
                    has("createdAt") and
                    has("updatedAt") and
                    (._id | type == "string") and
                    (.price | type == "number") and
                    (.quantity | type == "number") and
                    (.name | type == "string") and
                    (.description | type == "string") and
                    (.category | type == "string") and
                    (.farmerId | type == "string") and
                    (.createdAt | type == "string") and
                    (.updatedAt | type == "string") and
                    (.imageUrl | type == "string" or . == null)
                ) then 1 else 0 end
            end
        ' <<< "$get_products_response")

        created_product=$(jq '
            if type == "array" then
                .[] | select(
                    .name == "Organic Apples" and
                    (.price | tostring | startswith("2.99")) and
                    .quantity == 100 and
                    .category == "Fruits" and
                    .imageUrl == "http://example.com/apple.jpg"
                )
            else
                select(
                    .name == "Organic Apples" and
                    (.price | tostring | startswith("2.99")) and
                    .quantity == 100 and
                    .category == "Fruits" and
                    .imageUrl == "http://example.com/apple.jpg"
                )
            end
        ' <<< "$get_products_response")

        if [ "$product_count" -eq "$valid_products" ] && [ -n "$created_product" ]; then
            print_result "Get All Products" "$get_products_response" "200" "Response contains valid products including the created product"
        elif [ "$product_count" -eq "$valid_products" ]; then
            print_result "Get All Products" "$get_products_response" "200" "Response contains valid products but the created product is missing or incorrect"
            echo "Expected product not found. Response content:"
            echo "$get_products_response" | jq '.'
        else
            invalid_count=$((product_count - valid_products))
            print_result "Get All Products" "$get_products_response" "200" "Response contains $invalid_count invalid product object(s) out of $product_count total"
            echo "Invalid products found:"
            jq '
                if type == "array" then
                    map(select(
                        (._id | type != "string") or
                        (.name | type != "string") or
                        (.description | type != "string") or
                        (.price | type != "number") or
                        (.quantity | type != "number") or
                        (.category | type != "string") or
                        (.farmerId | type != "string") or
                        (.createdAt | type != "string") or
                        (.updatedAt | type != "string") or
                        (.imageUrl != null and .imageUrl | type != "string")
                    ))
                else
                    select(
                        (._id | type != "string") or
                        (.name | type != "string") or
                        (.description | type != "string") or
                        (.price | type != "number") or
                        (.quantity | type != "number") or
                        (.category | type != "string") or
                        (.farmerId | type != "string") or
                        (.createdAt | type != "string") or
                        (.updatedAt | type != "string") or
                        (.imageUrl != null and .imageUrl | type != "string")
                    )
                end
            ' <<< "$get_products_response"
        fi

        if [ -n "$created_product" ]; then
            echo "Validating created product fields:"
            jq -r '
                if .farmerId == null then "farmerId is missing or null" else empty end,
                if .createdAt == null then "createdAt is missing or null" else empty end,
                if .updatedAt == null then "updatedAt is missing or null" else empty end,
                if .imageUrl == null then "imageUrl is missing or null" else empty end
            ' <<< "$created_product"
        fi

        # Additional debug information
        echo "Debug: Full API response:"
        echo "$get_products_response" | jq '.'
        echo "Debug: Product count: $product_count"
        echo "Debug: Valid products count: $valid_products"
    fi
fi

echo -e "\nTesting product update..."
update_product_response=$(put_request "/products/$product_id" "{\"name\":\"Organic Red Apples\",\"description\":\"Fresh organic red apples\",\"price\":3.49,\"quantity\":90,\"category\":\"Fruits\",\"imageUrl\":\"http://example.com/red_apple.jpg\"}" "$token")
if ! jq -e . >/dev/null 2>&1 <<<"$update_product_response"; then
    print_result "Update Product" "$update_product_response" 500 "Invalid JSON response"
else
    status=$(echo "$update_product_response" | jq -r '.status // 200')
    message=$(echo "$update_product_response" | jq -r '.message // "No message provided"')
    print_result "Update Product" "$update_product_response" "$status" "$message"
fi

echo -e "\nTesting product deletion..."
delete_product_response=$(delete_request "/products/$product_id" "$token")
if jq -e . >/dev/null 2>&1 <<<"$delete_product_response"; then
    status=$(echo "$delete_product_response" | jq -r '.status // 200')
    message=$(echo "$delete_product_response" | jq -r '.message')
    print_result "Delete Product" "$delete_product_response" "$status" "Product deleted successfully"
else
    print_result "Delete Product" "$delete_product_response" "500" "Invalid JSON response"
fi

echo -e "\nProduct management tests completed."
