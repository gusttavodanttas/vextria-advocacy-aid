# Integração Stripe

Este documento descreve como configurar e usar a integração com Stripe no sistema.

## Configuração Inicial

### 1. Variáveis de Ambiente

Adicione as seguintes variáveis ao seu arquivo `.env`:

```bash
# Chaves do Stripe
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_sua_chave_publica_aqui
STRIPE_SECRET_KEY=sk_test_sua_chave_secreta_aqui
STRIPE_WEBHOOK_SECRET=whsec_seu_webhook_secret_aqui

# URLs de webhook (ajuste conforme seu domínio)
STRIPE_WEBHOOK_URL=https://seu-dominio.com/api/webhooks/stripe
```

### 2. Instalação de Dependências

O Stripe é integrado via API REST, não requer instalação de pacotes adicionais no frontend.

### 3. Estrutura dos Dados

#### Tabelas Atualizadas

- `stripe_checkouts` (anteriormente `asaas_checkouts`)
- `stripe_webhooks` (anteriormente `asaas_webhooks`)
- `subscriptions` (campos renomeados para Stripe)

#### Campos Renomeados

| Antigo (ASAAS) | Novo (Stripe) |
|----------------|---------------|
| asaas_checkout_id | stripe_checkout_id |
| asaas_customer_id | stripe_customer_id |
| asaas_subscription_id | stripe_subscription_id |
| asaas_payment_id | stripe_payment_intent_id |
| asaas_event_id | stripe_event_id |

### 4. Fluxo de Pagamento

#### Criação de Checkout

```typescript
import { useStripe } from '@/hooks/useStripe';

const { createCheckoutSession } = useStripe();

const handleCreateCheckout = async () => {
  const session = await createCheckoutSession({
    customer: 'cus_stripe_customer_id',
    price: 'price_stripe_price_id',
    success_url: `${window.location.origin}/obrigado`,
    cancel_url: `${window.location.origin}/pagamento/cancelado`,
    mode: 'subscription',
    metadata: {
      user_id: 'user_id',
      office_id: 'office_id'
    }
  });
  
  if (session?.url) {
    window.location.href = session.url;
  }
};
```

#### Criação de Assinatura

```typescript
const { createSubscription } = useStripe();

const subscription = await createSubscription({
  customer: 'cus_stripe_customer_id',
  price: 'price_stripe_price_id',
  metadata: {
    user_id: 'user_id',
    plan_name: 'Plano Mensal'
  }
});
```

### 5. Webhooks

Configure webhooks no Stripe Dashboard para os seguintes eventos:

- `checkout.session.completed`
- `customer.subscription.created`
- `customer.subscription.updated`
- `customer.subscription.deleted`
- `invoice.payment_succeeded`
- `invoice.payment_failed`

### 6. Testes

#### Test Cards (Stripe)

Use estes cartões de teste:

- **Sucesso**: 4242 4242 4242 4242
- **Requer autenticação**: 4000 0025 0000 3155
- **Falha**: 4000 0000 0000 0002

### 7. Migração de Dados

Execute a migração SQL para atualizar as tabelas:

```bash
# Aplique a migração no Supabase
supabase db reset
supabase db push src/migrations/20241220_migrate_asaas_to_stripe.sql
```

### 8. Serviços Disponíveis

#### StripeService

- `createCustomer()` - Criar cliente no Stripe
- `createCheckoutSession()` - Criar sessão de checkout
- `createSubscription()` - Criar assinatura
- `getSubscription()` - Obter detalhes da assinatura
- `cancelSubscription()` - Cancelar assinatura
- `createPaymentIntent()` - Criar intenção de pagamento

#### Hook useStripe

Hook React que encapsula o StripeService com estados de loading e error.

### 9. Troubleshooting

#### Problemas Comuns

1. **Webhook não recebido**: Verifique a URL configurada no Stripe Dashboard
2. **Erro de autenticação**: Confirme as chaves de API
3. **Campos não encontrados**: Execute a migração SQL

### 10. Próximos Passos

1. Configurar webhooks no ambiente de produção
2. Adicionar validações de webhook
3. Implementar notificações de pagamento
4. Adicionar histórico de pagamentos

## Suporte

Para questões relacionadas à integração Stripe:

1. Verifique este documento
2. Consulte a documentação oficial: https://stripe.com/docs
3. Verifique os logs no Supabase Dashboard