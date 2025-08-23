import { Scale, Mail, Phone, MapPin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-legal-primary text-white py-16">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-white/10 rounded-lg">
                <Scale className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold">دليل القانون المصري</h3>
                <p className="text-legal-secondary">مستشارك القانوني الشخصي</p>
              </div>
            </div>
            <p className="text-white/80 leading-relaxed mb-6">
              منصة متطورة للاستشارات القانونية المتخصصة في القانون المصري، نقدم تحليلاً دقيقاً 
              للقضايا والوثائق القانونية بناءً على أحدث القوانين والاجتهادات القضائية.
            </p>
            <div className="flex gap-4">
              <div className="flex items-center gap-2 text-sm">
                <Mail className="w-4 h-4" />
                <span>info@masrlawguide.com</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Phone className="w-4 h-4" />
                <span dir="ltr">+20 123 456 7890</span>
              </div>
            </div>
          </div>

          {/* Legal Services */}
          <div>
            <h4 className="text-lg font-semibold mb-4">الخدمات القانونية</h4>
            <ul className="space-y-2 text-white/80">
              <li><a href="#" className="hover:text-legal-secondary transition-colors">القانون المدني</a></li>
              <li><a href="#" className="hover:text-legal-secondary transition-colors">القانون الجنائي</a></li>
              <li><a href="#" className="hover:text-legal-secondary transition-colors">القانون التجاري</a></li>
              <li><a href="#" className="hover:text-legal-secondary transition-colors">قانون الأسرة</a></li>
              <li><a href="#" className="hover:text-legal-secondary transition-colors">القانون الإداري</a></li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">روابط سريعة</h4>
            <ul className="space-y-2 text-white/80">
              <li><a href="#services" className="hover:text-legal-secondary transition-colors">خدماتنا</a></li>
              <li><a href="#consultation" className="hover:text-legal-secondary transition-colors">استشارة قانونية</a></li>
              <li><a href="#about" className="hover:text-legal-secondary transition-colors">عن المنصة</a></li>
              <li><a href="#" className="hover:text-legal-secondary transition-colors">سياسة الخصوصية</a></li>
              <li><a href="#" className="hover:text-legal-secondary transition-colors">شروط الاستخدام</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/20 mt-12 pt-8 text-center">
          <p className="text-white/60">
            © 2024 دليل القانون المصري. جميع الحقوق محفوظة. | تطوير بواسطة فريق التطوير المتخصص
          </p>
          <p className="text-white/40 text-sm mt-2">
            هذه المنصة تقدم معلومات قانونية عامة ولا تغني عن استشارة محامٍ مرخص
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;