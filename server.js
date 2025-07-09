// server.js - Complete Beauty AI Backend with Claude Integration
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Security and middleware
app.use(helmet());
app.use(cors({
    origin: ['http://localhost:8081', 'exp://192.168.*', 'https://your-frontend-domain.com'],
    credentials: true
}));
app.use(express.json({ limit: '10mb' }));

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter);

// Your comprehensive backup products database
const BEAUTY_PRODUCTS = [
    // Anti-aging products
    { id: 1, name: 'Retinol Anti-Aging Serum', brand: 'CeraVe', price: '$29.99', country: 'USA', category: 'skincare', subCategory: 'Serum', description: 'Powerful retinol formula that reduces fine lines and wrinkles while improving skin texture and tone.', rating: 4.3, reviews: 1247, trending: false, ingredients: ['Retinol', 'Hyaluronic Acid', 'Ceramides'], skinType: ['Normal', 'Mature'], keywords: 'anti-aging retinol wrinkles fine lines' },
    
    { id: 2, name: 'Vitamin C Brightening Serum', brand: 'The Ordinary', price: '$7.90', country: 'Canada', category: 'skincare', subCategory: 'Serum', description: 'Antioxidant-rich vitamin C serum that brightens skin and protects against environmental damage.', rating: 4.1, reviews: 892, trending: false, ingredients: ['Vitamin C', 'Hyaluronic Acid'], skinType: ['All'], keywords: 'vitamin c brightening antioxidant glow' },
    
    { id: 3, name: 'Snail Mucin Essence', brand: 'COSRX', price: '$25.00', country: 'South Korea', category: 'skincare', subCategory: 'Essence', description: 'Korean beauty innovation with 96% snail secretion filtrate for hydration and healing.', rating: 4.5, reviews: 2156, trending: true, ingredients: ['Snail Secretion Filtrate'], skinType: ['Sensitive', 'Dry'], keywords: 'korean k-beauty snail hydrating healing' },
    
    { id: 4, name: 'Glass Skin Serum', brand: 'Beauty of Joseon', price: '$17.00', country: 'South Korea', category: 'skincare', subCategory: 'Serum', description: 'Traditional Korean hanbang ingredients for achieving the viral glass skin effect.', rating: 4.6, reviews: 1834, trending: true, ingredients: ['Niacinamide', 'Rice Water', 'Alpha Arbutin'], skinType: ['All'], keywords: 'glass skin korean viral glow dewy' },
    
    { id: 5, name: 'Hyaluronic Acid Serum', brand: 'The Ordinary', price: '$9.90', country: 'Canada', category: 'skincare', subCategory: 'Serum', description: 'Deep hydration with concentrated hyaluronic acid for plumping and moisture.', rating: 4.2, reviews: 1876, trending: false, ingredients: ['Hyaluronic Acid', 'Vitamin B5'], skinType: ['Dry', 'Dehydrated'], keywords: 'hydration moisture plumping dry skin' },
    
    // Makeup products
    { id: 6, name: 'Rare Beauty Liquid Blush', brand: 'Rare Beauty', price: '$20.00', country: 'USA', category: 'makeup', subCategory: 'Blush', description: 'Viral TikTok liquid blush for natural-looking flush. Selena Gomez brand.', rating: 4.7, reviews: 2341, trending: true, shades: ['Joy', 'Hope', 'Bliss', 'Grace'], keywords: 'liquid blush viral tiktok selena gomez rare beauty' },
    
    { id: 7, name: 'Fenty Beauty Foundation', brand: 'Fenty Beauty', price: '$36.00', country: 'USA', category: 'makeup', subCategory: 'Foundation', description: 'Inclusive foundation with 50 shades for all skin tones. Rihanna brand.', rating: 4.5, reviews: 3456, trending: false, shades: ['50 shades available'], keywords: 'foundation inclusive fenty rihanna 50 shades diversity' },
    
    { id: 8, name: 'Charlotte Tilbury Flawless Filter', brand: 'Charlotte Tilbury', price: '$44.00', country: 'UK', category: 'makeup', subCategory: 'Primer', description: 'Viral complexion booster and makeup primer for flawless filter effect.', rating: 4.4, reviews: 1987, trending: true, shades: ['Light', 'Medium', 'Dark'], keywords: 'flawless filter viral primer glow charlotte tilbury' },
    
    // Hair care products
    { id: 9, name: 'Olaplex Hair Perfector', brand: 'Olaplex', price: '$28.00', country: 'USA', category: 'haircare', subCategory: 'Treatment', description: 'Bond-building treatment for damaged and chemically treated hair.', rating: 4.4, reviews: 1654, trending: false, hairType: ['Damaged', 'Chemically Treated'], keywords: 'olaplex bond building damaged hair treatment' },
    
    { id: 10, name: 'Moroccan Oil Treatment', brand: 'Moroccanoil', price: '$34.00', country: 'Israel', category: 'haircare', subCategory: 'Oil', description: 'Argan oil treatment for all hair types to add shine and reduce frizz.', rating: 4.3, reviews: 2103, trending: false, hairType: ['All'], keywords: 'moroccan oil argan hair treatment shine frizz' },
    
    // Nail care
    { id: 11, name: 'OPI Nail Lacquer', brand: 'OPI', price: '$10.50', country: 'USA', category: 'nails', subCategory: 'Polish', description: 'Long-lasting nail polish in classic and trending shades.', rating: 4.2, reviews: 987, trending: false, colors: ['Red', 'Pink', 'Nude', 'Black'], keywords: 'opi nail polish lacquer long lasting' },
    
    { id: 12, name: 'Sally Hansen Cuticle Oil', brand: 'Sally Hansen', price: '$3.99', country: 'USA', category: 'nails', subCategory: 'Cuticle Care', description: 'Nourishing cuticle oil with vitamin E for healthy nail growth.', rating: 4.0, reviews: 543, trending: false, keywords: 'cuticle oil vitamin e nail care healthy growth' },
    
    // Eye care
    { id: 13, name: 'Advanced Night Repair Eye Cream', brand: 'Estée Lauder', price: '$68.00', country: 'USA', category: 'skincare', subCategory: 'Eye Care', description: 'Targeted eye cream that reduces dark circles, puffiness, and fine lines.', rating: 4.2, reviews: 1234, trending: false, skinType: ['All'], keywords: 'eye cream dark circles puffiness anti-aging luxury' },
    
    { id: 14, name: 'Ginseng Eye Cream', brand: 'Beauty of Joseon', price: '$18.00', country: 'South Korea', category: 'skincare', subCategory: 'Eye Care', description: 'Traditional Korean ginseng eye cream that firms and brightens the eye area.', rating: 4.4, reviews: 543, trending: false, skinType: ['All'], keywords: 'korean ginseng eye cream firming brightening' },
    
    // Foot care
    { id: 15, name: 'Foot Repair Cream', brand: "O'Keeffe's", price: '$7.99', country: 'USA', category: 'footcare', subCategory: 'Moisturizer', description: 'Intensive foot cream for dry, cracked heels and rough skin.', rating: 4.5, reviews: 2176, trending: false, keywords: 'foot cream dry cracked heels repair intensive' },
    
    // Beauty tools
    { id: 16, name: 'Beauty Blender Original', brand: 'Beauty Blender', price: '$20.00', country: 'USA', category: 'tools', subCategory: 'Sponges', description: 'Iconic makeup sponge for flawless foundation application.', rating: 4.3, reviews: 3421, trending: false, keywords: 'beauty blender sponge makeup application foundation' },
    
    { id: 17, name: 'Jade Facial Roller', brand: 'Mount Lai', price: '$25.00', country: 'USA', category: 'tools', subCategory: 'Facial Tools', description: 'Authentic jade roller for facial massage and lymphatic drainage.', rating: 4.1, reviews: 876, trending: true, keywords: 'jade roller facial massage lymphatic drainage gua sha' },
    
    // Fragrance
    { id: 18, name: 'Vanilla Woods Perfume', brand: 'Glossier', price: '$60.00', country: 'USA', category: 'fragrance', subCategory: 'Perfume', description: 'Warm and cozy fragrance with vanilla, woods, and skin-like scent.', rating: 4.2, reviews: 654, trending: false, notes: ['Vanilla', 'Sandalwood', 'Musk'], keywords: 'glossier vanilla woods perfume cozy warm' },
    
    // Add more products to reach thousands...
    // You can add your existing product database here
];

// ===== API ROUTES =====

// Health check
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        timestamp: new Date().toISOString(),
        service: 'Beauty AI API',
        version: '1.0.0',
        features: ['Product Search', 'Claude AI Chat', 'Facial Analysis', 'Trends']
    });
});

// ===== CLAUDE AI CHAT INTEGRATION =====
app.post('/api/chat/claude', async (req, res) => {
    try {
        const { message, context = 'beauty consultation' } = req.body;
        const claudeApiKey = process.env.CLAUDE_API_KEY;
        
        if (!claudeApiKey) {
            return res.status(400).json({ 
                success: false, 
                error: 'Claude API key not configured' 
            });
        }

        const response = await axios.post('https://api.anthropic.com/v1/messages', {
            model: 'claude-3-sonnet-20240229',
            max_tokens: 1500,
            messages: [{
                role: 'user',
                content: `You are an expert beauty consultant AI for a comprehensive beauty platform. You have access to thousands of global beauty products across all categories: skincare, makeup, hair care, nail care, foot care, fragrances, tools, and accessories.

Your expertise includes:
- Product recommendations for all skin types and concerns
- Makeup techniques and color matching
- Skincare routines and ingredient advice
- Hair care and styling tips
- Nail art and care recommendations
- Grooming advice for all genders
- Beauty trends and viral looks (TikTok, Instagram trends)
- Professional beauty tools and techniques
- Budget-friendly to luxury product options
- K-beauty, J-beauty, and global beauty trends

Context: ${context}

User question: ${message}

Provide helpful, detailed beauty advice. If recommending products, suggest searching for specific categories or ingredients. Be encouraging, inclusive, and professional. Include emoji where appropriate to make responses engaging.`
            }]
        }, {
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': claudeApiKey,
                'anthropic-version': '2023-06-01'
            }
        });

        res.json({
            success: true,
            response: response.data.content[0].text
        });

    } catch (error) {
        console.error('Claude API error:', error.response?.data || error.message);
        res.status(500).json({
            success: false,
            error: 'AI chat temporarily unavailable. Please try again.'
        });
    }
});

// ===== COMPREHENSIVE PRODUCT SEARCH =====
app.post('/api/products/search', async (req, res) => {
    try {
        const { 
            query = '', 
            category = 'all',
            subCategory = 'all',
            priceRange = 'all',
            skinType = 'all',
            trending = false,
            limit = 50,
            page = 1
        } = req.body;

        let products = [...BEAUTY_PRODUCTS];

        // Text search
        if (query) {
            const searchTerms = query.toLowerCase().split(' ');
            products = products.filter(product => {
                const searchableText = `${product.name} ${product.brand} ${product.description} ${product.keywords}`.toLowerCase();
                return searchTerms.some(term => searchableText.includes(term));
            });
        }

        // Category filter
        if (category !== 'all') {
            products = products.filter(product => product.category === category);
        }

        // Sub-category filter
        if (subCategory !== 'all') {
            products = products.filter(product => product.subCategory === subCategory);
        }

        // Price range filter
        if (priceRange !== 'all') {
            products = products.filter(product => {
                const price = parseFloat(product.price.replace(/[^0-9.]/g, ''));
                switch (priceRange) {
                    case 'budget': return price < 25;
                    case 'mid': return price >= 25 && price <= 75;
                    case 'luxury': return price > 75;
                    default: return true;
                }
            });
        }

        // Skin type filter
        if (skinType !== 'all' && category === 'skincare') {
            products = products.filter(product => 
                product.skinType && product.skinType.includes(skinType)
            );
        }

        // Trending filter
        if (trending) {
            products = products.filter(product => product.trending);
        }

        // Sort by relevance and rating
        products.sort((a, b) => {
            if (a.trending && !b.trending) return -1;
            if (!a.trending && b.trending) return 1;
            return (b.rating || 0) - (a.rating || 0);
        });

        // Pagination
        const startIndex = (page - 1) * limit;
        const paginatedProducts = products.slice(startIndex, startIndex + limit);

        res.json({
            success: true,
            products: paginatedProducts,
            total: products.length,
            page: page,
            totalPages: Math.ceil(products.length / limit),
            filters: {
                category,
                subCategory,
                priceRange,
                skinType,
                trending
            }
        });

    } catch (error) {
        console.error('Product search error:', error);
        res.status(500).json({
            success: false,
            error: 'Product search temporarily unavailable'
        });
    }
});

// ===== TRENDING PRODUCTS =====
app.get('/api/products/trending', (req, res) => {
    try {
        const trendingProducts = BEAUTY_PRODUCTS
            .filter(product => product.trending)
            .sort((a, b) => (b.rating || 0) - (a.rating || 0))
            .slice(0, 20);

        res.json({
            success: true,
            products: trendingProducts,
            timestamp: new Date().toISOString()
        });
        
    } catch (error) {
        console.error('Trending products error:', error);
        res.status(500).json({
            success: false,
            error: 'Unable to fetch trending products'
        });
    }
});

// ===== PRODUCT CATEGORIES =====
app.get('/api/products/categories', (req, res) => {
    try {
        const categories = {
            skincare: {
                name: 'Skincare',
                icon: '🧴',
                subCategories: ['Cleanser', 'Serum', 'Moisturizer', 'Treatment', 'Mask', 'Eye Care', 'Sunscreen']
            },
            makeup: {
                name: 'Makeup',
                icon: '💄',
                subCategories: ['Foundation', 'Concealer', 'Blush', 'Lipstick', 'Eyeshadow', 'Mascara', 'Primer']
            },
            haircare: {
                name: 'Hair Care',
                icon: '💇‍♀️',
                subCategories: ['Shampoo', 'Conditioner', 'Treatment', 'Styling', 'Oil']
            },
            nails: {
                name: 'Nail Care',
                icon: '💅',
                subCategories: ['Polish', 'Base Coat', 'Top Coat', 'Cuticle Care', 'Nail Art']
            },
            tools: {
                name: 'Beauty Tools',
                icon: '🔧',
                subCategories: ['Brushes', 'Sponges', 'Facial Tools', 'Hair Tools']
            },
            fragrance: {
                name: 'Fragrance',
                icon: '🌸',
                subCategories: ['Perfume', 'Body Spray', 'Candles']
            },
            footcare: {
                name: 'Foot Care',
                icon: '🦶',
                subCategories: ['Moisturizer', 'Treatment', 'Tools']
            }
        };

        res.json({
            success: true,
            categories: categories
        });
        
    } catch (error) {
        console.error('Categories error:', error);
        res.status(500).json({
            success: false,
            error: 'Unable to fetch categories'
        });
    }
});

// ===== FACIAL ANALYSIS =====
app.post('/api/facial-analysis', async (req, res) => {
    try {
        const { imageData, skinConcerns = [] } = req.body;
        
        // Simulate facial analysis processing
        // In production, integrate with facial analysis AI service
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        const mockAnalysis = {
            skinTone: 'Medium with warm undertones',
            skinType: 'Combination',
            concerns: ['Fine lines', 'Uneven texture'],
            recommendations: {
                foundation: 'Look for warm-toned foundations in medium shades',
                skincare: ['Retinol serum for fine lines', 'Niacinamide for texture', 'Hyaluronic acid for hydration'],
                makeup: ['Bronze eyeshadows', 'Coral blushes', 'Warm-toned lip colors'],
                routine: ['Gentle cleanser', 'Vitamin C serum (morning)', 'Retinol serum (evening)', 'Moisturizer with SPF']
            }
        };

        res.json({
            success: true,
            analysis: mockAnalysis,
            productSuggestions: [1, 2, 3, 6, 13] // Product IDs to recommend
        });
        
    } catch (error) {
        console.error('Facial analysis error:', error);
        res.status(500).json({
            success: false,
            error: 'Facial analysis temporarily unavailable'
        });
    }
});

// ===== BEAUTY TRENDS =====
app.get('/api/trends', (req, res) => {
    try {
        const trends = [
            {
                id: 1,
                title: 'Glass Skin Routine',
                description: 'Korean skincare trend for achieving translucent, poreless-looking skin',
                platform: 'TikTok',
                hashtag: '#glassskin',
                views: '2.3M',
                products: [3, 4], // Product IDs
                icon: '✨'
            },
            {
                id: 2,
                title: 'Dopamine Makeup',
                description: 'Bright, colorful makeup looks designed to boost mood',
                platform: 'Instagram',
                hashtag: '#dopaminemakeup',
                views: '890K',
                products: [6, 7],
                icon: '🌈'
            },
            {
                id: 3,
                title: 'Clean Girl Aesthetic',
                description: 'Minimalist beauty emphasizing natural skin and effortless style',
                platform: 'Pinterest',
                hashtag: '#cleangirl',
                views: '1.5M',
                products: [4, 6],
                icon: '🌿'
            },
            {
                id: 4,
                title: 'Viral Beauty Tools',
                description: 'Trending beauty tools and gadgets from social media',
                platform: 'TikTok',
                hashtag: '#beautytools',
                views: '3.1M',
                products: [16, 17],
                icon: '🔧'
            }
        ];

        res.json({
            success: true,
            trends: trends,
            timestamp: new Date().toISOString()
        });
        
    } catch (error) {
        console.error('Trends error:', error);
        res.status(500).json({
            success: false,
            error: 'Unable to fetch trends'
        });
    }
});

// ===== ERROR HANDLING =====
app.use((error, req, res, next) => {
    console.error('API Error:', error);
    res.status(500).json({
        success: false,
        error: 'Internal server error'
    });
});

// ===== START SERVER =====
app.listen(PORT, () => {
    console.log(`🚀 Beauty AI API Server running on port ${PORT}`);
    console.log(`📱 Health Check: http://localhost:${PORT}/api/health`);
    console.log(`🤖 Claude AI: ${process.env.CLAUDE_API_KEY ? 'Configured ✅' : 'Not configured ❌'}`);
    console.log(`🛍️ Products Database: ${BEAUTY_PRODUCTS.length} products loaded`);
});

module.exports = app;