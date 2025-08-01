# 🔧 Guia de Correção do Checkout Stripe

## 📋 Resumo do Problema

O checkout não está funcionando devido a **variáveis de ambiente não configuradas**. Após análise detalhada, identifiquei 3 abordagens possíveis e escolhi a **configuração completa das variáveis de ambiente** como solução principal.

## 🎯 Solução Implementada

### 1. Arquivos Criados
- ✅ `.env.local` - Template para variáveis de ambiente
- ✅ `src/utils/stripeDebug.ts` - Utilitário de diagnóstico
- ✅ `src/components/Debug/StripeDebugPanel.tsx` - Painel de debug visual
- ✅ `debug-checkout-report.md` - Relatório detalhado da análise

### 2. Rota de Debug Adicionada
- ✅ `/debug/stripe` - Acesse para diagnosticar problemas

## 🚀 Passos para Resolver

### Passo 1: Configurar Variáveis de Ambiente

1. **Obtenha suas chaves do Stripe:**
   - Acesse [Stripe Dashboard](https://dashboard.stripe.com/)
   - Vá em "Developers" > "API keys"
   - Copie a "Publishable key" (pk_test_...)
   - Copie a "Secret key" (sk_test_...)

2. **Configure o arquivo `.env.local`:**
   ```bash
   # Substitua pelas suas chaves reais
   VITE_STRIPE_PUBLISHABLE_KEY=pk_test_sua_chave_publica_aqui
   STRIPE_SECRET_KEY=sk_test_sua_chave_secreta_aqui
   STRIPE_WEBHOOK_SECRET=whsec_seu_webhook_secret_aqui
   ```

3. **Configure as variáveis no Supabase:**
   - Acesse seu projeto no [Supabase Dashboard](https://supabase.com/dashboard)
   - Vá em "Settings" > "Environment Variables"
   - Adicione:
     - `STRIPE_SECRET_KEY` = sua chave secreta
     - `STRIPE_WEBHOOK_SECRET` = seu webhook secret

### Passo 2: Configurar Webhooks no Stripe

1. **No Stripe Dashboard:**
   - Vá em "Developers" > "Webhooks"
   - Clique "Add endpoint"
   - URL: `https://SEU_PROJETO.supabase.co/functions/v1/stripe-webhook`
   - Eventos para escutar:
     - `checkout.session.completed`
     - `customer.subscription.created`
     - `customer.subscription.updated`
     - `invoice.payment_succeeded`
     - `invoice.payment_failed`

2. **Copie o Webhook Secret:**
   - Após criar o webhook, copie o "Signing secret"
   - Adicione no `.env.local` como `STRIPE_WEBHOOK_SECRET`

### Passo 3: Testar a Configuração

1. **Reinicie o servidor de desenvolvimento:**
   ```bash
   npm run dev
   ```

2. **Acesse o painel de debug:**
   - Vá para `http://localhost:8081/debug/stripe`
   - Verifique se todos os status estão "OK"
   - Clique em "Testar Checkout" para validar

3. **Teste o fluxo completo:**
   - Faça um novo cadastro
   - Verifique se o checkout é criado
   - Complete um pagamento de teste

## 🔍 Diagnóstico de Problemas

### Problemas Comuns e Soluções

| Problema | Causa | Solução |
|----------|-------|----------|
| "STRIPE_SECRET_KEY is not set" | Variável não configurada | Configure no `.env.local` e Supabase |
| "Product ID not found" | IDs de produtos incorretos | Verifique IDs no Stripe Dashboard |
| "Authentication error" | Chaves inválidas | Verifique se as chaves estão corretas |
| "Webhook não recebido" | URL incorreta | Configure URL correta no Stripe |

### Usando o Painel de Debug

1. **Acesse:** `http://localhost:8081/debug/stripe`
2. **Verifique:**
   - ✅ Status Geral deve estar "OK"
   - ✅ Publishable Key configurada
   - ✅ Secret Key NÃO deve aparecer no frontend
   - ✅ Conexão com Stripe funcionando
   - ✅ Função create-checkout respondendo

3. **Teste:**
   - Clique "Testar Checkout"
   - Deve abrir uma nova aba com checkout do Stripe
   - Use cartão de teste: `4242 4242 4242 4242`

## 📊 Validação Final

### Checklist de Sucesso
- [ ] Variáveis configuradas no `.env.local`
- [ ] Variáveis configuradas no Supabase
- [ ] Webhooks configurados no Stripe
- [ ] Painel de debug mostra status "OK"
- [ ] Teste de checkout funciona
- [ ] Fluxo completo de pagamento funciona

### Cartões de Teste Stripe
- **Sucesso:** `4242 4242 4242 4242`
- **Requer autenticação:** `4000 0025 0000 3155`
- **Falha:** `4000 0000 0000 0002`
- **Data:** Qualquer data futura
- **CVC:** Qualquer 3 dígitos

## 🆘 Se Ainda Não Funcionar

1. **Verifique os logs:**
   - Console do navegador (F12)
   - Logs do Supabase Edge Functions
   - Logs do Stripe Dashboard

2. **Problemas específicos:**
   - **CORS errors:** Verifique configuração do Supabase
   - **401 Unauthorized:** Chaves Stripe incorretas
   - **404 Not Found:** Função edge não deployada
   - **500 Internal Error:** Erro na lógica da função

3. **Contato para suporte:**
   - Documente o erro específico
   - Inclua screenshots do painel de debug
   - Verifique se seguiu todos os passos

## 🎉 Próximos Passos

Após resolver o problema:
1. Remova a rota de debug (`/debug/stripe`) em produção
2. Configure ambiente de produção com chaves live
3. Teste fluxo completo em produção
4. Configure monitoramento de pagamentos

---

**Tempo estimado para resolução:** 30-60 minutos
**Dificuldade:** Intermediária
**Requer:** Acesso ao Stripe Dashboard e Supabase Dashboard