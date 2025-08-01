import { useState } from "react";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Dashboard from "@/components/Dashboard";

const Index = () => {
  const [showDashboard, setShowDashboard] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      {showDashboard ? (
        <Dashboard />
      ) : (
        <div className="relative">
          <Hero />
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
            <button
              onClick={() => setShowDashboard(true)}
              className="bg-white/20 backdrop-blur-sm text-white px-6 py-2 rounded-full border border-white/30 hover:bg-white/30 transition-smooth"
            >
              Ver Dashboard
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Index;
