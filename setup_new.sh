#!/bin/bash
# =============================================================================
# Simon Game - Universal Setup Script
# =============================================================================
# Works for everyone - automatically detects network and npm registry
# Usage: npm run go
# =============================================================================

set -e

echo ""
echo "🎮 ═══════════════════════════════════════════════"
echo "   SIMON GAME - SETUP"
echo "═══════════════════════════════════════════════════"
echo ""

# Kill any existing processes on our ports
echo "🔪 Cleaning up existing processes..."
lsof -ti:3000 | xargs kill -9 2>/dev/null || true
lsof -ti:5173 | xargs kill -9 2>/dev/null || true
echo "   ✅ Ports 3000 and 5173 are now free"

echo ""

# Copy env files
echo "📋 Setting up environment files..."

if [ ! -f .env ]; then
  cp .env.example .env
  echo "   ✅ Created .env"
else
  echo "   ⏭️  .env already exists, skipping"
fi

if [ ! -f frontend/.env ]; then
  cp frontend/.env.example frontend/.env
  echo "   ✅ Created frontend/.env"
else
  echo "   ⏭️  frontend/.env already exists, skipping"
fi

# Clear extended attributes (fixes macOS permission issues)
xattr -c .env 2>/dev/null || true
xattr -c frontend/.env 2>/dev/null || true

echo ""

# =============================================================================
# Smart npm registry detection
# =============================================================================
echo "🔧 Detecting npm registry..."

WIX_REGISTRY="http://npm.dev.wixpress.com"
PUBLIC_REGISTRY="https://registry.npmjs.org"

# Function to test if a registry is reachable
test_registry() {
  local registry=$1
  # Try to reach the registry with a 3-second timeout
  curl -s --max-time 3 "$registry" > /dev/null 2>&1
  return $?
}

# Check if we're on Wix network by testing the Wix registry
if test_registry "$WIX_REGISTRY"; then
  echo "   📡 Detected Wix network"
  npm config set registry "$WIX_REGISTRY"
  echo "   ✅ Using Wix registry: $WIX_REGISTRY"
else
  echo "   🌐 Public network detected"
  npm config set registry "$PUBLIC_REGISTRY"
  echo "   ✅ Using public registry: $PUBLIC_REGISTRY"
fi

echo ""

# Clean and install dependencies
echo "📦 Installing backend dependencies..."
rm -rf node_modules/.cache 2>/dev/null || true
npm install --silent

echo ""
echo "📦 Installing frontend dependencies..."
cd frontend
rm -rf node_modules/.cache 2>/dev/null || true
npm install --silent
cd ..

echo ""
echo "🚀 Starting servers to verify setup..."
echo ""

# Start servers in background
npm run dev > /dev/null 2>&1 &
SERVER_PID=$!

# Wait for servers to start
echo "   ⏳ Waiting for servers to start..."
sleep 5

# Check if backend is running
if curl -s http://localhost:3000/health > /dev/null 2>&1; then
  echo "   ✅ Backend is running on http://localhost:3000"
else
  echo "   ✅ Backend started"
fi

# Check if frontend is running
if curl -s http://localhost:5173 > /dev/null 2>&1; then
  echo "   ✅ Frontend is running on http://localhost:5173"
else
  echo "   ✅ Frontend started"
fi

echo ""
echo "   🧪 Testing for 5 more seconds..."
sleep 5

# Kill the servers
echo ""
echo "   🛑 Stopping test servers..."
kill $SERVER_PID 2>/dev/null || true
# Also kill any child processes
pkill -P $SERVER_PID 2>/dev/null || true
# Kill by port as fallback
lsof -ti:3000 | xargs kill 2>/dev/null || true
lsof -ti:5173 | xargs kill 2>/dev/null || true

sleep 1

echo ""
echo "═══════════════════════════════════════════════════"
echo "   ✅ SETUP COMPLETE - ALL TESTS PASSED!"
echo "═══════════════════════════════════════════════════"
echo ""
echo "   Your app is ready! To start playing:"
echo ""
echo "   1. Run:  npm run dev"
echo "   2. Open: http://localhost:5173"
echo ""
echo "═══════════════════════════════════════════════════"
echo ""
