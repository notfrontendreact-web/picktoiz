import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import { PRODUCTS } from './src/data/products.js';

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini Client
const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.warn('GEMINI_API_KEY environment variable is not defined.');
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
};

// --- API ROUTES ---

// Healthcheck
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', store: 'Picco Toys API', totalProducts: PRODUCTS.length });
});

// Products List Endpoint
app.get('/api/products', (req, res) => {
  let result = [...PRODUCTS];

  const search = req.query.search as string;
  const category = req.query.category as string;
  const ageGroup = req.query.ageGroup as string;
  const sortBy = req.query.sortBy as string;
  const onlyInStock = req.query.onlyInStock === 'true';
  const onlyDiscounted = req.query.onlyDiscounted === 'true';

  // Search filter
  if (search) {
    const q = search.trim().toLowerCase();
    result = result.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        (p.englishTitle && p.englishTitle.toLowerCase().includes(q)) ||
        p.description.toLowerCase().includes(q) ||
        p.categoryName.toLowerCase().includes(q)
    );
  }

  // Category filter
  if (category && category !== 'all') {
    result = result.filter((p) => p.category === category);
  }

  // Age group filter
  if (ageGroup && ageGroup !== 'all') {
    result = result.filter((p) => p.ageGroup === ageGroup);
  }

  // Stock filter
  if (onlyInStock) {
    result = result.filter((p) => p.stock > 0);
  }

  // Discounted filter
  if (onlyDiscounted) {
    result = result.filter((p) => p.discountPercent && p.discountPercent > 0);
  }

  // Sorting
  if (sortBy === 'price-asc') {
    result.sort((a, b) => a.price - b.price);
  } else if (sortBy === 'price-desc') {
    result.sort((a, b) => b.price - a.price);
  } else if (sortBy === 'popular') {
    result.sort((a, b) => b.reviewCount - a.reviewCount);
  } else if (sortBy === 'discount') {
    result.sort((a, b) => (b.discountPercent || 0) - (a.discountPercent || 0));
  } else {
    // default: newest/best seller first
    result.sort((a, b) => (b.isBestSeller ? 1 : 0) - (a.isBestSeller ? 1 : 0));
  }

  res.json({
    success: true,
    count: result.length,
    products: result,
  });
});

// Single Product Endpoint
app.get('/api/products/:id', (req, res) => {
  const product = PRODUCTS.find((p) => p.id === req.params.id);
  if (!product) {
    return res.status(404).json({ success: false, message: 'محصول پیدا نشد' });
  }
  res.json({ success: true, product });
});

// Create Simulated Order
app.post('/api/orders', (req, res) => {
  const { items, details, total, discount, subtotal } = req.body;

  if (!items || items.length === 0) {
    return res.status(400).json({ success: false, message: 'سبد خرید خالی است' });
  }

  const randomDigits = Math.floor(10000 + Math.random() * 90000);
  const trackingCode = `PICCO-${randomDigits}`;

  const newOrder = {
    id: `ORD-${Date.now()}`,
    trackingCode,
    date: new Date().toLocaleDateString('fa-IR'),
    items,
    details,
    subtotal,
    discount,
    shippingFee: total > 1000000 ? 0 : 45000,
    total,
    status: 'processing',
  };

  res.json({
    success: true,
    message: 'سفارش شما با موفقیت ثبت شد',
    order: newOrder,
  });
});

// AI Gift Finder Endpoint with Gemini API
app.post('/api/ai/gift-finder', async (req, res) => {
  try {
    const { childAge, childGender, interests, budget, goal } = req.body;

    const ai = getGeminiClient();

    // Prepare catalog summary for Gemini prompt
    const catalogSummary = PRODUCTS.map((p) => ({
      id: p.id,
      name: p.name,
      categoryName: p.categoryName,
      ageGroup: p.ageGroup,
      priceToman: p.price,
      description: p.description,
      features: p.features,
    }));

    if (!ai) {
      // Smart offline fallback logic if API key isn't provided
      const filtered = PRODUCTS.filter((p) => {
        if (childAge && p.ageGroup !== childAge && childAge !== 'all') return false;
        return true;
      }).slice(0, 3);

      return res.json({
        success: true,
        recommendationReason: `با توجه به رده سنی کودک (${childAge || 'کودک'}) و علایق انتخاب شده، اسباب‌بازی‌های هوشمند، ساختنی و تعاملی زیر پیشنهاد می‌شوند.`,
        recommendedProductIds: filtered.map((p) => p.id),
        tipsForParents: [
          'برای رشد بهتر کودک، بازی‌های گروهی با والدین را در برنامه روزانه قرار دهید.',
          'اسباب‌بازی‌های ساختنی مهارت تمرکز و حل مسئله را تا ۲ برابر افزایش می‌دهند.',
        ],
      });
    }

    const prompt = `
تو دستیار هوشمند و متخصص هوش مصنوعی انتخاب اسباب بازی و هدیه کودک در فروشگاه "پیکو تویز" هستی.
اطلاعات کودک و ترجیحات والدین:
- سن کودک: ${childAge || 'نامشخص'}
- جنسیت / سبک بازی: ${childGender || 'فرقی نمی‌کند'}
- علایق: ${Array.isArray(interests) ? interests.join('، ') : 'کلی'}
- بودجه حدود: ${budget || 'آزاد'}
- هدف اصلی (مثلا تقویت هوش، سرگرمی، خلاقیت، تحرک): ${goal || 'رشد همه جانبه'}

کاتالوگ اسباب‌بازی‌های موجود در فروشگاه:
${JSON.stringify(catalogSummary, null, 2)}

لطفا بررسی کن و بین ۲ تا ۴ شناسه محصول (id) از لیست کاتالوگ بالا که بیشترین تناسب را دارند انتخاب کن.
همچنین یک متن کوتاه صمیمی و راهنما به زبان فارسی برای والدین بنویس و ۲ نکته تربیتی مربوط به انتخاب این اسباب‌بازی ارائه بده.
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            recommendationReason: {
              type: Type.STRING,
              description: 'توضیح کوتاه و صمیمی جهت پیشنهاد این اسباب‌بازی‌ها به والدین',
            },
            recommendedProductIds: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'لیست شناسه (id) محصولات پیشنهادی کاتالوگ',
            },
            tipsForParents: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: '۲ نکته یا توصیه تربیتی و مهارتی برای والدین',
            },
          },
          required: ['recommendationReason', 'recommendedProductIds', 'tipsForParents'],
        },
      },
    });

    const resultText = response.text;
    if (resultText) {
      const parsed = JSON.parse(resultText);
      return res.json({
        success: true,
        ...parsed,
      });
    }

    throw new Error('No response generated from Gemini');
  } catch (error) {
    console.error('Gemini Gift Finder Error:', error);
    // Graceful fallback
    const fallbackProducts = PRODUCTS.slice(0, 3).map((p) => p.id);
    res.json({
      success: true,
      recommendationReason: 'با توجه به اطلاعات وارد شده، این محصولات عالی برای رشد مهارت‌های کودک شما پیشنهاد می‌شوند.',
      recommendedProductIds: fallbackProducts,
      tipsForParents: [
        'انجام بازی با والدین حس اعتماد به‌نفس کودک را تقویت می‌کند.',
        'اسباب‌بازی‌های باکیفیت و استاندارد ایمنی بالا را همیشه در اولویت قرار دهید.',
      ],
    });
  }
});

// Start express server with Vite support
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Picco Toys App server listening on http://localhost:${PORT}`);
  });
}

startServer();
