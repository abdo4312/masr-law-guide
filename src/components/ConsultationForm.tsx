import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload, MessageSquare, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const ConsultationForm = () => {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [analysis, setAnalysis] = useState("");
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim() || !category) {
      toast({
        title: "خطأ",
        description: "يرجى ملء جميع الحقول المطلوبة",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    setAnalysis("");
    
    try {
      const { data, error } = await supabase.functions.invoke('legal-analysis', {
        body: { query: query.trim(), category }
      });

      if (error) {
        throw error;
      }

      setAnalysis(data.analysis);
      toast({
        title: "تم تحليل الاستشارة القانونية",
        description: "تم إنتاج التحليل القانوني بنجاح"
      });

    } catch (error) {
      console.error('Error getting legal analysis:', error);
      toast({
        title: "خطأ في التحليل",
        description: "حدث خطأ أثناء تحليل الاستشارة القانونية",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section id="consultation" className="py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 text-legal-primary">
              احصل على استشارة قانونية فورية
            </h2>
            <p className="text-xl text-muted-foreground">
              اطرح سؤالك القانوني وستحصل على تحليل مفصل وفقاً للقانون المصري
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Consultation Form */}
            <Card className="lg:col-span-2 p-8">
              <div className="flex items-center gap-3 mb-6">
                <MessageSquare className="w-6 h-6 text-legal-primary" />
                <h3 className="text-2xl font-semibold">استشارة قانونية</h3>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <Label htmlFor="category" className="text-base font-medium">
                    اختر مجال القانون *
                  </Label>
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger className="mt-2">
                      <SelectValue placeholder="اختر المجال القانوني" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="civil">القانون المدني</SelectItem>
                      <SelectItem value="criminal">القانون الجنائي</SelectItem>
                      <SelectItem value="commercial">القانون التجاري</SelectItem>
                      <SelectItem value="family">قانون الأسرة</SelectItem>
                      <SelectItem value="administrative">القانون الإداري</SelectItem>
                      <SelectItem value="constitutional">القانون الدستوري</SelectItem>
                      <SelectItem value="labor">قانون العمل</SelectItem>
                      <SelectItem value="other">أخرى</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="query" className="text-base font-medium">
                    اكتب استفسارك القانوني بالتفصيل *
                  </Label>
                  <Textarea
                    id="query"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="اشرح قضيتك أو استفسارك القانوني بالتفصيل، مع ذكر جميع الحقائق والوقائع المهمة..."
                    className="mt-2 min-h-[150px] text-right"
                    dir="rtl"
                  />
                </div>

                <div className="border-2 border-dashed border-legal-primary/30 rounded-lg p-8 text-center">
                  <Upload className="w-12 h-12 text-legal-primary mx-auto mb-4" />
                  <h4 className="text-lg font-medium mb-2">ارفع وثائقك القانونية</h4>
                  <p className="text-muted-foreground mb-4">
                    العقود، المراسلات، الأحكام، أو أي وثائق ذات صلة (اختياري)
                  </p>
                  <Button type="button" variant="outline">
                    اختر الملفات
                  </Button>
                </div>

                <Button 
                  type="submit" 
                  variant="legal" 
                  size="lg" 
                  className="w-full"
                  disabled={isLoading}
                >
                  {isLoading ? "جاري التحليل..." : "احصل على الاستشارة"}
                  <Send className="w-5 h-5 mr-2" />
                </Button>
              </form>
            </Card>

            {/* Analysis Framework */}
            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-4 text-legal-primary">
                إطار التحليل القانوني
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-legal-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-legal-primary font-semibold text-sm">1</span>
                  </div>
                  <div>
                    <h4 className="font-medium">تحديد الوقائع</h4>
                    <p className="text-sm text-muted-foreground">استخراج وتحديد الحقائق القانونية ذات الصلة</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-legal-secondary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-legal-secondary font-semibold text-sm">2</span>
                  </div>
                  <div>
                    <h4 className="font-medium">البحث القانوني</h4>
                    <p className="text-sm text-muted-foreground">الاستناد إلى القوانين والاجتهادات المصرية</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-legal-accent/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-legal-accent font-semibold text-sm">3</span>
                  </div>
                  <div>
                    <h4 className="font-medium">التطبيق القانوني</h4>
                    <p className="text-sm text-muted-foreground">تطبيق القوانين على الوقائع المحددة</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-legal-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-legal-primary font-semibold text-sm">4</span>
                  </div>
                  <div>
                    <h4 className="font-medium">الخلاصة والتوصيات</h4>
                    <p className="text-sm text-muted-foreground">تقديم النتائج والخطوات العملية</p>
                  </div>
                </div>
              </div>

              <div className="mt-6 p-4 bg-legal-muted rounded-lg">
                <p className="text-sm text-center text-muted-foreground">
                  <strong>تنويه:</strong> هذا التحليل لا يغني عن استشارة محامٍ مرخص
                </p>
              </div>
            </Card>

            {/* Legal Analysis Results */}
            {analysis && (
              <Card className="lg:col-span-3 p-8 mt-8">
                <div className="flex items-center gap-3 mb-6">
                  <MessageSquare className="w-6 h-6 text-legal-primary" />
                  <h3 className="text-2xl font-semibold">التحليل القانوني</h3>
                </div>
                
                <div className="prose prose-lg max-w-none text-right" dir="rtl">
                  <div className="whitespace-pre-line text-foreground leading-relaxed">
                    {analysis}
                  </div>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ConsultationForm;