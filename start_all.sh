#!/bin/bash

# Stock Analysis Dashboard - Cross-Platform Startup Script
# This script starts both the backend and frontend services

echo "🚀 Starting Stock Analysis Dashboard..."
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check prerequisites
echo -e "${BLUE}Checking prerequisites...${NC}"

if ! command_exists python3 && ! command_exists python; then
    echo -e "${RED}❌ Python is not installed. Please install Python 3.8+ from https://python.org${NC}"
    exit 1
fi

if ! command_exists node; then
    echo -e "${RED}❌ Node.js is not installed. Please install Node.js 16+ from https://nodejs.org${NC}"
    exit 1
fi

if ! command_exists npm; then
    echo -e "${RED}❌ npm is not installed. Please install npm with Node.js${NC}"
    exit 1
fi

echo -e "${GREEN}✅ All prerequisites found${NC}"
echo ""

# Determine Python command
if command_exists python3; then
    PYTHON_CMD="python3"
else
    PYTHON_CMD="python"
fi

# Check Python version
PYTHON_VERSION=$($PYTHON_CMD --version 2>&1 | cut -d' ' -f2 | cut -d'.' -f1,2)
REQUIRED_VERSION="3.8"

if [ "$(printf '%s\n' "$REQUIRED_VERSION" "$PYTHON_VERSION" | sort -V | head -n1)" != "$REQUIRED_VERSION" ]; then
    echo -e "${RED}❌ Python version $PYTHON_VERSION is too old. Please install Python 3.8+${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Python version $PYTHON_VERSION is compatible${NC}"

# Check Node.js version
NODE_VERSION=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)
REQUIRED_NODE_VERSION="16"

if [ "$NODE_VERSION" -lt "$REQUIRED_NODE_VERSION" ]; then
    echo -e "${RED}❌ Node.js version $NODE_VERSION is too old. Please install Node.js 16+${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Node.js version $(node --version) is compatible${NC}"
echo ""

# Setup Backend
echo -e "${BLUE}Setting up Python backend...${NC}"
cd backend

# Remove existing virtual environment if it exists
if [ -d "venv" ]; then
    echo -e "${YELLOW}Removing existing virtual environment...${NC}"
    rm -rf venv
fi

# Create virtual environment
echo -e "${YELLOW}Creating Python virtual environment...${NC}"
$PYTHON_CMD -m venv venv

# Activate virtual environment
echo -e "${YELLOW}Activating virtual environment...${NC}"
source venv/bin/activate

# Upgrade pip
echo -e "${YELLOW}Upgrading pip...${NC}"
pip install --upgrade pip

# Install dependencies
echo -e "${YELLOW}Installing Python dependencies...${NC}"
pip install -r requirements.txt

# Start backend in background
echo -e "${GREEN}Starting Python backend...${NC}"
$PYTHON_CMD app.py &
BACKEND_PID=$!

# Wait for backend to start
echo -e "${YELLOW}Waiting for backend to start...${NC}"
sleep 5

# Check if backend is running
if curl -s http://localhost:5000/health > /dev/null; then
    echo -e "${GREEN}✅ Backend is running on http://localhost:5000${NC}"
else
    echo -e "${RED}❌ Backend failed to start. Check the logs above.${NC}"
    kill $BACKEND_PID 2>/dev/null
    exit 1
fi

# Setup Frontend
echo ""
echo -e "${BLUE}Setting up React frontend...${NC}"
cd ..

# Install frontend dependencies
echo -e "${YELLOW}Installing Node.js dependencies...${NC}"
npm install

# Start frontend
echo -e "${GREEN}Starting React frontend...${NC}"
npm run dev &
FRONTEND_PID=$!

# Wait for frontend to start
echo -e "${YELLOW}Waiting for frontend to start...${NC}"
sleep 3

echo ""
echo -e "${GREEN}🎉 Stock Analysis Dashboard is now running!${NC}"
echo ""
echo -e "${BLUE}Backend:${NC}  http://localhost:5000"
echo -e "${BLUE}Frontend:${NC} http://localhost:3000 (or next available port)"
echo ""
echo -e "${YELLOW}Press Ctrl+C to stop both services${NC}"

# Function to cleanup on exit
cleanup() {
    echo ""
    echo -e "${YELLOW}Shutting down services...${NC}"
    kill $BACKEND_PID 2>/dev/null
    kill $FRONTEND_PID 2>/dev/null
    echo -e "${GREEN}✅ Services stopped${NC}"
    exit 0
}

# Set up signal handlers
trap cleanup SIGINT SIGTERM

# Wait for user to stop
wait
