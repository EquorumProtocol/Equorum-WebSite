// ============================================
// BUY BONDS PAGE LOGIC
// ============================================

let selectedSeriesAddress = null;
let seriesContract = null;
let seriesInfo = {
  name: '',
  symbol: '',
  tokenPrice: 0,
  available: 0,
  revenueShareBPS: 0,
  principalAmount: 0,
  maturityDate: 0,
  minPurchase: 0,
  saleActive: false
};

// ============================================
// INITIALIZATION
// ============================================

document.addEventListener('DOMContentLoaded', async () => {
  // Setup wallet button
  const connectBtn = document.getElementById('connect-wallet-btn');
  if (connectBtn) {
    connectBtn.onclick = async () => {
      await Web3Manager.connectWallet();
      updateUI();
      if (selectedSeriesAddress) {
        loadUserPosition();
      }
    };
  }

  // Load series list
  await loadSeriesList();
  
  // Check URL params for pre-selected series
  const urlParams = new URLSearchParams(window.location.search);
  const seriesParam = urlParams.get('series');
  if (seriesParam) {
    document.getElementById('series-select').value = seriesParam;
    await loadSeriesInfo();
  }
});

// ============================================
// SERIES LOADING
// ============================================

async function loadSeriesList() {
  const select = document.getElementById('series-select');
  
  try {
    // Get all series from V2 Factory
    const provider = new ethers.providers.JsonRpcProvider('https://arb1.arbitrum.io/rpc');
    const factory = new ethers.Contract(
      Web3Manager.FACTORY_ADDRESS,
      Web3Manager.FACTORY_ABI,
      provider
    );
    
    const allSeries = await factory.getAllSeries();
    
    if (allSeries.length === 0) {
      select.innerHTML = '<option value="">No series available</option>';
      return;
    }
    
    // Load basic info for each series
    for (const seriesAddr of allSeries) {
      const series = new ethers.Contract(seriesAddr, Web3Manager.REVENUE_SERIES_ABI, provider);
      
      try {
        const [name, symbol, active] = await Promise.all([
          series.name(),
          series.symbol(),
          series.active()
        ]);
        
        const option = document.createElement('option');
        option.value = seriesAddr;
        option.textContent = `${name} (${symbol})${active ? ' - ACTIVE' : ' - MATURED'}`;
        if (active) {
          option.style.color = '#10B981';
        }
        select.appendChild(option);
      } catch (e) {
        console.error('Error loading series:', seriesAddr, e);
      }
    }
  } catch (error) {
    console.error('Error loading series list:', error);
    select.innerHTML = '<option value="">Error loading series</option>';
  }
}

async function loadSeriesInfo() {
  const seriesAddress = document.getElementById('series-select').value;
  
  if (!seriesAddress) {
    document.getElementById('buy-interface').style.display = 'none';
    document.getElementById('no-sale-state').style.display = 'none';
    return;
  }
  
  selectedSeriesAddress = seriesAddress;
  
  // Show loading
  document.getElementById('loading-state').style.display = 'block';
  document.getElementById('buy-interface').style.display = 'none';
  document.getElementById('no-sale-state').style.display = 'none';
  
  try {
    const provider = new ethers.providers.JsonRpcProvider('https://arb1.arbitrum.io/rpc');
    seriesContract = new ethers.Contract(seriesAddress, Web3Manager.REVENUE_SERIES_ABI, provider);
    
    // Load series info from V2 RevenueSeries
    const [
      name,
      symbol,
      totalSupply,
      revenueShareBPS,
      maturityDate,
      active,
      totalRevenueReceived
    ] = await Promise.all([
      seriesContract.name(),
      seriesContract.symbol(),
      seriesContract.totalSupply(),
      seriesContract.revenueShareBPS(),
      seriesContract.maturityDate(),
      seriesContract.active(),
      seriesContract.totalRevenueReceived()
    ]);
    
    const now = Math.floor(Date.now() / 1000);
    const isActive = active && now < maturityDate.toNumber();
    
    seriesInfo = {
      name,
      symbol,
      tokenPrice: ethers.BigNumber.from(0), // V2 Soft bonds don't have token price
      available: ethers.BigNumber.from(0),
      revenueShareBPS: revenueShareBPS.toNumber(),
      principalAmount: ethers.BigNumber.from(0),
      maturityDate: maturityDate.toNumber(),
      minPurchase: ethers.BigNumber.from(0),
      totalSupply: totalSupply,
      totalRevenueReceived: totalRevenueReceived,
      saleActive: false // V2 Soft bonds don't have sale mechanism
    };
    
    // Hide loading
    document.getElementById('loading-state').style.display = 'none';
    
    // V2 Soft bonds don't have a buy mechanism (tokens are minted to protocol)
    // Show info about the series instead
    document.getElementById('no-sale-state').style.display = 'block';
    const noSaleMsg = document.querySelector('#no-sale-state p');
    if (noSaleMsg) {
      if (!isActive) {
        noSaleMsg.textContent = 'This series has matured. No tokens available for purchase.';
      } else {
        noSaleMsg.textContent = 'This is a Revenue-Only (Soft) bond. Tokens are distributed by the protocol directly. Contact the protocol to acquire tokens.';
      }
    }
    
    // Show basic series info
    const bondNameEl = document.getElementById('bond-name');
    if (bondNameEl) bondNameEl.textContent = name;
    const bondSymbolEl = document.getElementById('bond-symbol');
    if (bondSymbolEl) bondSymbolEl.textContent = `(${symbol})`;
    const revenueShareEl = document.getElementById('revenue-share');
    if (revenueShareEl) revenueShareEl.textContent = (revenueShareBPS.toNumber() / 100) + '%';
    
    const maturityDateObj = new Date(maturityDate.toNumber() * 1000);
    const maturityEl = document.getElementById('maturity-date');
    if (maturityEl) maturityEl.textContent = maturityDateObj.toLocaleDateString();
    
    const daysRemaining = Math.max(0, Math.ceil((maturityDate.toNumber() - Date.now() / 1000) / 86400));
    const daysEl = document.getElementById('days-remaining');
    if (daysEl) daysEl.textContent = daysRemaining + ' days';
    
    // Update buy button
    updateUI();
    
    // Load user position if connected
    if (Web3Manager.isConnected()) {
      loadUserPosition();
    }
    
  } catch (error) {
    console.error('Error loading series info:', error);
    document.getElementById('loading-state').style.display = 'none';
    document.getElementById('no-sale-state').style.display = 'block';
    document.querySelector('#no-sale-state p').textContent = 'Error loading series information.';
  }
}

// ============================================
// PURCHASE LOGIC
// ============================================

function updateCost() {
  const amount = document.getElementById('buy-amount').value;
  
  if (!amount || amount <= 0 || !seriesInfo.tokenPrice) {
    document.getElementById('token-cost').textContent = '0 ETH';
    document.getElementById('protocol-fee').textContent = '0 ETH';
    document.getElementById('total-cost').textContent = '0 ETH';
    return;
  }
  
  const tokenAmount = ethers.utils.parseEther(amount.toString());
  const totalCost = tokenAmount.mul(seriesInfo.tokenPrice).div(ethers.utils.parseEther('1'));
  const fee = totalCost.mul(200).div(10000); // 2% (deduzido internamente)
  
  document.getElementById('token-cost').textContent = ethers.utils.formatEther(totalCost) + ' ETH';
  document.getElementById('protocol-fee').textContent = ethers.utils.formatEther(fee) + ' ETH (deduzido)';
  document.getElementById('total-cost').textContent = ethers.utils.formatEther(totalCost) + ' ETH';
}

async function buyTokens() {
  if (!Web3Manager.isConnected()) {
    alert('Please connect your wallet first');
    return;
  }
  
  const amount = document.getElementById('buy-amount').value;
  if (!amount || amount <= 0) {
    alert('Please enter a valid amount');
    return;
  }
  
  const tokenAmount = ethers.utils.parseEther(amount.toString());
  
  // Check minimum
  if (tokenAmount.lt(seriesInfo.minPurchase)) {
    alert(`Minimum purchase is ${formatTokens(seriesInfo.minPurchase)} tokens`);
    return;
  }
  
  // Check available
  if (tokenAmount.gt(seriesInfo.available)) {
    alert(`Only ${formatTokens(seriesInfo.available)} tokens available`);
    return;
  }
  
  try {
    const buyBtn = document.getElementById('buy-btn');
    buyBtn.disabled = true;
    buyBtn.textContent = 'Confirming...';
    
    // Calculate cost (fee is deducted internally by contract)
    const totalCost = tokenAmount.mul(seriesInfo.tokenPrice).div(ethers.utils.parseEther('1'));
    
    // Get contract with signer
    const contract = Web3Manager.getContract(selectedSeriesAddress, Web3Manager.ESCROW_SERIES_ABI);
    
    // Execute purchase - contract deducts 2% fee internally
    const tx = await contract.buyTokens(tokenAmount, { value: totalCost });
    
    buyBtn.textContent = 'Processing...';
    
    await tx.wait();
    
    alert('Purchase successful! You now own ' + amount + ' tokens.');
    
    // Reload series info
    await loadSeriesInfo();
    
  } catch (error) {
    console.error('Purchase error:', error);
    alert('Purchase failed: ' + (error.reason || error.message));
  } finally {
    updateUI();
  }
}

// ============================================
// USER POSITION
// ============================================

async function loadUserPosition() {
  if (!Web3Manager.isConnected() || !seriesContract) {
    document.getElementById('position-card').style.display = 'none';
    return;
  }
  
  try {
    const userAddress = Web3Manager.getAddress();
    const contract = Web3Manager.getContract(selectedSeriesAddress, Web3Manager.REVENUE_SERIES_ABI);
    
    const [balance, claimable] = await Promise.all([
      contract.balanceOf(userAddress),
      contract.calculateClaimable(userAddress)
    ]);
    
    if (balance.gt(0) || claimable.gt(0)) {
      document.getElementById('position-card').style.display = 'block';
      document.getElementById('your-balance').textContent = formatTokens(balance) + ' tokens';
      document.getElementById('your-claimable').textContent = ethers.utils.formatEther(claimable) + ' ETH';
      document.getElementById('claim-btn').disabled = claimable.eq(0);
    } else {
      document.getElementById('position-card').style.display = 'none';
    }
  } catch (error) {
    console.error('Error loading user position:', error);
  }
}

async function claimRevenue() {
  if (!Web3Manager.isConnected()) return;
  
  try {
    const claimBtn = document.getElementById('claim-btn');
    claimBtn.disabled = true;
    claimBtn.textContent = 'Claiming...';
    
    const contract = Web3Manager.getContract(selectedSeriesAddress, Web3Manager.REVENUE_SERIES_ABI);
    const tx = await contract.claimRevenue();
    await tx.wait();
    
    alert('Revenue claimed successfully!');
    await loadUserPosition();
    
  } catch (error) {
    console.error('Claim error:', error);
    alert('Claim failed: ' + (error.reason || error.message));
  } finally {
    document.getElementById('claim-btn').disabled = false;
    document.getElementById('claim-btn').textContent = 'Claim Revenue';
  }
}

// ============================================
// UI HELPERS
// ============================================

function updateUI() {
  const buyBtn = document.getElementById('buy-btn');
  const connectBtn = document.getElementById('connect-wallet-btn');
  
  if (Web3Manager.isConnected()) {
    connectBtn.textContent = formatAddress(Web3Manager.getAddress());
    buyBtn.disabled = false;
    buyBtn.textContent = '🚀 Buy Tokens';
  } else {
    connectBtn.textContent = 'Connect Wallet';
    buyBtn.disabled = true;
    buyBtn.textContent = 'Connect Wallet to Buy';
  }
}

function formatTokens(amount) {
  if (!amount) return '0';
  const formatted = ethers.utils.formatEther(amount);
  return parseFloat(formatted).toLocaleString(undefined, { maximumFractionDigits: 2 });
}

function formatAddress(address) {
  if (!address) return '';
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}
