/**
 * Icons Loader - Dynamically loads all Lobe Icons from the repository
 * Part of the Composeon project - Smart Icon Repository & LinkedIn Post Generator
 */

class IconsLoader {
    constructor() {
        this.icons = [];
        this.categories = {
            ai: ['openai', 'claude', 'anthropic', 'gemini', 'chatglm', 'deepseek', 'cohere', 'mistral', 'yi', 'baichuan', 'doubao', 'glm', 'qwen'],
            cloud: ['aws', 'azure', 'google', 'googlecloud', 'microsoft', 'alibaba', 'alibabacloud', 'baidu', 'baiducloud', 'tencent', 'huawei'],
            database: ['mongodb', 'postgresql', 'mysql', 'redis', 'elasticsearch', 'cassandra', 'neo4j', 'sqlite', 'oracle', 'supabase'],
            design: ['figma', 'adobe', 'sketch', 'canva', 'framer', 'principle', 'invision', 'webflow', 'dribbble', 'behance'],
            dev: ['github', 'gitlab', 'bitbucket', 'vscode', 'cursor', 'jetbrains', 'docker', 'kubernetes', 'jenkins', 'circleci', 'travis', 'vercel', 'netlify'],
            social: ['linkedin', 'twitter', 'facebook', 'instagram', 'youtube', 'tiktok', 'discord', 'slack', 'telegram', 'whatsapp'],
            analytics: ['google', 'adobe', 'mixpanel', 'amplitude', 'segment', 'hotjar', 'fullstory', 'logrocket'],
            ecommerce: ['shopify', 'woocommerce', 'magento', 'stripe', 'paypal', 'square', 'klarna'],
            productivity: ['notion', 'obsidian', 'todoist', 'trello', 'asana', 'monday', 'clickup', 'airtable'],
            communication: ['zoom', 'teams', 'meet', 'webex', 'discord', 'slack', 'telegram', 'skype']
        };
        this.iconPath = 'lobe-icons/packages/static-svg/icons/';
    }

    /**
     * Initialize the icons loader by scanning the repository
     */
    async initialize() {
        try {
            // First, try to load from a pre-generated icons list if available
            const response = await fetch('./icons-manifest.json').catch(() => null);
            if (response && response.ok) {
                const manifest = await response.json();
                this.icons = manifest.icons;
                return this.icons;
            }

            // If no manifest, generate the icons list dynamically
            await this.generateIconsList();
            return this.icons;
        } catch (error) {
            console.error('Failed to initialize icons:', error);
            // Fallback to hardcoded popular icons
            this.loadFallbackIcons();
            return this.icons;
        }
    }

    /**
     * Generate icons list by scanning the directory structure
     */
    async generateIconsList() {
        // This is a simulation of directory scanning
        // In a real implementation, you might need a server-side script or build process
        const knownIcons = [
            // AI & ML
            'openai', 'claude', 'anthropic', 'gemini', 'chatglm', 'deepseek', 'cohere', 'mistral',
            'yi', 'baichuan', 'doubao', 'glm', 'qwen', 'huggingface', 'replicate', 'runway',
            'midjourney', 'dalle', 'stabilitai', 'perplexity', 'character',

            // Cloud Providers
            'aws', 'azure', 'google', 'googlecloud', 'microsoft', 'alibaba', 'alibabacloud',
            'baidu', 'baiducloud', 'tencent', 'huawei', 'oracle', 'ibm', 'digitalocean',
            'linode', 'vultr', 'hetzner', 'cloudflare',

            // Databases
            'mongodb', 'postgresql', 'mysql', 'redis', 'elasticsearch', 'cassandra',
            'neo4j', 'sqlite', 'oracle', 'supabase', 'planetscale', 'cockroachdb',
            'snowflake', 'databricks', 'clickhouse',

            // Design Tools
            'figma', 'adobe', 'sketch', 'canva', 'framer', 'principle', 'invision',
            'webflow', 'dribbble', 'behance', 'miro', 'whimsical', 'lucidchart',

            // Development
            'github', 'gitlab', 'bitbucket', 'vscode', 'cursor', 'jetbrains', 'atom',
            'sublime', 'vim', 'docker', 'kubernetes', 'jenkins', 'circleci', 'travis',
            'vercel', 'netlify', 'heroku', 'railway', 'render',

            // Social & Communication
            'linkedin', 'twitter', 'facebook', 'instagram', 'youtube', 'tiktok',
            'discord', 'slack', 'telegram', 'whatsapp', 'zoom', 'teams', 'meet',
            'webex', 'skype',

            // Programming Languages & Frameworks
            'react', 'vue', 'angular', 'svelte', 'nextjs', 'nuxt', 'gatsby',
            'nodejs', 'python', 'javascript', 'typescript', 'java', 'csharp',
            'go', 'rust', 'php', 'ruby', 'swift', 'kotlin', 'dart', 'flutter',

            // Analytics & Marketing
            'analytics', 'mixpanel', 'amplitude', 'segment', 'hotjar', 'fullstory',
            'logrocket', 'sentry', 'datadog', 'newrelic',

            // E-commerce & Payments
            'shopify', 'woocommerce', 'magento', 'stripe', 'paypal', 'square',
            'klarna', 'razorpay', 'adyen',

            // Productivity
            'notion', 'obsidian', 'todoist', 'trello', 'asana', 'monday',
            'clickup', 'airtable', 'sheets', 'excel', 'word', 'powerpoint',

            // Browsers
            'chrome', 'firefox', 'safari', 'edge', 'opera', 'brave',

            // Operating Systems
            'windows', 'macos', 'linux', 'ubuntu', 'debian', 'centos', 'redhat',

            // Gaming & Entertainment
            'unity', 'unreal', 'steam', 'epic', 'twitch', 'spotify', 'netflix',

            // Security & VPN
            'nordvpn', 'expressvpn', '1password', 'bitwarden', 'lastpass',

            // Cryptocurrency
            'bitcoin', 'ethereum', 'binance', 'coinbase', 'metamask'
        ];

        // Generate icon objects with categories
        this.icons = knownIcons.map(name => this.createIconObject(name));

        // Remove duplicates
        this.icons = this.icons.filter((icon, index, self) =>
            index === self.findIndex(i => i.name === icon.name)
        );
    }

    /**
     * Create an icon object with metadata
     */
    createIconObject(name) {
        const category = this.getCategoryForIcon(name);
        const variations = this.getIconVariations(name);

        return {
            name: name,
            displayName: this.formatDisplayName(name),
            category: category,
            tags: this.generateTags(name, category),
            variations: variations,
            path: `${this.iconPath}${name}.svg`,
            paths: variations.reduce((acc, variation) => {
                acc[variation] = `${this.iconPath}${name}${variation === 'default' ? '' : '-' + variation}.svg`;
                return acc;
            }, {}),
            searchable: this.generateSearchableText(name, category)
        };
    }

    /**
     * Determine category for an icon based on its name
     */
    getCategoryForIcon(name) {
        for (const [category, keywords] of Object.entries(this.categories)) {
            if (keywords.some(keyword => name.toLowerCase().includes(keyword.toLowerCase()))) {
                return category;
            }
        }

        // Additional category detection logic
        if (name.match(/(ai|gpt|llm|neural|deep|machine)/i)) return 'ai';
        if (name.match(/(cloud|server|hosting|deploy)/i)) return 'cloud';
        if (name.match(/(db|data|sql|nosql|base)/i)) return 'database';
        if (name.match(/(design|ui|ux|proto|wireframe)/i)) return 'design';
        if (name.match(/(code|dev|git|ide|editor)/i)) return 'dev';
        if (name.match(/(social|chat|message|communicate)/i)) return 'social';
        if (name.match(/(analytics|track|measure|metrics)/i)) return 'analytics';
        if (name.match(/(shop|commerce|pay|store)/i)) return 'ecommerce';
        if (name.match(/(task|todo|project|organize)/i)) return 'productivity';

        return 'other';
    }

    /**
     * Get available variations for an icon (default, color, text, brand)
     */
    getIconVariations(name) {
        // Default variations that might exist
        const possibleVariations = ['default', 'color', 'text', 'brand'];

        // For now, assume all icons have default, and popular ones have color/text variations
        const popularIcons = ['openai', 'google', 'microsoft', 'aws', 'azure', 'github', 'figma'];

        if (popularIcons.includes(name)) {
            return ['default', 'color', 'text'];
        }

        return ['default'];
    }

    /**
     * Format display name for better readability
     */
    formatDisplayName(name) {
        // Handle special cases
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
            'csharp': 'C#',
            'cplusplus': 'C++',
            'postgresql': 'PostgreSQL',
            'mongodb': 'MongoDB',
            'mysql': 'MySQL',
            'redis': 'Redis',
            'aws': 'AWS',
            'gcp': 'Google Cloud',
            'azure': 'Microsoft Azure'
        };

        if (specialNames[name.toLowerCase()]) {
            return specialNames[name.toLowerCase()];
        }

        // Capitalize first letter and handle camelCase
        return name
            .replace(/([A-Z])/g, ' $1')
            .replace(/^./, str => str.toUpperCase())
            .trim();
    }

    /**
     * Generate search tags for an icon
     */
    generateTags(name, category) {
        const baseTags = [name, category];
        const additionalTags = [];

        // Add common alternative names and related terms
        const tagMap = {
            'openai': ['chatgpt', 'gpt', 'artificial intelligence', 'ai'],
            'github': ['git', 'version control', 'repository', 'code'],
            'figma': ['design', 'ui', 'ux', 'prototyping'],
            'aws': ['amazon', 'cloud', 'ec2', 's3'],
            'azure': ['microsoft', 'cloud', 'windows'],
            'google': ['search', 'gmail', 'drive', 'chrome'],
            'docker': ['container', 'virtualization', 'devops'],
            'kubernetes': ['k8s', 'orchestration', 'container'],
            'react': ['facebook', 'frontend', 'javascript', 'jsx'],
            'vue': ['vuejs', 'frontend', 'javascript'],
            'angular': ['typescript', 'frontend', 'spa']
        };

        if (tagMap[name]) {
            additionalTags.push(...tagMap[name]);
        }

        return [...new Set([...baseTags, ...additionalTags])];
    }

    /**
     * Generate searchable text for fuzzy matching
     */
    generateSearchableText(name, category) {
        const tags = this.generateTags(name, category);
        const displayName = this.formatDisplayName(name);

        return [name, displayName, category, ...tags]
            .join(' ')
            .toLowerCase();
    }

    /**
     * Load fallback icons if dynamic loading fails
     */
    loadFallbackIcons() {
        const fallbackIcons = [
            'openai', 'claude', 'github', 'figma', 'google', 'microsoft',
            'aws', 'azure', 'docker', 'kubernetes', 'react', 'vue',
            'angular', 'nodejs', 'python', 'javascript', 'typescript'
        ];

        this.icons = fallbackIcons.map(name => this.createIconObject(name));
    }

    /**
     * Search icons by query
     */
    search(query) {
        if (!query || query.trim() === '') {
            return this.icons;
        }

        const searchTerm = query.toLowerCase().trim();

        return this.icons.filter(icon =>
            icon.searchable.includes(searchTerm) ||
            this.fuzzyMatch(icon.name, searchTerm) ||
            this.fuzzyMatch(icon.displayName, searchTerm)
        );
    }

    /**
     * Simple fuzzy matching implementation
     */
    fuzzyMatch(text, pattern) {
        const textLower = text.toLowerCase();
        const patternLower = pattern.toLowerCase();

        let textIndex = 0;
        let patternIndex = 0;

        while (textIndex < textLower.length && patternIndex < patternLower.length) {
            if (textLower[textIndex] === patternLower[patternIndex]) {
                patternIndex++;
            }
            textIndex++;
        }

        return patternIndex === patternLower.length;
    }

    /**
     * Filter icons by category
     */
    filterByCategory(category) {
        if (category === 'all' || !category) {
            return this.icons;
        }

        return this.icons.filter(icon => icon.category === category);
    }

    /**
     * Get icons by names
     */
    getIconsByNames(names) {
        return this.icons.filter(icon => names.includes(icon.name));
    }

    /**
     * Get popular icons (most commonly used)
     */
    getPopularIcons(limit = 20) {
        const popularNames = [
            'openai', 'github', 'figma', 'google', 'microsoft', 'aws',
            'azure', 'docker', 'react', 'nodejs', 'python', 'javascript',
            'typescript', 'vue', 'angular', 'mongodb', 'postgresql', 'redis',
            'kubernetes', 'vscode'
        ];

        return this.getIconsByNames(popularNames).slice(0, limit);
    }

    /**
     * Get trending icons (recently popular)
     */
    getTrendingIcons(limit = 10) {
        const trendingNames = [
            'claude', 'cursor', 'perplexity', 'midjourney', 'runway',
            'vercel', 'supabase', 'planetscale', 'railway', 'render'
        ];

        return this.getIconsByNames(trendingNames).slice(0, limit);
    }

    /**
     * Get all categories
     */
    getCategories() {
        return Object.keys(this.categories);
    }

    /**
     * Get statistics
     */
    getStats() {
        const categoryStats = {};
        const categories = this.getCategories();

        categories.forEach(category => {
            categoryStats[category] = this.filterByCategory(category).length;
        });

        return {
            total: this.icons.length,
            categories: categoryStats,
            popular: this.getPopularIcons().length,
            trending: this.getTrendingIcons().length
        };
    }

    /**
     * Validate if an icon exists
     */
    iconExists(name) {
        return this.icons.some(icon => icon.name === name);
    }

    /**
     * Get icon by name
     */
    getIcon(name) {
        return this.icons.find(icon => icon.name === name);
    }

    /**
     * Get random icons
     */
    getRandomIcons(count = 5) {
        const shuffled = [...this.icons].sort(() => 0.5 - Math.random());
        return shuffled.slice(0, count);
    }

    /**
     * Export icons data for caching
     */
    exportManifest() {
        return {
            version: '1.0.0',
            generated: new Date().toISOString(),
            total: this.icons.length,
            icons: this.icons
        };
    }
}

// Export for different module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = IconsLoader;
} else if (typeof window !== 'undefined') {
    window.IconsLoader = IconsLoader;
}
