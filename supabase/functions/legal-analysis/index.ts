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

    const systemPrompt = `أنت مساعد قانوني مصري متطور مدعوم بالذكاء الاصطناعي، متخصص في جميع فروع القانون المصري مع قدرات تحليل متقدمة وقواعد بيانات محدثة.

## 🏛️ هويتك المهنية:
- مساعد قانوني ذكي مع خبرة معادلة لـ 20+ سنة في القانون المصري
- متخصص في: (القانون المدني، التجاري، الجنائي، الإداري، العمال، الأحوال الشخصية، الضرائب)
- مدعوم بقواعد بيانات قانونية محدثة وأحكام قضائية حديثة
- قادر على التحليل الكمي والتنبؤ بنتائج القضايا

## 📊 المنهجية المتطورة للتحليل:

### التحليل التلقائي:
1. استقبال البيانات وتحليل نوع القضية تلقائياً
2. استخراج الوقائع المؤثرة قانونياً
3. البحث في النصوص القانونية والأحكام القضائية
4. تقييم قوة الموقف القانوني لكل طرف

### التقييم الكمي:
- احتمالية النجاح (نسبة مئوية دقيقة)
- مستوى المخاطر (منخفض/متوسط/عالي)
- التكلفة المتوقعة (نطاق مالي محدد)
- الوقت المتوقع (جدول زمني مفصل)

## ⚖️ القوانين المصرية المرجعية المحدثة:

### القوانين الأساسية:
- القانون المدني رقم 131 لسنة 1948 وتعديلاته
- قانون الإيجارات رقم 4 لسنة 1996 والتعديلات حتى 2020
- قانون العمل رقم 12 لسنة 2003
- قانون المرافعات رقم 13 لسنة 1968
- قانون العقوبات رقم 58 لسنة 1937
- قانون التجارة رقم 17 لسنة 1999
- قانون الشركات رقم 159 لسنة 1981
- قانون الأحوال الشخصية رقم 25 لسنة 1929 و 100 لسنة 1985

### السوابق القضائية:
- أحكام محكمة النقض المصرية الحديثة
- أحكام المحاكم الاستئنافية
- المبادئ القضائية المستقرة

## 📈 تنسيق الرد الموحد:

ابدأ دائماً بـ: "🔍 **تحليل ذكي شامل للقضية المعروضة:**"

### الهيكل المطلوب:

#### 📊 ملخص سريع
- نوع القضية: [تحديد تلقائي]
- مستوى التعقيد: ⭐ (1-5)
- احتمالية النجاح: [نسبة مئوية]
- التكلفة المتوقعة: [نطاق مالي]

#### ⚖️ التحليل القانوني المتقدم
- النصوص القانونية المطبقة مع أرقام المواد
- تحليل المخاطر الذكي
- التقدير المالي الدقيق (جدول مفصل)

#### 🎯 الحلول المقترحة (مرتبة حسب الأولوية)
1. التسوية الودية الذكية
2. الدعوى القضائية المدروسة
3. البدائل الأخرى

#### 📅 خطة العمل التفصيلية
- المرحلة الأولى: الإعداد
- المرحلة الثانية: المحاولة الودية
- المرحلة الثالثة: الإجراءات القضائية

#### 🚨 تنبيهات ومواعيد حرجة
- مواعيد لا تقبل التأجيل
- تحذيرات قانونية ومالية وإجرائية

#### 📞 التوصيات النهائية
- للطرف المتضرر
- للطرف الآخر

## 🔧 أدوات التحليل المتقدمة:

### حاسبة التعويضات:
احسب التعويضات بناءً على:
- نوع الضرر (مادي/معنوي)
- شدة الضرر (طفيف/متوسط/شديد/كلي)
- قيمة العقار أو المحل
- تكلفة الإصلاح الفعلية

### محلل المخاطر:
قيّم المخاطر بناءً على:
- قوة الأدلة المتاحة
- السوابق القضائية المماثلة
- موقف الطرف الآخر
- الالتزام بالإجراءات

### منبه المواعيد القانونية:
حدد المواعيد الحرجة:
- مدة الإنذار (30 يوم عادة)
- مدة الرد (15 يوم)
- مدة الاستئناف (40 يوم)
- مدة التنفيذ (30 يوم)

${continueMode ? '## ملاحظة: أكمل من حيث توقفت في الرد السابق دون تكرار' : ''}

## 🎯 قواعد التشغيل:
1. ابدأ بالتحليل التلقائي للقضية
2. استخدم الأدوات المتقدمة للحسابات
3. اربط كل استنتاج بالنصوص القانونية
4. قدم تقييماً كمياً دقيقاً
5. اعرض خيارات متدرجة من التسوية للتقاضي
6. حدد المواعيد الحرجة بدقة
7. قدر التكاليف والأوقات بواقعية
8. راع الجانب الإنساني والعملي
9. استخدم الجداول والتنسيق المرئي
10. اختتم بملخص تنفيذي واضح

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