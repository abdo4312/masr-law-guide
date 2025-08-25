import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Mic, Plus, Send, Volume2, Square, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const SimpleLegalConsultation = () => {
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
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

    const userMessage: Message = {
      role: 'user',
      content: query,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setQuery("");
    setIsLoading(true);
    setAudioUrl("");
    setIsPlaying(false);
    
    try {
      // Auto-detect legal category
      const category = detectLegalCategory(query);
      
      // Prepare conversation history
      const conversationHistory = messages.map(msg => ({
        role: msg.role,
        content: msg.content
      }));
      
      const { data, error } = await supabase.functions.invoke('legal-analysis', {
        body: { 
          query: userMessage.content, 
          category,
          conversationHistory 
        }
      });

      if (error) throw error;

      const assistantMessage: Message = {
        role: 'assistant',
        content: data.analysis,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);

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
      family: ['طلاق', 'نفقة', 'حضانة', 'زواج', 'ميراث', 'خلع', 'زوج', 'زوجة'],
      civil: ['عقد', 'إيجار', 'بيع', 'شراء', 'ملكية', 'تعويض', 'دين'],
      criminal: ['جريمة', 'سرقة', 'قتل', 'اعتداء', 'جنائي', 'حبس'],
      commercial: ['شركة', 'تجارة', 'إفلاس', 'شيك'],
      labor: ['عمل', 'فصل', 'راتب', 'إجازة'],
    };

    for (const [category, words] of Object.entries(keywords)) {
      if (words.some(word => text.includes(word))) {
        return category;
      }
    }
    return 'civil';
  };

  const handleTextToSpeech = async (text: string) => {
    if (!text) return;

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
        body: { text }
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

  const handleNewChat = () => {
    setMessages([]);
    setQuery("");
    setAudioUrl("");
    setIsPlaying(false);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
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
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              مستشارك القانوني
            </h1>
            <p className="text-muted-foreground text-sm mt-1">
              نموذج ذكاء اصطناعي متخصص في القانون المصري
            </p>
          </div>
          {messages.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleNewChat}
              className="gap-2"
            >
              <Trash2 className="h-4 w-4" />
              محادثة جديدة
            </Button>
          )}
        </div>

        {/* Messages */}
        {messages.length > 0 && (
          <div className="space-y-4 mb-6 max-h-[500px] overflow-y-auto">
            {messages.map((message, index) => (
              <Card 
                key={index} 
                className={`p-4 ${
                  message.role === 'user' 
                    ? 'bg-primary/5 border-primary/20' 
                    : 'bg-muted/50'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-xs text-muted-foreground mb-2">
                      {message.role === 'user' ? 'أنت' : 'المستشار القانوني'}
                    </p>
                    <div className="text-foreground whitespace-pre-line text-right" dir="rtl">
                      {message.content}
                    </div>
                  </div>
                  {message.role === 'assistant' && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleTextToSpeech(message.content)}
                      className="rounded-full ml-2"
                    >
                      {isPlaying ? (
                        <Square className="h-4 w-4" />
                      ) : (
                        <Volume2 className="h-4 w-4" />
                      )}
                    </Button>
                  )}
                </div>
              </Card>
            ))}
            {isLoading && (
              <Card className="p-4 bg-muted/50">
                <p className="text-xs text-muted-foreground mb-2">المستشار القانوني</p>
                <div className="flex items-center gap-2">
                  <div className="animate-pulse">جاري التحليل القانوني...</div>
                </div>
              </Card>
            )}
          </div>
        )}

        {/* Input Section */}
        <Card className="p-4 shadow-lg">
          <div className="space-y-3">
            <Textarea
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit();
                }
              }}
              placeholder={
                messages.length === 0 
                  ? "اكتب استشارتك القانونية هنا..."
                  : "اكتب سؤالك التالي..."
              }
              className="min-h-[100px] text-right resize-none"
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
                className="px-6"
              >
                {isLoading ? "جاري التحليل..." : "إرسال"}
                <Send className="w-4 h-4 mr-2" />
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default SimpleLegalConsultation;