# 🧪 TESTES DE VALIDAÇÃO - REVENUE BONDS V2

## ✅ CORREÇÕES APLICADAS

### **1. Taxa de Compra Duplicada (buy.js)** - CORRIGIDO
**Problema:** User pagava 102% (totalCost + fee)
**Correção:** User paga 100% (totalCost), fee deduzido internamente

---

## 📋 CHECKLIST DE TESTES

### **A. FLUXO DE COMPRA (BUY)**

#### **Teste 1: Cálculo de Custo**
```javascript
// Input: 100 tokens @ 0.01 ETH cada
// Esperado:
- Token Cost: 1 ETH
- Protocol Fee: 0.02 ETH (deduzido)
- Total a Pagar: 1 ETH ✅

// Contrato recebe: 1 ETH
// Protocolo recebe: 0.98 ETH
// Treasury recebe: 0.02 ETH
```

#### **Teste 2: Transação de Compra**
```javascript
// buy.js linha 261
contract.buyTokens(tokenAmount, { value: totalCost })

// Validar:
✅ msg.value = totalCost (não totalCost + fee)
✅ Contrato aceita transação
✅ Tokens transferidos para buyer
✅ ETH distribuído corretamente (98% protocolo, 2% treasury)
```

#### **Teste 3: Refund de Excesso**
```javascript
// Se user enviar mais ETH que totalCost
// Contrato deve fazer refund automático
✅ Excess refunded to buyer
```

---

### **B. FLUXO DE CRIAÇÃO (CREATE)**

#### **Teste 1: Criar Hybrid Bond**
```javascript
// Validar parâmetros:
✅ Nome e símbolo corretos
✅ Revenue share (BPS) válido
✅ Duration válida (30-1825 dias)
✅ Total supply válido (>= 1000 tokens)
✅ Principal amount correto
✅ Deposit deadline configurado
```

#### **Teste 2: Deposit Principal**
```javascript
// Protocol deve depositar principal antes de vender
✅ depositPrincipal() funciona
✅ Principal locked no contrato
✅ State muda para Active
✅ Sale pode ser iniciada
```

#### **Teste 3: Start Sale**
```javascript
// Protocol inicia venda de tokens
✅ startSale(price, treasury) funciona
✅ Treasury address válido
✅ Token price configurado
✅ saleActive = true
```

---

### **C. FLUXO DE REVENUE**

#### **Teste 1: Distribuir Revenue**
```javascript
// Protocol envia revenue para série
✅ distributeRevenue() funciona
✅ Revenue distribuído proporcionalmente
✅ revenuePerTokenStored atualizado
✅ totalRevenueReceived incrementado
```

#### **Teste 2: Claim Revenue**
```javascript
// Bondholder faz claim de revenue
✅ calculateClaimableRevenue() correto
✅ claimRevenue() funciona
✅ ETH transferido para holder
✅ Claimable zerado após claim
```

---

### **D. FLUXO DE MATURITY**

#### **Teste 1: Maturar Série**
```javascript
// Após maturity date
✅ matureSeries() pode ser chamado
✅ State muda para Matured
✅ Holders podem claim principal
```

#### **Teste 2: Claim Principal**
```javascript
// Bondholder resgata principal
✅ calculateClaimablePrincipal() correto
✅ claimPrincipal() funciona
✅ Tokens burned (prevent double-claim)
✅ ETH transferido proporcionalmente
✅ principalClaimed[user] = true
```

#### **Teste 3: Rescue Dust**
```javascript
// Após todos claims
✅ rescueDustPrincipal() só funciona se totalSupply = 0
✅ Só resgata dust principal (não revenue)
✅ Mínimo 1000 wei
```

---

### **E. FLUXO DE DEFAULT**

#### **Teste 1: Deposit Deadline**
```javascript
// Se protocol não depositar principal a tempo
✅ declareDefault() pode ser chamado após deadline
✅ State muda para Defaulted
✅ Reputation registry notificado
```

---

### **F. VALIDAÇÕES DE SEGURANÇA**

#### **Teste 1: Reentrancy**
```javascript
✅ buyTokens() tem nonReentrant
✅ claimRevenue() tem nonReentrant
✅ claimPrincipal() tem nonReentrant
```

#### **Teste 2: Double Claim**
```javascript
✅ Principal só pode ser claimed uma vez por user
✅ principalClaimed mapping funciona
✅ Tokens burned após claim
```

#### **Teste 3: Overflow Protection**
```javascript
✅ Revenue calculations não overflow
✅ Principal calculations corretos
✅ Fee calculations corretos
```

---

## 🎯 TESTES PRIORITÁRIOS

### **1. BUY FLOW (CRÍTICO)**
- [ ] User paga valor correto (não 102%)
- [ ] Fee deduzido internamente
- [ ] Protocolo recebe 98%
- [ ] Treasury recebe 2%
- [ ] Tokens transferidos

### **2. PRINCIPAL FLOW (CRÍTICO)**
- [ ] Deposit principal funciona
- [ ] Principal locked até maturity
- [ ] Claim principal funciona
- [ ] Tokens burned após claim
- [ ] Sem double-claim

### **3. REVENUE FLOW (IMPORTANTE)**
- [ ] Distribuir revenue funciona
- [ ] Claim revenue funciona
- [ ] Cálculos proporcionais corretos

---

## 🔧 COMO TESTAR LOCALMENTE

### **Opção 1: Hardhat Local**
```bash
cd ~/Equorum-Protocol
npx hardhat node
# Em outro terminal:
npx hardhat run scripts/test_escrow_complete.js --network localhost
```

### **Opção 2: Testnet (Arbitrum Sepolia)**
```bash
# Criar Hybrid Bond na testnet
npx hardhat run scripts/create_hybrid_test.js --network arbitrumSepolia

# Testar buy flow
# Abrir website apontando para testnet
# Conectar wallet
# Fazer compra de teste
```

### **Opção 3: Browser Console**
```javascript
// Abrir buy.html no browser
// F12 -> Console
// Simular compra:

const amount = 10; // 10 tokens
const tokenPrice = ethers.utils.parseEther("0.01"); // 0.01 ETH cada
const totalCost = ethers.utils.parseEther(amount.toString()).mul(tokenPrice).div(ethers.utils.parseEther('1'));
console.log("Total Cost:", ethers.utils.formatEther(totalCost), "ETH");

// Deve mostrar: 0.1 ETH (não 0.102 ETH)
```

---

## ✅ VALIDAÇÃO FINAL

Antes de deploy mainnet, confirmar:
- [ ] Buy flow testado e funcionando
- [ ] Fee indo para treasury correto
- [ ] Principal deposit testado
- [ ] Claim principal testado
- [ ] Sem double-claim possível
- [ ] Refund de excesso funciona
- [ ] Todos os eventos emitidos corretamente

---

## 🚨 ISSUES CONHECIDOS

### **RESOLVIDO:**
- ✅ Taxa duplicada no buy.js (user pagava 102%)

### **PENDENTE:**
- 🔄 Testar Hybrid Bond completo na testnet
- 🔄 Validar fluxo de maturity + claim principal
- 🔄 Testar cenário de default

---

**Última atualização:** 05/02/2026
**Status:** Buy flow corrigido, aguardando testes completos
