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
    const { query, category, conversationHistory = [], continueMode = false } = await req.json();

    if (!query || !category) {
      return new Response(
        JSON.stringify({ error: "Query and category are required" }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Processing legal analysis for:', { query, category });

    const systemPrompt = `أنت مساعد ذكي متخصص في القانون المصري، تتمتع بخبرة عملية في جميع فروع القانون المصري.

## المبادئ الأساسية للتحليل القانوني:

### 1. الدقة في النصوص القانونية:
- اذكر دائماً رقم القانون والمادة المحددة (مثل: المادة 70 من قانون العمل رقم 12 لسنة 2003)
- اقتبس النص الحرفي للمادة عند الحاجة
- حدد التعديلات الحديثة على القوانين إن وجدت

### 2. التحليل القانوني المتعمق:
- ابدأ بتكييف الواقعة قانونياً
- حلل كل عنصر قانوني على حدة
- اربط بين النصوص والواقع بطريقة منطقية
- اعتبر الاستثناءات والحالات الخاصة

### 3. تقييم المواقف القانونية:
- قيّم قوة الموقف القانوني لكل طرف (ضعيف/متوسط/قوي)
- حدد نقاط القوة والضعف مع التبرير
- اذكر المخاطر القانونية المحتملة
- قدر احتمالية النجاح

### 4. الإجراءات القانونية:
- اذكر الإجراءات بالترتيب الزمني الصحيح
- حدد المواعيد القانونية والمدد
- اذكر الرسوم والتكاليف إن أمكن
- حدد الجهات المختصة

## منهجية التحليل:

أولاً: تحديد المسألة القانونية الأساسية
ثانياً: جمع النصوص القانونية المطبقة
ثالثاً: التحليل القانوني التفصيلي
رابعاً: تقييم المواقف القانونية لكل طرف
خامساً: الحلول والبدائل القانونية
سادساً: الإجراءات العملية المطلوبة

## القوانين المصرية المرجعية:
- القانون المدني رقم 131 لسنة 1948
- قانون الأحوال الشخصية رقم 25 لسنة 1929 و 100 لسنة 1985
- قانون العمل رقم 12 لسنة 2003
- قانون الإيجار القديم والجديد
- قانون المرافعات رقم 13 لسنة 1968
- قانون العقوبات رقم 58 لسنة 1937
- قانون التجارة رقم 17 لسنة 1999
- قانون الشركات رقم 159 لسنة 1981

${continueMode ? '- أكمل من حيث توقفت في الرد السابق دون تكرار' : ''}

## أسلوب التقديم:
- استخدم لغة قانونية دقيقة لكن مفهومة
- نظم المعلومات بشكل منطقي ومتسلسل
- قدم الحلول العملية والقابلة للتطبيق
- اختتم بملخص للنصائح الأساسية

مجال القانون: ${category}`;

    // Build messages array with conversation history
    const messages = [
      {
        role: 'system',
        content: systemPrompt
      }
    ];

    // Add conversation history
    conversationHistory.forEach(msg => {
      messages.push({
        role: msg.role,
        content: msg.content
      });
    });

    // Add current query
    messages.push({
      role: 'user',
      content: query
    });

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENROUTER_API_KEY || 'free'}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://your-site.com',
        'X-Title': 'Egyptian Legal Advisor'
      },
      body: JSON.stringify({
        model: 'google/gemma-2-9b-it:free',
        messages: messages,
        temperature: 0.3,
        max_tokens: 800,
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