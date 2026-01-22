# Composeon MCP Server Setup Guide

🚀 **Transform your AI workflow with intelligent icon management and LinkedIn post generation**

## What is Composeon MCP Server?

Composeon is a Model Context Protocol (MCP) server that provides AI applications like Claude Desktop with access to:

- 🔍 **760+ Lobe Icons** - Searchable repository of tech company and tool icons
- ✍️ **LinkedIn Post Generator** - AI-powered content creation with icon integration
- 🎨 **Smart Categorization** - Organized by AI, Cloud, Design, Development, etc.
- 📊 **Usage Analytics** - Track popular icons and trends
- 🔌 **Easy Integration** - Works with Claude Desktop, IDEs, and other MCP-compatible apps

## Prerequisites

- Node.js 16 or higher
- Claude Desktop (for MCP integration)
- Git (to clone the repository)

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/guychenya/Composeon.git
cd Composeon
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Verify Installation

```bash
node mcp-server.js --help
```

You should see the server start with:
```
Composeon MCP Server initialized with X icons
Composeon MCP Server running on stdio
```

## Claude Desktop Integration

### 1. Locate Your Claude Desktop Config

**macOS:**
```bash
~/Library/Application Support/Claude/claude_desktop_config.json
```

**Windows:**
```bash
%APPDATA%\Claude\claude_desktop_config.json
```

### 2. Add Composeon Server

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

**Replace `/path/to/Composeon` with your actual path!**

### 3. Restart Claude Desktop

Close and reopen Claude Desktop. You should see a 🔌 icon indicating MCP servers are connected.

## Usage Examples

### 1. Search for Icons

```
Can you search for AI-related icons using the Composeon server?
```

**Claude will use:**
```json
{
  "tool": "search_icons",
  "arguments": {
    "query": "ai",
    "category": "ai",
    "limit": 10
  }
}
```

### 2. Generate LinkedIn Posts

```
Create a LinkedIn post about my tech stack using OpenAI, GitHub, and Docker icons
```

**Claude will:**
1. Search for the icons
2. Generate a professional LinkedIn post
3. Include relevant hashtags and emojis

### 3. Browse Categories

```
What icon categories are available in Composeon?
```

**Returns:**
- 🤖 AI (OpenAI, Claude, Anthropic...)
- ☁️ Cloud (AWS, Azure, Google Cloud...)
- 🗄️ Database (MongoDB, PostgreSQL, Redis...)
- 🎨 Design (Figma, Adobe, Sketch...)
- 👩‍💻 Development (GitHub, VS Code, Docker...)
- 📱 Social (LinkedIn, Twitter, Discord...)

## Available Tools

### `search_icons`
Search the icon repository by name, category, or keyword.

**Parameters:**
- `query` (string): Search term
- `category` (string): Filter by category
- `limit` (number): Max results (default: 50)

### `get_icon`
Retrieve a specific icon with SVG content.

**Parameters:**
- `name` (string, required): Icon name
- `variation` (string): Icon variant (default, color, text, brand)

### `generate_linkedin_post`
Create LinkedIn posts with selected icons.

**Parameters:**
- `icons` (array, required): List of icon names
- `template` (string): Post template type

**Templates:**
- `tools-spotlight` - Highlight amazing tools
- `tech-stack` - Showcase development stack
- `comparison` - Compare different solutions
- `trend-analysis` - Analyze technology trends

### `get_categories`
Get statistics about available categories and icon counts.

### `get_popular_icons`
Retrieve trending and popular icons.

**Parameters:**
- `limit` (number): Max icons to return (default: 20)

## Web Interface

Composeon also includes a beautiful web interface:

```bash
# Serve the web app locally
npm run serve
```

Visit `http://localhost:3000` to:
- Browse all 760+ icons interactively
- Generate LinkedIn posts visually
- Download icons in various formats
- Test search and filtering

## Configuration

### Custom Icon Path

Modify `mcp-server.js` to change the icon directory:

```javascript
this.iconBasePath = path.join(__dirname, 'your-custom-path');
```

### Add Custom Categories

Edit the categories in `mcp-server.js`:

```javascript
this.categories = {
  ai: ['openai', 'claude', 'anthropic'],
  yourCategory: ['icon1', 'icon2', 'icon3'],
  // ... more categories
};
```

## Troubleshooting

### Server Not Starting

1. **Check Node.js version:**
   ```bash
   node --version  # Should be 16+
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Check file permissions:**
   ```bash
   chmod +x mcp-server.js
   ```

### Claude Desktop Not Connecting

1. **Verify config path** - Ensure the path in `claude_desktop_config.json` is absolute
2. **Check JSON syntax** - Use a JSON validator
3. **Restart Claude Desktop** - Completely quit and reopen
4. **Check logs** - Look for error messages in Claude Desktop

### Icons Not Loading

1. **Verify submodule:**
   ```bash
   git submodule update --init --recursive
   ```

2. **Check icon directory:**
   ```bash
   ls lobe-icons/packages/static-svg/icons/ | head -10
   ```

## Example Prompts for Claude

Once set up, try these prompts:

```
🔍 "Find me icons for cloud providers"

✍️ "Create a LinkedIn post about modern AI tools using relevant icons"

📊 "What are the most popular development tools in your icon database?"

🎨 "Show me design-related icons and create a post about my design workflow"

🔧 "Generate a tech stack post using React, Node.js, MongoDB, and AWS icons"
```

## Development

### Running in Development Mode

```bash
npm run dev
```

### Adding New Features

1. Fork the repository
2. Create a feature branch
3. Add your changes
4. Test with Claude Desktop
5. Submit a pull request

### Testing the MCP Server

```bash
# Test icon search
echo '{"jsonrpc":"2.0","id":1,"method":"tools/call","params":{"name":"search_icons","arguments":{"query":"github"}}}' | node mcp-server.js
```

## Deployment

### As a Web App

Deploy to Netlify, Vercel, or any static hosting:

```bash
npm run deploy
```

### As a Standalone MCP Server

Package for distribution:

```bash
npm pack
```

## Support

- 🐛 **Issues:** [GitHub Issues](https://github.com/guychenya/Composeon/issues)
- 💬 **Discussions:** [GitHub Discussions](https://github.com/guychenya/Composeon/discussions)
- 📧 **Contact:** Open an issue for support

## Contributing

We welcome contributions! Areas where you can help:

- 🎯 **Icon Categorization** - Improve automatic categorization
- 📝 **Post Templates** - Add new LinkedIn post templates  
- 🔍 **Search Features** - Enhance search algorithms
- 🌐 **Integrations** - Add support for more MCP clients
- 📚 **Documentation** - Improve guides and examples

## License

MIT License - See [LICENSE](LICENSE) for details.

---

**Made with ❤️ for the AI and developer community**

Transform your workflow with intelligent icon management and content generation!