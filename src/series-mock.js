// Mock data for testing series.html page
// This simulates the data that would come from the blockchain

const MOCK_SERIES_DATA = {
  // Series Identity
  address: "0x88122C5805281bAbF3B172fA212a6F6300Bb1EF3",
  name: "Revenue Bonds Genesis - Built for the underdogs",
  symbol: "UNDERDOG-RB",
  bondType: "SOFT",
  
  // Protocol Info
  protocol: {
    address: "0x48CF80F950E52d6D55537a2A7de0Dbd7e1532f77",
    reputationScore: 75,
    blacklisted: false
  },
  
  // Router
  router: {
    address: "0x8a4796F943Ed862671115fefAB860AC12B2772eE"
  },
  
  // Dates
  createdAt: "2026-01-19T15:30:00Z",
  maturityDate: "2026-07-19T15:30:00Z", // 180 days from creation
  
  // Metrics
  totalSupply: "100000",
  revenueSharePercentage: 20, // 20%
  totalRevenueReceived: "1.25", // ETH
  distributionCount: 3,
  holderCount: 42,
  estimatedAPY: 15.5,
  
  // Status
  isMatured: false,
  isPaused: false,
  
  // User Position (if wallet connected)
  userPosition: {
    balance: "500", // tokens
    claimableRevenue: "0.0125", // ETH
    totalClaimed: "0.0075" // ETH
  },
  
  // Router Status (for protocol owner)
  routerStatus: {
    balance: "0.05", // ETH
    availableToWithdraw: "0.03" // ETH
  },
  
  // Is user the protocol owner?
  isProtocolOwner: false
};

// Helper functions to format data
function formatETH(value) {
  return parseFloat(value).toFixed(4) + " ETH";
}

function formatUSD(ethValue, ethPrice = 3000) {
  const usd = parseFloat(ethValue) * ethPrice;
  return "≈ $" + usd.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function formatNumber(value) {
  return parseInt(value).toLocaleString('en-US');
}

function formatPercentage(value) {
  return value + "%";
}

function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

function formatAddress(address) {
  return address.slice(0, 6) + "..." + address.slice(-4);
}

function getReputationColor(score) {
  if (score >= 80) return '#10b981'; // green
  if (score >= 60) return '#f59e0b'; // yellow
  if (score >= 40) return '#ff6224'; // orange
  return '#ef4444'; // red
}

function getBadgeClass(type) {
  return 'badge-' + type.toLowerCase();
}

// Countdown timer
function updateCountdown() {
  const maturityDate = new Date(MOCK_SERIES_DATA.maturityDate);
  const now = new Date();
  const diff = maturityDate - now;
  
  if (diff <= 0) {
    document.getElementById('countdown-section').innerHTML = '<p style="text-align: center; color: var(--green); font-size: 1.5rem; font-weight: 700;">🎉 MATURED</p>';
    return;
  }
  
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);
  
  document.getElementById('days').textContent = days;
  document.getElementById('hours').textContent = hours;
  document.getElementById('minutes').textContent = minutes;
  document.getElementById('seconds').textContent = seconds;
}

// Load mock data into the page
function loadMockData() {
  const data = MOCK_SERIES_DATA;
  
  // Header
  document.getElementById('series-name').textContent = data.name;
  document.getElementById('series-symbol').textContent = data.symbol;
  
  // Type badge
  const typeBadge = document.getElementById('series-type-badge');
  typeBadge.innerHTML = `<span class="badge ${getBadgeClass(data.bondType)}">${data.bondType}</span>`;
  
  // Status badge
  const statusBadge = document.getElementById('series-status-badge');
  if (data.isMatured) {
    statusBadge.innerHTML = '<span class="badge badge-matured">MATURED</span>';
  } else if (data.isPaused) {
    statusBadge.innerHTML = '<span class="badge badge-paused">PAUSED</span>';
  } else {
    statusBadge.innerHTML = '<span class="badge badge-active">ACTIVE</span>';
  }
  
  // Block A: Identity
  document.getElementById('series-address').textContent = formatAddress(data.address);
  document.getElementById('series-address').href = `https://arbiscan.io/address/${data.address}`;
  document.getElementById('series-bond-type').textContent = data.bondType;
  document.getElementById('protocol-address').textContent = formatAddress(data.protocol.address);
  document.getElementById('protocol-address').href = `https://arbiscan.io/address/${data.protocol.address}`;
  document.getElementById('router-address').textContent = formatAddress(data.router.address);
  document.getElementById('router-address').href = `https://arbiscan.io/address/${data.router.address}`;
  document.getElementById('series-created').textContent = formatDate(data.createdAt);
  document.getElementById('series-maturity').textContent = formatDate(data.maturityDate);
  
  // Block B: Metrics
  document.getElementById('metric-supply').textContent = formatNumber(data.totalSupply);
  document.getElementById('metric-revenue').textContent = formatETH(data.totalRevenueReceived);
  document.getElementById('metric-revenue-usd').textContent = formatUSD(data.totalRevenueReceived);
  
  const revenuePerToken = parseFloat(data.totalRevenueReceived) / parseFloat(data.totalSupply);
  document.getElementById('metric-per-token').textContent = revenuePerToken.toFixed(8) + " ETH";
  
  document.getElementById('metric-holders').textContent = formatNumber(data.holderCount);
  document.getElementById('metric-share').textContent = formatPercentage(data.revenueSharePercentage);
  document.getElementById('metric-distributions').textContent = data.distributionCount;
  document.getElementById('metric-apy').textContent = formatPercentage(data.estimatedAPY);
  
  // Reputation
  document.getElementById('reputation-score').textContent = data.protocol.reputationScore;
  document.getElementById('reputation-score').style.color = getReputationColor(data.protocol.reputationScore);
  document.getElementById('reputation-fill').style.width = data.protocol.reputationScore + '%';
  
  // Countdown
  updateCountdown();
  setInterval(updateCountdown, 1000);
  
  // Block C: User Position
  if (data.userPosition) {
    const holderActions = document.getElementById('holder-actions');
    if (holderActions) {
      holderActions.style.display = 'block';
    }
    document.getElementById('holder-balance').textContent = formatNumber(data.userPosition.balance);
    document.getElementById('holder-claimable').textContent = formatETH(data.userPosition.claimableRevenue);
    document.getElementById('holder-claimable-usd').textContent = formatUSD(data.userPosition.claimableRevenue);
    document.getElementById('holder-claimed').textContent = formatETH(data.userPosition.totalClaimed);
  }
  
  // Block D: Protocol Actions (only if owner)
  if (data.isProtocolOwner) {
    document.getElementById('protocol-actions').style.display = 'block';
    document.getElementById('router-balance').textContent = formatETH(data.routerStatus.balance);
    document.getElementById('router-available').textContent = formatETH(data.routerStatus.availableToWithdraw);
  }
  
  // Hide loading, show content
  document.getElementById('loading-state').style.display = 'none';
  document.getElementById('series-content').style.display = 'block';
}

// Mock button actions
function setupMockActions() {
  // Claim button
  document.getElementById('claim-btn').addEventListener('click', () => {
    alert('Mock: Claiming ' + MOCK_SERIES_DATA.userPosition.claimableRevenue + ' ETH');
  });
  
  // Claim via relayer
  document.getElementById('claim-relayer-btn').addEventListener('click', () => {
    alert('Mock: Claiming via relayer (gasless)');
  });
  
  // Distribute (if protocol owner)
  const distributeBtn = document.getElementById('distribute-btn');
  if (distributeBtn) {
    distributeBtn.addEventListener('click', () => {
      const amount = document.getElementById('distribute-amount').value;
      alert('Mock: Distributing ' + amount + ' ETH to holders');
    });
  }
  
  // Route via router
  const routeBtn = document.getElementById('route-btn');
  if (routeBtn) {
    routeBtn.addEventListener('click', () => {
      alert('Mock: Routing revenue via router');
    });
  }
  
  // Withdraw from router
  const withdrawBtn = document.getElementById('withdraw-btn');
  if (withdrawBtn) {
    withdrawBtn.addEventListener('click', () => {
      alert('Mock: Withdrawing ' + MOCK_SERIES_DATA.routerStatus.availableToWithdraw + ' ETH from router');
    });
  }
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', () => {
  console.log('🎭 Loading MOCK data for series page...');
  loadMockData();
  setupMockActions();
  console.log('✅ Mock data loaded successfully!');
});
