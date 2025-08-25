import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Mic, Plus, Send, Volume2, Square } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const SimpleLegalConsultation = () => {
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [analysis, setAnalysis] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioUrl, setAudioUrl] = useState("");
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleSubmit = async () => {
    if (!query.trim()) {
      toast({
        title: "خطأ",
        description: "يرجى كتابة استشارتك القانونية",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    setAnalysis("");
    setAudioUrl("");
    setIsPlaying(false);
    
    try {
      // Auto-detect legal category based on keywords
      const category = detectLegalCategory(query);
      
      const { data, error } = await supabase.functions.invoke('legal-analysis', {
        body: { query: query.trim(), category }
      });

      if (error) throw error;

      setAnalysis(data.analysis);
      toast({
        title: "تم التحليل القانوني",
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

  const detectLegalCategory = (text: string) => {
    const keywords = {
      civil: ['عقد', 'إيجار', 'بيع', 'شراء', 'ملكية', 'تعويض'],
      criminal: ['جريمة', 'سرقة', 'قتل', 'اعتداء', 'جنائي'],
      commercial: ['شركة', 'تجارة', 'إفلاس', 'شيك'],
      family: ['طلاق', 'نفقة', 'حضانة', 'زواج', 'ميراث'],
      labor: ['عمل', 'فصل', 'راتب', 'إجازة'],
    };

    for (const [category, words] of Object.entries(keywords)) {
      if (words.some(word => text.includes(word))) {
        return category;
      }
    }
    return 'civil'; // default
  };

  const handleTextToSpeech = async () => {
    if (!analysis) return;

    if (isPlaying && audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
      return;
    }

    if (audioUrl && audioRef.current) {
      audioRef.current.play();
      setIsPlaying(true);
      return;
    }

    try {
      const { data, error } = await supabase.functions.invoke('text-to-speech', {
        body: { text: analysis }
      });

      if (error) throw error;

      const blob = new Blob([data], { type: 'audio/mpeg' });
      const url = URL.createObjectURL(blob);
      setAudioUrl(url);

      const audio = new Audio(url);
      audioRef.current = audio;
      
      audio.onended = () => {
        setIsPlaying(false);
      };

      audio.play();
      setIsPlaying(true);

    } catch (error) {
      console.error('Error in text-to-speech:', error);
      toast({
        title: "خطأ",
        description: "حدث خطأ في تحويل النص إلى صوت",
        variant: "destructive"
      });
    }
  };

  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleMicClick = () => {
    toast({
      title: "قريباً",
      description: "ميزة التسجيل الصوتي قيد التطوير",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            المستشار القانوني المصري
          </h1>
          <p className="text-muted-foreground">
            تحليل قانوني عميق وفقاً للقانون المصري
          </p>
        </div>

        {/* Input Section */}
        <Card className="p-6 mb-6 shadow-lg">
          <div className="space-y-4">
            <Textarea
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="اكتب استشارتك القانونية هنا بالتفصيل..."
              className="min-h-[150px] text-right resize-none"
              dir="rtl"
            />
            
            <div className="flex items-center justify-between">
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={handleMicClick}
                  className="rounded-full"
                >
                  <Mic className="h-4 w-4" />
                </Button>
                
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={handleFileSelect}
                  className="rounded-full"
                >
                  <Plus className="h-4 w-4" />
                </Button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*,.pdf"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files?.length) {
                      toast({
                        title: "تم اختيار الملف",
                        description: `${e.target.files[0].name}`,
                      });
                    }
                  }}
                />
              </div>
              
              <Button
                onClick={handleSubmit}
                disabled={isLoading || !query.trim()}
                size="lg"
                className="px-8"
              >
                {isLoading ? "جاري التحليل..." : "تحليل"}
                <Send className="w-4 h-4 mr-2" />
              </Button>
            </div>
          </div>
        </Card>

        {/* Analysis Result */}
        {analysis && (
          <Card className="p-6 shadow-lg animate-in fade-in slide-in-from-bottom-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-foreground">
                التحليل القانوني
              </h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleTextToSpeech}
                className="rounded-full"
              >
                {isPlaying ? (
                  <Square className="h-4 w-4" />
                ) : (
                  <Volume2 className="h-4 w-4" />
                )}
              </Button>
            </div>
            
            <div className="prose prose-sm max-w-none text-right" dir="rtl">
              <div className="whitespace-pre-line text-foreground/90 leading-relaxed">
                {analysis}
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default SimpleLegalConsultation;