#!/bin/bash

# Composeon Startup Script
# This script starts the Composeon AI-powered icon discovery platform

set -e

echo "🚀 Starting Composeon AI Icon Discovery Platform"
echo "================================================"

# Check if we're in the right directory
if [ ! -f "icon-scanner.js" ]; then
    echo "❌ Error: icon-scanner.js not found. Please run this script from the Composeon directory."
    exit 1
fi

# Check if lobe-icons directory exists
if [ ! -d "lobe-icons" ]; then
    echo "❌ Error: lobe-icons directory not found."
    echo "Please make sure the lobe-icons repository is cloned in this directory."
    exit 1
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Error: Node.js is not installed."
    echo "Please install Node.js from https://nodejs.org/"
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'.' -f1 | sed 's/v//')
if [ "$NODE_VERSION" -lt 16 ]; then
    echo "❌ Error: Node.js version 16 or higher is required."
    echo "Current version: $(node -v)"
    exit 1
fi

echo "✅ Node.js version: $(node -v)"

# Check if Ollama is running (optional)
echo "🔍 Checking Ollama connection..."
if curl -s http://localhost:11434/api/tags > /dev/null 2>&1; then
    echo "✅ Ollama is running and accessible"
    OLLAMA_MODELS=$(curl -s http://localhost:11434/api/tags | grep -o '"name":"[^"]*' | cut -d'"' -f4 | head -3 | tr '\n' ' ')
    echo "📚 Available models: ${OLLAMA_MODELS}"
else
    echo "⚠️  Ollama not detected. AI features will be disabled."
    echo "💡 To enable AI features:"
    echo "   1. Install Ollama: https://ollama.ai/"
    echo "   2. Run: ollama serve"
    echo "   3. Pull a model: ollama pull llama3.2"
fi

echo ""
echo "🔧 Starting Composeon server..."
echo "   Server: http://localhost:3000"
echo "   API: http://localhost:3000/api/icons"
echo "   Health: http://localhost:3000/api/health"
echo ""
echo "📝 Usage:"
echo "   • Browse icons in the right panel"
echo "   • Use AI search in the left panel (if Ollama is running)"
echo "   • Select icons and generate LinkedIn posts"
echo "   • Press Ctrl+C to stop the server"
echo ""

# Start the server
node icon-scanner.js

# Cleanup message when server stops
echo ""
echo "👋 Composeon server stopped. Thank you for using Composeon!"
