# Composeon 🚀

**Smart Icon Repository & LinkedIn Post Generator with MCP Server Integration**

Transform your AI workflow with intelligent icon management and professional LinkedIn content generation.

[![GitHub stars](https://img.shields.io/github/stars/guychenya/Composeon?style=social)](https://github.com/guychenya/Composeon)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![MCP Compatible](https://img.shields.io/badge/MCP-Compatible-blue.svg)](https://modelcontextprotocol.io/)

## 🌟 What is Composeon?

Composeon is a revolutionary platform that combines:

- **🔍 Smart Icon Repository** - Search through 760+ Lobe Icons with intelligent categorization
- **✍️ AI-Powered LinkedIn Post Generator** - Create professional posts with integrated icons
- **🔌 MCP Server** - Seamlessly integrate with Claude Desktop and other AI applications  
- **🎨 Beautiful Web Interface** - Interactive browsing and selection experience
- **📊 Analytics Dashboard** - Track popular icons and trending technologies

## ✨ Key Features

### 🔍 **Smart Search & Discovery**
- Search 760+ high-quality Lobe Icons
- Intelligent categorization (AI, Cloud, Design, Development, etc.)
- Fuzzy matching and tag-based filtering
- Real-time search results

### ✍️ **LinkedIn Post Generation**
- **Tools Spotlight** - Highlight amazing technologies
- **Tech Stack** - Showcase your development setup  
- **Tool Comparison** - Compare different solutions
- **Trend Analysis** - Analyze technology trends
- Professional formatting with emojis and hashtags

### 🔌 **MCP Server Integration**
- Compatible with Claude Desktop
- RESTful API endpoints
- Real-time icon search and retrieval
- Automated post generation via AI

### 🎨 **Interactive Web Interface**
- Responsive design for all devices
- Drag-and-drop icon selection
- Live preview of generated posts
- Download icons in multiple formats

## 🚀 Quick Start

### Web Application

1. **Clone the repository**
   ```bash
   git clone https://github.com/guychenya/Composeon.git
   cd Composeon
   ```

2. **Open the web app**
   ```bash
   # Serve locally (optional)
   python -m http.server 3000
   # or
   npm run serve
   
   # Then visit http://localhost:3000
   # Or simply open index.html in your browser
   ```

3. **Start exploring!**
   - Search for icons by name or category
   - Select icons to build your collection
   - Generate LinkedIn posts with different templates

### MCP Server Setup

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Configure Claude Desktop**
   
   Edit your `claude_desktop_config.json`:
   ```json
   {
     "mcpServers": {
       "composeon": {
         "command": "node",
         "args": ["/path/to/Composeon/mcp-server.js"],
         "cwd": "/path/to/Composeon"
       }
     }
   }
   ```

3. **Restart Claude Desktop** and start using Composeon tools!

For detailed setup instructions, see [MCP_SETUP.md](MCP_SETUP.md)

## 🎯 Usage Examples

### In Claude Desktop (MCP)

```
🔍 "Find me all AI-related icons"
✍️ "Create a LinkedIn post about my development stack using React, Node.js, and MongoDB"
📊 "What are the most popular cloud provider icons?"
🎨 "Generate a tools spotlight post featuring design applications"
```

### Web Interface

1. **Search Icons** - Type "openai", "github", or any tech tool
2. **Filter by Category** - Click AI, Cloud, Design, etc.
3. **Select Icons** - Click to add to your collection
4. **Generate Post** - Choose a template and see the magic
5. **Copy & Share** - Copy to clipboard and post on LinkedIn

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────┐
│                Web Application                      │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐   │
│  │   Search    │ │  Generator  │ │  Analytics  │   │
│  │  Interface  │ │   Engine    │ │  Dashboard  │   │
│  └─────────────┘ └─────────────┘ └─────────────┘   │
└─────────────────────┬───────────────────────────────┘
                      │
┌─────────────────────┴───────────────────────────────┐
│               MCP Server Layer                      │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐   │
│  │   Icon      │ │    Post     │ │    API      │   │
│  │  Manager    │ │  Generator  │ │  Handler    │   │
│  └─────────────┘ └─────────────┘ └─────────────┘   │
└─────────────────────┬───────────────────────────────┘
                      │
┌─────────────────────┴───────────────────────────────┐
│              Lobe Icons Repository                  │
│         760+ SVG Icons Organized by Category        │
└─────────────────────────────────────────────────────┘
```

## 📁 Project Structure

```
Composeon/
├── 📄 index.html              # Main web application
├── 🔧 mcp-server.js           # MCP server implementation  
├── 📦 icons-loader.js         # Dynamic icon loading system
├── 📋 package.json            # Node.js dependencies
├── 📚 MCP_SETUP.md            # Detailed setup instructions
├── 🌐 netlify.toml            # Netlify deployment config
├── 📁 lobe-icons/             # 760+ SVG icons
│   └── packages/static-svg/icons/
├── 📁 public/                 # Static assets
└── 📄 README.md               # You are here!
```

## 🛠️ Technology Stack

### Frontend
- **HTML5** - Semantic, accessible markup
- **CSS3** - Modern styling with flexbox and animations  
- **Vanilla JavaScript** - No framework dependencies
- **Progressive Enhancement** - Works without JavaScript

### Backend (MCP Server)
- **Node.js** - Server runtime
- **Model Context Protocol** - AI integration standard
- **RESTful Architecture** - Clean API design
- **JSON Schema Validation** - Type-safe operations

### Data & Assets  
- **Lobe Icons** - 760+ high-quality SVG icons
- **Smart Categorization** - AI, Cloud, Design, Dev, Social, etc.
- **Metadata Management** - Tags, descriptions, variations

## 🔧 API Reference

### MCP Tools

| Tool | Description | Parameters |
|------|-------------|------------|
| `search_icons` | Search icons by query/category | `query`, `category`, `limit` |
| `get_icon` | Retrieve specific icon + SVG | `name`, `variation` |
| `generate_linkedin_post` | Create LinkedIn post | `icons[]`, `template` |
| `get_categories` | List all categories + stats | None |
| `get_popular_icons` | Get trending icons | `limit` |

### Post Templates

- **`tools-spotlight`** - Highlight amazing tools and technologies
- **`tech-stack`** - Showcase your development stack
- **`comparison`** - Compare different solutions  
- **`trend-analysis`** - Analyze technology trends

## 🎨 Icon Categories

| Category | Count | Examples |
|----------|-------|----------|
| 🤖 **AI** | 45+ | OpenAI, Claude, Anthropic, Gemini |
| ☁️ **Cloud** | 80+ | AWS, Azure, Google Cloud, Alibaba |
| 🗄️ **Database** | 35+ | MongoDB, PostgreSQL, Redis, MySQL |
| 🎨 **Design** | 25+ | Figma, Adobe, Sketch, Canva |
| 👩‍💻 **Development** | 120+ | GitHub, VS Code, Docker, React |
| 📱 **Social** | 30+ | LinkedIn, Twitter, Discord, Slack |
| 📊 **Analytics** | 20+ | Google Analytics, Mixpanel, Amplitude |
| 🛒 **E-commerce** | 15+ | Shopify, Stripe, PayPal, WooCommerce |

## 🌐 Live Demo

Try Composeon online: [https://composeon.netlify.app](https://composeon.netlify.app) *(Coming soon)*

## 🤝 Contributing

We welcome contributions! Here's how you can help:

### 🎯 **Areas for Contribution**
- **Icon Categorization** - Improve automatic categorization logic
- **Post Templates** - Create new LinkedIn post templates
- **Search Features** - Enhance search algorithms and filters  
- **MCP Integrations** - Add support for more AI applications
- **Documentation** - Improve guides and examples
- **UI/UX** - Enhance the web interface

### 📝 **How to Contribute**
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Test thoroughly (especially MCP integration)
5. Commit your changes (`git commit -m 'Add amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

## 📊 Usage Statistics

- **760+ Icons** from Lobe Icons library
- **10+ Categories** with intelligent classification
- **4 Post Templates** for different content types
- **MCP Compatible** with Claude Desktop and other AI apps
- **Open Source** with MIT license

## 🔮 Roadmap

### Phase 1: Core Features ✅
- [x] Web-based icon repository
- [x] LinkedIn post generator  
- [x] MCP server implementation
- [x] Category-based filtering

### Phase 2: Enhanced Features 🚧
- [ ] Icon variation support (color, text, brand)
- [ ] Bulk download functionality
- [ ] Custom post templates
- [ ] Usage analytics dashboard

### Phase 3: Advanced Integration 🎯
- [ ] GitHub integration for tech stack detection
- [ ] AI-powered categorization improvements
- [ ] Multi-language support
- [ ] Enterprise features

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **[Lobe Icons](https://github.com/lobehub/lobe-icons)** - Amazing icon library that powers Composeon
- **[Model Context Protocol](https://modelcontextprotocol.io/)** - Standard that enables AI integration
- **[Claude Desktop](https://claude.ai/desktop)** - AI application that showcases MCP capabilities
- **Open Source Community** - For inspiration, feedback, and contributions

## 💬 Support

- 🐛 **Bug Reports**: [GitHub Issues](https://github.com/guychenya/Composeon/issues)
- 💡 **Feature Requests**: [GitHub Discussions](https://github.com/guychenya/Composeon/discussions)  
- 📧 **Contact**: Open an issue for support

---

<div align="center">

**Made with ❤️ for the AI and developer community**

Transform your workflow with intelligent icon management and content generation!

[⭐ Star this repo](https://github.com/guychenya/Composeon) • [🐛 Report Bug](https://github.com/guychenya/Composeon/issues) • [💡 Request Feature](https://github.com/guychenya/Composeon/discussions)

</div>