
import { Calendar, Clock, Users, MapPin, Plus, Trash2, CalendarCheck, AlertCircle } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { DeleteConfirmDialog } from "@/components/ui/DeleteConfirmDialog";
import { NovoCompromissoDialog } from "@/components/Agenda/NovoCompromissoDialog";
import { useMultiSelect } from "@/hooks/useMultiSelect";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FullScreenCalendar } from "@/components/ui/fullscreen-calendar";
import React, { useState } from "react";
import { format, isToday, addDays, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay } from "date-fns";
import { ptBR } from "date-fns/locale";

// Definição dos tipos de eventos
type EventType = "audiencia" | "reuniao" | "prazo" | "tarefa";

type EventStatus = "confirmado" | "pendente" | "cancelado";

interface AgendaEvent {
  id: number;
  name: string;
  time: string;
  datetime: string;
  type: EventType;
  client: string;
  location: string;
  status: EventStatus;
}

interface AgendaDay {
  day: Date;
  events: AgendaEvent[];
}

// Função para gerar eventos dinamicamente
const generateEventsForMonth = (targetDate: Date): AgendaDay[] => {
  const startMonth = startOfMonth(targetDate);
  const endMonth = endOfMonth(targetDate);
  const daysInMonth = eachDayOfInterval({ start: startMonth, end: endMonth });
  
  const eventTemplates = [
    {
      names: ["Audiência de Conciliação", "Audiência de Instrução", "Audiência Trabalhista", "Audiência Criminal"],
      type: "audiencia" as const,
      locations: ["Fórum Central - Sala 205", "TRT - 15ª Vara", "Tribunal de Justiça", "Vara Criminal"],
      clients: ["João Silva vs. Empresa XYZ", "Maria Santos vs. Construtora", "Processo Trabalhista", "Ação Penal"]
    },
    {
      names: ["Reunião com Cliente", "Reunião de Planejamento", "Reunião com Sócios", "Reunião de Estratégia"],
      type: "reuniao" as const,
      locations: ["Escritório - Sala de Reunião", "Escritório Principal", "Home Office", "Cliente - Sede"],
      clients: ["Maria Santos", "Tech Solutions Ltda", "Planejamento Estratégico", "Consultoria Jurídica"]
    },
    {
      names: ["Prazo Recursal", "Protocolo de Petição", "Entrega de Documentos", "Prazo Processual"],
      type: "prazo" as const,
      locations: ["Protocolo Digital", "Cartório", "Tribunal", "Secretaria Judicial"],
      clients: ["Processo 1001234-56.2025", "Ação Civil", "Recurso Trabalhista", "Mandado de Segurança"]
    },
    {
      names: ["Análise de Contrato", "Pesquisa Jurisprudencial", "Elaboração de Petição", "Revisão Processual"],
      type: "tarefa" as const,
      locations: ["Home Office", "Escritório", "Biblioteca Jurídica", "Sala de Estudos"],
      clients: ["ABC Consultoria", "Empresa Municipal", "Escritório Parceiro", "Cliente Corporativo"]
    }
  ];

  const times = ["08:00", "09:00", "10:30", "14:00", "14:30", "15:00", "16:00", "16:30", "17:00"];
  const statuses: EventStatus[] = ["confirmado", "pendente", "cancelado"];

  return daysInMonth.map((day, dayIndex) => {
    const events: AgendaEvent[] = [];
    
    // Gera eventos aleatoriamente (aproximadamente 30% dos dias terão eventos)
    if (Math.random() < 0.3) {
      const numEvents = Math.floor(Math.random() * 3) + 1; // 1 a 3 eventos por dia
      
      for (let i = 0; i < numEvents; i++) {
        const template = eventTemplates[Math.floor(Math.random() * eventTemplates.length)];
        const eventId = dayIndex * 100 + i + 1;
        
        events.push({
          id: eventId,
          name: template.names[Math.floor(Math.random() * template.names.length)],
          time: times[Math.floor(Math.random() * times.length)],
          datetime: day.toISOString(),
          type: template.type,
          client: template.clients[Math.floor(Math.random() * template.clients.length)],
          location: template.locations[Math.floor(Math.random() * template.locations.length)],
          status: statuses[Math.floor(Math.random() * statuses.length)]
        });
      }
    }
    
    return {
      day,
      events: events.sort((a, b) => a.time.localeCompare(b.time))
    };
  });
};

// Dados iniciais para hoje
const today = new Date();
const initialMockData = generateEventsForMonth(today);

// Adicionar alguns eventos específicos para hoje para demonstração
const todayEvents: AgendaEvent[] = [
  {
    id: 999,
    name: "Audiência de Conciliação",
    time: "09:00",
    datetime: today.toISOString(),
    type: "audiencia",
    client: "João Silva vs. Empresa XYZ",
    location: "Fórum Central - Sala 205",
    status: "confirmado",
  },
  {
    id: 998,
    name: "Reunião com Cliente",
    time: "14:30",
    datetime: today.toISOString(),
    type: "reuniao",
    client: "Maria Santos",
    location: "Escritório - Sala de Reunião",
    status: "confirmado",
  }
];

// Adiciona eventos de hoje aos dados mock
const todayData = initialMockData.find(day => isSameDay(day.day, today));
if (todayData) {
  todayData.events = [...todayEvents, ...todayData.events].sort((a, b) => a.time.localeCompare(b.time));
}

// Cache para armazenar dados gerados por mês
const monthDataCache = new Map<string, AgendaDay[]>();
monthDataCache.set(format(today, 'yyyy-MM'), initialMockData);

// Função para obter dados de um mês específico
const getEventsForMonth = (date: Date): AgendaDay[] => {
  const monthKey = format(date, 'yyyy-MM');
  
  if (!monthDataCache.has(monthKey)) {
    monthDataCache.set(monthKey, generateEventsForMonth(date));
  }
  
  return monthDataCache.get(monthKey) || [];
};

const getTypeColor = (type: string) => {
  switch (type) {
    case "audiencia": return "bg-red-100 text-red-800 border-red-200";
    case "reuniao": return "bg-blue-100 text-blue-800 border-blue-200";
    case "prazo": return "bg-orange-100 text-orange-800 border-orange-200";
    case "tarefa": return "bg-green-100 text-green-800 border-green-200";
    default: return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "confirmado": return "bg-green-100 text-green-800";
    case "pendente": return "bg-yellow-100 text-yellow-800";
    case "cancelado": return "bg-red-100 text-red-800";
    default: return "bg-gray-100 text-gray-800";
  }
};

const getTypeIcon = (type: string) => {
  switch (type) {
    case "audiencia": return <Users className="h-4 w-4" />;
    case "reuniao": return <Calendar className="h-4 w-4" />;
    case "prazo": return <AlertCircle className="h-4 w-4" />;
    case "tarefa": return <CalendarCheck className="h-4 w-4" />;
    default: return <Calendar className="h-4 w-4" />;
  }
};

export default function Agenda() {
  const { toast } = useToast();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [novoCompromissoOpen, setNovoCompromissoOpen] = useState(false);
  const [selectedDateForNew, setSelectedDateForNew] = useState<Date>(new Date());
  const [agendaData, setAgendaData] = useState(initialMockData);
  const [selectedEvent, setSelectedEvent] = useState<AgendaEvent | null>(null);
  const [currentViewMonth, setCurrentViewMonth] = useState(today);
  
  const todayEvents = agendaData.find(day => isSameDay(day.day, today))?.events || [];
  const multiSelect = useMultiSelect<AgendaEvent>(todayEvents);

  // Callback para quando o mês muda no calendário
  const handleMonthChange = React.useCallback((date: Date) => {
    setCurrentViewMonth(date);
    
    // Carregar dados do mês se não existirem
    const monthKey = format(date, 'yyyy-MM');
    if (!monthDataCache.has(monthKey)) {
      const newMonthData = generateEventsForMonth(date);
      monthDataCache.set(monthKey, newMonthData);
      
      // Adicionar novos dados ao estado se não estiverem presentes
      setAgendaData(prev => {
        const existingMonthData = prev.filter(day => 
          format(day.day, 'yyyy-MM') === monthKey
        );
        
        if (existingMonthData.length === 0) {
          return [...prev, ...newMonthData].sort((a, b) => a.day.getTime() - b.day.getTime());
        }
        
        return prev;
      });
    }
  }, []);

  // Filtrar dados para o mês atual visualizado
  const currentMonthData = React.useMemo(() => {
    const monthKey = format(currentViewMonth, 'yyyy-MM');
    return agendaData.filter(day => format(day.day, 'yyyy-MM') === monthKey);
  }, [agendaData, currentViewMonth]);

  const handleDeleteSelected = () => {
    const selectedItems = multiSelect.getSelectedItems();
    const pastEvents = selectedItems.filter(event => {
      const eventDate = new Date();
      eventDate.setHours(parseInt(event.time.split(':')[0]), parseInt(event.time.split(':')[1]));
      return eventDate < new Date();
    });
    
    if (pastEvents.length > 0) {
      toast({
        title: "Não é possível excluir",
        description: "Eventos passados não podem ser excluídos.",
        variant: "destructive",
      });
      return;
    }
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    setIsDeleting(true);
    try {
      const selectedItems = multiSelect.getSelectedItems();
      const selectedIds = selectedItems.map(item => item.id);
      
      setAgendaData(prev => {
        const newData = [...prev];
        const todayIndex = newData.findIndex(day => isSameDay(day.day, today));
        if (todayIndex !== -1) {
          newData[todayIndex].events = newData[todayIndex].events.filter(event => !selectedIds.includes(event.id));
        }
        return newData;
      });
      
      toast({
        title: "Compromissos excluídos",
        description: `${selectedItems.length} compromisso(s) foram excluído(s) com sucesso.`,
      });
      multiSelect.clearSelection();
    } catch (error) {
      toast({
        title: "Erro ao excluir",
        description: "Ocorreu um erro ao excluir os compromissos.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
      setDeleteDialogOpen(false);
    }
  };

  const handleEventClick = (event: AgendaEvent) => {
    setSelectedEvent(event);
    toast({
      title: event.name,
      description: `${event.time} - ${event.client}`,
    });
  };

  const handleNewEvent = (date: Date) => {
    setSelectedDateForNew(date);
    setNovoCompromissoOpen(true);
  };

  const todayEventsCount = agendaData.find(day => isSameDay(day.day, today))?.events.length || 0;
  const weekEventsCount = agendaData.reduce((total, day) => total + day.events.length, 0);
  const audienciasCount = agendaData.flatMap(day => day.events).filter(c => c.type === 'audiencia').length;
  const reunioesCount = agendaData.flatMap(day => day.events).filter(c => c.type === 'reuniao').length;

  return (
    <div className="flex flex-col h-full">
      <div className="p-6 border-b">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Calendar className="h-8 w-8 text-primary" />
              <h1 className="text-3xl font-bold">Agenda</h1>
            </div>
            <div className="flex gap-2">
              {!multiSelect.isNoneSelected && (
                <Button
                  variant="destructive"
                  onClick={handleDeleteSelected}
                  className="flex items-center gap-2"
                >
                  <Trash2 className="h-4 w-4" />
                  Excluir Selecionados ({multiSelect.selectedCount})
                </Button>
              )}
              <Button onClick={() => handleNewEvent(new Date())}>
                <Plus className="h-4 w-4 mr-2" />
                Novo Compromisso
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Hoje</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{todayEventsCount}</div>
                <p className="text-xs text-muted-foreground">compromissos</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Esta Semana</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{weekEventsCount}</div>
                <p className="text-xs text-muted-foreground">eventos agendados</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Audiências</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{audienciasCount}</div>
                <p className="text-xs text-muted-foreground">próximas</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Reuniões</CardTitle>
                <MapPin className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{reunioesCount}</div>
                <p className="text-xs text-muted-foreground">esta semana</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <div className="flex-1 flex">
        <Tabs defaultValue="calendar" className="flex-1 flex flex-col">
          <div className="border-b px-6">
            <TabsList className="grid w-full max-w-md grid-cols-3">
              <TabsTrigger value="calendar">Calendário</TabsTrigger>
              <TabsTrigger value="list">Lista</TabsTrigger>
              <TabsTrigger value="agenda">Agenda</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="calendar" className="flex-1 m-0">
            <FullScreenCalendar 
              data={currentMonthData}
              onEventClick={handleEventClick}
              onNewEvent={handleNewEvent}
              onMonthChange={handleMonthChange}
            />
          </TabsContent>

          <TabsContent value="list" className="flex-1 p-6">
            <div className="max-w-7xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Hoje - {format(today, "d 'de' MMMM 'de' yyyy", { locale: ptBR })}</CardTitle>
                    <CardDescription>Seus compromissos de hoje</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                                         {todayEvents.length > 0 && (
                      <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                        <div className="flex items-center gap-3">
                          <Checkbox
                            checked={multiSelect.isAllSelected}
                            onCheckedChange={() => 
                              multiSelect.isAllSelected ? multiSelect.clearSelection() : multiSelect.selectAll()
                            }
                          />
                          <span className="text-sm text-muted-foreground">
                            {multiSelect.selectedCount > 0 ? (
                                                             `${multiSelect.selectedCount} de ${todayEvents.length} selecionado(s)`
                            ) : (
                              "Selecionar todos"
                            )}
                          </span>
                        </div>
                        {multiSelect.selectedCount > 0 && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={multiSelect.clearSelection}
                          >
                            Limpar seleção
                          </Button>
                        )}
                      </div>
                    )}
                                         {todayEvents.map((event) => (
                      <div key={event.id} className={`flex items-start space-x-3 p-4 border rounded-lg transition-all duration-200 ${
                        multiSelect.isSelected(event.id) ? "ring-2 ring-primary" : ""
                      }`}>
                        <Checkbox
                          checked={multiSelect.isSelected(event.id)}
                          onCheckedChange={() => multiSelect.toggleItem(event.id)}
                        />
                        <div className="flex items-center gap-2">
                          {getTypeIcon(event.type)}
                          <div className="text-sm font-medium text-primary">
                            {event.time}
                          </div>
                        </div>
                        <div className="flex-1">
                          <div className="font-medium text-sm">{event.name}</div>
                          <div className="text-sm text-gray-500">{event.client}</div>
                          <div className="flex items-center text-xs text-gray-400 mt-1">
                            <MapPin className="h-3 w-3 mr-1" />
                            {event.location}
                          </div>
                          <div className="flex items-center gap-2 mt-2">
                            <Badge className={`${getTypeColor(event.type)} text-xs`}>
                              {event.type}
                            </Badge>
                            <Badge className={`${getStatusColor(event.status)} text-xs`}>
                              {event.status}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    ))}
                                         {todayEvents.length === 0 && (
                      <div className="text-center py-8 text-muted-foreground">
                        <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>Nenhum compromisso para hoje</p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Próximos Compromissos</CardTitle>
                    <CardDescription>Agenda da próxima semana</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {agendaData.flatMap(day => day.events).slice(0, 10).map((compromisso) => (
                      <div key={compromisso.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent/50 transition-colors">
                        <div className="flex items-center gap-3">
                          {getTypeIcon(compromisso.type)}
                          <div>
                            <div className="font-medium text-sm">{compromisso.name}</div>
                            <div className="text-sm text-gray-500">{compromisso.client}</div>
                            <div className="text-xs text-gray-400">
                              {format(new Date(compromisso.datetime), "d 'de' MMM", { locale: ptBR })} às {compromisso.time}
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-1">
                          <Badge className={getStatusColor(compromisso.status)}>
                            {compromisso.status}
                          </Badge>
                          <Badge variant="outline" className={getTypeColor(compromisso.type)}>
                            {compromisso.type}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="agenda" className="flex-1 p-6">
            <div className="max-w-4xl mx-auto">
              <Card>
                <CardHeader>
                  <CardTitle>Agenda Completa</CardTitle>
                  <CardDescription>Visão detalhada de todos os compromissos</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {agendaData.map((day, index) => (
                      <div key={index} className="border-l-4 border-primary/20 pl-4">
                        <h3 className="font-semibold text-lg mb-3">
                          {format(day.day, "EEEE, d 'de' MMMM", { locale: ptBR })}
                          {isToday(day.day) && (
                            <Badge className="ml-2 bg-primary/10 text-primary">Hoje</Badge>
                          )}
                        </h3>
                        <div className="space-y-3">
                          {day.events.map((event) => (
                            <div 
                              key={event.id} 
                              className="flex items-center gap-4 p-3 bg-card border rounded-lg hover:shadow-md transition-all cursor-pointer"
                              onClick={() => handleEventClick(event)}
                            >
                              <div className="flex items-center gap-2">
                                {getTypeIcon(event.type)}
                                <span className="font-mono text-sm font-medium">{event.time}</span>
                              </div>
                              <div className="flex-1">
                                <div className="font-medium">{event.name}</div>
                                <div className="text-sm text-muted-foreground">{event.client}</div>
                                {event.location && (
                                  <div className="flex items-center text-xs text-muted-foreground mt-1">
                                    <MapPin className="h-3 w-3 mr-1" />
                                    {event.location}
                                  </div>
                                )}
                              </div>
                              <div className="flex flex-col items-end gap-1">
                                <Badge className={getStatusColor(event.status)}>
                                  {event.status}
                                </Badge>
                                <Badge variant="outline" className={getTypeColor(event.type)}>
                                  {event.type}
                                </Badge>
                              </div>
                            </div>
                          ))}
                          {day.events.length === 0 && (
                            <p className="text-sm text-muted-foreground italic pl-8">
                              Nenhum compromisso agendado
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleConfirmDelete}
        title="Excluir Compromissos"
        description={`Tem certeza que deseja excluir ${multiSelect.selectedCount} compromisso(s)? Esta ação não pode ser desfeita.`}
        isLoading={isDeleting}
      />
      
      <NovoCompromissoDialog
        open={novoCompromissoOpen}
        onOpenChange={setNovoCompromissoOpen}
        selectedDate={selectedDateForNew}
      />
    </div>
  );
}
