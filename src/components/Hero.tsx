import { Button } from "@/components/ui/button";
import { ArrowRight, Shield, Users, FileText } from "lucide-react";
import heroImage from "@/assets/hero-legal.jpg";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroImage}
          alt="Professional Legal Tech"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-primary/70"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
        <h1 className="text-4xl md:text-6xl font-bold mb-6">
          Atendimento Profissional
          <span className="block text-accent">Para Advogados</span>
        </h1>
        
        <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto opacity-90">
          Gerencie seus clientes, casos e comunicações em uma plataforma única, 
          profissional e segura, desenvolvida especialmente para escritórios de advocacia.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Button variant="hero" size="lg" className="text-lg px-8 py-4">
            Começar Agora
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
          <Button variant="outline" size="lg" className="text-lg px-8 py-4 bg-white/10 backdrop-blur-sm border-white/30 text-white hover:bg-white/20">
            Agendar Demo
          </Button>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
            <Shield className="h-12 w-12 text-accent mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Segurança Total</h3>
            <p className="text-white/80">Dados protegidos com criptografia de nível bancário</p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
            <Users className="h-12 w-12 text-accent mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Gestão de Clientes</h3>
            <p className="text-white/80">Organize e acompanhe todos os seus clientes</p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
            <FileText className="h-12 w-12 text-accent mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Controle de Casos</h3>
            <p className="text-white/80">Gerencie processos e documentos em um só lugar</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;