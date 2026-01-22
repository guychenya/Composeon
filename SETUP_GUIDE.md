# Composeon AI Setup Guide

🚀 **Complete setup guide for Composeon - AI-powered icon discovery and LinkedIn post generation platform**

## 📋 Overview

Composeon is a revolutionary platform that combines:
- **760+ Lobe Icons** from tech companies and tools
- **AI-powered search** using local Ollama models
- **LinkedIn post generation** with selected icons
- **Progressive loading** for optimal performance
- **Split-screen interface** with AI chat and icon browsing

## 🔧 Prerequisites

### Required
- **Node.js 16+** - [Download here](https://nodejs.org/)
- **Git** - For cloning repositories
- **Modern browser** - Chrome, Firefox, Safari, or Edge

### Optional (for AI features)
- **Ollama** - Local AI model runner ([Install guide](https://ollama.ai/))
- **llama3.2 or similar model** - For intelligent search

## 🚀 Quick Start

### 1. Clone the Repository
```bash
git clone https://github.com/guychenya/Composeon.git
cd Composeon
```

### 2. Start the Server
```bash
./start.sh
```

Or manually:
```bash
node icon-scanner.js
```

### 3. Open in Browser
Navigate to: **http://localhost:3000**

## 📦 Detailed Setup

### Step 1: Verify Prerequisites
```bash
# Check Node.js version (should be 16+)
node -v

# Check Git
git --version
```

### Step 2: Clone and Initialize
```bash
# Clone the main repository
git clone https://github.com/guychenya/Composeon.git
cd Composeon

# Verify lobe-icons are included
ls lobe-icons/packages/static-svg/icons/ | wc -l
# Should show ~760 files
```

### Step 3: Start the Development Server
```bash
# Option 1: Use the startup script (recommended)
./start.sh

# Option 2: Manual start
node icon-scanner.js
```

You should see:
```
🎯 Starting Composeon Icon Scanner...
🔍 Scanning icons directory...
📊 Found 760 SVG files
✅ Processed 298 unique icons
🚀 Composeon server running at http://localhost:3000
```

## 🧠 AI Setup (Optional)

For the full AI-powered experience, install Ollama:

### Install Ollama
```bash
# macOS
brew install ollama

# Or download from https://ollama.ai/
```

### Start Ollama Service
```bash
# Start the Ollama service
ollama serve
```

### Pull a Language Model
```bash
# Recommended: Fast and capable model
ollama pull llama3.2

# Alternative options:
ollama pull llama3.2:3b    # Smaller, faster
ollama pull codellama      # Code-focused
ollama pull mistral        # Alternative option
```

### Verify AI Connection
1. Open Composeon: http://localhost:3000
2. Check the left panel "Ollama Status"
3. Should show: ✅ "Connected to Ollama"
4. Toggle "AI-Enhanced Search" to ON

## 🎯 Usage Guide

### Basic Icon Browsing
1. **Browse Icons** - Right panel shows 24 icons initially
2. **Load More** - Click "Load More Icons" button for additional icons
3. **Filter by Category** - Use chips: AI, Cloud, Dev, Design, Social, etc.
4. **Select Icons** - Click icons to add to your selection

### AI-Powered Search
1. **Enable AI** - Toggle "AI-Enhanced Search" in the left panel
2. **Natural Queries** - Ask: *"Show me AI company icons"*
3. **Get Suggestions** - AI provides related searches
4. **Smart Results** - AI understands context and intent

### LinkedIn Post Generation
1. **Select Icons** - Choose 3-5 icons from the grid
2. **Generate Post** - Click the floating "Generate Post" button
3. **Copy Content** - Post is automatically copied to clipboard
4. **Paste to LinkedIn** - Ready-to-use professional content

## 🛠️ Server Endpoints

When running, Composeon provides these APIs:

| Endpoint | Description | Example |
|----------|-------------|---------|
| `http://localhost:3000` | Main application | Open in browser |
| `http://localhost:3000/api/icons` | Icons API with filtering | `?category=ai&limit=24` |
| `http://localhost:3000/api/health` | Health check + Ollama status | JSON status response |
| `http://localhost:3000/api/ollama` | Ollama proxy (CORS-enabled) | POST requests only |

### Example API Usage
```bash
# Get first 24 AI icons
curl "http://localhost:3000/api/icons?category=ai&limit=24"

# Check system health
curl "http://localhost:3000/api/health"
```

## 🔍 Troubleshooting

### Icons Not Loading
**Problem**: Gray circles instead of icons

**Solutions**:
1. **Check server is running**: Ensure `node icon-scanner.js` is active
2. **Verify icon paths**: Check that `lobe-icons/` directory exists
3. **CORS issues**: Use the local server (not file:// URLs)
4. **Restart server**: Stop with Ctrl+C and restart

```bash
# Debug: Check if icons exist
ls lobe-icons/packages/static-svg/icons/ | head -10

# Debug: Test server endpoint
curl "http://localhost:3000/api/icons?limit=5"
```

### Ollama Not Connecting
**Problem**: AI features not working

**Solutions**:
1. **Install Ollama**: Visit https://ollama.ai/
2. **Start service**: Run `ollama serve` in terminal
3. **Pull model**: Run `ollama pull llama3.2`
4. **Check port**: Verify Ollama runs on port 11434

```bash
# Test Ollama directly
curl http://localhost:11434/api/tags

# Check if models are available
ollama list
```

### Server Won't Start
**Problem**: Port already in use or permission errors

**Solutions**:
```bash
# Check if port 3000 is busy
lsof -i :3000

# Kill process using port 3000
kill -9 $(lsof -ti:3000)

# Or use different port
PORT=3001 node icon-scanner.js
```

### Performance Issues
**Problem**: Slow loading or browser lag

**Solutions**:
- **Use modern browser**: Chrome, Firefox, Safari latest versions
- **Progressive loading**: Icons load in batches of 24
- **Clear browser cache**: Force refresh with Cmd+Shift+R (Mac) or Ctrl+Shift+R (Windows)
- **Check memory**: Close other browser tabs if needed

## 🎨 Customization

### Adding Custom Icons
1. Place SVG files in `lobe-icons/packages/static-svg/icons/`
2. Restart server to re-scan
3. Icons will be automatically categorized

### Modifying Categories
Edit `icon-scanner.js`, update the `categoryKeywords` object:
```javascript
this.categoryKeywords = {
    ai: ['openai', 'claude', /* your additions */],
    yourCategory: ['icon1', 'icon2', 'icon3']
};
```

### Custom Templates
In `index.html`, modify the `generatePostContent()` function to add new LinkedIn post templates.

## 🔧 Development

### File Structure
```
Composeon/
├── index.html              # Main application
├── icon-scanner.js         # Server + icon scanner
├── start.sh               # Startup script
├── icons-manifest.json    # Generated icon database
├── lobe-icons/            # Icon library (760+ SVGs)
├── package.json           # MCP server config
├── mcp-server.js          # Model Context Protocol server
└── README.md              # Documentation
```

### Building for Production
```bash
# Generate fresh manifest
node icon-scanner.js

# The app is ready to serve from any static server
# No build step required - vanilla HTML/CSS/JS
```

## 🌐 Deployment Options

### Static Hosting (Netlify, Vercel)
```bash
# Deploy the entire directory
# Set build command: node icon-scanner.js
# Set publish directory: ./
```

### Docker Deployment
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY . .
EXPOSE 3000
CMD ["node", "icon-scanner.js"]
```

### Self-hosted Server
```bash
# Use PM2 for process management
npm install -g pm2
pm2 start icon-scanner.js --name composeon
pm2 startup
pm2 save
```

## 📊 Performance Metrics

- **Icons**: 298 unique icons from 760+ SVG files
- **Categories**: 8+ intelligent categories
- **Loading**: Progressive 24-icon batches
- **Memory**: ~50MB browser memory usage
- **Speed**: < 100ms initial load, < 50ms per batch

## 🤝 Contributing

### Reporting Issues
1. Check existing issues on GitHub
2. Provide browser console errors
3. Include system info (OS, Node version, Ollama version)

### Adding Features
1. Fork the repository
2. Create feature branch
3. Test with different browsers
4. Submit pull request

## 📞 Support

- **GitHub Issues**: [Report bugs](https://github.com/guychenya/Composeon/issues)
- **Documentation**: Check README.md and MCP_SETUP.md
- **Community**: GitHub Discussions

## 🎯 Advanced Usage

### Keyboard Shortcuts
- **Ctrl/Cmd + K**: Focus search input
- **Ctrl/Cmd + Enter**: Generate post (when icons selected)
- **Escape**: Clear selection

### URL Parameters
```bash
# Direct category filtering
http://localhost:3000/?category=ai

# Search query
http://localhost:3000/?search=github
```

### Batch Operations
```bash
# Export all icons data
curl "http://localhost:3000/api/icons?limit=1000" > all-icons.json

# Search programmatically
curl "http://localhost:3000/api/icons?search=cloud&category=cloud"
```

---

## 🎉 You're Ready!

Congratulations! You now have a fully functional AI-powered icon discovery platform. Start exploring icons, try the AI search, and generate amazing LinkedIn posts!

**Quick test checklist**:
- ✅ Server running on http://localhost:3000
- ✅ Icons loading in right panel
- ✅ AI search working (if Ollama installed)
- ✅ Icon selection and post generation functional

Happy icon hunting! 🚀✨