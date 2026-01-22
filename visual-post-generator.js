/**
 * Visual Post Generator for Composeon
 * Creates beautiful, shareable images for LinkedIn posts with selected icons
 */

class VisualPostGenerator {
    constructor() {
        this.canvas = null;
        this.ctx = null;
        this.canvasWidth = 1200;
        this.canvasHeight = 630; // LinkedIn recommended aspect ratio
        this.selectedIcons = [];
        this.template = 'modern';

        // Design system
        this.colors = {
            primary: '#58a6ff',
            secondary: '#a5a1ff',
            dark: '#0d1117',
            darker: '#161b22',
            light: '#f0f6fc',
            muted: '#7d8590',
            accent: '#3fb950'
        };

        this.fonts = {
            heading: 'Inter, -apple-system, sans-serif',
            body: 'Inter, -apple-system, sans-serif',
            mono: 'JetBrains Mono, monospace'
        };

        this.templates = {
            modern: this.modernTemplate,
            gradient: this.gradientTemplate,
            minimal: this.minimalTemplate,
            tech: this.techTemplate
        };
    }

    /**
     * Initialize the visual generator
     */
    async initialize() {
        this.createCanvas();
        await this.loadFonts();
        console.log('🎨 Visual Post Generator initialized');
    }

    /**
     * Create and setup canvas
     */
    createCanvas() {
        this.canvas = document.createElement('canvas');
        this.canvas.width = this.canvasWidth;
        this.canvas.height = this.canvasHeight;
        this.ctx = this.canvas.getContext('2d');

        // Enable high DPI rendering
        const dpr = window.devicePixelRatio || 1;
        this.canvas.style.width = this.canvasWidth + 'px';
        this.canvas.style.height = this.canvasHeight + 'px';
        this.canvas.width = this.canvasWidth * dpr;
        this.canvas.height = this.canvasHeight * dpr;
        this.ctx.scale(dpr, dpr);
    }

    /**
     * Load web fonts
     */
    async loadFonts() {
        try {
            await document.fonts.load('600 32px Inter');
            await document.fonts.load('500 24px Inter');
            await document.fonts.load('400 18px Inter');
            console.log('✅ Fonts loaded');
        } catch (error) {
            console.warn('⚠️ Font loading failed, using fallbacks');
        }
    }

    /**
     * Generate visual post with selected icons
     */
    async generateVisualPost(icons, template = 'modern', customText = null) {
        this.selectedIcons = icons;
        this.template = template;

        // Clear canvas
        this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);

        // Apply template
        if (this.templates[template]) {
            await this.templates[template].call(this, customText);
        } else {
            await this.modernTemplate(customText);
        }

        return this.canvas;
    }

    /**
     * Modern template - Clean, professional look
     */
    async modernTemplate(customText) {
        const ctx = this.ctx;

        // Background gradient
        const gradient = ctx.createLinearGradient(0, 0, this.canvasWidth, this.canvasHeight);
        gradient.addColorStop(0, this.colors.dark);
        gradient.addColorStop(1, this.colors.darker);
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, this.canvasWidth, this.canvasHeight);

        // Header section
        await this.drawHeader('🚀 My Tech Stack', 'Tools that power my daily workflow');

        // Icons grid
        await this.drawIconsGrid();

        // Footer branding
        this.drawFooter();

        // Decorative elements
        this.drawModernDecorations();
    }

    /**
     * Gradient template - Vibrant, eye-catching
     */
    async gradientTemplate(customText) {
        const ctx = this.ctx;

        // Background gradient
        const gradient = ctx.createLinearGradient(0, 0, this.canvasWidth, this.canvasHeight);
        gradient.addColorStop(0, '#667eea');
        gradient.addColorStop(0.5, '#764ba2');
        gradient.addColorStop(1, '#f093fb');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, this.canvasWidth, this.canvasHeight);

        // Semi-transparent overlay
        ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
        ctx.fillRect(0, 0, this.canvasWidth, this.canvasHeight);

        // Header
        await this.drawHeader('✨ Amazing Tools', 'Transforming how we work and create', 'white');

        // Icons with glow effect
        await this.drawIconsGrid(true);

        // Footer
        this.drawFooter('white');
    }

    /**
     * Minimal template - Clean, simple
     */
    async minimalTemplate(customText) {
        const ctx = this.ctx;

        // White background
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, this.canvasWidth, this.canvasHeight);

        // Header
        await this.drawHeader('Tech Tools I Use', 'Curated for productivity and innovation', this.colors.dark);

        // Icons grid
        await this.drawIconsGrid(false, true);

        // Footer
        this.drawFooter(this.colors.muted);

        // Minimal decorations
        this.drawMinimalDecorations();
    }

    /**
     * Tech template - Developer focused
     */
    async techTemplate(customText) {
        const ctx = this.ctx;

        // Dark tech background
        ctx.fillStyle = '#0a0a0f';
        ctx.fillRect(0, 0, this.canvasWidth, this.canvasHeight);

        // Grid pattern background
        this.drawGridPattern();

        // Header with code-style formatting
        await this.drawTechHeader();

        // Icons in terminal-style layout
        await this.drawTechIconsGrid();

        // Footer with ASCII art
        this.drawTechFooter();
    }

    /**
     * Draw header section
     */
    async drawHeader(title, subtitle, color = this.colors.light) {
        const ctx = this.ctx;

        // Title
        ctx.font = 'bold 48px ' + this.fonts.heading;
        ctx.fillStyle = color;
        ctx.textAlign = 'center';
        ctx.fillText(title, this.canvasWidth / 2, 120);

        // Subtitle
        ctx.font = '24px ' + this.fonts.body;
        ctx.fillStyle = color === 'white' ? 'rgba(255,255,255,0.8)' : this.colors.muted;
        ctx.fillText(subtitle, this.canvasWidth / 2, 160);
    }

    /**
     * Draw tech-style header
     */
    async drawTechHeader() {
        const ctx = this.ctx;

        // Terminal-style header
        ctx.font = '20px ' + this.fonts.mono;
        ctx.fillStyle = this.colors.primary;
        ctx.textAlign = 'left';
        ctx.fillText('$ cat my-tech-stack.json', 60, 80);

        // JSON-style title
        ctx.font = 'bold 36px ' + this.fonts.mono;
        ctx.fillStyle = this.colors.light;
        ctx.textAlign = 'center';
        ctx.fillText('{ "tools": [', this.canvasWidth / 2, 140);
    }

    /**
     * Draw icons grid
     */
    async drawIconsGrid(glowEffect = false, shadows = false) {
        if (this.selectedIcons.length === 0) return;

        const iconSize = 80;
        const spacing = 120;
        const maxCols = 6;
        const startY = 220;

        // Calculate grid layout
        const cols = Math.min(this.selectedIcons.length, maxCols);
        const rows = Math.ceil(this.selectedIcons.length / maxCols);
        const gridWidth = (cols - 1) * spacing;
        const startX = (this.canvasWidth - gridWidth) / 2;

        for (let i = 0; i < this.selectedIcons.length; i++) {
            const col = i % maxCols;
            const row = Math.floor(i / maxCols);
            const x = startX + col * spacing;
            const y = startY + row * spacing;

            await this.drawIcon(this.selectedIcons[i], x, y, iconSize, glowEffect, shadows);
            this.drawIconLabel(this.selectedIcons[i], x, y + iconSize + 20);
        }
    }

    /**
     * Draw tech-style icons grid
     */
    async drawTechIconsGrid() {
        if (this.selectedIcons.length === 0) return;

        const iconSize = 60;
        const startX = 180;
        const startY = 200;
        const lineHeight = 100;

        for (let i = 0; i < this.selectedIcons.length; i++) {
            const y = startY + i * lineHeight;

            // JSON-style formatting
            this.ctx.font = '18px ' + this.fonts.mono;
            this.ctx.fillStyle = this.colors.muted;
            this.ctx.textAlign = 'left';
            this.ctx.fillText('  {', startX - 40, y - 20);

            // Icon
            await this.drawIcon(this.selectedIcons[i], startX, y, iconSize);

            // Icon name in JSON format
            this.ctx.fillStyle = this.colors.primary;
            this.ctx.fillText(`"name": "${this.selectedIcons[i].displayName}",`, startX + 80, y + 10);
            this.ctx.fillStyle = this.colors.accent;
            this.ctx.fillText(`"category": "${this.selectedIcons[i].category}"`, startX + 80, y + 35);

            this.ctx.fillStyle = this.colors.muted;
            this.ctx.fillText(i < this.selectedIcons.length - 1 ? '  },' : '  }', startX - 40, y + 60);
        }

        // Closing bracket
        this.ctx.font = 'bold 36px ' + this.fonts.mono;
        this.ctx.fillStyle = this.colors.light;
        this.ctx.textAlign = 'center';
        const finalY = startY + this.selectedIcons.length * lineHeight + 40;
        this.ctx.fillText('] }', this.canvasWidth / 2, finalY);
    }

    /**
     * Draw individual icon
     */
    async drawIcon(icon, x, y, size, glowEffect = false, shadow = false) {
        const ctx = this.ctx;

        try {
            // Create image element
            const img = new Image();
            img.crossOrigin = 'anonymous';

            // Return promise that resolves when image loads
            await new Promise((resolve, reject) => {
                img.onload = () => {
                    // Add shadow if requested
                    if (shadow) {
                        ctx.shadowColor = 'rgba(0,0,0,0.2)';
                        ctx.shadowBlur = 10;
                        ctx.shadowOffsetX = 0;
                        ctx.shadowOffsetY = 5;
                    }

                    // Add glow effect if requested
                    if (glowEffect) {
                        ctx.shadowColor = this.colors.primary;
                        ctx.shadowBlur = 20;
                        ctx.shadowOffsetX = 0;
                        ctx.shadowOffsetY = 0;
                    }

                    // Draw icon
                    ctx.drawImage(img, x - size/2, y - size/2, size, size);

                    // Reset shadow
                    ctx.shadowColor = 'transparent';
                    ctx.shadowBlur = 0;
                    ctx.shadowOffsetX = 0;
                    ctx.shadowOffsetY = 0;

                    resolve();
                };

                img.onerror = () => {
                    // Fallback: draw colored circle with first letter
                    this.drawIconFallback(icon, x, y, size);
                    resolve();
                };

                // Set image source
                const iconPath = icon.path || `http://localhost:3000/lobe-icons/packages/static-svg/icons/${icon.name}.svg`;
                img.src = iconPath;
            });

        } catch (error) {
            // Fallback for any errors
            this.drawIconFallback(icon, x, y, size);
        }
    }

    /**
     * Draw fallback icon (colored circle with letter)
     */
    drawIconFallback(icon, x, y, size) {
        const ctx = this.ctx;

        // Background circle
        ctx.fillStyle = this.colors.primary;
        ctx.beginPath();
        ctx.arc(x, y, size/2, 0, 2 * Math.PI);
        ctx.fill();

        // First letter
        ctx.font = `bold ${size/2}px ${this.fonts.heading}`;
        ctx.fillStyle = 'white';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(icon.displayName.charAt(0).toUpperCase(), x, y);
    }

    /**
     * Draw icon label
     */
    drawIconLabel(icon, x, y) {
        const ctx = this.ctx;

        ctx.font = '16px ' + this.fonts.body;
        ctx.fillStyle = this.colors.light;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';
        ctx.fillText(icon.displayName, x, y);
    }

    /**
     * Draw footer
     */
    drawFooter(color = this.colors.muted) {
        const ctx = this.ctx;

        // Divider line
        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(100, this.canvasHeight - 80);
        ctx.lineTo(this.canvasWidth - 100, this.canvasHeight - 80);
        ctx.stroke();

        // Branding
        ctx.font = '18px ' + this.fonts.body;
        ctx.fillStyle = color;
        ctx.textAlign = 'center';
        ctx.fillText('Generated with Composeon AI', this.canvasWidth / 2, this.canvasHeight - 50);

        // URL
        ctx.font = '14px ' + this.fonts.body;
        ctx.fillText('composeon.ai', this.canvasWidth / 2, this.canvasHeight - 25);
    }

    /**
     * Draw tech footer with ASCII art
     */
    drawTechFooter() {
        const ctx = this.ctx;

        ctx.font = '14px ' + this.fonts.mono;
        ctx.fillStyle = this.colors.muted;
        ctx.textAlign = 'center';
        ctx.fillText('# Generated with Composeon AI ⚡', this.canvasWidth / 2, this.canvasHeight - 40);
        ctx.fillText('# Discover more at composeon.ai', this.canvasWidth / 2, this.canvasHeight - 20);
    }

    /**
     * Draw modern decorative elements
     */
    drawModernDecorations() {
        const ctx = this.ctx;

        // Corner accent
        const gradient = ctx.createLinearGradient(0, 0, 200, 200);
        gradient.addColorStop(0, this.colors.primary + '40');
        gradient.addColorStop(1, 'transparent');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 200, 200);

        // Bottom right accent
        const gradient2 = ctx.createLinearGradient(this.canvasWidth - 200, this.canvasHeight - 200, this.canvasWidth, this.canvasHeight);
        gradient2.addColorStop(0, 'transparent');
        gradient2.addColorStop(1, this.colors.secondary + '40');
        ctx.fillStyle = gradient2;
        ctx.fillRect(this.canvasWidth - 200, this.canvasHeight - 200, 200, 200);
    }

    /**
     * Draw minimal decorative elements
     */
    drawMinimalDecorations() {
        const ctx = this.ctx;

        // Simple accent line
        ctx.strokeStyle = this.colors.primary;
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(this.canvasWidth / 2 - 100, 180);
        ctx.lineTo(this.canvasWidth / 2 + 100, 180);
        ctx.stroke();
    }

    /**
     * Draw grid pattern background
     */
    drawGridPattern() {
        const ctx = this.ctx;
        const gridSize = 40;

        ctx.strokeStyle = this.colors.primary + '20';
        ctx.lineWidth = 1;

        // Vertical lines
        for (let x = 0; x <= this.canvasWidth; x += gridSize) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, this.canvasHeight);
            ctx.stroke();
        }

        // Horizontal lines
        for (let y = 0; y <= this.canvasHeight; y += gridSize) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(this.canvasWidth, y);
            ctx.stroke();
        }
    }

    /**
     * Download the generated image
     */
    downloadImage(filename = 'composeon-post.png') {
        const link = document.createElement('a');
        link.download = filename;
        link.href = this.canvas.toDataURL();
        link.click();
    }

    /**
     * Get image as blob for sharing
     */
    getImageBlob() {
        return new Promise(resolve => {
            this.canvas.toBlob(resolve, 'image/png', 1.0);
        });
    }

    /**
     * Get available templates
     */
    getAvailableTemplates() {
        return [
            { id: 'modern', name: '🚀 Modern', description: 'Clean, professional look' },
            { id: 'gradient', name: '✨ Gradient', description: 'Vibrant, eye-catching' },
            { id: 'minimal', name: '⚪ Minimal', description: 'Simple and clean' },
            { id: 'tech', name: '💻 Tech', description: 'Developer focused' }
        ];
    }

    /**
     * Preview template without generating full image
     */
    async previewTemplate(templateId) {
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = 300;
        tempCanvas.height = 157;
        const tempCtx = tempCanvas.getContext('2d');

        // Draw template preview
        const originalCanvas = this.canvas;
        const originalCtx = this.ctx;
        const originalWidth = this.canvasWidth;
        const originalHeight = this.canvasHeight;

        this.canvas = tempCanvas;
        this.ctx = tempCtx;
        this.canvasWidth = 300;
        this.canvasHeight = 157;

        // Generate preview with sample data
        const sampleIcons = [
            { name: 'sample1', displayName: 'Tool 1', category: 'dev' },
            { name: 'sample2', displayName: 'Tool 2', category: 'ai' }
        ];

        await this.templates[templateId].call(this, 'Preview');

        // Restore original canvas
        this.canvas = originalCanvas;
        this.ctx = originalCtx;
        this.canvasWidth = originalWidth;
        this.canvasHeight = originalHeight;

        return tempCanvas.toDataURL();
    }
}

// Export for use in main application
if (typeof window !== 'undefined') {
    window.VisualPostGenerator = VisualPostGenerator;
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = VisualPostGenerator;
}
