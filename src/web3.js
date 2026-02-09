// ============================================
// WEB3 PROVIDER & WALLET CONNECTION
// ============================================

const ARBITRUM_CHAIN_ID = '0xa4b1'; // 42161 in hex (Arbitrum One)
const ARBITRUM_RPC = 'https://arb1.arbitrum.io/rpc';

// Contract addresses
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
// WALLET CONNECTION
// ============================================

async function connectWallet() {
  try {
    // Check if ethers.js is loaded
    if (typeof ethers === 'undefined') {
      throw new Error('Ethers.js library not loaded. Please refresh the page.');
    }

    if (!window.ethereum) {
      throw new Error('No wallet detected. Please install MetaMask or Rabby.');
    }

    // Request account access
    const accounts = await window.ethereum.request({
      method: 'eth_requestAccounts',
    });

    if (!accounts || accounts.length === 0) {
      throw new Error('No accounts found');
    }

    // Initialize provider
    provider = new ethers.providers.Web3Provider(window.ethereum);
    signer = provider.getSigner();
    userAddress = accounts[0];

    // Get chain ID
    const network = await provider.getNetwork();
    chainId = '0x' + network.chainId.toString(16);

    // Check if on Arbitrum
    if (chainId !== ARBITRUM_CHAIN_ID) {
      await switchToArbitrum();
    }

    // Setup listeners
    setupWalletListeners();

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
  updateWalletUI();
  hideUserPosition();
}

async function switchToArbitrum() {
  try {
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: ARBITRUM_CHAIN_ID }],
    });
  } catch (switchError) {
    // Chain not added, try to add it
    if (switchError.code === 4902) {
      try {
        await window.ethereum.request({
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

function setupWalletListeners() {
  if (!window.ethereum) return;

  window.ethereum.on('accountsChanged', (accounts) => {
    if (accounts.length === 0) {
      disconnectWallet();
    } else {
      userAddress = accounts[0];
      updateWalletUI();
      loadUserPosition();
    }
  });

  window.ethereum.on('chainChanged', (newChainId) => {
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
  // This should fetch from subgraph or contract
  // For now, return mock data
  if (USE_MOCK_DATA) {
    return getMockData('revenueSeries').revenueSeries;
  }
  
  // TODO: Fetch from subgraph when deployed
  const data = await fetchGraphQL(ACTIVE_SERIES_QUERY, {
    first: 100,
    skip: 0,
    orderBy: 'createdAt',
    orderDirection: 'desc',
  });
  
  return data.revenueSeries || [];
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
