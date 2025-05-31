#!/bin/bash

echo "🚀 Testing Assignment Features"
echo "=============================="

# Check Node.js version
echo "📋 Checking Node.js version..."
node --version
npm --version

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run this script from the e-learning-ui directory."
    exit 1
fi

echo "✅ Found package.json"

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install --legacy-peer-deps
fi

# Check TypeScript compilation
echo "🔍 Checking TypeScript compilation..."
npx tsc --noEmit --skipLibCheck

if [ $? -eq 0 ]; then
    echo "✅ TypeScript compilation successful"
else
    echo "⚠️  TypeScript compilation has issues, but continuing..."
fi

# Try to build the project
echo "🏗️  Building project..."
npx next build

if [ $? -eq 0 ]; then
    echo "✅ Build successful"
    
    # Start the production server
    echo "🚀 Starting production server..."
    echo "📱 Open http://localhost:3000/test-assignments to test assignment features"
    echo "📱 Open http://localhost:3000/demo-assignments for full demo"
    echo "📱 Open http://localhost:3000/teacher/courses for teacher dashboard"
    
    npx next start
else
    echo "❌ Build failed. Trying development mode..."
    
    # Try development mode
    echo "🔧 Starting development server..."
    echo "📱 Open http://localhost:3000/test-assignments to test assignment features"
    echo "📱 Open http://localhost:3000/demo-assignments for full demo"
    echo "📱 Open http://localhost:3000/teacher/courses for teacher dashboard"
    
    npx next dev --turbopack
fi
