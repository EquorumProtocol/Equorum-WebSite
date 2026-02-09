# 📊 Equorum Protocol Dashboard - Implementation Guide

## Overview

O Dashboard do Equorum Protocol é a interface pública de descoberta e análise de Revenue Bonds na Arbitrum One. Ele funciona como o "Bloomberg of On-Chain Revenue Financing", fornecendo métricas em tempo real, análise de séries ativas e ferramentas de cálculo de ROI.

## 🏗️ Arquitetura

### Estrutura Híbrida

```
┌─────────────────────────────────────────────────────────────┐
│                    USUÁRIO FINAL                             │
└─────────────────────────────────────────────────────────────┘
                          │
                          ▼
        ┌─────────────────────────────────────┐
        │  equorumprotocol.org/dashboard.html │
        │  (Descoberta & Análise Pública)     │
        └─────────────────────────────────────┘
                          │
                          │ GraphQL Queries
                          ▼
        ┌─────────────────────────────────────┐
        │     TheGraph Subgraph (Arbitrum)    │
        │  (Indexação de Eventos On-Chain)    │
        └─────────────────────────────────────┘
                          │
                          │ Events
                          ▼
        ┌─────────────────────────────────────┐
        │   Equorum V2 Contracts (Arbitrum)   │
        │         Factory: 0x8afA...          │
        └─────────────────────────────────────┘
```

### Fluxo do Usuário

1. **Descoberta** → Visitante acessa `equorumprotocol.org/dashboard.html`
2. **Análise** → Vê KPIs globais, séries ativas, calculadora de ROI
3. **Interesse** → Clica em "View Details" de uma série
4. **Ação** → É redirecionado para `app.equorumprotocol.org` para executar transações

## 📦 Arquivos Criados

### 1. TheGraph Subgraph (`/Equorum-Protocol/subgraph/`)

```
subgraph/
├── schema.graphql              # 19 entidades, 3 enums
├── subgraph.yaml              # Factory + 4 templates dinâmicos
├── package.json               # Dependências e scripts
├── setup.sh                   # Script de setup automatizado
├── .gitignore                 # Arquivos a ignorar
├── README.md                  # Documentação completa
└── src/
    ├── factory.ts             # Handler da Factory
    ├── revenue-series.ts      # Handler de Soft Bonds
    ├── revenue-bond-escrow.ts # Handler de Hybrid Bonds
    ├── revenue-router.ts      # Handler do Router
    └── reputation-registry.ts # Handler de Reputação
```

### 2. Dashboard Frontend (`/equorum-website/`)

```
equorum-website/
├── dashboard.html             # Página principal do Dashboard
├── index.html                 # (modificado) Link para Dashboard
└── src/
    └── dashboard.js           # Lógica de integração com TheGraph
```

## 🚀 Setup e Deploy

### Fase 1: Deploy do Subgraph

#### 1.1. Preparar Ambiente

```bash
cd Equorum-Protocol/subgraph

# Instalar Graph CLI globalmente
npm install -g @graphprotocol/graph-cli

# Rodar script de setup
chmod +x setup.sh
./setup.sh
```

O script `setup.sh` irá:
- Instalar dependências
- Copiar ABIs dos contratos compilados
- Gerar código TypeScript (`graph codegen`)
- Compilar para WebAssembly (`graph build`)

#### 1.2. Deploy no The Graph Studio

```bash
# 1. Criar conta em https://thegraph.com/studio/
# 2. Criar novo subgraph chamado "equorum-protocol"
# 3. Copiar deploy key

# 4. Autenticar
graph auth --studio <DEPLOY_KEY>

# 5. Deploy
npm run deploy
```

#### 1.3. Obter URL do Subgraph

Após o deploy, você receberá uma URL como:
```
https://api.studio.thegraph.com/query/<SUBGRAPH_ID>/equorum-protocol/version/latest
```

Copie essa URL - você precisará dela para o Dashboard.

### Fase 2: Configurar Dashboard

#### 2.1. Atualizar URL do Subgraph

Edite `equorum-website/src/dashboard.js`:

```javascript
// Linha 10
const SUBGRAPH_URL = 'https://api.studio.thegraph.com/query/<SUBGRAPH_ID>/equorum-protocol/version/latest';

// Linha 13 - Mudar para false após deploy
const USE_MOCK_DATA = false;
```

#### 2.2. Testar Localmente

```bash
cd equorum-website

# Opção 1: Servidor Python
python3 -m http.server 8000

# Opção 2: Servidor Node.js
npx http-server -p 8000

# Acesse: http://localhost:8000/dashboard.html
```

#### 2.3. Deploy do Site

O site é estático, então pode ser deployado em qualquer serviço:

**Netlify:**
```bash
# Instalar Netlify CLI
npm install -g netlify-cli

# Deploy
cd equorum-website
netlify deploy --prod
```

**Vercel:**
```bash
# Instalar Vercel CLI
npm install -g vercel

# Deploy
cd equorum-website
vercel --prod
```

**GitHub Pages:**
```bash
# Commit e push para branch gh-pages
git add .
git commit -m "Add Dashboard"
git push origin main
```

## 📊 Funcionalidades do Dashboard

### 1. Hero Section - KPIs Globais

Exibe métricas principais em tempo real:
- Total de Bonds criados
- Capital total levantado (ETH)
- Receita total distribuída (ETH)
- Séries ativas

**Fonte de dados:** Query `protocolStats(id: "protocol-stats")`

### 2. Global Metrics - Cards de KPIs

4 cards com métricas detalhadas:
- **Total Protocols:** Protocolos únicos que criaram séries
- **Avg Delivery Rate:** Taxa média de entrega de receita
- **24h Revenue:** Receita distribuída nas últimas 24h
- **Total Holders:** Holders únicos de bonds

**Fonte de dados:** Combinação de `protocolStats` e `dailySnapshots`

### 3. Revenue Bond Calculator

Calculadora interativa para estimar retornos:

**Inputs:**
- Investment Amount (ETH)
- Revenue Share % (da série)
- Expected Monthly Protocol Revenue (ETH)
- Series Duration (dias)
- Your % of Total Supply

**Outputs:**
- Estimated Monthly Revenue
- Total Revenue Over Duration
- Estimated APY
- ROI %

**Lógica:**
```javascript
monthlyRevenueToSeries = protocolRevenue × (revenueShare / 100)
yourMonthlyRevenue = monthlyRevenueToSeries × (ownership / 100)
totalRevenue = yourMonthlyRevenue × (duration / 30)
APY = (yourMonthlyRevenue × 12 / investment) × 100
ROI = (totalRevenue / investment) × 100
```

### 4. Active Series Table

Tabela interativa com todas as séries ativas:

**Colunas:**
- Series Name & Symbol
- Type (Soft/Hybrid badge)
- Protocol Address (link para Arbiscan)
- Reputation Score (0-100 com barra visual)
- Revenue Share %
- Total Revenue (ETH + # distribuições)
- Estimated APY
- Holders
- Days to Maturity
- Action (botão "View Details")

**Filtros:**
- Search (por nome, símbolo ou endereço)
- Type (All/Soft/Hybrid)
- Sort (Revenue, APY, Reputation, Recent)

**Fonte de dados:** Query `revenueSeries(where: { isActive: true })`

### 5. Auto-Refresh

Dados são atualizados automaticamente a cada 30 segundos sem reload da página.

## 🔧 Customização

### Adicionar Novos KPIs

1. Adicione o campo no `schema.graphql` do subgraph
2. Atualize o handler correspondente em `src/`
3. Adicione a query no `dashboard.js`
4. Crie o elemento HTML no `dashboard.html`
5. Atualize a função de render no `dashboard.js`

### Modificar Estilos

Todas as cores e estilos estão definidas em CSS variables no `<style>` do `dashboard.html`:

```css
:root {
    --orange: #FF6224;
    --navy: #000A21;
    --gray-50: #F9FAFB;
    /* ... */
}
```

### Adicionar Novos Filtros

1. Adicione o elemento HTML (select/input)
2. Crie a função de filtro no `dashboard.js`
3. Adicione event listener na inicialização
4. Chame `applyFilters()` após mudanças

## 📈 Queries GraphQL Disponíveis

### Global Stats
```graphql
query GlobalStats {
  protocolStats(id: "protocol-stats") {
    totalRevenueBondsCreated
    totalCapitalRaised
    totalRevenueDistributed
    totalActiveSeries
    totalProtocolsFunded
    averageDeliveryRate
  }
}
```

### Active Series
```graphql
query ActiveSeries {
  revenueSeries(
    where: { isActive: true }
    orderBy: totalRevenueReceived
    orderDirection: desc
  ) {
    id
    name
    symbol
    bondType
    protocol {
      reputationScore
      deliveryRate
    }
    totalRevenueReceived
    estimatedAPY
    holderCount
  }
}
```

### Series Details (para página futura)
```graphql
query SeriesDetails($id: ID!) {
  revenueSeries(id: $id) {
    name
    symbol
    distributions(orderBy: timestamp, orderDirection: desc) {
      amount
      timestamp
    }
    holders(orderBy: balance, orderDirection: desc) {
      holder
      balance
    }
  }
}
```

## 🐛 Troubleshooting

### Subgraph não indexa eventos

**Problema:** Subgraph deployado mas sem dados

**Soluções:**
1. Verifique se o `startBlock` no `subgraph.yaml` está correto
2. Confirme que o endereço da Factory está correto
3. Verifique logs no The Graph Studio
4. Teste queries no Playground do Studio

### Dashboard mostra dados mockados

**Problema:** Dashboard não conecta ao subgraph

**Soluções:**
1. Verifique se `USE_MOCK_DATA = false` no `dashboard.js`
2. Confirme que a `SUBGRAPH_URL` está correta
3. Abra o DevTools do navegador e verifique erros de CORS
4. Teste a URL do subgraph diretamente no navegador

### Calculadora não atualiza

**Problema:** Inputs não recalculam resultados

**Soluções:**
1. Verifique se `setupCalculator()` está sendo chamado
2. Confirme que os IDs dos inputs estão corretos
3. Verifique erros no Console do navegador
4. Teste `calculateReturns()` manualmente no Console

### Tabela não carrega

**Problema:** Loading infinito ou erro

**Soluções:**
1. Verifique se o subgraph está online
2. Confirme que a query está correta
3. Verifique se há séries ativas na mainnet
4. Teste a query no Playground do The Graph Studio

## 🔗 Links Úteis

- **The Graph Studio:** https://thegraph.com/studio/
- **Subgraph Docs:** https://thegraph.com/docs/
- **Equorum Contracts:** https://arbiscan.io/address/0x8afA0318363FfBc29Cc28B3C98d9139C08Af737b
- **Arbitrum One Explorer:** https://arbiscan.io/

## 📝 Próximos Passos

### Fase 3: Página de Detalhes da Série

Criar `series.html?id=<address>` com:
- Informações completas da série
- Gráfico de distribuições ao longo do tempo
- Lista de top holders
- Histórico de claims
- Botão "Buy Bonds" → redirect para app

### Fase 4: Interface de Ações no App

Implementar em `app.equorumprotocol.org`:
- Criar nova série (form completo)
- Comprar bonds (swap ETH por tokens)
- Claim revenue (botão de claim)
- Claim principal (para Hybrid Bonds)
- Deposit principal (para protocolos)

## 🎯 Métricas de Sucesso

Para validar que o Dashboard está funcionando:

1. **Subgraph indexando:** Queries retornam dados reais
2. **KPIs atualizados:** Hero stats mostram valores corretos
3. **Tabela populada:** Séries ativas aparecem na tabela
4. **Calculadora funcional:** Inputs geram outputs corretos
5. **Auto-refresh:** Dados atualizam a cada 30s
6. **Performance:** Página carrega em < 2s
7. **Responsivo:** Funciona em mobile e desktop

## 📧 Suporte

Para dúvidas ou problemas:
- **Discord:** https://discord.gg/qAzseSwY
- **GitHub Issues:** https://github.com/EquorumProtocol/Equorum-Revenue-Bonds/issues
- **Twitter:** https://twitter.com/EquorumProtocol
