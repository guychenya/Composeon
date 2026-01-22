#!/usr/bin/env node

/**
 * Composeon MCP Server
 * Model Context Protocol server for smart icon repository and LinkedIn post generation
 *
 * This server provides tools for:
 * - Searching and browsing Lobe Icons
 * - Generating LinkedIn posts with selected icons
 * - Managing icon collections
 * - Downloading icons in various formats
 */

const { Server } = require('@modelcontextprotocol/sdk/server/index.js');
const { StdioServerTransport } = require('@modelcontextprotocol/sdk/server/stdio.js');
const {
  CallToolRequestSchema,
  ErrorCode,
  ListToolsRequestSchema,
  McpError,
} = require('@modelcontextprotocol/sdk/types.js');

const fs = require('fs').promises;
const path = require('path');

class ComposeonMCPServer {
  constructor() {
    this.name = 'composeon-server';
    this.version = '1.0.0';
    this.iconBasePath = path.join(__dirname, 'lobe-icons/packages/static-svg/icons');
    this.icons = [];
    this.categories = {
      ai: ['openai', 'claude', 'anthropic', 'gemini', 'chatglm', 'deepseek', 'cohere', 'mistral'],
      cloud: ['aws', 'azure', 'google', 'googlecloud', 'microsoft', 'alibaba', 'alibabacloud'],
      database: ['mongodb', 'postgresql', 'mysql', 'redis', 'elasticsearch', 'cassandra'],
      design: ['figma', 'adobe', 'sketch', 'canva', 'framer', 'principle'],
      dev: ['github', 'gitlab', 'vscode', 'cursor', 'docker', 'kubernetes'],
      social: ['linkedin', 'twitter', 'facebook', 'instagram', 'discord', 'slack']
    };
  }

  async initialize() {
    await this.loadIcons();
    console.error(`Composeon MCP Server initialized with ${this.icons.length} icons`);
  }

  async loadIcons() {
    try {
      // Load icons from directory
      const files = await fs.readdir(this.iconBasePath);
      const svgFiles = files.filter(file => file.endsWith('.svg'));

      this.icons = svgFiles.map(file => {
        const name = path.parse(file).name;
        const category = this.categorizeIcon(name);
        return {
          name,
          category,
          filename: file,
          path: path.join(this.iconBasePath, file),
          displayName: this.formatDisplayName(name),
          variations: this.getVariations(name, svgFiles)
        };
      });

      // Remove duplicates (keep base version)
      const uniqueIcons = new Map();
      this.icons.forEach(icon => {
        const baseName = icon.name.replace(/-(?:color|text|brand)$/, '');
        if (!uniqueIcons.has(baseName) || icon.name === baseName) {
          uniqueIcons.set(baseName, {
            ...icon,
            name: baseName,
            variations: this.getVariations(baseName, svgFiles)
          });
        }
      });

      this.icons = Array.from(uniqueIcons.values());
    } catch (error) {
      console.error('Failed to load icons:', error);
      this.icons = this.getFallbackIcons();
    }
  }

  categorizeIcon(name) {
    const baseName = name.replace(/-(?:color|text|brand)$/, '');
    for (const [category, keywords] of Object.entries(this.categories)) {
      if (keywords.some(keyword => baseName.includes(keyword))) {
        return category;
      }
    }
    return 'other';
  }

  formatDisplayName(name) {
    const specialNames = {
      'openai': 'OpenAI',
      'chatgpt': 'ChatGPT',
      'github': 'GitHub',
      'vscode': 'VS Code',
      'nodejs': 'Node.js',
      'nextjs': 'Next.js',
      'typescript': 'TypeScript',
      'javascript': 'JavaScript'
    };

    const baseName = name.replace(/-(?:color|text|brand)$/, '');
    return specialNames[baseName] || baseName.charAt(0).toUpperCase() + baseName.slice(1);
  }

  getVariations(baseName, allFiles) {
    const variations = ['default'];
    const possibleVariations = ['color', 'text', 'brand'];

    possibleVariations.forEach(variation => {
      if (allFiles.includes(`${baseName}-${variation}.svg`)) {
        variations.push(variation);
      }
    });

    return variations;
  }

  getFallbackIcons() {
    const fallbackList = [
      'openai', 'claude', 'github', 'figma', 'google', 'microsoft',
      'aws', 'azure', 'docker', 'react', 'nodejs', 'python'
    ];

    return fallbackList.map(name => ({
      name,
      category: this.categorizeIcon(name),
      filename: `${name}.svg`,
      path: path.join(this.iconBasePath, `${name}.svg`),
      displayName: this.formatDisplayName(name),
      variations: ['default']
    }));
  }

  searchIcons(query, category = null, limit = 50) {
    let filtered = this.icons;

    if (category && category !== 'all') {
      filtered = filtered.filter(icon => icon.category === category);
    }

    if (query && query.trim()) {
      const searchTerm = query.toLowerCase();
      filtered = filtered.filter(icon =>
        icon.name.toLowerCase().includes(searchTerm) ||
        icon.displayName.toLowerCase().includes(searchTerm) ||
        icon.category.toLowerCase().includes(searchTerm)
      );
    }

    return filtered.slice(0, limit);
  }

  generateLinkedInPost(template, selectedIcons) {
    const iconObjects = selectedIcons.map(name =>
      this.icons.find(icon => icon.name === name)
    ).filter(Boolean);

    const iconList = iconObjects
      .map(icon => `• ${icon.displayName}`)
      .join('\n');

    const iconEmojis = iconObjects
      .map(icon => this.getIconEmoji(icon.name))
      .join(' ');

    const templates = {
      'tools-spotlight': `🌟 Amazing tools that are transforming how we work:

${iconList}

These tools have revolutionized productivity and creativity in their respective domains. Each one brings unique capabilities that help teams and individuals achieve more.

What's your favorite tool from this list? Share your experience in the comments! 👇

${iconEmojis}

#TechTools #Innovation #Productivity #TechStack`,

      'tech-stack': `🛠️ My current tech stack:

${iconList}

This combination has been incredibly powerful for building scalable, maintainable solutions. Each tool plays a crucial role in the development lifecycle.

The synergy between these technologies enables rapid development while maintaining high quality standards.

What does your tech stack look like? Drop it in the comments! 💻

${iconEmojis}

#TechStack #Development #Engineering #SoftwareDevelopment`,

      'comparison': `⚖️ Comparing some popular tools in the market:

${iconList}

Each of these tools has its strengths and ideal use cases. The choice often depends on:
• Team size and expertise
• Project requirements
• Budget considerations
• Integration needs
• Long-term scalability

Have you used any of these? What's been your experience? 🤔

${iconEmojis}

#TechComparison #ToolSelection #TechDecisions`,

      'trend-analysis': `📈 Trending technologies worth watching:

${iconList}

These tools are gaining significant traction in the tech community. Here's why they're trending:

✨ Innovation in user experience
🚀 Improved performance and efficiency
🔧 Better developer experience
🌐 Strong community adoption
💡 Solving real-world problems

Which one are you most excited about? Let me know! 🎯

${iconEmojis}

#TechTrends #Innovation #FutureTech #Technology`
    };

    return templates[template] || `Check out these amazing tools: ${iconObjects.map(i => i.displayName).join(', ')}!`;
  }

  getIconEmoji(name) {
    const emojiMap = {
      'openai': '🤖',
      'claude': '🧠',
      'github': '🐙',
      'figma': '🎨',
      'google': '🔍',
      'microsoft': '🪟',
      'aws': '☁️',
      'azure': '🔵',
      'docker': '🐳',
      'kubernetes': '⚓',
      'mongodb': '🍃',
      'postgresql': '🐘',
      'linkedin': '💼',
      'twitter': '🐦'
    };
    return emojiMap[name] || '⭐';
  }

  async getIconContent(iconName, variation = 'default') {
    const icon = this.icons.find(i => i.name === iconName);
    if (!icon) {
      throw new Error(`Icon '${iconName}' not found`);
    }

    let filename = icon.filename;
    if (variation !== 'default' && icon.variations.includes(variation)) {
      filename = `${iconName}-${variation}.svg`;
    }

    const filePath = path.join(this.iconBasePath, filename);

    try {
      const content = await fs.readFile(filePath, 'utf-8');
      return content;
    } catch (error) {
      throw new Error(`Failed to read icon file: ${error.message}`);
    }
  }

  getStats() {
    const categoryStats = {};
    Object.keys(this.categories).forEach(category => {
      categoryStats[category] = this.icons.filter(icon => icon.category === category).length;
    });

    return {
      total: this.icons.length,
      categories: categoryStats,
      availableCategories: Object.keys(this.categories),
      lastUpdated: new Date().toISOString()
    };
  }

  setupToolHandlers(server) {
    // Search icons tool
    server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      switch (name) {
        case 'search_icons': {
          const { query = '', category = 'all', limit = 50 } = args;
          const results = this.searchIcons(query, category, limit);

          return {
            content: [{
              type: 'text',
              text: JSON.stringify({
                results,
                total: results.length,
                query,
                category
              }, null, 2)
            }]
          };
        }

        case 'get_categories': {
          const stats = this.getStats();
          return {
            content: [{
              type: 'text',
              text: JSON.stringify(stats, null, 2)
            }]
          };
        }

        case 'get_icon': {
          const { name: iconName, variation = 'default' } = args;
          if (!iconName) {
            throw new McpError(ErrorCode.InvalidParams, 'Icon name is required');
          }

          try {
            const content = await this.getIconContent(iconName, variation);
            const icon = this.icons.find(i => i.name === iconName);

            return {
              content: [{
                type: 'text',
                text: JSON.stringify({
                  name: iconName,
                  variation,
                  displayName: icon.displayName,
                  category: icon.category,
                  availableVariations: icon.variations,
                  svgContent: content
                }, null, 2)
              }]
            };
          } catch (error) {
            throw new McpError(ErrorCode.InternalError, error.message);
          }
        }

        case 'generate_linkedin_post': {
          const { template = 'tools-spotlight', icons = [] } = args;

          if (!Array.isArray(icons) || icons.length === 0) {
            throw new McpError(ErrorCode.InvalidParams, 'At least one icon must be selected');
          }

          const post = this.generateLinkedInPost(template, icons);
          const selectedIconsData = icons.map(name =>
            this.icons.find(icon => icon.name === name)
          ).filter(Boolean);

          return {
            content: [{
              type: 'text',
              text: JSON.stringify({
                template,
                selectedIcons: selectedIconsData.map(icon => ({
                  name: icon.name,
                  displayName: icon.displayName,
                  category: icon.category
                })),
                post,
                charactersCount: post.length,
                generatedAt: new Date().toISOString()
              }, null, 2)
            }]
          };
        }

        case 'get_popular_icons': {
          const { limit = 20 } = args;
          const popularNames = [
            'openai', 'github', 'figma', 'google', 'microsoft', 'aws',
            'azure', 'docker', 'react', 'nodejs', 'python', 'javascript',
            'typescript', 'vue', 'angular', 'mongodb', 'postgresql'
          ];

          const popular = popularNames
            .map(name => this.icons.find(icon => icon.name === name))
            .filter(Boolean)
            .slice(0, limit);

          return {
            content: [{
              type: 'text',
              text: JSON.stringify({ popular }, null, 2)
            }]
          };
        }

        default:
          throw new McpError(ErrorCode.MethodNotFound, `Unknown tool: ${name}`);
      }
    });
  }

  setupServer() {
    const server = new Server(
      {
        name: this.name,
        version: this.version,
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    // List available tools
    server.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        tools: [
          {
            name: 'search_icons',
            description: 'Search for icons by name, category, or keyword',
            inputSchema: {
              type: 'object',
              properties: {
                query: {
                  type: 'string',
                  description: 'Search query (icon name, keyword, etc.)'
                },
                category: {
                  type: 'string',
                  description: 'Filter by category (ai, cloud, database, design, dev, social, all)',
                  default: 'all'
                },
                limit: {
                  type: 'number',
                  description: 'Maximum number of results',
                  default: 50
                }
              }
            }
          },
          {
            name: 'get_categories',
            description: 'Get all available icon categories and statistics',
            inputSchema: {
              type: 'object',
              properties: {}
            }
          },
          {
            name: 'get_icon',
            description: 'Get a specific icon with its SVG content',
            inputSchema: {
              type: 'object',
              properties: {
                name: {
                  type: 'string',
                  description: 'Icon name (e.g., "openai", "github")'
                },
                variation: {
                  type: 'string',
                  description: 'Icon variation (default, color, text, brand)',
                  default: 'default'
                }
              },
              required: ['name']
            }
          },
          {
            name: 'generate_linkedin_post',
            description: 'Generate a LinkedIn post using selected icons',
            inputSchema: {
              type: 'object',
              properties: {
                template: {
                  type: 'string',
                  description: 'Post template (tools-spotlight, tech-stack, comparison, trend-analysis)',
                  default: 'tools-spotlight'
                },
                icons: {
                  type: 'array',
                  items: {
                    type: 'string'
                  },
                  description: 'Array of icon names to include in the post'
                }
              },
              required: ['icons']
            }
          },
          {
            name: 'get_popular_icons',
            description: 'Get a list of popular/trending icons',
            inputSchema: {
              type: 'object',
              properties: {
                limit: {
                  type: 'number',
                  description: 'Maximum number of popular icons to return',
                  default: 20
                }
              }
            }
          }
        ]
      };
    });

    this.setupToolHandlers(server);
    return server;
  }

  async run() {
    await this.initialize();
    const server = this.setupServer();
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.error('Composeon MCP Server running on stdio');
  }
}

// Handle graceful shutdown
process.on('SIGINT', async () => {
  console.error('Shutting down Composeon MCP Server...');
  process.exit(0);
});

// Run the server
if (require.main === module) {
  const server = new ComposeonMCPServer();
  server.run().catch((error) => {
    console.error('Server error:', error);
    process.exit(1);
  });
}

module.exports = ComposeonMCPServer;
