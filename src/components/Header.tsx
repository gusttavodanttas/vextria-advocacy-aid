import { Button } from "@/components/ui/button";
import { Bell, Search, User } from "lucide-react";

const Header = () => {
  return (
    <header className="bg-background border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <h1 className="text-2xl font-bold text-primary">VextriaHub</h1>
            </div>
            <nav className="hidden md:ml-10 md:flex space-x-8">
              <a href="#" className="text-foreground hover:text-primary transition-smooth">
                Dashboard
              </a>
              <a href="#" className="text-foreground hover:text-primary transition-smooth">
                Clientes
              </a>
              <a href="#" className="text-foreground hover:text-primary transition-smooth">
                Casos
              </a>
              <a href="#" className="text-foreground hover:text-primary transition-smooth">
                Relatórios
              </a>
            </nav>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <input
                type="search"
                placeholder="Buscar..."
                className="pl-10 pr-4 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <User className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;