import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Users, 
  FileText, 
  Clock, 
  TrendingUp, 
  Plus,
  MoreHorizontal 
} from "lucide-react";

const Dashboard = () => {
  const stats = [
    {
      label: "Clientes Ativos",
      value: "127",
      change: "+12%",
      icon: Users,
      color: "text-primary"
    },
    {
      label: "Casos em Andamento",
      value: "43",
      change: "+8%",
      icon: FileText,
      color: "text-accent"
    },
    {
      label: "Tarefas Pendentes",
      value: "18",
      change: "-5%",
      icon: Clock,
      color: "text-destructive"
    },
    {
      label: "Taxa de Resolução",
      value: "94%",
      change: "+3%",
      icon: TrendingUp,
      color: "text-primary"
    }
  ];

  const recentCases = [
    {
      id: "001",
      client: "Maria Silva Santos",
      type: "Direito Trabalhista",
      status: "Em Análise",
      priority: "Alta",
      date: "2024-01-28"
    },
    {
      id: "002", 
      client: "João Pedro Oliveira",
      type: "Direito Civil",
      status: "Aguardando Documentos",
      priority: "Média",
      date: "2024-01-27"
    },
    {
      id: "003",
      client: "Ana Carolina Lima",
      type: "Direito Familiar",
      status: "Em Negociação",
      priority: "Baixa",
      date: "2024-01-26"
    }
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">Visão geral do seu escritório</p>
        </div>
        <Button variant="hero">
          <Plus className="mr-2 h-4 w-4" />
          Novo Caso
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="p-6 bg-gradient-card border-0 shadow-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  {stat.label}
                </p>
                <p className="text-2xl font-bold text-foreground">
                  {stat.value}
                </p>
                <p className={`text-sm ${stat.change.startsWith('+') ? 'text-primary' : 'text-destructive'}`}>
                  {stat.change} vs mês anterior
                </p>
              </div>
              <stat.icon className={`h-8 w-8 ${stat.color}`} />
            </div>
          </Card>
        ))}
      </div>

      {/* Recent Cases */}
      <Card className="bg-gradient-card border-0 shadow-card">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-foreground">Casos Recentes</h2>
            <Button variant="outline" size="sm">
              Ver Todos
            </Button>
          </div>
          
          <div className="space-y-4">
            {recentCases.map((case_item) => (
              <div key={case_item.id} className="flex items-center justify-between p-4 rounded-lg bg-background border border-border">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <FileText className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium text-foreground">{case_item.client}</h3>
                    <p className="text-sm text-muted-foreground">{case_item.type}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <p className="text-sm font-medium text-foreground">{case_item.status}</p>
                    <p className="text-xs text-muted-foreground">{case_item.date}</p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    case_item.priority === 'Alta' ? 'bg-destructive/10 text-destructive' :
                    case_item.priority === 'Média' ? 'bg-accent/10 text-accent' :
                    'bg-muted text-muted-foreground'
                  }`}>
                    {case_item.priority}
                  </span>
                  <Button variant="ghost" size="icon">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Dashboard;