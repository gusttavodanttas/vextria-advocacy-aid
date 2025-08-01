import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Cliente, NovoCliente, DatabaseHookResult } from '@/types/database';

export function useClientes(): DatabaseHookResult<Cliente, NovoCliente> {
  const [data, setData] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchData = async () => {
    if (!user) {
      setData([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const { data: result, error } = await supabase
        .from('clientes')
        .select('*')
        .eq('user_id', user.id)
        .eq('deletado', false)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      setData(result || []);
      setError(null);
    } catch (err) {
      console.error('Erro ao buscar clientes:', err);
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
      toast({
        title: 'Erro ao carregar clientes',
        description: 'Não foi possível carregar a lista de clientes.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const create = async (newRecord: NovoCliente): Promise<Cliente | null> => {
    if (!user) return null;

    try {
      const { data: result, error } = await supabase
        .from('clientes')
        .insert([
          {
            ...newRecord,
            user_id: user.id,
          }
        ])
        .select()
        .single();

      if (error) throw error;

      setData(prev => [result, ...prev]);
      toast({
        title: 'Cliente criado',
        description: 'O cliente foi criado com sucesso.',
      });
      
      return result;
    } catch (err) {
      console.error('Erro ao criar cliente:', err);
      toast({
        title: 'Erro ao criar cliente',
        description: 'Não foi possível criar o cliente.',
        variant: 'destructive',
      });
      return null;
    }
  };

  const update = async (id: string, updates: Partial<Cliente>): Promise<Cliente | null> => {
    if (!user) return null;

    try {
      const { data: result, error } = await supabase
        .from('clientes')
        .update(updates)
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;

      setData(prev => prev.map(item => 
        item.id === id ? { ...item, ...result } : item
      ));

      toast({
        title: 'Cliente atualizado',
        description: 'O cliente foi atualizado com sucesso.',
      });
      
      return result;
    } catch (err) {
      console.error('Erro ao atualizar cliente:', err);
      toast({
        title: 'Erro ao atualizar cliente',
        description: 'Não foi possível atualizar o cliente.',
        variant: 'destructive',
      });
      return null;
    }
  };

  const requestDelete = async (id: string, motivo?: string): Promise<boolean> => {
    if (!user) return false;

    try {
      const recordToDelete = data.find(item => item.id === id);
      if (!recordToDelete) return false;

      const { error: updateError } = await supabase
        .from('clientes')
        .update({ deletado_pendente: true })
        .eq('id', id)
        .eq('user_id', user.id);

      if (updateError) throw updateError;

      const { error: exclusionError } = await supabase
        .from('exclusoes_pendentes')
        .insert([
          {
            user_id: user.id,
            tabela: 'clientes',
            registro_id: id,
            dados_registro: recordToDelete,
            motivo: motivo,
          }
        ]);

      if (exclusionError) throw exclusionError;

      setData(prev => prev.filter(item => item.id !== id));

      toast({
        title: 'Solicitação de exclusão enviada',
        description: 'Sua solicitação foi enviada para aprovação do administrador.',
      });
      
      return true;
    } catch (err) {
      console.error('Erro ao solicitar exclusão:', err);
      toast({
        title: 'Erro ao solicitar exclusão',
        description: 'Não foi possível processar a solicitação de exclusão.',
        variant: 'destructive',
      });
      return false;
    }
  };

  const requestMultipleDelete = async (ids: string[], motivo?: string): Promise<boolean> => {
    if (!user) return false;

    try {
      const recordsToDelete = data.filter(item => ids.includes(item.id));

      const { error: updateError } = await supabase
        .from('clientes')
        .update({ deletado_pendente: true })
        .in('id', ids)
        .eq('user_id', user.id);

      if (updateError) throw updateError;

      const exclusionRecords = recordsToDelete.map(record => ({
        user_id: user.id,
        tabela: 'clientes',
        registro_id: record.id,
        dados_registro: record,
        motivo: motivo,
      }));

      const { error: exclusionError } = await supabase
        .from('exclusoes_pendentes')
        .insert(exclusionRecords);

      if (exclusionError) throw exclusionError;

      setData(prev => prev.filter(item => !ids.includes(item.id)));

      toast({
        title: 'Solicitações de exclusão enviadas',
        description: `${ids.length} solicitação(ões) foram enviadas para aprovação.`,
      });
      
      return true;
    } catch (err) {
      console.error('Erro ao solicitar exclusões múltiplas:', err);
      toast({
        title: 'Erro ao solicitar exclusões',
        description: 'Não foi possível processar as solicitações de exclusão.',
        variant: 'destructive',
      });
      return false;
    }
  };

  useEffect(() => {
    fetchData();
  }, [user]);

  return {
    data,
    loading,
    error,
    refresh: fetchData,
    create,
    update,
    requestDelete,
    requestMultipleDelete,
    isEmpty: data.length === 0 && !loading,
  };
}