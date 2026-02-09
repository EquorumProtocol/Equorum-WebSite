# 📸 Guia de Screenshots para FAQ Pages

Este guia explica **exatamente quais screenshots tirar** e **onde colocá-los** nas páginas FAQ.

---

## 🎯 Como Tirar os Screenshots

### Ferramentas Recomendadas:
- **Windows:** Snipping Tool (Win + Shift + S) ou ShareX
- **Mac:** Cmd + Shift + 4
- **Linux:** Flameshot ou GNOME Screenshot

### Formato e Qualidade:
- **Formato:** PNG (melhor qualidade)
- **Resolução:** 1920x1080 ou maior
- **Tamanho máximo:** 500KB por imagem (comprima se necessário)

### Dicas:
- Use **setas** ou **círculos** para destacar botões importantes
- Capture em **modo claro** (light mode) para melhor legibilidade
- **Oculte** informações sensíveis (endereços de carteira, valores reais)

---

## 📄 For Investors Page (faq-investors.html)

### Screenshot 1: Connect Wallet
**O que capturar:**
- Dashboard principal (`dashboard.html`)
- Botão "Connect Wallet" no canto superior direito
- Adicione uma **seta laranja** apontando para o botão

**Como fazer:**
1. Abra `http://localhost/dashboard.html` (ou seu servidor local)
2. Certifique-se de que a carteira NÃO está conectada
3. Tire print da tela inteira
4. Edite a imagem e adicione seta/círculo no botão "Connect Wallet"

**Nome do arquivo:** `investor-step1-connect-wallet.png`

**Onde colocar:** Crie pasta `/screenshots/` e salve lá

---

### Screenshot 2: Browse Active Series
**O que capturar:**
- Dashboard mostrando lista de séries ativas
- Cards com informações: nome, revenue share %, duração, etc.
- Botão "View Details" em cada card

**Como fazer:**
1. Abra `dashboard.html` com carteira conectada
2. Se não houver séries reais, use dados mock ou crie série de teste
3. Capture a seção com os cards de séries
4. Destaque um dos cards com borda laranja

**Nome do arquivo:** `investor-step2-browse-series.png`

---

### Screenshot 3: Series Details & ROI Calculator
**O que capturar:**
- Página de detalhes de uma série (`series.html`)
- Painel com informações da série (nome, %, duração, etc.)
- **ROI Calculator** com inputs preenchidos
- Resultado mostrando ROI positivo (verde) ou negativo (vermelho)
- Botão "Buy on Uniswap"

**Como fazer:**
1. Abra `series.html?address=0x...` (use série de teste)
2. Role até a calculadora de ROI
3. Preencha:
   - Protocol Monthly Revenue: $50,000
   - Tokens to Buy: 1,000
4. Capture o resultado mostrando ROI calculado
5. Destaque o botão "Buy on Uniswap"

**Nome do arquivo:** `investor-step3-roi-calculator.png`

---

### Screenshot 4: Buy on Uniswap
**O que capturar:**
- Interface do Uniswap (https://app.uniswap.org)
- Par de tokens: ETH → Revenue Bond Token
- Campos de input preenchidos
- Taxa de câmbio
- Botão "Swap"
- Popup de confirmação da carteira (se possível)

**Como fazer:**
1. Vá para Uniswap em Arbitrum One
2. Selecione ETH como token de entrada
3. Cole endereço do token de revenue bond como saída
4. Digite quantidade (ex: 0.1 ETH)
5. Tire print ANTES de confirmar
6. Se possível, tire outro print do popup da carteira

**Nome do arquivo:** `investor-step4-uniswap-swap.png`

**ALTERNATIVA:** Se não tiver liquidez real, use **screenshot editado** ou **mockup** do Uniswap

---

### Screenshot 5: Claim Revenue
**O que capturar:**
- Página `series.html` (visão do investidor)
- Painel "Your Position" mostrando:
  - Token balance
  - Claimable revenue (em ETH)
  - Total claimed
- Botão "Claim Revenue" **destacado**

**Como fazer:**
1. Conecte carteira que possui tokens da série
2. Abra `series.html` da série
3. Role até "Your Position"
4. Capture o painel completo
5. Adicione círculo/destaque no botão "Claim Revenue"

**Nome do arquivo:** `investor-step5-claim-revenue.png`

**MOCK:** Se não tiver posição real, edite o HTML temporariamente para mostrar valores mock

---

### Screenshot 6: Sell Tokens (Uniswap Reverse)
**O que capturar:**
- Uniswap com swap reverso: Revenue Bond Token → ETH
- Preço de mercado atual
- Liquidez disponível

**Como fazer:**
1. Vá para Uniswap
2. Inverta o par: Token → ETH
3. Mostre a interface pronta para vender
4. Capture

**Nome do arquivo:** `investor-step6-sell-tokens.png`

---

## 🏗️ For Protocols Page (faq-protocols.html)

### Screenshot 1: Connect Protocol Wallet
**O que capturar:**
- Página `create.html`
- Botão "Connect Wallet"
- Seletor de rede mostrando "Arbitrum One"
- Mensagem de aviso sobre usar carteira segura

**Como fazer:**
1. Abra `create.html` sem carteira conectada
2. Capture a tela inicial
3. Destaque botão de conexão

**Nome do arquivo:** `protocol-step1-connect-wallet.png`

---

### Screenshot 2: Fill Series Parameters
**O que capturar:**
- Formulário completo de criação de série em `create.html`
- Todos os campos de input:
  - Series Name
  - Symbol
  - Revenue Share % (slider)
  - Duration (seletor)
  - Total Supply
- Painel de preview com valores calculados

**Como fazer:**
1. Abra `create.html` com carteira conectada
2. Preencha o formulário com dados de exemplo:
   - Name: "Uniswap Revenue Bonds Q1 2026"
   - Symbol: "UNI-RB-Q1"
   - Revenue Share: 30%
   - Duration: 12 months
   - Supply: 100,000
3. Capture formulário + preview
4. Adicione anotações nos campos importantes

**Nome do arquivo:** `protocol-step2-fill-parameters.png`

---

### Screenshot 3: Review & Deploy
**O que capturar:**
- Modal de confirmação antes do deploy
- Resumo de todos os parâmetros
- Custo estimado de gas (~0.001-0.003 ETH)
- Botão "Confirm Deployment"
- Popup da carteira sobreposto (se possível)

**Como fazer:**
1. Preencha formulário e clique "Create Series"
2. Capture o modal de confirmação
3. NÃO confirme de verdade (a menos que queira gastar gas)
4. Se confirmar, capture também o popup da carteira

**Nome do arquivo:** `protocol-step3-deploy-confirmation.png`

---

### Screenshot 4: Distribute Tokens
**O que capturar:**
- Dashboard de gerenciamento da série (após deploy)
- Painel mostrando "Token Balance: 100,000 (100% in your wallet)"
- Botões de distribuição:
  - "Airdrop Tokens"
  - "Create Uniswap Pool"
  - "Transfer Tokens"

**Como fazer:**
1. Após criar série, vá para página de gerenciamento
2. Capture o painel de distribuição
3. Destaque as opções disponíveis

**Nome do arquivo:** `protocol-step4-distribute-tokens.png`

**MOCK:** Pode ser necessário criar interface de gerenciamento ou usar HTML temporário

---

### Screenshot 5: Deposit Revenue
**O que capturar:**
- Interface de depósito de receita
- Campo de input para quantidade de ETH
- Preview: "X ETH will be distributed to Y holders"
- Botão de confirmação
- Mensagem de sucesso após depósito

**Como fazer:**
1. Vá para página de gerenciamento da série
2. Clique "Deposit Revenue"
3. Digite valor (ex: 1 ETH)
4. Capture o modal
5. Se confirmar, capture também a mensagem de sucesso

**Nome do arquivo:** `protocol-step5-deposit-revenue.png`

---

### Screenshot 6: Monitor & Manage
**O que capturar:**
- Dashboard do protocolo mostrando:
  - Total Revenue Distributed
  - Number of Holders
  - Average Claim Rate
  - Time Remaining
  - Gráfico de distribuição (se houver)
- Botões "Pause Series" e "Deposit Revenue"

**Como fazer:**
1. Capture dashboard completo da série
2. Mostre métricas com dados realistas
3. Destaque botões de ação

**Nome do arquivo:** `protocol-step6-manage-series.png`

---

### Screenshot 7: Series Expiration
**O que capturar:**
- Página de série expirada
- Badge "Series Expired"
- Estatísticas finais
- Botão "Create New Series"
- Mensagem explicativa

**Como fazer:**
1. Use série de teste que já expirou OU
2. Edite HTML temporariamente para simular expiração
3. Capture a tela

**Nome do arquivo:** `protocol-step7-series-expired.png`

---

## ❓ Help Page (faq-help.html)

**Esta página NÃO precisa de screenshots!** 

É apenas FAQ em formato accordion (perguntas e respostas). Já está completa.

---

## 🔧 Como Adicionar Screenshots nas Páginas

### Opção 1: Substituir Placeholder (Recomendado)

Substitua este código:
```html
<div class="screenshot">
    📸 Screenshot needed:<br>
    Dashboard page showing "Connect Wallet" button...
</div>
```

Por este:
```html
<img src="/screenshots/investor-step1-connect-wallet.png" 
     alt="Connect Wallet Button" 
     style="width: 100%; border-radius: 12px; border: 2px solid #e5e7eb; margin-top: 1.5rem;">
```

### Opção 2: Manter Placeholder Temporariamente

Se não tiver todos os screenshots ainda, deixe os placeholders. Eles servem como **guia visual** do que falta.

---

## 📁 Estrutura de Pastas Recomendada

```
equorum-website/
├── screenshots/
│   ├── investor-step1-connect-wallet.png
│   ├── investor-step2-browse-series.png
│   ├── investor-step3-roi-calculator.png
│   ├── investor-step4-uniswap-swap.png
│   ├── investor-step5-claim-revenue.png
│   ├── investor-step6-sell-tokens.png
│   ├── protocol-step1-connect-wallet.png
│   ├── protocol-step2-fill-parameters.png
│   ├── protocol-step3-deploy-confirmation.png
│   ├── protocol-step4-distribute-tokens.png
│   ├── protocol-step5-deposit-revenue.png
│   ├── protocol-step6-manage-series.png
│   └── protocol-step7-series-expired.png
├── faq-investors.html
├── faq-protocols.html
└── faq-help.html
```

---

## 🎨 Ferramentas para Editar Screenshots

### Adicionar Setas/Círculos:
- **Online:** Photopea (https://photopea.com) - Photoshop grátis no browser
- **Windows:** Paint 3D ou ShareX (tem editor integrado)
- **Mac:** Preview (built-in)
- **Linux:** GIMP ou Krita

### Comprimir Imagens:
- **Online:** TinyPNG (https://tinypng.com)
- **CLI:** `pngquant` ou `imagemagick`

---

## ⚡ Atalho Rápido

**Se não quiser tirar todos os prints agora:**

1. Deixe os placeholders como estão
2. Tire prints aos poucos conforme tiver tempo
3. Substitua um por vez
4. Priorize os mais importantes:
   - Investor Step 1, 3, 5
   - Protocol Step 2, 5, 6

**Os placeholders já explicam o que deve aparecer**, então a página já é funcional mesmo sem imagens!

---

## 🚀 Próximos Passos

1. Crie pasta `/screenshots/`
2. Tire os prints seguindo este guia
3. Salve com os nomes corretos
4. Substitua os placeholders por tags `<img>`
5. Teste as páginas para ver se ficou bom

**Dúvidas?** Me avise qual screenshot está difícil de tirar que eu te ajudo!
