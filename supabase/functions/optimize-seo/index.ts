import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { businessName, description, category, location } = await req.json();
    
    console.log('Optimizing SEO for:', { businessName, category, location });

    if (!businessName) {
      return new Response(
        JSON.stringify({ error: 'Business name is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAIApiKey) {
      return new Response(
        JSON.stringify({ error: 'OpenAI API key not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create a detailed prompt for SEO optimization
    const prompt = `You are an expert SEO copywriter specializing in high-CTR business listings. Analyze the business information below and create compelling, customized SEO content that MAXIMIZES click-through rates.

BUSINESS INFORMATION:
Name: ${businessName}
Full Description: ${description || 'Not provided'}
Category/Industry: ${category || 'Not specified'}
Location: ${location || 'Singapore'}

YOUR TASK:
Create TWO pieces of content that are SPECIFICALLY tailored to THIS business (NOT generic templates):

1. SEO TITLE (EXACTLY 55-60 characters to maximize space):
   - Start with the business name
   - Include a compelling benefit or unique value proposition
   - Add location ONLY if characters allow
   - Use power words: Expert, Professional, Premium, Certified, Trusted, Leading, Best, Top
   - NO generic phrases like "Halal Business in Singapore"
   - Examples of GOOD titles: "ONN AGENCY - Expert Marketing Solutions & Growth Strategy"

2. META DESCRIPTION (EXACTLY 155-160 characters to maximize space):
   - Start with a strong action verb or benefit statement
   - Include what makes this business unique based on their description
   - Add a clear call-to-action (Visit, Discover, Contact, Get, Book, etc.)
   - Use emotional triggers and urgency
   - Mention specific services/products if described
   - Examples of GOOD descriptions: "Transform your business with expert marketing solutions from ONN AGENCY. Strategic campaigns, proven results, and dedicated support. Contact us today for a free consultation!"

CTR OPTIMIZATION RULES:
- Use numbers when possible (10+ years, 500+ clients, etc.)
- Include emotional words: Transform, Discover, Expert, Premium, Exclusive
- Add urgency: Today, Now, Limited, Book Now
- Make it benefit-focused (what customer GETS, not what you DO)
- Be specific to THIS business's actual services

Return ONLY valid JSON (no markdown, no code blocks, no extra text):
{
  "title": "Your 55-60 character title here",
  "description": "Your 155-160 character description here"
}`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-5-mini-2025-08-07',
        messages: [
          { 
            role: 'system', 
            content: 'You are a professional SEO copywriter with 10+ years experience. You MUST return ONLY valid JSON with no markdown, no code blocks, no extra text. Format: {"title":"text","description":"text"}' 
          },
          { role: 'user', content: prompt }
        ],
        max_completion_tokens: 800,
        response_format: { type: "json_object" }
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenAI API error:', response.status, errorText);
      return new Response(
        JSON.stringify({ error: 'Failed to generate SEO content' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const data = await response.json();
    const generatedContent = data.choices[0].message.content;
    
    console.log('Generated content:', generatedContent);

    // Parse the JSON response
    let seoContent;
    try {
      // Remove markdown code blocks if present
      const cleanContent = generatedContent
        .replace(/```json\n?/g, '')
        .replace(/```\n?/g, '')
        .replace(/^[^{]*/, '') // Remove any text before first {
        .replace(/[^}]*$/, '') // Remove any text after last }
        .trim();
      
      seoContent = JSON.parse(cleanContent);
      
      // Validate the response has required fields
      if (!seoContent.title || !seoContent.description) {
        throw new Error('Missing required fields in AI response');
      }
      
      // Ensure character limits
      if (seoContent.title.length > 60) {
        seoContent.title = seoContent.title.substring(0, 57) + '...';
      }
      if (seoContent.description.length > 160) {
        seoContent.description = seoContent.description.substring(0, 157) + '...';
      }
      
      console.log('Parsed SEO content:', seoContent);
    } catch (parseError) {
      console.error('Failed to parse AI response:', parseError, 'Raw content:', generatedContent);
      
      // Improved fallback using actual business info
      const shortDesc = description?.substring(0, 100) || 'quality services';
      seoContent = {
        title: `${businessName} - ${category || 'Professional Services'}`.substring(0, 60),
        description: `Discover ${businessName} in Singapore. ${shortDesc}. Contact us today for more information!`.substring(0, 160)
      };
    }

    return new Response(
      JSON.stringify(seoContent),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in optimize-seo function:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
