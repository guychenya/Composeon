#!/usr/bin/env node

/**
 * Composeon Icon Scanner & Server
 *
 * This script:
 * 1. Scans the lobe-icons directory for all available SVG icons
 * 2. Generates a manifest file with categorized icons
 * 3. Starts a local development server with CORS enabled
 * 4. Provides endpoints for icon discovery and Ollama proxy
 */

const fs = require('fs');
const path = require('path');
const http = require('http');
const url = require('url');

class ComposeonIconScanner {
    constructor() {
        this.iconsPath = path.join(__dirname, 'lobe-icons/packages/static-svg/icons');
        this.publicPath = path.join(__dirname, 'public');
        this.manifestPath = path.join(__dirname, 'icons-manifest.json');
        this.port = 3000;
        this.ollamaUrl = 'http://localhost:11434';

        // Category mapping for better organization
        this.categoryKeywords = {
            ai: [
                'openai', 'claude', 'anthropic', 'gemini', 'chatgpt', 'gpt', 'midjourney',
                'stability', 'huggingface', 'deepseek', 'cohere', 'replicate', 'runway',
                'perplexity', 'character', 'ai21', 'ai2', 'ai302', 'ai360', 'aihubmix',
                'aimass', 'aionlabs', 'aistudio', 'akashchat', 'alephalpha', 'baai',
                'chatglm', 'deepai', 'deepcogito', 'deepinfra', 'deepmind', 'doubao',
                'dreammachine', 'elevenx', 'essentialai', 'glmv', 'goose'
            ],
            cloud: [
                'aws', 'azure', 'google', 'googlecloud', 'gcp', 'digitalocean', 'cloudflare',
                'heroku', 'netlify', 'vercel', 'railway', 'render', 'supabase', 'planetscale',
                'alibaba', 'alibabacloud', 'baidu', 'baiducloud', 'tencent', 'huawei',
                'oracle', 'ibm', 'linode', 'vultr', 'hetzner', 'baseten', 'crusoe',
                'anyscale', 'centml', 'fireworks', 'featherless', 'friendli'
            ],
            dev: [
                'github', 'gitlab', 'bitbucket', 'vscode', 'cursor', 'jetbrains', 'sublime',
                'atom', 'vim', 'docker', 'kubernetes', 'jenkins', 'circleci', 'travis',
                'copilot', 'githubcopilot', 'cline', 'codeflicker', 'codegeex', 'commanda',
                'copilotkit', 'greptile', 'colab', 'gradio'
            ],
            framework: [
                'react', 'vue', 'angular', 'svelte', 'nextjs', 'nuxt', 'gatsby',
                'nodejs', 'python', 'javascript', 'typescript', 'java', 'golang', 'rust',
                'php', 'ruby', 'swift', 'kotlin', 'dart', 'flutter', 'unity', 'unreal'
            ],
            design: [
                'figma', 'adobe', 'sketch', 'canva', 'framer', 'invision', 'principle',
                'dribbble', 'behance', 'unsplash', 'pexels', 'clipdrop', 'miro', 'whimsical',
                'lucidchart', 'webflow'
            ],
            social: [
                'linkedin', 'twitter', 'facebook', 'instagram', 'youtube', 'tiktok',
                'discord', 'slack', 'telegram', 'whatsapp', 'zoom', 'teams', 'meet',
                'webex', 'skype', 'twitch', 'spotify', 'netflix'
            ],
            database: [
                'mongodb', 'postgresql', 'mysql', 'redis', 'elasticsearch', 'cassandra',
                'neo4j', 'sqlite', 'snowflake', 'databricks', 'clickhouse', 'cockroachdb'
            ],
            browser: [
                'chrome', 'firefox', 'safari', 'edge', 'opera', 'brave'
            ],
            crypto: [
                'bitcoin', 'ethereum', 'binance', 'coinbase', 'metamask'
            ],
            ecommerce: [
                'shopify', 'stripe', 'paypal', 'square', 'klarna', 'razorpay', 'adyen'
            ],
            productivity: [
                'notion', 'obsidian', 'todoist', 'trello', 'asana', 'monday',
                'clickup', 'airtable', 'sheets', 'excel', 'word', 'powerpoint'
            ],
            security: [
                'nordvpn', 'expressvpn', '1password', 'bitwarden', 'lastpass'
            ]
        };
    }

    /**
     * Scan the icons directory and generate manifest
     */
    async scanIcons() {
        console.log('🔍 Scanning icons directory...');

        try {
            if (!fs.existsSync(this.iconsPath)) {
                console.error('❌ Icons directory not found:', this.iconsPath);
                console.log('💡 Make sure lobe-icons is properly installed');
                return [];
            }

            const files = fs.readdirSync(this.iconsPath);
            const svgFiles = files.filter(file => file.endsWith('.svg'));

            console.log(`📊 Found ${svgFiles.length} SVG files`);

            const icons = svgFiles.map(file => {
                const name = path.parse(file).name;
                const baseName = this.getBaseName(name);
                const variation = this.getVariation(name);

                return {
                    name: baseName,
                    fileName: file,
                    variation,
                    displayName: this.formatDisplayName(baseName),
                    category: this.categorizeIcon(baseName),
                    path: `lobe-icons/packages/static-svg/icons/${file}`,
                    tags: this.generateTags(baseName)
                };
            });

            // Group by base name and combine variations
            const groupedIcons = new Map();
            icons.forEach(icon => {
                if (!groupedIcons.has(icon.name)) {
                    groupedIcons.set(icon.name, {
                        ...icon,
                        variations: [icon.variation],
                        paths: { [icon.variation]: icon.path }
                    });
                } else {
                    const existing = groupedIcons.get(icon.name);
                    existing.variations.push(icon.variation);
                    existing.paths[icon.variation] = icon.path;
                }
            });

            const finalIcons = Array.from(groupedIcons.values());

            // Sort by popularity/category
            finalIcons.sort((a, b) => {
                const aPopular = this.isPopularIcon(a.name);
                const bPopular = this.isPopularIcon(b.name);

                if (aPopular && !bPopular) return -1;
                if (!aPopular && bPopular) return 1;

                return a.displayName.localeCompare(b.displayName);
            });

            console.log(`✅ Processed ${finalIcons.length} unique icons`);
            return finalIcons;

        } catch (error) {
            console.error('❌ Error scanning icons:', error);
            return [];
        }
    }

    /**
     * Get base name without variation suffix
     */
    getBaseName(fileName) {
        return fileName.replace(/-(?:color|text|brand|mono)$/, '');
    }

    /**
     * Get variation type
     */
    getVariation(fileName) {
        if (fileName.endsWith('-color')) return 'color';
        if (fileName.endsWith('-text')) return 'text';
        if (fileName.endsWith('-brand')) return 'brand';
        if (fileName.endsWith('-mono')) return 'mono';
        return 'default';
    }

    /**
     * Format display name for better readability
     */
    formatDisplayName(name) {
        const specialNames = {
            'openai': 'OpenAI',
            'chatgpt': 'ChatGPT',
            'github': 'GitHub',
            'gitlab': 'GitLab',
            'vscode': 'VS Code',
            'nodejs': 'Node.js',
            'nextjs': 'Next.js',
            'typescript': 'TypeScript',
            'javascript': 'JavaScript',
            'mongodb': 'MongoDB',
            'postgresql': 'PostgreSQL',
            'mysql': 'MySQL',
            'aws': 'AWS',
            'gcp': 'Google Cloud',
            'ui': 'UI',
            'api': 'API',
            'ai': 'AI',
            'ml': 'ML',
            'ar': 'AR',
            'vr': 'VR',
            'iot': 'IoT',
            'sdk': 'SDK'
        };

        if (specialNames[name.toLowerCase()]) {
            return specialNames[name.toLowerCase()];
        }

        // Handle camelCase and kebab-case
        return name
            .replace(/[-_]/g, ' ')
            .replace(/([A-Z])/g, ' $1')
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
            .join(' ')
            .trim();
    }

    /**
     * Categorize icon based on keywords
     */
    categorizeIcon(name) {
        const nameLower = name.toLowerCase();

        for (const [category, keywords] of Object.entries(this.categoryKeywords)) {
            if (keywords.some(keyword =>
                nameLower.includes(keyword.toLowerCase()) ||
                keyword.toLowerCase().includes(nameLower)
            )) {
                return category;
            }
        }

        return 'other';
    }

    /**
     * Generate search tags
     */
    generateTags(name) {
        const baseTags = [name];
        const category = this.categorizeIcon(name);

        // Add category tags
        baseTags.push(category);

        // Add common alternative names
        const alternatives = {
            'github': ['git', 'version control'],
            'docker': ['container', 'virtualization'],
            'kubernetes': ['k8s', 'orchestration'],
            'postgresql': ['postgres', 'sql'],
            'mongodb': ['mongo', 'nosql'],
            'javascript': ['js', 'node'],
            'typescript': ['ts'],
            'react': ['reactjs'],
            'vue': ['vuejs'],
            'angular': ['ng']
        };

        if (alternatives[name]) {
            baseTags.push(...alternatives[name]);
        }

        return baseTags;
    }

    /**
     * Check if icon is popular (for sorting priority)
     */
    isPopularIcon(name) {
        const popular = [
            'github', 'google', 'microsoft', 'apple', 'amazon', 'meta', 'netflix',
            'openai', 'claude', 'anthropic', 'gemini', 'chatgpt',
            'aws', 'azure', 'googlecloud', 'docker', 'kubernetes',
            'react', 'vue', 'angular', 'nodejs', 'python', 'javascript',
            'figma', 'adobe', 'vscode', 'chrome', 'firefox',
            'linkedin', 'twitter', 'instagram', 'youtube', 'tiktok',
            'mongodb', 'postgresql', 'redis', 'elasticsearch'
        ];

        return popular.includes(name.toLowerCase());
    }

    /**
     * Generate and save manifest file
     */
    async generateManifest(icons) {
        const manifest = {
            version: '2.0.0',
            generated: new Date().toISOString(),
            total: icons.length,
            categories: this.getCategoryStats(icons),
            icons: icons
        };

        fs.writeFileSync(this.manifestPath, JSON.stringify(manifest, null, 2));
        console.log(`💾 Manifest saved: ${this.manifestPath}`);
        console.log(`📊 Categories: ${Object.keys(manifest.categories).join(', ')}`);

        return manifest;
    }

    /**
     * Get category statistics
     */
    getCategoryStats(icons) {
        const stats = {};
        icons.forEach(icon => {
            stats[icon.category] = (stats[icon.category] || 0) + 1;
        });
        return stats;
    }

    /**
     * Start development server with CORS and Ollama proxy
     */
    startServer() {
        const server = http.createServer(async (req, res) => {
            // Enable CORS for all requests
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
            res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

            if (req.method === 'OPTIONS') {
                res.writeHead(200);
                res.end();
                return;
            }

            const parsedUrl = url.parse(req.url, true);
            const pathname = parsedUrl.pathname;

            try {
                // API Routes
                if (pathname === '/api/icons') {
                    await this.handleIconsAPI(req, res);
                } else if (pathname === '/api/ollama') {
                    await this.handleOllamaProxy(req, res);
                } else if (pathname === '/api/health') {
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({
                        status: 'ok',
                        timestamp: new Date().toISOString(),
                        ollama: await this.checkOllamaStatus()
                    }));
                } else {
                    // Serve static files
                    await this.serveStaticFile(req, res, pathname);
                }
            } catch (error) {
                console.error('Server error:', error);
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Internal server error' }));
            }
        });

        server.listen(this.port, () => {
            console.log(`🚀 Composeon server running at http://localhost:${this.port}`);
            console.log(`📡 Icons API: http://localhost:${this.port}/api/icons`);
            console.log(`🧠 Ollama proxy: http://localhost:${this.port}/api/ollama`);
            console.log(`❤️  Health check: http://localhost:${this.port}/api/health`);
        });

        return server;
    }

    /**
     * Handle icons API endpoint
     */
    async handleIconsAPI(req, res) {
        try {
            const manifest = JSON.parse(fs.readFileSync(this.manifestPath, 'utf8'));
            const parsedUrl = url.parse(req.url, true);
            const query = parsedUrl.query;

            let icons = manifest.icons;

            // Apply filters
            if (query.category && query.category !== 'all') {
                icons = icons.filter(icon => icon.category === query.category);
            }

            if (query.search) {
                const searchTerm = query.search.toLowerCase();
                icons = icons.filter(icon =>
                    icon.name.toLowerCase().includes(searchTerm) ||
                    icon.displayName.toLowerCase().includes(searchTerm) ||
                    icon.tags.some(tag => tag.toLowerCase().includes(searchTerm))
                );
            }

            // Pagination
            const page = parseInt(query.page) || 0;
            const limit = parseInt(query.limit) || 24;
            const startIndex = page * limit;
            const endIndex = startIndex + limit;

            const result = {
                total: icons.length,
                page,
                limit,
                hasMore: endIndex < icons.length,
                icons: icons.slice(startIndex, endIndex),
                categories: manifest.categories
            };

            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(result));
        } catch (error) {
            console.error('Icons API error:', error);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Failed to load icons' }));
        }
    }

    /**
     * Handle Ollama proxy to avoid CORS issues
     */
    async handleOllamaProxy(req, res) {
        if (req.method !== 'POST') {
            res.writeHead(405, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Method not allowed' }));
            return;
        }

        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });

        req.on('end', async () => {
            try {
                const requestData = JSON.parse(body);

                const response = await fetch(`${this.ollamaUrl}/api/generate`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(requestData)
                });

                if (!response.ok) {
                    throw new Error(`Ollama request failed: ${response.status}`);
                }

                const data = await response.json();
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(data));
            } catch (error) {
                console.error('Ollama proxy error:', error);
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({
                    error: 'Ollama connection failed',
                    details: error.message
                }));
            }
        });
    }

    /**
     * Check Ollama status
     */
    async checkOllamaStatus() {
        try {
            const response = await fetch(`${this.ollamaUrl}/api/tags`, {
                method: 'GET',
                signal: AbortSignal.timeout(3000)
            });
            return response.ok;
        } catch (error) {
            return false;
        }
    }

    /**
     * Serve static files
     */
    async serveStaticFile(req, res, pathname) {
        let filePath;

        if (pathname === '/' || pathname === '/index.html') {
            filePath = path.join(__dirname, 'index.html');
        } else if (pathname === '/icons-manifest.json') {
            filePath = this.manifestPath;
        } else if (pathname.startsWith('/lobe-icons/')) {
            filePath = path.join(__dirname, pathname);
        } else {
            filePath = path.join(__dirname, pathname);
        }

        try {
            if (!fs.existsSync(filePath)) {
                res.writeHead(404, { 'Content-Type': 'text/plain' });
                res.end('Not Found');
                return;
            }

            const ext = path.extname(filePath);
            const contentTypes = {
                '.html': 'text/html',
                '.js': 'application/javascript',
                '.css': 'text/css',
                '.json': 'application/json',
                '.svg': 'image/svg+xml',
                '.png': 'image/png',
                '.jpg': 'image/jpeg',
                '.jpeg': 'image/jpeg'
            };

            const contentType = contentTypes[ext] || 'application/octet-stream';
            const content = fs.readFileSync(filePath);

            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content);
        } catch (error) {
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            res.end('Server Error');
        }
    }

    /**
     * Initialize and run the scanner
     */
    async run() {
        console.log('🎯 Starting Composeon Icon Scanner...\n');

        const icons = await this.scanIcons();
        if (icons.length === 0) {
            console.log('❌ No icons found. Please check your lobe-icons installation.');
            return;
        }

        await this.generateManifest(icons);

        console.log('\n🎉 Icon scanning complete!');
        console.log(`📈 Total: ${icons.length} icons`);
        console.log(`🏷️  Categories: ${Object.keys(this.getCategoryStats(icons)).length}`);

        console.log('\n🚀 Starting development server...\n');
        this.startServer();
    }
}

// Run if called directly
if (require.main === module) {
    const scanner = new ComposeonIconScanner();
    scanner.run().catch(console.error);
}

module.exports = ComposeonIconScanner;
