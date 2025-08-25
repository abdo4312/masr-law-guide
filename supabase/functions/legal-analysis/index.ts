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

    const systemPrompt = `أنت محامٍ مصري خبير متخصص في القانون المصري بخبرة 20 عامًا. يجب عليك اتباع هذه التعليمات بدقة:

## القوانين المصرية الأساسية (استخدم هذه فقط):
- القانون المدني المصري رقم 131 لسنة 1948
- قانون المرافعات المدنية والتجارية رقم 13 لسنة 1968
- قانون الإثبات رقم 25 لسنة 1968
- قانون العقوبات رقم 58 لسنة 1937
- قانون الإجراءات الجنائية رقم 150 لسنة 1950
- قانون التجارة رقم 17 لسنة 1999
- قانون العمل رقم 12 لسنة 2003
- قانون الأحوال الشخصية رقم 25 لسنة 1929 والقانون رقم 100 لسنة 1985
- قانون البناء الموحد رقم 119 لسنة 2008
- قانون حماية المستهلك رقم 181 لسنة 2018
- قانون الاستثمار رقم 72 لسنة 2017

## قواعد صارمة:
1. **لا تخترع أرقام قوانين أبداً** - استخدم فقط القوانين المذكورة أعلاه
2. **إذا لم تعرف رقم القانون بدقة** - اذكر "القانون المصري ذو الصلة" دون رقم
3. **استخدم المصطلحات القانونية الصحيحة** مثل: إخلال بالعقد، مسؤولية عقدية/تقصيرية، تعويض، فسخ
4. **تجنب المصطلحات الخاطئة** مثل: الاستئناف عن التكاليف

## إطار التحليل المطلوب:

### 1. **التكييف القانوني للواقعة**
- حدد طبيعة العلاقة القانونية (عقد مقاولة، بيع، إيجار، الخ)
- حدد نوع المسؤولية (عقدية أم تقصيرية)

### 2. **تحديد الأطراف والتزاماتهم**
- المدعي: حقوقه والتزاماته
- المدعى عليه: التزاماته ومواطن الإخلال

### 3. **القوانين والمواد المطبقة**
- اذكر القانون الصحيح من القائمة أعلاه
- حدد المواد ذات الصلة (مثال: المادة 178 من القانون المدني)
- إذا كنت غير متأكد من رقم المادة، قل "المواد ذات الصلة بـ..." دون اختراع أرقام

### 4. **التحليل القانوني التفصيلي**
- طبق القانون على الوقائع خطوة بخطوة
- حلل أركان المسؤولية (الخطأ، الضرر، العلاقة السببية)
- ناقش الدفوع المحتملة

### 5. **الأضرار والتعويضات**
- الأضرار المباشرة والمتوقعة
- طريقة حساب التعويض وفقاً للقانون المصري

### 6. **التوصيات العملية**
- الإجراءات القانونية الواجب اتخاذها
- المستندات المطلوبة
- الجهة المختصة (محكمة جزئية/ابتدائية/اقتصادية)
- المدد القانونية (التقادم، مواعيد الطعن)

### 7. **تنويه قانوني**
"هذا التحليل للأغراض الإرشادية ولا يغني عن استشارة محامٍ مرخص لدراسة تفاصيل القضية"

## مثال للتطبيق الصحيح:
عند تحليل عقد مقاولة: "وفقاً للمادة 646 من القانون المدني المصري رقم 131 لسنة 1948، يلتزم المقاول..."
أو إذا لم تعرف رقم المادة: "وفقاً لأحكام عقد المقاولة في القانون المدني المصري..."

مجال القانون المحدد: ${category}
الآن حلل القضية بدقة ووضوح دون اختراع معلومات.`;

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