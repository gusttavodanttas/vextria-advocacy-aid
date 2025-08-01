import { useMemo } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { FeaturePermissions } from '@/types/permissions';

/**
 * Hook para gerenciar permissões granulares baseadas em roles e contexto
 * Substitui o useUserRole para um sistema mais específico
 */
export const usePermissions = (): FeaturePermissions => {
  const { user, isSuperAdmin, isAdmin, isOfficeAdmin, office, officeUser, isLoading, session } = useAuth();

  return useMemo(() => {
    // Debug logs para identificar o problema
    console.log('🔐 usePermissions Debug:', {
      user: user ? { id: user.id, email: user.email, role: user.role } : null,
      isSuperAdmin,
      isAdmin,
      isOfficeAdmin,
      isLoading,
      hasSession: !!session,
      sessionEmail: session?.user?.email,
      sessionUserMetadata: session?.user?.user_metadata
    });

    // Se ainda está carregando, retorna permissões vazias temporariamente
    if (isLoading) {
      console.log('🔐 Still loading, returning empty permissions');
      return createEmptyPermissions();
    }

    // Fallback para super admins baseado no email enquanto user não carrega
    const superAdminEmails = ['dev.jp.991@gmail.com', 'vextriahubv1@gmail.com', 'contato@vextriahub.com.br', '1266jp@gmail.com', 'joao.pedro@vextriahub.com.br'];
    if (!user && session?.user?.email && superAdminEmails.includes(session.user.email)) {
      console.log('🔐 Fallback: Super admin detected by email', session.user.email);
      return createSuperAdminPermissions();
    }

    // Se não há usuário após carregamento, nenhuma permissão
    if (!user) {
      console.log('🔐 No user after loading, returning empty permissions');
      return createEmptyPermissions();
    }

    // Super Admin tem todas as permissões
    if (isSuperAdmin) {
      console.log('🔐 Super admin permissions granted');
      return createSuperAdminPermissions();
    }

    // Admin tem permissões administrativas limitadas
    if (isAdmin) {
      console.log('🔐 Admin permissions granted');
      return createAdminPermissions();
    }

    // Office Admin tem permissões de escritório
    if (isOfficeAdmin) {
      console.log('🔐 Office admin permissions granted');
      return createOfficeAdminPermissions();
    }

    // Usuário comum tem permissões básicas
    console.log('🔐 User permissions granted');
    return createUserPermissions();
  }, [user, isSuperAdmin, isAdmin, isOfficeAdmin, office, officeUser, isLoading, session]);
};

/**
 * Cria permissões vazias (usuário não autenticado)
 */
function createEmptyPermissions(): FeaturePermissions {
  return {
    // Core Features
    canViewDashboard: false,
    canViewClients: false,
    canCreateClients: false,
    canEditClients: false,
    canDeleteClients: false,
    
    // Process Management
    canViewProcesses: false,
    canCreateProcesses: false,
    canEditProcesses: false,
    canDeleteProcesses: false,
    
    // Attendance/Service Management
    canViewAtendimentos: false,
    canCreateAtendimentos: false,
    canEditAtendimentos: false,
    canDeleteAtendimentos: false,
    
    // CRM Features
    canViewCRM: false,
    canManageCRM: false,
    
    // Calendar & Scheduling
    canViewAgenda: false,
    canManageAgenda: false,
    canViewAudiencias: false,
    canManageAudiencias: false,
    
    // Team Management
    canViewEquipe: false,
    canManageEquipe: false,
    
    // Tasks & Deadlines
    canViewTarefas: false,
    canManageTarefas: false,
    canViewPrazos: false,
    canManagePrazos: false,
    
    // Publications & Legal Research
    canViewPublicacoes: false,
    canManagePublicacoes: false,
    canViewConsultivo: false,
    canManageConsultivo: false,
    
    // Analytics & Reports
    canViewGraficos: false,
    canViewAdvancedAnalytics: false,
    
    // Financial
    canViewFinanceiro: false,
    canManageFinanceiro: false,
    
    // Goals & Targets
    canViewMetas: false,
    canManageMetas: false,
    
    // Tags & Organization
    canViewEtiquetas: false,
    canManageEtiquetas: false,
    
    // Notifications
    canViewNotificacoes: false,
    canManageNotificacoes: false,
    
    // Settings & Configuration
    canViewConfiguracoes: false,
    canManageConfiguracoes: false,
    canViewPerfil: false,
    canEditPerfil: false,
    
    // Office Management
    canViewOffice: false,
    canManageOffice: false,
    canInviteUsers: false,
    canManageOfficeUsers: false,
    canManageOfficeSettings: false,
    
    // System Administration
    canViewAdmin: false,
    canManageGlobalSettings: false,
    canManageAllOffices: false,
    canManageSubscriptions: false,
    canViewSystemMetrics: false,
    canManageSystemUsers: false,
  };
}

/**
 * Cria permissões para Super Admin (acesso total)
 */
function createSuperAdminPermissions(): FeaturePermissions {
  return {
    // Core Features
    canViewDashboard: true,
    canViewClients: true,
    canCreateClients: true,
    canEditClients: true,
    canDeleteClients: true,
    
    // Process Management
    canViewProcesses: true,
    canCreateProcesses: true,
    canEditProcesses: true,
    canDeleteProcesses: true,
    
    // Attendance/Service Management
    canViewAtendimentos: true,
    canCreateAtendimentos: true,
    canEditAtendimentos: true,
    canDeleteAtendimentos: true,
    
    // CRM Features
    canViewCRM: true,
    canManageCRM: true,
    
    // Calendar & Scheduling
    canViewAgenda: true,
    canManageAgenda: true,
    canViewAudiencias: true,
    canManageAudiencias: true,
    
    // Team Management
    canViewEquipe: true,
    canManageEquipe: true,
    
    // Tasks & Deadlines
    canViewTarefas: true,
    canManageTarefas: true,
    canViewPrazos: true,
    canManagePrazos: true,
    
    // Publications & Legal Research
    canViewPublicacoes: true,
    canManagePublicacoes: true,
    canViewConsultivo: true,
    canManageConsultivo: true,
    
    // Analytics & Reports
    canViewGraficos: true,
    canViewAdvancedAnalytics: true,
    
    // Financial
    canViewFinanceiro: true,
    canManageFinanceiro: true,
    
    // Goals & Targets
    canViewMetas: true,
    canManageMetas: true,
    
    // Tags & Organization
    canViewEtiquetas: true,
    canManageEtiquetas: true,
    
    // Notifications
    canViewNotificacoes: true,
    canManageNotificacoes: true,
    
    // Settings & Configuration
    canViewConfiguracoes: true,
    canManageConfiguracoes: true,
    canViewPerfil: true,
    canEditPerfil: true,
    
    // Office Management
    canViewOffice: true,
    canManageOffice: true,
    canInviteUsers: true,
    canManageOfficeUsers: true,
    canManageOfficeSettings: true,
    
    // System Administration
    canViewAdmin: true,
    canManageGlobalSettings: true,
    canManageAllOffices: true,
    canManageSubscriptions: true,
    canViewSystemMetrics: true,
    canManageSystemUsers: true,
  };
}

/**
 * Cria permissões para Admin (sem acesso a funcionalidades de super admin)
 */
function createAdminPermissions(): FeaturePermissions {
  return {
    // Core Features
    canViewDashboard: true,
    canViewClients: true,
    canCreateClients: true,
    canEditClients: true,
    canDeleteClients: true,
    
    // Process Management
    canViewProcesses: true,
    canCreateProcesses: true,
    canEditProcesses: true,
    canDeleteProcesses: true,
    
    // Attendance/Service Management
    canViewAtendimentos: true,
    canCreateAtendimentos: true,
    canEditAtendimentos: true,
    canDeleteAtendimentos: true,
    
    // CRM Features
    canViewCRM: true,
    canManageCRM: true,
    
    // Calendar & Scheduling
    canViewAgenda: true,
    canManageAgenda: true,
    canViewAudiencias: true,
    canManageAudiencias: true,
    
    // Team Management
    canViewEquipe: true,
    canManageEquipe: true,
    
    // Tasks & Deadlines
    canViewTarefas: true,
    canManageTarefas: true,
    canViewPrazos: true,
    canManagePrazos: true,
    
    // Publications & Legal Research
    canViewPublicacoes: true,
    canManagePublicacoes: true,
    canViewConsultivo: true,
    canManageConsultivo: true,
    
    // Analytics & Reports
    canViewGraficos: true,
    canViewAdvancedAnalytics: true,
    
    // Financial
    canViewFinanceiro: true,
    canManageFinanceiro: true,
    
    // Goals & Targets
    canViewMetas: true,
    canManageMetas: true,
    
    // Tags & Organization
    canViewEtiquetas: true,
    canManageEtiquetas: true,
    
    // Notifications
    canViewNotificacoes: true,
    canManageNotificacoes: true,
    
    // Settings & Configuration
    canViewConfiguracoes: true,
    canManageConfiguracoes: true,
    canViewPerfil: true,
    canEditPerfil: true,
    
    // Office Management
    canViewOffice: true,
    canManageOffice: true,
    canInviteUsers: true,
    canManageOfficeUsers: true,
    canManageOfficeSettings: true,
    
    // System Administration - Limitado para admin
    canViewAdmin: true,
    canManageGlobalSettings: false,
    canManageAllOffices: false,
    canManageSubscriptions: false,
    canViewSystemMetrics: false,
    canManageSystemUsers: false,
  };
}

/**
 * Cria permissões para Office Admin (gerenciamento de escritório)
 */
function createOfficeAdminPermissions(): FeaturePermissions {
  return {
    // Core Features
    canViewDashboard: true,
    canViewClients: true,
    canCreateClients: true,
    canEditClients: true,
    canDeleteClients: true,
    
    // Process Management
    canViewProcesses: true,
    canCreateProcesses: true,
    canEditProcesses: true,
    canDeleteProcesses: false, // Limitado para office admin
    
    // Attendance/Service Management
    canViewAtendimentos: true,
    canCreateAtendimentos: true,
    canEditAtendimentos: true,
    canDeleteAtendimentos: true,
    
    // CRM Features
    canViewCRM: true,
    canManageCRM: true,
    
    // Calendar & Scheduling
    canViewAgenda: true,
    canManageAgenda: true,
    canViewAudiencias: true,
    canManageAudiencias: true,
    
    // Team Management
    canViewEquipe: true,
    canManageEquipe: true,
    
    // Tasks & Deadlines
    canViewTarefas: true,
    canManageTarefas: true,
    canViewPrazos: true,
    canManagePrazos: true,
    
    // Publications & Legal Research
    canViewPublicacoes: true,
    canManagePublicacoes: true,
    canViewConsultivo: true,
    canManageConsultivo: true,
    
    // Analytics & Reports
    canViewGraficos: true,
    canViewAdvancedAnalytics: true,
    
    // Financial
    canViewFinanceiro: true,
    canManageFinanceiro: true,
    
    // Goals & Targets
    canViewMetas: true,
    canManageMetas: true,
    
    // Tags & Organization
    canViewEtiquetas: true,
    canManageEtiquetas: true,
    
    // Notifications
    canViewNotificacoes: true,
    canManageNotificacoes: true,
    
    // Settings & Configuration
    canViewConfiguracoes: true,
    canManageConfiguracoes: true,
    canViewPerfil: true,
    canEditPerfil: true,
    
    // Office Management
    canViewOffice: true,
    canManageOffice: true,
    canInviteUsers: true,
    canManageOfficeUsers: true,
    canManageOfficeSettings: true,
    
    // System Administration - Negado para office admin
    canViewAdmin: false,
    canManageGlobalSettings: false,
    canManageAllOffices: false,
    canManageSubscriptions: false,
    canViewSystemMetrics: false,
    canManageSystemUsers: false,
  };
}

/**
 * Cria permissões para usuário comum
 */
function createUserPermissions(): FeaturePermissions {
  return {
    // Core Features
    canViewDashboard: true,
    canViewClients: true,
    canCreateClients: true,
    canEditClients: true,
    canDeleteClients: false, // Usuário comum não pode excluir
    
    // Process Management
    canViewProcesses: true,
    canCreateProcesses: true,
    canEditProcesses: true,
    canDeleteProcesses: false, // Usuário comum não pode excluir
    
    // Attendance/Service Management
    canViewAtendimentos: true,
    canCreateAtendimentos: true,
    canEditAtendimentos: true,
    canDeleteAtendimentos: false, // Usuário comum não pode excluir
    
    // CRM Features
    canViewCRM: true,
    canManageCRM: false, // Apenas visualização
    
    // Calendar & Scheduling
    canViewAgenda: true,
    canManageAgenda: true,
    canViewAudiencias: true,
    canManageAudiencias: true,
    
    // Team Management
    canViewEquipe: true,
    canManageEquipe: true, // Acesso completo
    
    // Tasks & Deadlines
    canViewTarefas: true,
    canManageTarefas: true,
    canViewPrazos: true,
    canManagePrazos: true,
    
    // Publications & Legal Research
    canViewPublicacoes: true,
    canManagePublicacoes: true, // Acesso completo
    canViewConsultivo: true,
    canManageConsultivo: true,
    
    // Analytics & Reports
    canViewGraficos: true,
    canViewAdvancedAnalytics: true, // Acesso completo
    
    // Financial
    canViewFinanceiro: true,
    canManageFinanceiro: true, // Acesso completo
    
    // Goals & Targets
    canViewMetas: true,
    canManageMetas: true, // Acesso completo
    
    // Tags & Organization
    canViewEtiquetas: true,
    canManageEtiquetas: true, // Acesso completo
    
    // Notifications
    canViewNotificacoes: true,
    canManageNotificacoes: false, // Apenas visualização
    
    // Settings & Configuration
    canViewConfiguracoes: true,
    canManageConfiguracoes: false, // Apenas visualização
    canViewPerfil: true,
    canEditPerfil: true,
    
    // Office Management - Negado para usuário comum
    canViewOffice: false,
    canManageOffice: false,
    canInviteUsers: false,
    canManageOfficeUsers: false,
    canManageOfficeSettings: false,
    
    // System Administration - Negado para usuário comum
    canViewAdmin: false,
    canManageGlobalSettings: false,
    canManageAllOffices: false,
    canManageSubscriptions: false,
    canViewSystemMetrics: false,
    canManageSystemUsers: false,
  };
}