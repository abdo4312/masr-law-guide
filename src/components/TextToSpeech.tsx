import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Volume2, VolumeX, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface TextToSpeechProps {
  text: string;
  className?: string;
}

const TextToSpeech = ({ text, className = "" }: TextToSpeechProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { toast } = useToast();

  const handleTextToSpeech = async () => {
    if (isPlaying && audioRef.current) {
      // Stop current playback
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
      return;
    }

    if (!text?.trim()) {
      toast({
        title: "خطأ",
        description: "لا يوجد نص للنطق",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('text-to-speech', {
        body: { text: text.trim() }
      });

      if (error) {
        throw error;
      }

      if (!data?.audioContent) {
        throw new Error('لم يتم إرجاع محتوى صوتي');
      }

      // Convert base64 to audio blob
      const binaryString = atob(data.audioContent);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      
      const audioBlob = new Blob([bytes], { type: 'audio/mp3' });
      const audioUrl = URL.createObjectURL(audioBlob);

      // Create and play audio
      if (audioRef.current) {
        audioRef.current.pause();
      }

      const audio = new Audio(audioUrl);
      audioRef.current = audio;

      audio.onloadstart = () => {
        setIsPlaying(true);
        setIsLoading(false);
      };

      audio.onended = () => {
        setIsPlaying(false);
        URL.revokeObjectURL(audioUrl);
      };

      audio.onerror = () => {
        setIsPlaying(false);
        setIsLoading(false);
        URL.revokeObjectURL(audioUrl);
        toast({
          title: "خطأ",
          description: "حدث خطأ أثناء تشغيل الصوت",
          variant: "destructive"
        });
      };

      await audio.play();

    } catch (error) {
      console.error('Error with text-to-speech:', error);
      setIsLoading(false);
      toast({
        title: "خطأ في النطق",
        description: "حدث خطأ أثناء تحويل النص إلى صوت",
        variant: "destructive"
      });
    }
  };

  return (
    <Button
      onClick={handleTextToSpeech}
      variant="outline"
      size="sm"
      className={`gap-2 ${className}`}
      disabled={isLoading}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : isPlaying ? (
        <VolumeX className="w-4 h-4" />
      ) : (
        <Volume2 className="w-4 h-4" />
      )}
      {isLoading ? "جاري التحويل..." : isPlaying ? "إيقاف النطق" : "استمع للتحليل"}
    </Button>
  );
};

export default TextToSpeech;