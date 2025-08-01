import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useOfficeManagement } from '@/hooks/useOfficeManagement';
import { useToast } from '@/hooks/use-toast';
import { Building2, Plus, Edit, Users, Settings, Eye, Trash2, Search } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import type { NovoOffice } from '@/types/database';

export const OfficeManagement: React.FC = () => {
  const { offices, loading, createOffice, updateOffice, deactivateOffice, refresh } = useOfficeManagement();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [planFilter, setPlanFilter] = useState<string>('all');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingOffice, setEditingOffice] = useState<any>(null);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState<NovoOffice>({
    name: '',
    email: '',
    phone: '',
    address: '',
    plan: 'free',
    max_users: 5,
    active: true,
    logo_url: null,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      if (editingOffice) {
        const updated = await updateOffice(editingOffice.id, formData);
        if (updated) {
          toast({
            title: "Escritório atualizado",
            description: `O escritório "${formData.name}" foi atualizado com sucesso.`,
          });
        }
      } else {
        const created = await createOffice(formData);
        if (created) {
          toast({
            title: "Escritório criado",
            description: `O escritório "${formData.name}" foi criado com sucesso.`,
          });
        }
      }
      
      setDialogOpen(false);
      resetForm();
      refresh();
    } catch (error) {
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao salvar o escritório.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      address: '',
      plan: 'free',
      max_users: 5,
      active: true,
      logo_url: null,
    });
    setEditingOffice(null);
  };

  const handleEdit = (office: any) => {
    setEditingOffice(office);
    setFormData({
      name: office.name,
      email: office.email || '',
      phone: office.phone || '',
      address: office.address || '',
      plan: office.plan,
      max_users: office.max_users,
      active: office.active,
      logo_url: office.logo_url,
    });
    setDialogOpen(true);
  };

  const handleDeactivate = async (officeId: string, officeName: string) => {
    if (confirm(`Tem certeza que deseja desativar o escritório "${officeName}"?`)) {
      const success = await deactivateOffice(officeId);
      if (success) {
        toast({
          title: "Escritório desativado",
          description: `O escritório "${officeName}" foi desativado.`,
        });
        refresh();
      }
    }
  };

  // Filtros
  const filteredOffices = offices.filter(office => {
    const matchesSearch = office.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (office.email && office.email.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = statusFilter === 'all' || 
                         (statusFilter === 'active' && office.active) ||
                         (statusFilter === 'inactive' && !office.active);
    const matchesPlan = planFilter === 'all' || office.plan === planFilter;
    
    return matchesSearch && matchesStatus && matchesPlan;
  });

  const getPlanDisplayName = (plan: string) => {
    const names: Record<string, string> = {
      free: 'Gratuito',
      basic: 'Básico',
      professional: 'Profissional',
      enterprise: 'Empresarial',
    };
    return names[plan] || plan;
  };

  const getPlanBadgeVariant = (plan: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      free: 'outline',
      basic: 'secondary',
      professional: 'default',
      enterprise: 'destructive',
    };
    return variants[plan] || 'outline';
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando escritórios...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header e controles */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-semibold">Gerenciar Escritórios</h2>
          <p className="text-sm text-muted-foreground">
            {offices.length} escritório(s) cadastrado(s)
          </p>
        </div>
        
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm} className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Novo Escritório
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>
                {editingOffice ? 'Editar Escritório' : 'Novo Escritório'}
              </DialogTitle>
              <DialogDescription>
                {editingOffice 
                  ? 'Atualize as informações do escritório.'
                  : 'Preencha os dados do novo escritório.'
                }
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Nome do escritório"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="contato@escritorio.com"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phone">Telefone</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="(11) 99999-9999"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="address">Endereço</Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="Endereço do escritório"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="plan">Plano</Label>
                  <Select 
                    value={formData.plan} 
                    onValueChange={(value: any) => setFormData({ ...formData, plan: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="free">Gratuito</SelectItem>
                      <SelectItem value="basic">Básico</SelectItem>
                      <SelectItem value="professional">Profissional</SelectItem>
                      <SelectItem value="enterprise">Empresarial</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="max_users">Max. Usuários</Label>
                  <Input
                    id="max_users"
                    type="number"
                    min="1"
                    value={formData.max_users}
                    onChange={(e) => setFormData({ ...formData, max_users: parseInt(e.target.value) || 1 })}
                  />
                </div>
              </div>
              
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit" disabled={submitting}>
                  {submitting ? 'Salvando...' : (editingOffice ? 'Atualizar' : 'Criar')}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Filtros</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="search">Buscar</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Nome ou email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="active">Ativos</SelectItem>
                  <SelectItem value="inactive">Inativos</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="plan-filter">Plano</Label>
              <Select value={planFilter} onValueChange={setPlanFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="free">Gratuito</SelectItem>
                  <SelectItem value="basic">Básico</SelectItem>
                  <SelectItem value="professional">Profissional</SelectItem>
                  <SelectItem value="enterprise">Empresarial</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista de escritórios */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Escritórios ({filteredOffices.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Plano</TableHead>
                  <TableHead>Usuários</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Criado em</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOffices.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      <Building2 className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
                      <p className="text-muted-foreground">
                        {searchTerm || statusFilter !== 'all' || planFilter !== 'all'
                          ? 'Nenhum escritório encontrado com os filtros aplicados.'
                          : 'Nenhum escritório cadastrado ainda.'
                        }
                      </p>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredOffices.map((office) => (
                    <TableRow key={office.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <Building2 className="h-4 w-4 text-primary" />
                          {office.name}
                        </div>
                      </TableCell>
                      <TableCell>{office.email || '-'}</TableCell>
                      <TableCell>
                        <Badge variant={getPlanBadgeVariant(office.plan)}>
                          {getPlanDisplayName(office.plan)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          {(office as any).users?.length || 0}/{office.max_users}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={office.active ? "default" : "secondary"}>
                          {office.active ? 'Ativo' : 'Inativo'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {format(new Date(office.created_at), 'dd/MM/yyyy', { locale: ptBR })}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(office)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          {office.active && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeactivate(office.id, office.name)}
                              className="text-destructive hover:text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};