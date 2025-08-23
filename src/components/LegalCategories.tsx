import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Scale, 
  Home, 
  Briefcase, 
  Users, 
  Shield, 
  Gavel,
  FileText,
  Building
} from "lucide-react";

const categories = [
  {
    icon: Scale,
    title: "القانون المدني",
    description: "العقود، الالتزامات، الحقوق العينية، والمسؤولية المدنية",
    color: "legal-primary"
  },
  {
    icon: Gavel,
    title: "القانون الجنائي",
    description: "الجرائم، العقوبات، الإجراءات الجنائية، والدفاع",
    color: "legal-accent"
  },
  {
    icon: Briefcase,
    title: "القانون التجاري",
    description: "الشركات، التجارة الإلكترونية، الملكية الفكرية، والإفلاس",
    color: "legal-secondary"
  },
  {
    icon: Users,
    title: "قانون الأسرة",
    description: "الزواج، الطلاق، الحضانة، الميراث، والأحوال الشخصية",
    color: "legal-primary"
  },
  {
    icon: Building,
    title: "القانون الإداري",
    description: "الخدمة المدنية، المناقصات، التراخيص، والقرارات الإدارية",
    color: "legal-accent"
  },
  {
    icon: Shield,
    title: "القانون الدستوري",
    description: "الحقوق والحريات، السلطات العامة، والرقابة الدستورية",
    color: "legal-secondary"
  },
  {
    icon: Home,
    title: "قانون العمل",
    description: "عقود العمل، الأجور، التأمينات الاجتماعية، والنقابات",
    color: "legal-primary"
  },
  {
    icon: FileText,
    title: "قوانين أخرى",
    description: "القانون البيئي، قانون الضرائب، وقوانين متخصصة أخرى",
    color: "legal-accent"
  }
];

const LegalCategories = () => {
  return (
    <section id="services" className="py-20 bg-legal-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4 text-legal-primary">
            مجالات القانون المصري
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            نغطي جميع فروع القانون المصري بخبرة متخصصة وتحديث مستمر للقوانين والاجتهادات
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category, index) => {
            const IconComponent = category.icon;
            
            return (
              <Card 
                key={index}
                className="p-6 text-center hover:shadow-elegant transition-all duration-300 hover:-translate-y-2 group border border-legal-primary/10"
              >
                <div className={`inline-flex p-4 rounded-2xl bg-${category.color}/10 mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <IconComponent className={`w-8 h-8 text-${category.color}`} />
                </div>
                
                <h3 className="text-lg font-semibold mb-3 text-legal-primary">
                  {category.title}
                </h3>
                
                <p className="text-muted-foreground text-sm mb-4 leading-relaxed">
                  {category.description}
                </p>
                
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full hover:bg-legal-primary hover:text-white transition-all duration-300"
                >
                  استشر الآن
                </Button>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default LegalCategories;