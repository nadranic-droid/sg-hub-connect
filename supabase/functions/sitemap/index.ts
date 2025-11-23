/// <reference lib="deno.ns" />
/// <reference types="https://esm.sh/@supabase/functions-js/src/edge-runtime.d.ts" />

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Type definitions for sitemap data
interface Category {
  slug: string;
  updated_at: string | null;
}

interface Neighbourhood {
  slug: string;
  updated_at: string | null;
}

interface Business {
  slug: string;
  updated_at: string | null;
}

interface Article {
  slug: string;
  updated_at: string | null;
  is_featured: boolean | null;
}

Deno.serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const baseUrl = 'https://humblehalal.sg';
    const currentDate = new Date().toISOString();

    console.log('Generating sitemap...');

    // Fetch all data
    const [categoriesData, neighbourhoodsData, businessesData, articlesData] = await Promise.all([
      supabase.from('categories').select('slug, updated_at').order('sort_order'),
      supabase.from('neighbourhoods').select('slug, updated_at').order('name'),
      supabase.from('businesses').select('slug, updated_at').eq('status', 'approved').order('updated_at', { ascending: false }),
      supabase.from('articles').select('slug, updated_at, is_featured').eq('is_published', true).order('published_at', { ascending: false })
    ]);

    console.log(`Found: ${categoriesData.data?.length} categories, ${neighbourhoodsData.data?.length} neighbourhoods, ${businessesData.data?.length} businesses, ${articlesData.data?.length} articles`);

    // Build sitemap XML
    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

    // Homepage
    xml += `  <url>
    <loc>${baseUrl}/</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>\n`;

    // Categories
    categoriesData.data?.forEach((category: Category) => {
      xml += `  <url>
    <loc>${baseUrl}/category/${category.slug}</loc>
    <lastmod>${category.updated_at || currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>\n`;
    });

    // Neighbourhoods
    neighbourhoodsData.data?.forEach((neighbourhood: Neighbourhood) => {
      xml += `  <url>
    <loc>${baseUrl}/neighbourhood/${neighbourhood.slug}</loc>
    <lastmod>${neighbourhood.updated_at || currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>\n`;
    });

    // Businesses
    businessesData.data?.forEach((business: Business) => {
      xml += `  <url>
    <loc>${baseUrl}/business/${business.slug}</loc>
    <lastmod>${business.updated_at || currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>\n`;
    });

    // Articles
    articlesData.data?.forEach((article: Article) => {
      const priority = article.is_featured ? '0.8' : '0.6';
      xml += `  <url>
    <loc>${baseUrl}/articles/${article.slug}</loc>
    <lastmod>${article.updated_at || currentDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>${priority}</priority>
  </url>\n`;
    });

    // Static pages
    const staticPages = [
      { path: '/search', priority: '0.7' },
      { path: '/events', priority: '0.6' },
      { path: '/articles', priority: '0.7' },
      { path: '/resources', priority: '0.6' },
      { path: '/auth', priority: '0.3' },
    ];

    staticPages.forEach(page => {
      xml += `  <url>
    <loc>${baseUrl}${page.path}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>${page.priority}</priority>
  </url>\n`;
    });

    xml += '</urlset>';

    console.log('Sitemap generated successfully');

    return new Response(xml, {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=3600', // Cache for 1 hour
      },
    });

  } catch (err) {
    console.error('Error generating sitemap:', err);
    const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});