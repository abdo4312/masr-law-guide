import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FileText, MessageSquare, Upload, CheckCircle } from "lucide-react";
import heroImage from "@/assets/legal-hero.jpg";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-legal-muted to-background">
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `url(${heroImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="text-center lg:text-right">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-l from-legal-primary to-legal-secondary bg-clip-text text-transparent leading-tight">
              مستشارك القانوني
              <br />
              المتخصص في القانون المصري
            </h1>
            
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              منصة استشارات قانونية متطورة تقدم تحليلاً دقيقاً للقضايا والوثائق القانونية
              <br />
              وفقاً للقانون المصري والاجتهادات القضائية الحديثة
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-end mb-12">
              <Button variant="hero" size="lg" className="text-lg">
                ابدأ استشارة قانونية
              </Button>
              <Button variant="outline" size="lg" className="text-lg">
                تعرف على خدماتنا
              </Button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-legal-primary">+1000</div>
                <div className="text-sm text-muted-foreground">قضية تم تحليلها</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-legal-primary">95%</div>
                <div className="text-sm text-muted-foreground">دقة التحليل</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-legal-primary">24/7</div>
                <div className="text-sm text-muted-foreground">متاح على مدار الساعة</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-legal-primary">100+</div>
                <div className="text-sm text-muted-foreground">قانون مصري</div>
              </div>
            </div>
          </div>

          {/* Features Cards */}
          <div className="grid gap-6">
            <Card className="p-6 bg-white/80 backdrop-blur-sm border border-legal-primary/20 hover:shadow-elegant transition-all duration-300">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-legal-primary/10 rounded-lg">
                  <MessageSquare className="w-6 h-6 text-legal-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">استشارة قانونية فورية</h3>
                  <p className="text-muted-foreground">
                    احصل على تحليل قانوني فوري لاستفساراتك مع الاستناد إلى القوانين المصرية
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-white/80 backdrop-blur-sm border border-legal-secondary/20 hover:shadow-elegant transition-all duration-300">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-legal-secondary/10 rounded-lg">
                  <Upload className="w-6 h-6 text-legal-secondary" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">تحليل الوثائق</h3>
                  <p className="text-muted-foreground">
                    ارفع عقودك ووثائقك القانونية للحصول على تحليل دقيق ومفصل
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-white/80 backdrop-blur-sm border border-legal-accent/20 hover:shadow-elegant transition-all duration-300">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-legal-accent/10 rounded-lg">
                  <FileText className="w-6 h-6 text-legal-accent" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">مرجع قانوني شامل</h3>
                  <p className="text-muted-foreground">
                    قاعدة بيانات محدثة بجميع القوانين المصرية والاجتهادات القضائية
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;