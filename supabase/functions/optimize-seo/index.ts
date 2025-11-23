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
    const prompt = `You are an SEO expert specializing in local business listings for Singapore. Generate optimized SEO content for the following halal business:

Business Name: ${businessName}
Description: ${description || 'No description provided'}
Category: ${category || 'General business'}
Location: ${location || 'Singapore'}

Generate:
1. An SEO-optimized title (max 60 characters) that includes the business name and key location/category terms
2. An SEO-optimized meta description (max 160 characters) that's compelling and includes relevant keywords

Focus on:
- Including location terms (Singapore, neighbourhood if provided)
- Highlighting halal/Muslim-friendly aspects
- Action-oriented language
- Local SEO best practices
- Avoiding keyword stuffing

Return ONLY a JSON object with this exact structure (no markdown, no code blocks):
{
  "title": "Your optimized title here",
  "description": "Your optimized description here"
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
            content: 'You are an SEO expert. Return only valid JSON without markdown formatting or code blocks.' 
          },
          { role: 'user', content: prompt }
        ],
        max_completion_tokens: 500,
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
      const cleanContent = generatedContent.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      seoContent = JSON.parse(cleanContent);
    } catch (parseError) {
      console.error('Failed to parse AI response:', parseError);
      // Fallback to basic SEO if parsing fails
      seoContent = {
        title: `${businessName} - ${category || 'Halal Business'} in Singapore`,
        description: description?.substring(0, 160) || `Discover ${businessName}, a halal-certified business in Singapore. Visit us for quality products and services.`
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
