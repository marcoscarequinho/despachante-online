import { MapPin, Clock, Phone, MessageCircle, Facebook, Instagram, Youtube } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const services = [
    "Transferência de Propriedade",
    "Licenciamento Digital", 
    "CNH - Renovação",
    "Segunda Via de Documentos",
    "Conversão para GNV",
    "Registro ANTT"
  ];

  const quickLinks = [
    { label: "Início", href: "#inicio" },
    { label: "Serviços", href: "#servicos" },
    { label: "Depoimentos", href: "#depoimentos" },
    { label: "FAQ", href: "#faq" },
    { label: "Contato", href: "#contato" }
  ];

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">D</span>
              </div>
              <div>
                <h3 className="font-bold text-xl">DETRAN Digital</h3>
                <p className="text-sm text-primary-foreground/80">Despachante Marcos Carequinho</p>
                <p className="text-xs text-primary-foreground/70">Credenciado DETRAN RJ • ES • MG • SP • MS • PR</p>
              </div>
            </div>
            
            <p className="text-primary-foreground/90 mb-6 text-sm leading-relaxed">
              Despachante Marcos Carequinho, credenciado ao DETRAN nos estados RJ, SP, ES, MG, MS e PR.
              Especialista em documentação veicular com processos 100% digitais, oferecendo
              agilidade e confiança em todos os serviços.
            </p>

            <div className="flex space-x-4">
              <a 
                href="#" 
                className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center hover:bg-white/20 transition-smooth"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a 
                href="#" 
                className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center hover:bg-white/20 transition-smooth"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a 
                href="#" 
                className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center hover:bg-white/20 transition-smooth"
              >
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Services */}
          <div className="lg:col-span-1">
            <h4 className="font-bold text-lg mb-6">Nossos Serviços</h4>
            <ul className="space-y-3">
              {services.map((service, index) => (
                <li key={index}>
                  <button 
                    onClick={() => scrollToSection("#servicos")}
                    className="text-primary-foreground/90 hover:text-white text-sm transition-smooth text-left"
                  >
                    {service}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-1">
            <h4 className="font-bold text-lg mb-6">Links Rápidos</h4>
            <ul className="space-y-3">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <button 
                    onClick={() => scrollToSection(link.href)}
                    className="text-primary-foreground/90 hover:text-white text-sm transition-smooth"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="lg:col-span-1">
            <h4 className="font-bold text-lg mb-6">Contato</h4>
            
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-primary-foreground/80 flex-shrink-0 mt-0.5" />
                <div className="text-sm">
                  <p className="text-primary-foreground/90">Av. Getúlio Vargas, 1575</p>
                  <p className="text-primary-foreground/80">Centro, Araruama – RJ</p>
                  <p className="text-primary-foreground/80">28979-129</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-primary-foreground/80 flex-shrink-0" />
                <div className="text-sm">
                  <p className="text-primary-foreground/90">Segunda a Sexta</p>
                  <p className="text-primary-foreground/80">9:30h às 17h</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-primary-foreground/80 flex-shrink-0" />
                <div className="text-sm">
                  <p className="text-primary-foreground/90">(22) 99209-0682</p>
                  <p className="text-primary-foreground/80">WhatsApp e Telefone</p>
                </div>
              </div>
            </div>

            <div className="mt-6 space-y-3">
              <button
                onClick={() => window.open("https://wa.me/5522992090682", "_blank")}
                className="w-full bg-success-green hover:bg-success-green/90 text-white px-4 py-2 rounded-lg text-sm font-medium transition-smooth flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-4 h-4" />
                WhatsApp
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-primary-foreground/20">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col lg:flex-row justify-between items-center gap-4">
            <div className="text-sm text-primary-foreground/80 text-center lg:text-left">
              <p>© {currentYear} DETRAN Digital - Despachante Marcos Carequinho</p>
              <p className="mt-1">CNPJ: 00.000.000/0001-00</p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 text-sm text-center">
              <button className="text-primary-foreground/80 hover:text-white transition-smooth">
                Termos de Uso
              </button>
              <button className="text-primary-foreground/80 hover:text-white transition-smooth">
                Política de Privacidade
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;