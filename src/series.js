// ============================================
// SERIES DETAIL PAGE
// ============================================

const ETH_PRICE_USD = 3150;
let seriesAddress = null;
let seriesData = null;
let userAddress = null;

// Extended ABI for series page - ALIGNED WITH V2 DEPLOYED CONTRACT
const SERIES_ABI = [
  // ERC-20 Standard
  'function balanceOf(address) view returns (uint256)',
  'function totalSupply() view returns (uint256)',
  'function name() view returns (string)',
  'function symbol() view returns (string)',
  
  // Revenue Bonds V2 - Public immutable variables (accessed directly, not as functions)
  'function protocol() view returns (address)',
  'function router() view returns (address)',
  'function revenueShareBPS() view returns (uint256)',
  'function maturityDate() view returns (uint256)',
  'function totalTokenSupply() view returns (uint256)',
  
  // Revenue Bonds V2 - Public mutable variables
  'function totalRevenueReceived() view returns (uint256)',
  'function revenuePerTokenStored() view returns (uint256)',
  'function active() view returns (bool)',
  
  // Revenue Bonds V2 - Functions
  'function calculateClaimable(address) view returns (uint256)',
  'function claimRevenue() external',
  'function claimFor(address) external',
  'function distributeRevenue() external payable',
  'function getSeriesInfo() view returns (address,uint256,uint256,uint256,uint256,bool,uint256)',
];

const ROUTER_ABI = [
  'function getRouterStatus() view returns (uint256,uint256,uint256,uint256,uint256,uint256,bool)',
  'function routeRevenue() external',
  'function withdrawToProtocol(uint256) external',
  'function withdrawAllToProtocol() external',
  'function pendingToRoute() view returns (uint256)',
  'function protocol() view returns (address)',
  'function revenueSeries() view returns (address)',
  'function revenueShareBPS() view returns (uint256)',
];

// ============================================
// INITIALIZATION
// ============================================

document.addEventListener('DOMContentLoaded', async () => {
  console.log('Series page initializing...');
  
  // Get series address from URL
  const urlParams = new URLSearchParams(window.location.search);
  seriesAddress = urlParams.get('id') || urlParams.get('address');
  console.log('Series address from URL:', seriesAddress);

  if (!seriesAddress) {
    console.error('No series address provided in URL');
    showError('No series address provided');
    return;
  }

  // Initialize wallet button
  const connectBtn = document.getElementById('connect-wallet-btn');
  console.log('Connect button found:', !!connectBtn);
  
  if (connectBtn) {
    connectBtn.onclick = async () => {
      console.log('Connect button clicked');
      try {
        if (typeof Web3Manager === 'undefined') {
          throw new Error('Web3Manager not loaded');
        }
        await Web3Manager.connectWallet();
        userAddress = Web3Manager.getAddress();
        console.log('Wallet connected:', userAddress);
        await loadSeriesData();
      } catch (error) {
        console.error('Failed to connect wallet:', error);
        alert('Failed to connect wallet: ' + error.message);
      }
    };
  }

  // Auto-connect if previously connected
  if (window.ethereum && window.ethereum.selectedAddress) {
    console.log('Auto-connecting to wallet...');
    try {
      if (typeof Web3Manager !== 'undefined') {
        await Web3Manager.connectWallet();
        userAddress = Web3Manager.getAddress();
        console.log('Auto-connected:', userAddress);
      }
    } catch (error) {
      console.log('Auto-connect failed:', error);
    }
  }

  // Load series data
  console.log('Loading series data...');
  try {
    await loadSeriesData();
    console.log('Series data loaded successfully');
  } catch (error) {
    console.error('Failed to load series data:', error);
    showError('Failed to load series: ' + error.message);
  }

  // Start countdown if not matured
  if (seriesData && !seriesData.isMatured) {
    startCountdown();
  }
  
  console.log('Series page initialization complete');
});

// ============================================
// DATA LOADING
// ============================================

async function loadSeriesData() {
  try {
    console.log('loadSeriesData: Starting...');
    
    const loadingState = document.getElementById('loading-state');
    const seriesContent = document.getElementById('series-content');
    
    if (!loadingState || !seriesContent) {
      throw new Error('Required DOM elements not found (loading-state or series-content)');
    }
    
    loadingState.style.display = 'block';
    seriesContent.style.display = 'none';
    console.log('loadSeriesData: Loading state shown');

    // Fetch from subgraph or contract
    console.log('loadSeriesData: Fetching series data for', seriesAddress);
    const data = await fetchSeriesData(seriesAddress);
    seriesData = data;
    console.log('loadSeriesData: Data fetched:', data);

    // Render all blocks
    console.log('loadSeriesData: Rendering identity...');
    renderIdentity(data);
    console.log('loadSeriesData: Rendering metrics...');
    renderMetrics(data);

    // Render actions based on user role
    if (userAddress) {
      console.log('loadSeriesData: User address found, rendering actions...');
      const isProtocol = userAddress.toLowerCase() === data.protocolAddress.toLowerCase();
      
      if (isProtocol) {
        console.log('loadSeriesData: Rendering protocol actions...');
        await renderProtocolActions(data);
      } else {
        console.log('loadSeriesData: Rendering holder actions...');
        await renderHolderActions(data);
      }
    } else {
      console.log('loadSeriesData: No user address, skipping action rendering');
    }

    loadingState.style.display = 'none';
    seriesContent.style.display = 'block';
    console.log('loadSeriesData: Complete! Content shown');
  } catch (error) {
    console.error('Error loading series data:', error);
    showError('Failed to load series data: ' + error.message);
    
    // Hide loading state even on error
    const loadingState = document.getElementById('loading-state');
    if (loadingState) loadingState.style.display = 'none';
  }
}

async function fetchSeriesData(address) {
  // Try wallet provider first, then public RPC fallback
  if (typeof Web3Manager !== 'undefined' && Web3Manager.isConnected()) {
    return await fetchFromContract(address);
  }

  // Fallback: read via public RPC (no wallet needed)
  return await fetchFromPublicRPC(address);
}

async function fetchFromPublicRPC(address) {
  const rpcProvider = new ethers.providers.JsonRpcProvider(ARBITRUM_RPC);
  const contract = new ethers.Contract(address, SERIES_ABI, rpcProvider);

  const [name, symbol, totalSupply, totalRevenueReceived, maturityDate, revenueShareBPS, protocolAddress, routerAddress, active] =
    await Promise.all([
      contract.name(), contract.symbol(), contract.totalSupply(),
      contract.totalRevenueReceived(), contract.maturityDate(),
      contract.revenueShareBPS(), contract.protocol(), contract.router(), contract.active(),
    ]);

  const now = Math.floor(Date.now() / 1000);
  const isMatured = now >= maturityDate.toNumber();
  const isActive = active && !isMatured;

  return {
    address,
    name, symbol,
    totalSupply: ethers.utils.formatEther(totalSupply),
    totalRevenueReceived: ethers.utils.formatEther(totalRevenueReceived),
    totalRevenueDistributed: ethers.utils.formatEther(totalRevenueReceived),
    distributionCount: '0',
    maturityDate: maturityDate.toNumber(),
    revenueShareBPS: revenueShareBPS.toNumber(),
    protocolAddress, routerAddress,
    isActive, isMatured,
    bondType: 'SOFT',
    reputationScore: 0,
  };
}

async function fetchFromContract(address) {
  const contract = Web3Manager.getContract(address, SERIES_ABI);

  // Use getSeriesInfo() for efficient single call, or individual calls
  const [
    name,
    symbol,
    totalSupply,
    totalRevenueReceived,
    maturityDate,
    revenueShareBPS,
    protocolAddress,
    routerAddress,
    active,
  ] = await Promise.all([
    contract.name(),
    contract.symbol(),
    contract.totalSupply(),
    contract.totalRevenueReceived(),
    contract.maturityDate(),
    contract.revenueShareBPS(),
    contract.protocol(),
    contract.router(),
    contract.active(),
  ]);

  // Calculate if matured
  const now = Math.floor(Date.now() / 1000);
  const isMatured = now >= maturityDate.toNumber();
  const isActive = active && !isMatured;

  return {
    address,
    name,
    symbol,
    totalSupply: ethers.utils.formatEther(totalSupply),
    totalRevenueReceived: ethers.utils.formatEther(totalRevenueReceived),
    totalRevenueDistributed: ethers.utils.formatEther(totalRevenueReceived), // V2 doesn't track distributed separately
    distributionCount: '0', // V2 doesn't track distribution count
    maturityDate: maturityDate.toNumber(),
    revenueShareBPS: revenueShareBPS.toNumber(),
    protocolAddress,
    routerAddress,
    isActive,
    isMatured,
    bondType: 'SOFT', // TODO: detect from contract
    reputationScore: 0, // TODO: fetch from reputation registry
  };
}


// ============================================
// RENDER FUNCTIONS
// ============================================

function renderIdentity(data) {
  document.getElementById('series-name').textContent = data.name;
  document.getElementById('series-symbol').textContent = data.symbol;
  
  // Type badge
  const typeBadge = document.getElementById('series-type-badge');
  typeBadge.className = `badge badge-${data.bondType.toLowerCase()}`;
  typeBadge.textContent = data.bondType;

  // Status badge
  const statusBadge = document.getElementById('series-status-badge');
  if (data.isMatured) {
    statusBadge.className = 'badge badge-matured';
    statusBadge.textContent = '⚫ MATURED';
  } else if (data.isActive) {
    statusBadge.className = 'badge badge-active';
    statusBadge.textContent = '🟢 ACTIVE';
  } else {
    statusBadge.className = 'badge badge-paused';
    statusBadge.textContent = '⏸ PAUSED';
  }

  // Addresses
  document.getElementById('series-address').textContent = formatAddress(data.address);
  document.getElementById('series-address').href = `https://arbiscan.io/address/${data.address}`;
  
  document.getElementById('protocol-address').textContent = formatAddress(data.protocolAddress);
  document.getElementById('protocol-address').href = `https://arbiscan.io/address/${data.protocolAddress}`;
  
  document.getElementById('router-address').textContent = formatAddress(data.routerAddress);
  document.getElementById('router-address').href = `https://arbiscan.io/address/${data.routerAddress}`;

  // Bond type
  document.getElementById('series-bond-type').textContent = data.bondType;

  // Dates
  if (data.createdAt) {
    const createdDate = new Date(data.createdAt * 1000);
    document.getElementById('series-created').textContent = createdDate.toLocaleDateString();
  }

  const maturityDate = new Date(data.maturityDate * 1000);
  document.getElementById('series-maturity').textContent = maturityDate.toLocaleDateString();
}

function renderMetrics(data) {
  // Key metrics
  document.getElementById('metric-supply').textContent = formatNumber(data.totalSupply);
  document.getElementById('metric-revenue').textContent = formatETH(data.totalRevenueReceived);
  document.getElementById('metric-revenue-usd').textContent = formatUSD(data.totalRevenueReceived);

  // Revenue per token
  const perToken = parseFloat(data.totalSupply) > 0 
    ? parseFloat(data.totalRevenueDistributed) / parseFloat(data.totalSupply)
    : 0;
  document.getElementById('metric-per-token').textContent = perToken.toFixed(6) + ' ETH';

  document.getElementById('metric-holders').textContent = data.holderCount || '0';

  // Additional metrics
  document.getElementById('metric-share').textContent = (data.revenueShareBPS / 100).toFixed(1) + '%';
  document.getElementById('metric-distributions').textContent = data.distributionCount;

  // APY calculation
  const apy = calculateAPY(data);
  document.getElementById('metric-apy').textContent = apy ? apy.toFixed(1) + '%' : 'N/A';

  // Reputation
  const score = data.reputationScore || 0;
  document.getElementById('reputation-score').textContent = score;
  document.getElementById('reputation-fill').style.width = score + '%';

  // Hide countdown if matured
  if (data.isMatured) {
    document.getElementById('countdown-section').style.display = 'none';
  }
}

async function renderHolderActions(data) {
  const holderBlock = document.getElementById('holder-actions');
  
  try {
    if (typeof Web3Manager === 'undefined' || typeof ethers === 'undefined') {
      console.log('Web3 not available, skipping holder actions');
      return;
    }
    
    const contract = Web3Manager.getContract(data.address, SERIES_ABI);
    const balance = await contract.balanceOf(userAddress);
    
    if (balance.gt(0)) {
      const claimable = await contract.calculateClaimable(userAddress);
      
      document.getElementById('holder-balance').textContent = formatNumber(ethers.utils.formatEther(balance));
      document.getElementById('holder-claimable').textContent = formatETH(ethers.utils.formatEther(claimable));
      document.getElementById('holder-claimable-usd').textContent = formatUSD(ethers.utils.formatEther(claimable));
      document.getElementById('holder-claimed').textContent = '0 ETH'; // TODO: track claimed amount

      // Setup claim button
      const claimBtn = document.getElementById('claim-btn');
      claimBtn.disabled = claimable.eq(0);
      claimBtn.onclick = () => claimRevenue(data.address);

      holderBlock.style.display = 'block';
    }
  } catch (error) {
    console.error('Error loading holder data:', error);
  }
}

async function renderProtocolActions(data) {
  const protocolBlock = document.getElementById('protocol-actions');
  
  try {
    if (typeof Web3Manager === 'undefined' || typeof ethers === 'undefined') {
      console.log('Web3 not available, skipping protocol actions');
      return;
    }
    
    // Setup distribute button
    const distributeBtn = document.getElementById('distribute-btn');
    distributeBtn.onclick = () => distributeRevenue(data.address);

    // Setup route button
    const routeBtn = document.getElementById('route-btn');
    routeBtn.onclick = () => routeRevenue(data.routerAddress);

    // Load router status
    // getRouterStatus returns: (balance, totalReceived, totalToSeries, totalToProtocol, failedAttempts, shareBPS, canRouteNow)
    if (data.routerAddress && typeof ethers !== 'undefined' && data.routerAddress !== ethers.constants.AddressZero) {
      const routerContract = Web3Manager.getContract(data.routerAddress, ROUTER_ABI);
      const status = await routerContract.getRouterStatus();
      const pending = await routerContract.pendingToRoute();
      
      const balance = status[0];
      const availableToWithdraw = pending.eq(0) ? balance : ethers.BigNumber.from(0);
      
      document.getElementById('router-balance').textContent = formatETH(ethers.utils.formatEther(balance));
      document.getElementById('router-available').textContent = formatETH(ethers.utils.formatEther(availableToWithdraw));

      // Setup withdraw button (can only withdraw when pendingToRoute == 0)
      const withdrawBtn = document.getElementById('withdraw-btn');
      withdrawBtn.disabled = availableToWithdraw.eq(0);
      withdrawBtn.onclick = () => withdrawFromRouter(data.routerAddress);
    }

    protocolBlock.style.display = 'block';
  } catch (error) {
    console.error('Error loading protocol data:', error);
  }
}

// ============================================
// ACTIONS
// ============================================

async function claimRevenue(seriesAddress) {
  try {
    const contract = Web3Manager.getContract(seriesAddress, SERIES_ABI);
    const tx = await contract.claimRevenue();
    
    showSuccess('Transaction submitted! Waiting for confirmation...');
    await tx.wait();
    
    showSuccess('Revenue claimed successfully!');
    await loadSeriesData();
  } catch (error) {
    console.error('Error claiming revenue:', error);
    showError('Failed to claim revenue: ' + error.message);
  }
}

async function distributeRevenue(seriesAddress) {
  try {
    const amount = document.getElementById('distribute-amount').value;
    if (!amount || parseFloat(amount) <= 0) {
      showError('Please enter a valid amount');
      return;
    }

    const contract = Web3Manager.getContract(seriesAddress, SERIES_ABI);
    const tx = await contract.distributeRevenue({
      value: ethers.utils.parseEther(amount),
    });
    
    showSuccess('Transaction submitted! Waiting for confirmation...');
    await tx.wait();
    
    showSuccess('Revenue distributed successfully!');
    document.getElementById('distribute-amount').value = '';
    await loadSeriesData();
  } catch (error) {
    console.error('Error distributing revenue:', error);
    showError('Failed to distribute revenue: ' + error.message);
  }
}

async function routeRevenue(routerAddress) {
  try {
    const contract = Web3Manager.getContract(routerAddress, ROUTER_ABI);
    const tx = await contract.routeRevenue();
    
    showSuccess('Transaction submitted! Waiting for confirmation...');
    await tx.wait();
    
    showSuccess('Revenue routed successfully!');
    await loadSeriesData();
  } catch (error) {
    console.error('Error routing revenue:', error);
    showError('Failed to route revenue: ' + error.message);
  }
}

async function withdrawFromRouter(routerAddress) {
  try {
    const contract = Web3Manager.getContract(routerAddress, ROUTER_ABI);
    const tx = await contract.withdrawAllToProtocol();
    
    showSuccess('Transaction submitted! Waiting for confirmation...');
    await tx.wait();
    
    showSuccess('Funds withdrawn successfully!');
    await loadSeriesData();
  } catch (error) {
    console.error('Error withdrawing:', error);
    showError('Failed to withdraw: ' + error.message);
  }
}

// ============================================
// COUNTDOWN
// ============================================

function startCountdown() {
  updateCountdown();
  setInterval(updateCountdown, 60000); // Update every minute
}

function updateCountdown() {
  if (!seriesData || seriesData.isMatured) return;

  const now = Math.floor(Date.now() / 1000);
  const remaining = seriesData.maturityDate - now;

  if (remaining <= 0) {
    document.getElementById('countdown-section').innerHTML = '<h3 style="text-align: center; color: var(--gray-600);">Series has matured</h3>';
    return;
  }

  const days = Math.floor(remaining / 86400);
  const hours = Math.floor((remaining % 86400) / 3600);
  const minutes = Math.floor((remaining % 3600) / 60);

  document.getElementById('days').textContent = days;
  document.getElementById('hours').textContent = hours;
  document.getElementById('minutes').textContent = minutes;
}

// ============================================
// UTILITIES
// ============================================

function formatAddress(address) {
  if (!address) return '';
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

function formatETH(value) {
  const num = parseFloat(value);
  if (num >= 1000000) {
    return (num / 1000000).toFixed(2) + 'M ETH';
  } else if (num >= 1000) {
    return (num / 1000).toFixed(2) + 'K ETH';
  } else {
    return num.toFixed(4) + ' ETH';
  }
}

function formatUSD(ethValue) {
  const num = parseFloat(ethValue) * ETH_PRICE_USD;
  if (num >= 1000000000) {
    return '≈ $' + (num / 1000000000).toFixed(2) + 'B USD';
  } else if (num >= 1000000) {
    return '≈ $' + (num / 1000000).toFixed(1) + 'M USD';
  } else if (num >= 1000) {
    return '≈ $' + (num / 1000).toFixed(1) + 'K USD';
  } else {
    return '≈ $' + num.toFixed(0) + ' USD';
  }
}

function formatNumber(value) {
  const num = parseFloat(value);
  if (num >= 1000000) {
    return (num / 1000000).toFixed(2) + 'M';
  } else if (num >= 1000) {
    return (num / 1000).toFixed(2) + 'K';
  } else {
    return num.toFixed(2);
  }
}

function calculateAPY(data) {
  // Simple APY calculation based on revenue and supply
  if (!data.totalSupply || parseFloat(data.totalSupply) === 0) return null;
  if (!data.totalRevenueDistributed || parseFloat(data.totalRevenueDistributed) === 0) return null;

  const revenue = parseFloat(data.totalRevenueDistributed);
  const supply = parseFloat(data.totalSupply);
  const daysElapsed = data.createdAt ? (Date.now() / 1000 - data.createdAt) / 86400 : 30;

  const dailyReturn = (revenue / supply) / daysElapsed;
  const apy = (dailyReturn * 365) * 100;

  return apy;
}

function showError(message) {
  console.error('showError called:', message);
  
  // Hide loading state
  const loadingState = document.getElementById('loading-state');
  if (loadingState) loadingState.style.display = 'none';
  
  // Show error in the page
  const seriesContent = document.getElementById('series-content');
  if (seriesContent) {
    seriesContent.style.display = 'block';
    seriesContent.innerHTML = `
      <div style="text-align: center; padding: 4rem 2rem; background: #fee; border-radius: 12px; border: 2px solid #f88;">
        <h2 style="color: #c33; margin-bottom: 1rem;">⚠️ Error Loading Series</h2>
        <p style="color: #666; font-size: 1.1rem; margin-bottom: 2rem;">${message}</p>
        <a href="/dashboard.html" class="btn" style="display: inline-block; padding: 0.75rem 2rem;">
          ← Back to Dashboard
        </a>
      </div>
    `;
  } else {
    // Fallback to alert if DOM not ready
    alert('Error: ' + message);
  }
}

function showSuccess(message) {
  console.log('Success:', message);
  // TODO: Implement toast notifications
}
