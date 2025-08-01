# Debug Report - Problema no Checkout Stripe

## Análise do Problema

Após investigação detalhada do código, identifiquei **3 abordagens principais** para resolver o problema do checkout:

## 🔍 Possíveis Causas Identificadas

### 1. **Variáveis de Ambiente Não Configuradas** (MAIS PROVÁVEL)
- **Problema**: Não existe arquivo `.env` ou `.env.local` no projeto
- **Evidência**: Apenas `.env.example` encontrado, variáveis não configuradas
- **Impacto**: Funções edge do Supabase falham por falta de `STRIPE_SECRET_KEY`

### 2. **Configuração Incorreta das Chaves Stripe**
- **Problema**: Inconsistência entre frontend e backend na nomenclatura das variáveis
- **Evidência**: Frontend usa `VITE_STRIPE_SECRET_KEY`, backend usa `STRIPE_SECRET_KEY`
- **Impacto**: Autenticação falha nas chamadas da API Stripe

### 3. **Problemas na Função Edge create-checkout**
- **Problema**: Mapeamento incorreto de produtos ou falha na criação da sessão
- **Evidência**: Função usa IDs de produtos hardcoded que podem estar incorretos
- **Impacto**: Checkout session não é criada corretamente

## 🎯 Abordagem Escolhida: **Configuração Completa das Variáveis de Ambiente**

### Por que esta abordagem?
1. **Causa raiz**: Sem variáveis de ambiente, nada funciona
2. **Impacto máximo**: Resolve múltiplos problemas de uma vez
3. **Baixo risco**: Não altera código existente
4. **Fácil validação**: Pode ser testado imediatamente

## 🔧 Plano de Implementação

### Fase 1: Configurar Variáveis de Ambiente
1. Criar arquivo `.env.local` com chaves Stripe reais
2. Configurar variáveis no Supabase para funções edge
3. Validar configuração com teste simples

### Fase 2: Verificar Configuração Stripe
1. Validar produtos e preços no dashboard Stripe
2. Confirmar webhooks configurados
3. Testar autenticação das APIs

### Fase 3: Debug e Testes
1. Adicionar logs detalhados nas funções edge
2. Testar fluxo completo de checkout
3. Validar redirecionamentos e callbacks

## 📋 Checklist de Implementação

### ✅ Variáveis de Ambiente Necessárias
- [ ] `VITE_STRIPE_PUBLISHABLE_KEY` (frontend)
- [ ] `STRIPE_SECRET_KEY` (backend/edge functions)
- [ ] `STRIPE_WEBHOOK_SECRET` (webhooks)
- [ ] `SUPABASE_URL` (edge functions)
- [ ] `SUPABASE_SERVICE_ROLE_KEY` (edge functions)
- [ ] `SUPABASE_ANON_KEY` (edge functions)

### ✅ Configuração Stripe Dashboard
- [ ] Produtos criados com IDs corretos
- [ ] Preços configurados
- [ ] Webhooks configurados para URL correta
- [ ] Chaves de API ativas

### ✅ Testes de Validação
- [ ] Função `create-checkout` responde corretamente
- [ ] Redirecionamento para Stripe funciona
- [ ] Webhooks recebem eventos
- [ ] Fluxo completo de pagamento

## 🚨 Riscos Identificados

1. **Chaves incorretas**: Usar chaves de produção em ambiente de teste
2. **URLs incorretas**: Webhooks apontando para URLs inválidas
3. **Produtos inexistentes**: IDs de produtos não correspondem ao Stripe

## 📊 Métricas de Sucesso

- [ ] Checkout session criada com sucesso (200 response)
- [ ] Redirecionamento para Stripe funciona
- [ ] Usuário consegue completar pagamento
- [ ] Webhook processa evento corretamente
- [ ] Status da assinatura atualizado no banco

## 🔄 Próximos Passos

1. **Imediato**: Configurar variáveis de ambiente
2. **Curto prazo**: Implementar logs detalhados
3. **Médio prazo**: Adicionar tratamento de erros robusto
4. **Longo prazo**: Implementar testes automatizados

---

**Data**: $(date)
**Status**: Aguardando implementação
**Prioridade**: Alta
**Estimativa**: 2-4 horas para resolução completa