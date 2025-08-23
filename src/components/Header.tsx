import { Scale, Globe, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const Header = () => {
  const [language, setLanguage] = useState<'ar' | 'en'>('ar');

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'ar' ? 'en' : 'ar');
  };

  return (
    <header className="fixed top-0 w-full bg-white/95 backdrop-blur-md border-b border-border z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-legal-primary to-legal-secondary rounded-lg">
              <Scale className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-legal-primary">
                {language === 'ar' ? 'دليل القانون المصري' : 'Masr Law Guide'}
              </h1>
              <p className="text-sm text-muted-foreground">
                {language === 'ar' ? 'مستشارك القانوني الشخصي' : 'Your Personal Legal Advisor'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={toggleLanguage}
              className="hover:bg-legal-muted"
            >
              <Globe className="w-5 h-5" />
            </Button>
            
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="w-5 h-5" />
            </Button>

            <nav className="hidden md:flex items-center gap-6">
              <a href="#services" className="text-foreground hover:text-legal-primary transition-colors">
                {language === 'ar' ? 'الخدمات' : 'Services'}
              </a>
              <a href="#consultation" className="text-foreground hover:text-legal-primary transition-colors">
                {language === 'ar' ? 'استشارة قانونية' : 'Legal Consultation'}
              </a>
              <a href="#about" className="text-foreground hover:text-legal-primary transition-colors">
                {language === 'ar' ? 'عن المنصة' : 'About'}
              </a>
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;