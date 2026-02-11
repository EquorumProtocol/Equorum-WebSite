// ============================================
// WEB3 PROVIDER & WALLET CONNECTION
// ============================================

const ARBITRUM_CHAIN_ID = '0xa4b1'; // 42161 in hex (Arbitrum One)
const ARBITRUM_RPC = 'https://arb1.arbitrum.io/rpc';

// Multiple RPCs for browser fallback (CORS issues vary by provider)
const ARBITRUM_RPC_LIST = [
  'https://arb1.arbitrum.io/rpc',
  'https://arbitrum-one-rpc.publicnode.com',
  'https://1rpc.io/arb',
  'https://arbitrum.drpc.org',
];

async function getWorkingProvider() {
  for (const rpc of ARBITRUM_RPC_LIST) {
    try {
      const p = new ethers.providers.JsonRpcProvider(rpc);
      await p.getBlockNumber();
      console.log('RPC connected:', rpc);
      return p;
    } catch (e) {
      console.warn('RPC failed:', rpc, e.message);
    }
  }
  throw new Error('All RPC providers failed');
}

// Cached provider
let _cachedBrowserProvider = null;
async function getBrowserProvider() {
  if (_cachedBrowserProvider) return _cachedBrowserProvider;
  _cachedBrowserProvider = await getWorkingProvider();
  return _cachedBrowserProvider;
}

// Contract addresses - V1 (legacy)
const V1_FACTORY_ADDRESS = '0x8afA0318363FfBc29Cc28B3C98d9139C08Af737b'; // V1 Revenue Series Factory (Arbitrum One)

// Contract addresses - V2 (current)
const FACTORY_ADDRESS = '0x280E83c47E243267753B7E2f322f55c52d4D2C3a'; // V2 Revenue Series Factory (Arbitrum One)
const ESCROW_FACTORY_ADDRESS = '0x2CfE9a33050EB77fC124ec3eAac4fA4D687bE650'; // V2 Escrow Factory (Arbitrum One)

// ABIs (minimal for dashboard) - ALIGNED WITH V2 DEPLOYED CONTRACT
const ESCROW_SERIES_ABI = [
  'function balanceOf(address) view returns (uint256)',
  'function calculateClaimableRevenue(address) view returns (uint256)',
  'function calculateClaimablePrincipal(address) view returns (uint256)',
  'function claimRevenue() external',
  'function claimPrincipal() external',
  'function totalSupply() view returns (uint256)',
  'function name() view returns (string)',
  'function symbol() view returns (string)',
  'function totalRevenueReceived() view returns (uint256)',
  'function protocol() view returns (address)',
  'function router() view returns (address)',
  'function revenueShareBPS() view returns (uint256)',
  'function maturityDate() view returns (uint256)',
  'function state() view returns (uint8)',
  'function principalAmount() view returns (uint256)',
  'function principalDeposited() view returns (bool)',
  'function depositPrincipal() external payable',
  'function getBondInfo() view returns (tuple(uint256,uint256,uint256,uint256,uint256,uint256,uint256,uint8,bool))',
  'function tokenPriceWei() view returns (uint256)',
  'function saleActive() view returns (bool)',
  'function treasury() view returns (address)',
  'function minPurchaseAmount() view returns (uint256)',
  'function getAvailableForSale() view returns (uint256)',
  'function calculateBuyCost(uint256) view returns (uint256,uint256)',
  'function buyTokens(uint256) external payable',
  'function startSale(uint256,address) external',
  'function stopSale() external',
];

const ESCROW_FACTORY_ABI = [
  'function createEscrowSeries(string,string,address,uint256,uint256,uint256,uint256,uint256,uint256) external payable returns (address,address)',
  'function getAllSeries() view returns (address[])',
  'function getSeriesByProtocol(address) view returns (address[])',
  'function getTotalSeries() view returns (uint256)',
  'function getRouterForSeries(address) view returns (address)',
];

const REVENUE_SERIES_ABI = [
  'function balanceOf(address) view returns (uint256)',
  'function calculateClaimable(address) view returns (uint256)',
  'function claimRevenue() external',
  'function claimFor(address) external',
  'function totalSupply() view returns (uint256)',
  'function name() view returns (string)',
  'function symbol() view returns (string)',
  'function totalRevenueReceived() view returns (uint256)',
  'function revenuePerTokenStored() view returns (uint256)',
  'function protocol() view returns (address)',
  'function router() view returns (address)',
  'function revenueShareBPS() view returns (uint256)',
  'function maturityDate() view returns (uint256)',
  'function minDistributionAmount() view returns (uint256)',
  'function active() view returns (bool)',
  'function distributeRevenue() external payable',
  'function matureSeries() external',
  'function getSeriesInfo() view returns (address,uint256,uint256,uint256,uint256,bool,uint256)',
  'function getEffectiveMinDistribution() view returns (uint256)',
];

const FACTORY_ABI = [
  'function createSeries(string,string,address,uint256,uint256,uint256,uint256) external payable returns (address,address)',
  'function getAllSeries() view returns (address[])',
  'function getSeriesByProtocol(address) view returns (address[])',
  'function getTotalSeries() view returns (uint256)',
  'function getRouterForSeries(address) view returns (address)',
  'function getSafetyLimits() pure returns (uint256,uint256,uint256,uint256)',
  'function getPolicies() view returns (address,address,address)',
  'function treasury() view returns (address)',
  'function feePolicy() view returns (address)',
  'function safetyPolicy() view returns (address)',
  'function accessPolicy() view returns (address)',
  'function paused() view returns (bool)',
];

const ROUTER_ABI = [
  'function getRouterStatus() view returns (uint256,uint256,uint256,uint256,uint256,uint256,bool)',
  'function receiveAndRoute() external payable',
  'function routeRevenue() external',
  'function withdrawToProtocol(uint256) external',
  'function withdrawAllToProtocol() external',
  'function emergencyWithdraw(address) external',
  'function pause() external',
  'function unpause() external',
  'function pendingToRoute() view returns (uint256)',
  'function totalRoutedToSeries() view returns (uint256)',
  'function failedRouteCount() view returns (uint256)',
  'function protocol() view returns (address)',
  'function revenueSeries() view returns (address)',
  'function revenueShareBPS() view returns (uint256)',
];

// State
let provider = null;
let signer = null;
let userAddress = null;
let chainId = null;

// ============================================
// EIP-6963: Multi-Wallet Discovery
// ============================================
const detectedProviders = [];

window.addEventListener('eip6963:announceProvider', (event) => {
  const { info, provider: walletProvider } = event.detail;
  detectedProviders.push({ info, provider: walletProvider });
  console.log('EIP-6963 wallet detected:', info.name);
});

// Request providers to announce themselves
window.dispatchEvent(new Event('eip6963:requestProvider'));

// Get the best available wallet provider (prefers MetaMask via EIP-6963, falls back to window.ethereum)
function getInjectedProvider() {
  // Try EIP-6963 first — prefer MetaMask
  const metamask = detectedProviders.find(p => p.info.rdns === 'io.metamask' || p.info.name.toLowerCase().includes('metamask'));
  if (metamask) {
    console.log('Using EIP-6963 provider:', metamask.info.name);
    return metamask.provider;
  }
  // Fallback: first EIP-6963 provider
  if (detectedProviders.length > 0) {
    console.log('Using EIP-6963 provider:', detectedProviders[0].info.name);
    return detectedProviders[0].provider;
  }
  // Final fallback: window.ethereum (may cause conflict warning but still works)
  if (window.ethereum) {
    console.log('Using window.ethereum fallback');
    return window.ethereum;
  }
  return null;
}

// ============================================
// WALLET CONNECTION
// ============================================

async function connectWallet() {
  try {
    // Check if ethers.js is loaded
    if (typeof ethers === 'undefined') {
      throw new Error('Ethers.js library not loaded. Please refresh the page.');
    }

    const injected = getInjectedProvider();
    if (!injected) {
      throw new Error('No wallet detected. Please install MetaMask or Rabby.');
    }

    // Request account access
    const accounts = await injected.request({
      method: 'eth_requestAccounts',
    });

    if (!accounts || accounts.length === 0) {
      throw new Error('No accounts found');
    }

    // Initialize provider
    provider = new ethers.providers.Web3Provider(injected);
    signer = provider.getSigner();
    userAddress = accounts[0];

    // Get chain ID
    const network = await provider.getNetwork();
    chainId = '0x' + network.chainId.toString(16);

    // Check if on Arbitrum
    if (chainId !== ARBITRUM_CHAIN_ID) {
      await switchToArbitrum(injected);
    }

    // Setup listeners
    setupWalletListeners(injected);

    // Persist connection
    localStorage.setItem('walletConnected', 'true');

    // Update UI
    updateWalletUI();
    await loadUserPosition();

    return { address: userAddress, chainId };
  } catch (error) {
    console.error('Error connecting wallet:', error);
    showError(error.message);
    throw error;
  }
}

async function disconnectWallet() {
  provider = null;
  signer = null;
  userAddress = null;
  chainId = null;
  localStorage.removeItem('walletConnected');
  updateWalletUI();
  hideUserPosition();
}

// Auto-reconnect wallet on page load if previously connected
async function autoReconnectWallet() {
  const injected = getInjectedProvider();
  if (localStorage.getItem('walletConnected') === 'true' && injected) {
    try {
      const accounts = await injected.request({ method: 'eth_accounts' });
      if (accounts && accounts.length > 0) {
        provider = new ethers.providers.Web3Provider(injected);
        signer = provider.getSigner();
        userAddress = accounts[0];
        const network = await provider.getNetwork();
        chainId = '0x' + network.chainId.toString(16);
        setupWalletListeners(injected);
        updateWalletUI();
        await loadUserPosition();
        console.log('Wallet auto-reconnected:', userAddress);
      }
    } catch (err) {
      console.warn('Auto-reconnect failed:', err.message);
    }
  }
}

// Run auto-reconnect when DOM is ready (small delay to let EIP-6963 providers announce)
function scheduleAutoReconnect() {
  setTimeout(autoReconnectWallet, 100);
}
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', scheduleAutoReconnect);
} else {
  scheduleAutoReconnect();
}

async function switchToArbitrum(injected) {
  const wallet = injected || getInjectedProvider();
  try {
    await wallet.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: ARBITRUM_CHAIN_ID }],
    });
  } catch (switchError) {
    // Chain not added, try to add it
    if (switchError.code === 4902) {
      try {
        await wallet.request({
          method: 'wallet_addEthereumChain',
          params: [
            {
              chainId: ARBITRUM_CHAIN_ID,
              chainName: 'Arbitrum One',
              nativeCurrency: {
                name: 'Ether',
                symbol: 'ETH',
                decimals: 18,
              },
              rpcUrls: [ARBITRUM_RPC],
              blockExplorerUrls: ['https://arbiscan.io'],
            },
          ],
        });
      } catch (addError) {
        throw new Error('Failed to add Arbitrum network');
      }
    } else {
      throw switchError;
    }
  }
}

function setupWalletListeners(injected) {
  const wallet = injected || getInjectedProvider();
  if (!wallet || !wallet.on) return;

  wallet.on('accountsChanged', (accounts) => {
    if (accounts.length === 0) {
      disconnectWallet();
    } else {
      userAddress = accounts[0];
      updateWalletUI();
      loadUserPosition();
    }
  });

  wallet.on('chainChanged', (newChainId) => {
    chainId = newChainId;
    if (chainId !== ARBITRUM_CHAIN_ID) {
      showNetworkWarning();
    } else {
      hideNetworkWarning();
      loadUserPosition();
    }
  });
}

// ============================================
// USER POSITION (ON-CHAIN DATA)
// ============================================

async function loadUserPosition() {
  if (!userAddress || !provider) return;

  try {
    // Get all series from subgraph or contract
    const series = await getAllSeries();
    
    let totalBondsHeld = 0;
    let totalClaimable = ethers.BigNumber.from(0);
    let totalInvested = ethers.BigNumber.from(0);
    const userSeries = [];

    // Check each series for user balance
    for (const s of series) {
      const contract = new ethers.Contract(s.id, REVENUE_SERIES_ABI, provider);
      
      const balance = await contract.balanceOf(userAddress);
      if (balance.gt(0)) {
        const claimable = await contract.calculateClaimable(userAddress);
        
        totalBondsHeld++;
        totalClaimable = totalClaimable.add(claimable);
        totalInvested = totalInvested.add(balance);
        
        userSeries.push({
          address: s.id,
          name: s.name,
          balance: balance,
          claimable: claimable,
        });
      }
    }

    // Update UI
    renderUserPosition({
      bondsHeld: totalBondsHeld,
      claimableRevenue: ethers.utils.formatEther(totalClaimable),
      investedPrincipal: ethers.utils.formatEther(totalInvested),
      series: userSeries,
    });
  } catch (error) {
    console.error('Error loading user position:', error);
  }
}

async function claimAll() {
  if (!signer || !userAddress) {
    showError('Please connect wallet first');
    return;
  }

  try {
    showLoading('Claiming revenue from all series...');

    const series = await getAllSeries();
    const claimTxs = [];

    for (const s of series) {
      const contract = new ethers.Contract(s.id, REVENUE_SERIES_ABI, signer);
      const claimable = await contract.calculateClaimable(userAddress);
      
      if (claimable.gt(0)) {
        const tx = await contract.claimRevenue();
        claimTxs.push({ series: s.name, tx });
      }
    }

    if (claimTxs.length === 0) {
      showInfo('No revenue to claim');
      return;
    }

    // Wait for all transactions
    for (const { series, tx } of claimTxs) {
      await tx.wait();
      showSuccess(`Claimed revenue from ${series}`);
    }

    // Refresh position
    await loadUserPosition();
  } catch (error) {
    console.error('Error claiming revenue:', error);
    showError(error.message);
  } finally {
    hideLoading();
  }
}

// ============================================
// CONTRACT INTERACTIONS
// ============================================

async function getAllSeries() {
  // Fetch all series from V1 + V2 factories via RPC
  try {
    const rpcProvider = await getBrowserProvider();
    const factoryAbi = ['function getAllSeries() view returns (address[])'];
    const seriesAbi = ['function name() view returns (string)'];
    const results = [];

    // V1 Factory
    try {
      const f1 = new ethers.Contract(V1_FACTORY_ADDRESS, factoryAbi, rpcProvider);
      const addrs = await f1.getAllSeries();
      for (const addr of addrs) {
        try {
          const s = new ethers.Contract(addr, seriesAbi, rpcProvider);
          const name = await s.name();
          results.push({ id: addr, name });
        } catch (e) { results.push({ id: addr, name: 'Unknown' }); }
      }
    } catch (e) { console.warn('V1 getAllSeries failed:', e.message); }

    // V2 Soft Factory
    try {
      const f2 = new ethers.Contract(FACTORY_ADDRESS, factoryAbi, rpcProvider);
      const addrs = await f2.getAllSeries();
      for (const addr of addrs) {
        try {
          const s = new ethers.Contract(addr, seriesAbi, rpcProvider);
          const name = await s.name();
          results.push({ id: addr, name });
        } catch (e) { results.push({ id: addr, name: 'Unknown' }); }
      }
    } catch (e) { console.warn('V2 Soft getAllSeries failed:', e.message); }

    return results;
  } catch (e) {
    console.warn('getAllSeries failed:', e.message);
    return [];
  }
}

function getContract(address, abi) {
  if (!provider) throw new Error('Provider not initialized');
  return new ethers.Contract(address, abi, signer || provider);
}

// ============================================
// UI UPDATES
// ============================================

function updateWalletUI() {
  const connectBtn = document.getElementById('connect-wallet-btn');
  const walletInfo = document.getElementById('wallet-info');

  if (!userAddress) {
    // Not connected
    if (connectBtn) {
      connectBtn.textContent = 'Connect Wallet';
      connectBtn.onclick = connectWallet;
    }
    if (walletInfo) walletInfo.style.display = 'none';
  } else {
    // Connected
    if (connectBtn) {
      connectBtn.textContent = formatAddress(userAddress);
      connectBtn.onclick = disconnectWallet;
    }
    
    if (walletInfo) {
      walletInfo.style.display = 'flex';
      document.getElementById('wallet-address').textContent = formatAddress(userAddress);
      document.getElementById('wallet-network').textContent = chainId === ARBITRUM_CHAIN_ID ? 'Arbitrum One' : 'Wrong Network';
      
      if (chainId !== ARBITRUM_CHAIN_ID) {
        showNetworkWarning();
      } else {
        hideNetworkWarning();
      }
    }
  }
}

function renderUserPosition(data) {
  const positionCard = document.getElementById('user-position-card');
  if (!positionCard) return;

  positionCard.style.display = 'block';
  
  document.getElementById('user-bonds-held').textContent = data.bondsHeld;
  document.getElementById('user-claimable').textContent = formatETH(data.claimableRevenue);
  document.getElementById('user-invested').textContent = formatETH(data.investedPrincipal);
  
  const claimBtn = document.getElementById('claim-all-btn');
  if (claimBtn) {
    claimBtn.disabled = parseFloat(data.claimableRevenue) === 0;
    claimBtn.onclick = claimAll;
  }
}

function hideUserPosition() {
  const positionCard = document.getElementById('user-position-card');
  if (positionCard) positionCard.style.display = 'none';
}

function showNetworkWarning() {
  const warning = document.getElementById('network-warning');
  if (warning) {
    warning.style.display = 'flex';
    const switchBtn = document.getElementById('switch-network-btn');
    if (switchBtn) switchBtn.onclick = switchToArbitrum;
  }
}

function hideNetworkWarning() {
  const warning = document.getElementById('network-warning');
  if (warning) warning.style.display = 'none';
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
  if (num >= 1000000) return (num / 1000000).toFixed(2) + 'M ETH';
  if (num >= 1000) return (num / 1000).toFixed(2) + 'K ETH';
  return num.toFixed(4) + ' ETH';
}

function formatUSD(ethValue) {
  const num = parseFloat(ethValue) * 3150;
  if (num >= 1000000000) return '≈ $' + (num / 1000000000).toFixed(2) + 'B USD';
  if (num >= 1000000) return '≈ $' + (num / 1000000).toFixed(1) + 'M USD';
  if (num >= 1000) return '≈ $' + (num / 1000).toFixed(1) + 'K USD';
  return '≈ $' + num.toFixed(0) + ' USD';
}

function formatNumber(value) {
  const num = parseFloat(value);
  if (num >= 1000000) return (num / 1000000).toFixed(2) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(2) + 'K';
  return num.toFixed(2);
}

function showError(message) {
  // TODO: Implement toast notifications
  alert('Error: ' + message);
}

function showSuccess(message) {
  // TODO: Implement toast notifications
  console.log('Success:', message);
}

function showInfo(message) {
  // TODO: Implement toast notifications
  alert(message);
}

function showLoading(message) {
  // TODO: Implement loading overlay
  console.log('Loading:', message);
}

function hideLoading() {
  // TODO: Hide loading overlay
}

// ============================================
// EXPORTS
// ============================================

window.Web3Manager = {
  connectWallet,
  disconnectWallet,
  switchToArbitrum,
  loadUserPosition,
  claimAll,
  getContract,
  isConnected: () => !!userAddress,
  getAddress: () => userAddress,
  getChainId: () => chainId,
  FACTORY_ADDRESS,
  REVENUE_SERIES_ABI,
  FACTORY_ABI,
  ROUTER_ABI,
  ESCROW_FACTORY_ADDRESS,
  ESCROW_FACTORY_ABI,
  ESCROW_SERIES_ABI,
};
