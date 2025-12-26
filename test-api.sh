#!/bin/bash

# API Testing Script for SmartBiz ERP Backend
# Make sure the server is running before executing this script

BASE_URL="http://localhost:5000/api"

echo "🧪 Testing SmartBiz ERP API"
echo "================================"
echo ""

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test 1: Health Check
echo "1. Testing Health Check..."
HEALTH_RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL/health")
if [ "$HEALTH_RESPONSE" == "200" ]; then
    echo -e "${GREEN}✓ Health check passed${NC}"
else
    echo -e "${RED}✗ Health check failed (Status: $HEALTH_RESPONSE)${NC}"
fi
echo ""

# Test 2: Login
echo "2. Testing Login..."
LOGIN_RESPONSE=$(curl -s -X POST "$BASE_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@smartbiz.com","password":"admin123"}')

TOKEN=$(echo $LOGIN_RESPONSE | grep -o '"token":"[^"]*' | cut -d'"' -f4)

if [ -n "$TOKEN" ]; then
    echo -e "${GREEN}✓ Login successful${NC}"
    echo "Token: ${TOKEN:0:50}..."
else
    echo -e "${RED}✗ Login failed${NC}"
    echo "Response: $LOGIN_RESPONSE"
    exit 1
fi
echo ""

# Test 3: Get Current User
echo "3. Testing Get Current User..."
USER_RESPONSE=$(curl -s -X GET "$BASE_URL/auth/me" \
  -H "Authorization: Bearer $TOKEN")
if echo "$USER_RESPONSE" | grep -q "success"; then
    echo -e "${GREEN}✓ Get current user successful${NC}"
else
    echo -e "${RED}✗ Get current user failed${NC}"
fi
echo ""

# Test 4: Get Employees
echo "4. Testing Get Employees..."
EMPLOYEES_RESPONSE=$(curl -s -X GET "$BASE_URL/employees" \
  -H "Authorization: Bearer $TOKEN")
if echo "$EMPLOYEES_RESPONSE" | grep -q "success"; then
    echo -e "${GREEN}✓ Get employees successful${NC}"
else
    echo -e "${RED}✗ Get employees failed${NC}"
fi
echo ""

# Test 5: Get Products
echo "5. Testing Get Products..."
PRODUCTS_RESPONSE=$(curl -s -X GET "$BASE_URL/inventory/products" \
  -H "Authorization: Bearer $TOKEN")
if echo "$PRODUCTS_RESPONSE" | grep -q "success"; then
    echo -e "${GREEN}✓ Get products successful${NC}"
else
    echo -e "${RED}✗ Get products failed${NC}"
fi
echo ""

# Test 6: Get Tasks
echo "6. Testing Get Tasks..."
TASKS_RESPONSE=$(curl -s -X GET "$BASE_URL/tasks" \
  -H "Authorization: Bearer $TOKEN")
if echo "$TASKS_RESPONSE" | grep -q "success"; then
    echo -e "${GREEN}✓ Get tasks successful${NC}"
else
    echo -e "${RED}✗ Get tasks failed${NC}"
fi
echo ""

# Test 7: Get Orders
echo "7. Testing Get Orders..."
ORDERS_RESPONSE=$(curl -s -X GET "$BASE_URL/orders" \
  -H "Authorization: Bearer $TOKEN")
if echo "$ORDERS_RESPONSE" | grep -q "success"; then
    echo -e "${GREEN}✓ Get orders successful${NC}"
else
    echo -e "${RED}✗ Get orders failed${NC}"
fi
echo ""

# Test 8: Get Dashboard
echo "8. Testing Get Dashboard..."
DASHBOARD_RESPONSE=$(curl -s -X GET "$BASE_URL/dashboard" \
  -H "Authorization: Bearer $TOKEN")
if echo "$DASHBOARD_RESPONSE" | grep -q "success"; then
    echo -e "${GREEN}✓ Get dashboard successful${NC}"
else
    echo -e "${RED}✗ Get dashboard failed${NC}"
fi
echo ""

echo "================================"
echo -e "${GREEN}✅ API Testing Complete!${NC}"
echo ""
echo "To test more endpoints, use Postman or curl with the token:"
echo "Authorization: Bearer $TOKEN"

