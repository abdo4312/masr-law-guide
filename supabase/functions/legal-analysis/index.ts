import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const OPENROUTER_API_KEY = Deno.env.get('OPENROUTER_API_KEY');

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { query, category } = await req.json();

    if (!query || !category) {
      return new Response(
        JSON.stringify({ error: "Query and category are required" }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Processing legal analysis for:', { query, category });

    const systemPrompt = `أنت محامٍ مصري خبير متخصص في القانون المصري. تحليلك يجب أن يتبع الإطار التالي:

1. **ملخص القضية**: عرض موجز للمسألة القانونية
2. **القوانين المطبقة**: المواد القانونية المحددة والسوابق القضائية المصرية (اذكر أرقام المواد وأسماء القوانين)
3. **التحليل القانوني**: تطبيق مفصل للقانون على الوقائع
4. **التوصيات**: نصائح قانونية عملية والخطوات التالية
5. **تنويه**: "هذا التحليل لا يغني عن استشارة محامٍ مرخص"

يجب أن تركز على القانون المصري فقط ولا تقدم معلومات غير موثقة. إذا كانت المعلومات غير كافية، اطلب توضيحات بدلاً من التخمين.

مجال القانون: ${category}`;

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://your-site.com',
        'X-Title': 'Egyptian Legal Advisor'
      },
      body: JSON.stringify({
        model: 'meta-llama/llama-3.2-3b-instruct:free',
        messages: [
          {
            role: 'system',
            content: systemPrompt
          },
          {
            role: 'user',
            content: query
          }
        ],
        temperature: 0.3,
        max_tokens: 500,
        top_p: 0.9
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('OpenRouter API error:', errorData);
      throw new Error(`OpenRouter API error: ${response.status}`);
    }

    const data = await response.json();
    console.log('OpenRouter response received');

    const analysis = data.choices[0].message.content;

    return new Response(
      JSON.stringify({ 
        analysis,
        timestamp: new Date().toISOString(),
        category 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('Error in legal-analysis function:', error);
    return new Response(
      JSON.stringify({ 
        error: 'حدث خطأ في معالجة الاستشارة القانونية',
        details: error.message 
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});