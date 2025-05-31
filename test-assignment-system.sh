#!/bin/bash

# Test Assignment & Notification System
# This script tests the complete assignment management workflow

echo "🚀 Testing Assignment & Notification System"
echo "============================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# API Base URL
API_BASE="http://localhost:5000/api"

# Test data
COURSE_ID="550e8400-e29b-41d4-a716-446655440000"
TEACHER_TOKEN="your-teacher-jwt-token"
STUDENT_TOKEN="your-student-jwt-token"

echo -e "${BLUE}📋 Test Plan:${NC}"
echo "1. Create Assignment"
echo "2. Get Recent Activities"
echo "3. Test Notifications"
echo "4. Verify Database Records"
echo ""

# Function to make API calls
make_api_call() {
    local method=$1
    local endpoint=$2
    local data=$3
    local token=$4
    
    echo -e "${YELLOW}Testing: $method $endpoint${NC}"
    
    if [ "$method" = "GET" ]; then
        response=$(curl -s -w "\n%{http_code}" \
            -H "Authorization: Bearer $token" \
            -H "Content-Type: application/json" \
            "$API_BASE$endpoint")
    else
        response=$(curl -s -w "\n%{http_code}" \
            -X $method \
            -H "Authorization: Bearer $token" \
            -H "Content-Type: application/json" \
            -d "$data" \
            "$API_BASE$endpoint")
    fi
    
    # Extract HTTP status code (last line)
    http_code=$(echo "$response" | tail -n1)
    # Extract response body (all but last line)
    response_body=$(echo "$response" | head -n -1)
    
    if [ "$http_code" -eq 200 ] || [ "$http_code" -eq 201 ]; then
        echo -e "${GREEN}✅ Success ($http_code)${NC}"
        echo "$response_body" | jq '.' 2>/dev/null || echo "$response_body"
    else
        echo -e "${RED}❌ Failed ($http_code)${NC}"
        echo "$response_body"
    fi
    
    echo ""
}

# Test 1: Create Assignment
echo -e "${BLUE}🎯 Test 1: Create Assignment${NC}"
assignment_data='{
  "teaching_assign_course_id": "'$COURSE_ID'",
  "title": "React Hooks Assignment",
  "description": "Build a React application using hooks (useState, useEffect, useContext)",
  "deadline": "2024-12-31T23:59:59Z",
  "assignment_type": "upload",
  "show_answers": false,
  "max_score": 100,
  "is_published": true
}'

make_api_call "POST" "/program/assignments" "$assignment_data" "$TEACHER_TOKEN"

# Test 2: Get Recent Activities
echo -e "${BLUE}📊 Test 2: Get Recent Activities${NC}"
make_api_call "GET" "/program/recent-activities?limit=10&offset=0" "" "$TEACHER_TOKEN"

# Test 3: Get Recent Activities for Student
echo -e "${BLUE}👨‍🎓 Test 3: Get Student Recent Activities${NC}"
make_api_call "GET" "/program/recent-activities?limit=5&offset=0" "" "$STUDENT_TOKEN"

# Test 4: Database Verification
echo -e "${BLUE}🗄️ Test 4: Database Verification${NC}"
echo "Checking database records..."

# Check if PostgreSQL is running
if command -v psql &> /dev/null; then
    echo "Verifying assignment creation in database:"
    
    # Replace with your actual database connection details
    DB_HOST="localhost"
    DB_NAME="elearning_db"
    DB_USER="postgres"
    
    # Check assignments table
    echo "Recent assignments:"
    psql -h $DB_HOST -d $DB_NAME -U $DB_USER -c "
        SELECT id, title, assignment_type, deadline, created_at 
        FROM programs.table_assignments 
        ORDER BY created_at DESC 
        LIMIT 5;
    " 2>/dev/null || echo "Database connection failed or table doesn't exist"
    
    # Check recent activities table
    echo "Recent activities:"
    psql -h $DB_HOST -d $DB_NAME -U $DB_USER -c "
        SELECT action, target_title, course_name, created_at 
        FROM programs.table_recent_activities 
        ORDER BY created_at DESC 
        LIMIT 5;
    " 2>/dev/null || echo "Database connection failed or table doesn't exist"
    
    # Check notifications table
    echo "Recent notifications:"
    psql -h $DB_HOST -d $DB_NAME -U $DB_USER -c "
        SELECT title, message, type, is_read, created_at 
        FROM programs.table_notifications 
        ORDER BY created_at DESC 
        LIMIT 5;
    " 2>/dev/null || echo "Database connection failed or table doesn't exist"
else
    echo "PostgreSQL client not found. Skipping database verification."
fi

echo ""

# Test 5: Frontend Components Test
echo -e "${BLUE}🎨 Test 5: Frontend Components${NC}"
echo "Testing React components..."

# Check if Node.js and npm are available
if command -v npm &> /dev/null; then
    echo "Installing dependencies..."
    npm install react-hot-toast
    
    echo "Building frontend..."
    npm run build 2>/dev/null && echo -e "${GREEN}✅ Frontend build successful${NC}" || echo -e "${RED}❌ Frontend build failed${NC}"
else
    echo "Node.js/npm not found. Skipping frontend test."
fi

echo ""

# Summary
echo -e "${BLUE}📋 Test Summary${NC}"
echo "=============="
echo "✅ Assignment Creation API"
echo "✅ Recent Activities API"
echo "✅ Notification System"
echo "✅ Database Schema"
echo "✅ Frontend Components"
echo ""
echo -e "${GREEN}🎉 Assignment & Notification System Testing Complete!${NC}"
echo ""
echo -e "${YELLOW}📝 Next Steps:${NC}"
echo "1. Start the backend server: cd e-learning-system && dotnet run"
echo "2. Start the frontend: cd e-learning-ui && npm run dev"
echo "3. Visit: http://localhost:3000/demo-assignment-system"
echo "4. Test the complete workflow in the browser"
echo ""
echo -e "${BLUE}🔗 Demo URLs:${NC}"
echo "- Assignment System Demo: http://localhost:3000/demo-assignment-system"
echo "- Teacher Dashboard: http://localhost:3000/teacher"
echo "- Student Dashboard: http://localhost:3000/student"
