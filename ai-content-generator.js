/**
 * AI-Powered Content Research & Carousel Generation System
 *
 * This system leverages LLM, RAG capabilities, and real-time web research
 * to create sophisticated, data-driven LinkedIn carousels with market insights,
 * company analysis, and professional commentary.
 */

class AIContentGenerator {
    constructor() {
        this.ollamaEndpoint = 'http://localhost:11434/api/generate';
        this.serperAPIKey = process.env.SERPER_API_KEY || null;
        this.openaiAPIKey = process.env.OPENAI_API_KEY || null;

        // Content templates for different carousel types
        this.carouselTemplates = {
            'market-analysis': {
                name: 'Market Analysis',
                description: 'Deep dive into market trends and company positioning',
                slides: ['intro', 'market-overview', 'key-players', 'trends', 'predictions', 'conclusion']
            },
            'tech-stack-review': {
                name: 'Tech Stack Review',
                description: 'Professional analysis of selected technologies',
                slides: ['cover', 'overview', 'strengths', 'use-cases', 'alternatives', 'recommendation']
            },
            'company-spotlight': {
                name: 'Company Spotlight',
                description: 'Comprehensive company analysis with latest updates',
                slides: ['intro', 'company-overview', 'recent-news', 'financials', 'innovation', 'outlook']
            },
            'industry-trends': {
                name: 'Industry Trends',
                description: 'Current trends and future predictions in tech',
                slides: ['trend-overview', 'driving-forces', 'impact-analysis', 'key-players', 'timeline', 'implications']
            }
        };

        // Research sources configuration
        this.researchSources = {
            news: ['techcrunch.com', 'venturebeat.com', 'theverge.com', 'arstechnica.com'],
            financial: ['bloomberg.com', 'reuters.com', 'wsj.com', 'ft.com'],
            developer: ['github.com', 'stackoverflow.com', 'dev.to', 'hackernews.ycombinator.com'],
            industry: ['gartner.com', 'forrester.com', 'mckinsey.com', 'pwc.com']
        };

        this.cache = new Map();
        this.rateLimiter = new Map();
    }

    /**
     * Generate comprehensive carousel content for selected companies/tools
     */
    async generateCarousel(selectedIcons, carouselType = 'tech-stack-review', customPrompt = null) {
        console.log(`🧠 Starting AI content generation for ${selectedIcons.length} companies`);

        try {
            // Step 1: Research each company/tool
            const researchData = await this.conductResearch(selectedIcons);

            // Step 2: Generate carousel structure
            const carouselStructure = await this.createCarouselStructure(researchData, carouselType);

            // Step 3: Generate content for each slide
            const slides = await this.generateSlideContent(carouselStructure, researchData, customPrompt);

            // Step 4: Create visual layouts
            const visualCarousel = await this.createVisualCarousel(slides);

            return {
                metadata: {
                    type: carouselType,
                    companiesAnalyzed: selectedIcons.length,
                    generatedAt: new Date().toISOString(),
                    researchSources: this.getUsedSources(researchData)
                },
                slides: slides,
                visualCarousel: visualCarousel,
                textSummary: this.generateTextSummary(slides)
            };

        } catch (error) {
            console.error('❌ Carousel generation failed:', error);
            throw new Error(`Failed to generate carousel: ${error.message}`);
        }
    }

    /**
     * Conduct comprehensive research on selected companies/tools
     */
    async conductResearch(selectedIcons) {
        console.log('🔍 Conducting research phase...');

        const researchPromises = selectedIcons.map(async (icon) => {
            const cacheKey = `research_${icon.name}_${Date.now() - (Date.now() % 3600000)}`; // 1-hour cache

            if (this.cache.has(cacheKey)) {
                return this.cache.get(cacheKey);
            }

            const research = await this.researchCompany(icon);
            this.cache.set(cacheKey, research);
            return research;
        });

        const researchResults = await Promise.all(researchPromises);
        console.log('✅ Research phase completed');

        return researchResults;
    }

    /**
     * Research individual company/tool with multiple data sources
     */
    async researchCompany(icon) {
        const companyName = icon.displayName || icon.name;

        try {
            console.log(`🔬 Researching ${companyName}...`);

            // Parallel research across multiple dimensions
            const [
                latestNews,
                marketData,
                technicalInfo,
                competitorAnalysis,
                recentDevelopments
            ] = await Promise.allSettled([
                this.fetchLatestNews(companyName),
                this.fetchMarketData(companyName),
                this.fetchTechnicalInformation(companyName, icon.category),
                this.analyzeCompetitors(companyName, icon.category),
                this.fetchRecentDevelopments(companyName)
            ]);

            return {
                company: {
                    name: companyName,
                    category: icon.category,
                    icon: icon
                },
                research: {
                    latestNews: this.extractValue(latestNews),
                    marketData: this.extractValue(marketData),
                    technicalInfo: this.extractValue(technicalInfo),
                    competitors: this.extractValue(competitorAnalysis),
                    recentDevelopments: this.extractValue(recentDevelopments)
                },
                researchedAt: new Date().toISOString()
            };

        } catch (error) {
            console.warn(`⚠️ Research failed for ${companyName}:`, error.message);
            return this.createFallbackResearch(icon);
        }
    }

    /**
     * Fetch latest news about a company using web search
     */
    async fetchLatestNews(companyName) {
        const query = `"${companyName}" news 2024 latest updates`;

        try {
            // Use Serper API for web search if available
            if (this.serperAPIKey) {
                return await this.searchWithSerper(query, 'news');
            }

            // Fallback to LLM knowledge
            return await this.queryLLMForNews(companyName);

        } catch (error) {
            console.warn(`News search failed for ${companyName}:`, error.message);
            return { news: [], error: error.message };
        }
    }

    /**
     * Search using Serper API (Google Search)
     */
    async searchWithSerper(query, type = 'search') {
        if (!this.serperAPIKey) {
            throw new Error('Serper API key not configured');
        }

        const response = await fetch('https://google.serper.dev/search', {
            method: 'POST',
            headers: {
                'X-API-KEY': this.serperAPIKey,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                q: query,
                num: 5,
                type: type
            })
        });

        if (!response.ok) {
            throw new Error(`Serper API failed: ${response.status}`);
        }

        return await response.json();
    }

    /**
     * Query LLM for company information
     */
    async queryLLMForNews(companyName) {
        const prompt = `Provide a comprehensive analysis of ${companyName} including:

1. Latest developments and news (2024)
2. Market position and competitive landscape
3. Key products/services and innovations
4. Financial performance and business model
5. Future outlook and growth prospects

Focus on factual, business-relevant information suitable for professional LinkedIn content.
Format as structured JSON with clear categories.`;

        try {
            const response = await fetch('http://localhost:3000/api/ollama', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    model: 'llama3.2',
                    prompt: prompt,
                    stream: false
                })
            });

            if (!response.ok) {
                throw new Error('LLM query failed');
            }

            const data = await response.json();
            return this.parseLLMResponse(data.response);

        } catch (error) {
            console.warn(`LLM query failed for ${companyName}:`, error.message);
            return { analysis: 'Research unavailable', error: error.message };
        }
    }

    /**
     * Fetch market data and financial information
     */
    async fetchMarketData(companyName) {
        // This would integrate with financial APIs like Alpha Vantage, Yahoo Finance, etc.
        // For now, we'll use LLM to provide market insights

        const prompt = `Provide market analysis for ${companyName}:

1. Market capitalization and valuation (if public)
2. Recent funding rounds (if private)
3. Market share in their sector
4. Key financial metrics and performance
5. Stock performance and analyst ratings (if applicable)

Return structured data suitable for business analysis.`;

        return await this.queryLLMWithStructuredPrompt(prompt, companyName, 'market');
    }

    /**
     * Fetch technical information about the tool/platform
     */
    async fetchTechnicalInformation(companyName, category) {
        const prompt = `Provide technical analysis of ${companyName} as a ${category} tool:

1. Core technology stack and architecture
2. Key features and capabilities
3. Integration possibilities and APIs
4. Scalability and performance characteristics
5. Developer experience and documentation quality
6. Pricing model and value proposition

Focus on technical details relevant for developers and IT decision makers.`;

        return await this.queryLLMWithStructuredPrompt(prompt, companyName, 'technical');
    }

    /**
     * Analyze competitors in the same space
     */
    async analyzeCompetitors(companyName, category) {
        const prompt = `Analyze ${companyName}'s competitive landscape in the ${category} space:

1. Direct competitors and alternatives
2. Competitive advantages and differentiators
3. Market positioning and strategy
4. Strengths and weaknesses comparison
5. Market share and growth trends
6. Emerging threats and opportunities

Provide objective analysis suitable for business decision making.`;

        return await this.queryLLMWithStructuredPrompt(prompt, companyName, 'competitive');
    }

    /**
     * Fetch recent developments and announcements
     */
    async fetchRecentDevelopments(companyName) {
        const prompt = `What are the most significant recent developments for ${companyName} in 2024?

Include:
1. Product launches and updates
2. Strategic partnerships and acquisitions
3. Leadership changes
4. Funding or investment news
5. Technology breakthroughs
6. Market expansion or new initiatives

Focus on developments that would impact users, investors, or the broader market.`;

        return await this.queryLLMWithStructuredPrompt(prompt, companyName, 'developments');
    }

    /**
     * Query LLM with structured prompt and response parsing
     */
    async queryLLMWithStructuredPrompt(prompt, companyName, analysisType) {
        try {
            const response = await fetch('http://localhost:3000/api/ollama', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    model: 'llama3.2',
                    prompt: prompt,
                    stream: false,
                    options: {
                        temperature: 0.3, // Lower temperature for more factual responses
                        top_p: 0.9
                    }
                })
            });

            if (!response.ok) {
                throw new Error(`LLM request failed: ${response.status}`);
            }

            const data = await response.json();
            return {
                type: analysisType,
                company: companyName,
                analysis: data.response,
                generatedAt: new Date().toISOString()
            };

        } catch (error) {
            return {
                type: analysisType,
                company: companyName,
                error: error.message,
                fallback: `Analysis unavailable for ${companyName}`
            };
        }
    }

    /**
     * Create carousel structure based on template and research data
     */
    async createCarouselStructure(researchData, carouselType) {
        const template = this.carouselTemplates[carouselType];
        if (!template) {
            throw new Error(`Unknown carousel type: ${carouselType}`);
        }

        const companies = researchData.map(r => r.company.name).join(', ');

        const structurePrompt = `Create a professional LinkedIn carousel structure for a ${template.name} about: ${companies}

Template slides: ${template.slides.join(' -> ')}

Requirements:
1. Each slide should have a clear purpose and key message
2. Content should be business-focused and professional
3. Include data-driven insights where possible
4. Maintain narrative flow between slides
5. End with actionable insights or recommendations

Return a detailed outline for each slide with:
- Title
- Key points to cover
- Data/metrics to highlight
- Visual elements needed

Make it suitable for C-level executives and technical decision makers.`;

        const response = await this.queryLLMWithStructuredPrompt(structurePrompt, companies, 'structure');

        return {
            template: template,
            structure: response,
            slideCount: template.slides.length,
            targetAudience: 'Technical leaders and decision makers'
        };
    }

    /**
     * Generate detailed content for each carousel slide
     */
    async generateSlideContent(carouselStructure, researchData, customPrompt) {
        console.log('📝 Generating slide content...');

        const slides = [];
        const template = carouselStructure.template;

        for (let i = 0; i < template.slides.length; i++) {
            const slideType = template.slides[i];

            const slideContent = await this.generateIndividualSlide(
                slideType,
                i,
                researchData,
                carouselStructure.structure,
                customPrompt
            );

            slides.push(slideContent);
        }

        console.log(`✅ Generated ${slides.length} slides`);
        return slides;
    }

    /**
     * Generate content for individual slide
     */
    async generateIndividualSlide(slideType, slideIndex, researchData, structure, customPrompt) {
        const relevantResearch = this.extractRelevantResearch(researchData, slideType);

        const slidePrompt = `Generate professional LinkedIn carousel slide content:

Slide ${slideIndex + 1}: ${slideType}
Context: ${structure.analysis}
Research Data: ${JSON.stringify(relevantResearch, null, 2)}
Custom Requirements: ${customPrompt || 'Standard professional format'}

Create:
1. Compelling headline (under 60 characters)
2. 3-5 key bullet points with supporting data
3. One impactful statistic or insight
4. Clear visual description for designers
5. Call-to-action or thought-provoking question

Tone: Professional, data-driven, thought leadership
Format: Ready for LinkedIn business audience`;

        const response = await this.queryLLMWithStructuredPrompt(slidePrompt, slideType, 'slide-content');

        return {
            slideNumber: slideIndex + 1,
            type: slideType,
            content: response,
            relevantData: relevantResearch,
            visualElements: this.determineVisualElements(slideType, relevantResearch)
        };
    }

    /**
     * Create visual carousel with professional design
     */
    async createVisualCarousel(slides) {
        console.log('🎨 Creating visual carousel...');

        // This would integrate with a sophisticated design system
        // For now, we'll create a structured layout plan

        const visualDesign = {
            theme: 'professional-dark',
            dimensions: {
                width: 1080,
                height: 1350 // LinkedIn carousel standard
            },
            colorScheme: {
                primary: '#0077B5', // LinkedIn blue
                secondary: '#58a6ff',
                accent: '#00A0DC',
                background: '#1A1A1A',
                text: '#FFFFFF'
            },
            typography: {
                headline: 'Inter Bold 32px',
                body: 'Inter Regular 18px',
                accent: 'Inter Medium 16px'
            },
            slides: slides.map((slide, index) => ({
                slideNumber: index + 1,
                layout: this.determineSlideLayout(slide.type),
                content: slide.content,
                visualElements: slide.visualElements,
                dataVisualization: this.createDataVisualization(slide.relevantData)
            }))
        };

        return visualDesign;
    }

    /**
     * Generate comprehensive text summary
     */
    generateTextSummary(slides) {
        const summaryPrompt = `Create an executive summary from these carousel slides:

${slides.map((slide, i) => `Slide ${i + 1}: ${JSON.stringify(slide.content)}`).join('\n\n')}

Generate:
1. 2-3 sentence overview
2. Key insights and takeaways
3. Strategic recommendations
4. Market implications

Format as professional LinkedIn post with relevant hashtags.`;

        return this.queryLLMWithStructuredPrompt(summaryPrompt, 'carousel-summary', 'summary');
    }

    /**
     * Utility functions
     */
    extractValue(promiseResult) {
        return promiseResult.status === 'fulfilled' ? promiseResult.value : { error: promiseResult.reason };
    }

    createFallbackResearch(icon) {
        return {
            company: { name: icon.displayName, category: icon.category, icon: icon },
            research: {
                latestNews: { news: [], note: 'Research unavailable' },
                marketData: { analysis: 'Data unavailable' },
                technicalInfo: { analysis: 'Technical details unavailable' },
                competitors: { analysis: 'Competitive analysis unavailable' },
                recentDevelopments: { analysis: 'Recent developments unavailable' }
            },
            researchedAt: new Date().toISOString(),
            status: 'fallback'
        };
    }

    parseLLMResponse(response) {
        try {
            // Try to extract JSON if present
            const jsonMatch = response.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                return JSON.parse(jsonMatch[0]);
            }
            return { analysis: response };
        } catch {
            return { analysis: response };
        }
    }

    extractRelevantResearch(researchData, slideType) {
        // Filter research data based on slide type
        return researchData.map(research => ({
            company: research.company.name,
            relevantData: this.filterResearchBySlideType(research.research, slideType)
        }));
    }

    filterResearchBySlideType(research, slideType) {
        const relevanceMap = {
            'intro': ['latestNews', 'recentDevelopments'],
            'market-overview': ['marketData', 'competitors'],
            'company-overview': ['technicalInfo', 'marketData'],
            'recent-news': ['latestNews', 'recentDevelopments'],
            'trends': ['marketData', 'competitors'],
            'conclusion': ['marketData', 'recentDevelopments']
        };

        const relevantKeys = relevanceMap[slideType] || Object.keys(research);
        const filtered = {};

        relevantKeys.forEach(key => {
            if (research[key]) {
                filtered[key] = research[key];
            }
        });

        return filtered;
    }

    determineVisualElements(slideType, relevantResearch) {
        const visualMap = {
            'intro': ['company-logos', 'hero-graphic'],
            'market-overview': ['market-chart', 'growth-metrics'],
            'company-overview': ['infographic', 'key-stats'],
            'recent-news': ['news-timeline', 'update-badges'],
            'trends': ['trend-arrows', 'prediction-chart'],
            'conclusion': ['summary-grid', 'action-items']
        };

        return visualMap[slideType] || ['standard-layout'];
    }

    determineSlideLayout(slideType) {
        const layoutMap = {
            'intro': 'hero-centered',
            'market-overview': 'data-focused',
            'company-overview': 'info-grid',
            'recent-news': 'timeline-vertical',
            'trends': 'chart-emphasis',
            'conclusion': 'summary-action'
        };

        return layoutMap[slideType] || 'standard';
    }

    createDataVisualization(relevantData) {
        // Placeholder for data visualization logic
        return {
            type: 'mixed',
            elements: ['charts', 'metrics', 'infographics'],
            data: relevantData
        };
    }

    getUsedSources(researchData) {
        // Extract sources used in research
        const sources = new Set();
        researchData.forEach(research => {
            Object.values(research.research).forEach(data => {
                if (data.sources) {
                    data.sources.forEach(source => sources.add(source));
                }
            });
        });
        return Array.from(sources);
    }

    /**
     * Export carousel for different platforms
     */
    async exportCarousel(carousel, format = 'linkedin') {
        const exportFormats = {
            'linkedin': this.exportForLinkedIn,
            'pdf': this.exportToPDF,
            'powerpoint': this.exportToPowerPoint,
            'json': this.exportToJSON
        };

        const exporter = exportFormats[format];
        if (!exporter) {
            throw new Error(`Unsupported export format: ${format}`);
        }

        return await exporter.call(this, carousel);
    }

    exportForLinkedIn(carousel) {
        return {
            format: 'linkedin-carousel',
            slides: carousel.slides,
            metadata: carousel.metadata,
            optimizedFor: 'LinkedIn algorithm',
            recommendations: {
                postingTime: 'Weekday mornings 8-10 AM',
                hashtags: this.generateHashtags(carousel),
                engagement: 'Ask thought-provoking questions in slide 1 and final slide'
            }
        };
    }

    generateHashtags(carousel) {
        const companies = carousel.metadata.companiesAnalyzed;
        const categories = [...new Set(carousel.slides.map(s => s.relevantData).flat().map(d => d.company))];

        return [
            '#TechLeadership',
            '#MarketAnalysis',
            '#Innovation',
            '#TechStack',
            '#DigitalTransformation',
            ...categories.slice(0, 3).map(c => `#${c.replace(/\s+/g, '')}`)
        ];
    }

    /**
     * Rate limiting and caching utilities
     */
    async withRateLimit(key, fn, limit = 10, window = 60000) {
        const now = Date.now();
        const windowStart = now - window;

        if (!this.rateLimiter.has(key)) {
            this.rateLimiter.set(key, []);
        }

        const requests = this.rateLimiter.get(key).filter(time => time > windowStart);

        if (requests.length >= limit) {
            const oldestRequest = Math.min(...requests);
            const waitTime = window - (now - oldestRequest);
            throw new Error(`Rate limit exceeded. Wait ${waitTime}ms`);
        }

        requests.push(now);
        this.rateLimiter.set(key, requests);

        return await fn();
    }
}

// Export for Node.js and browser environments
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AIContentGenerator;
}

if (typeof window !== 'undefined') {
    window.AIContentGenerator = AIContentGenerator;
}
