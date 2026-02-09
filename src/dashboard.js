// ============================================
// EQUORUM PROTOCOL DASHBOARD
// ============================================
// Integração com TheGraph Subgraph para dados em tempo real

// TheGraph API Endpoint (será atualizado após deploy do subgraph)
const SUBGRAPH_URL = 'https://api.studio.thegraph.com/query/<SUBGRAPH_ID>/equorum-protocol/version/latest';

// Subgraph not yet deployed - dashboard will show real data when available

// ============================================
// GRAPHQL QUERIES
// ============================================

const GLOBAL_STATS_QUERY = `
  query GlobalStats {
    protocolStats(id: "protocol-stats") {
      totalRevenueBondsCreated
      totalCapitalRaised
      totalRevenueDistributed
      totalActiveSeries
      totalMaturedSeries
      totalProtocolsFunded
      averageDeliveryRate
    }
  }
`;

const ACTIVE_SERIES_QUERY = `
  query ActiveSeries($first: Int!, $skip: Int!, $orderBy: String!, $orderDirection: String!, $where: String) {
    revenueSeries(
      first: $first
      skip: $skip
      orderBy: $orderBy
      orderDirection: $orderDirection
      where: { isActive: true }
    ) {
      id
      name
      symbol
      bondType
      protocol {
        address
        reputationScore
        deliveryRate
        blacklisted
      }
      revenueSharePercentage
      totalSupply
      totalRevenueReceived
      totalRevenueDistributed
      distributionCount
      holderCount
      maturityDate
      createdAt
      estimatedAPY
      escrow {
        principalAmount
        state
        principalDeposited
      }
    }
  }
`;

const DAILY_SNAPSHOTS_QUERY = `
  query DailySnapshots($startDate: BigInt!) {
    dailySnapshots(
      where: { date_gte: $startDate }
      orderBy: date
      orderDirection: asc
      first: 30
    ) {
      date
      totalRevenueDistributed
      totalCapitalRaised
      revenueDistributedToday
      newSeriesCreated
    }
  }
`;

// ============================================
// API FUNCTIONS
// ============================================

async function fetchGraphQL(query, variables = {}) {
  try {
    const response = await fetch(SUBGRAPH_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query,
        variables,
      }),
    });

    const result = await response.json();
    
    if (result.errors) {
      console.error('GraphQL Errors:', result.errors);
      throw new Error(result.errors[0].message);
    }

    return result.data;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
}

// ============================================
// FORMATTING UTILITIES
// ============================================

// ETH price (update this periodically or fetch from API)
const ETH_PRICE_USD = 3150; // Approximate ETH price in USD

function formatETH(value) {
  const num = parseFloat(value);
  if (num >= 1000000) {
    return (num / 1000000).toFixed(2) + 'M ETH';
  } else if (num >= 1000) {
    return (num / 1000).toFixed(2) + 'K ETH';
  } else {
    return num.toFixed(2) + ' ETH';
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
    return num.toFixed(0);
  }
}

function formatPercentage(value) {
  return parseFloat(value).toFixed(1) + '%';
}

function formatDate(timestamp) {
  const date = new Date(parseInt(timestamp) * 1000);
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'short',
    day: 'numeric'
  });
}

function formatAddress(address) {
  if (!address) return '';
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

function createAddressLink(address, label = null) {
  const displayText = label || formatAddress(address);
  return `
    <div style="display: flex; align-items: center; gap: 0.5rem;">
      <a href="https://arbiscan.io/address/${address}" 
         target="_blank" 
         style="color: var(--orange); text-decoration: none; font-family: 'Courier New', monospace;">
        ${displayText} ↗
      </a>
      <button onclick="copyAddress('${address}')" 
              style="background: none; border: none; cursor: pointer; padding: 0.25rem; color: var(--gray-500);"
              title="Copy address">
        📋
      </button>
    </div>
  `;
}

function copyAddress(address) {
  navigator.clipboard.writeText(address).then(() => {
    const btn = event.target;
    const originalText = btn.textContent;
    btn.textContent = '✓';
    btn.style.color = 'var(--green)';
    setTimeout(() => {
      btn.textContent = originalText;
      btn.style.color = 'var(--gray-500)';
    }, 2000);
  }).catch(err => {
    console.error('Failed to copy:', err);
  });
}

function getDaysUntilMaturity(maturityTimestamp) {
  const now = Math.floor(Date.now() / 1000);
  const maturity = parseInt(maturityTimestamp);
  const secondsRemaining = maturity - now;
  const daysRemaining = Math.floor(secondsRemaining / 86400);
  return daysRemaining > 0 ? daysRemaining : 0;
}

// ============================================
// RENDER FUNCTIONS
// ============================================

function renderHeroStats(stats) {
  document.getElementById('hero-total-bonds').textContent = stats.totalRevenueBondsCreated;
  document.getElementById('hero-capital-raised').textContent = formatETH(stats.totalCapitalRaised);
  document.getElementById('hero-capital-raised-usd').textContent = formatUSD(stats.totalCapitalRaised);
  document.getElementById('hero-revenue-distributed').textContent = formatETH(stats.totalRevenueDistributed);
  document.getElementById('hero-revenue-distributed-usd').textContent = formatUSD(stats.totalRevenueDistributed);
  document.getElementById('hero-active-series').textContent = stats.totalActiveSeries;
}

function renderKPIs(stats) {
  document.getElementById('kpi-protocols').textContent = stats.totalProtocolsFunded;
  document.getElementById('kpi-protocols-change').textContent = 'this month';
  
  document.getElementById('kpi-delivery-rate').textContent = formatPercentage(stats.averageDeliveryRate);
  document.getElementById('kpi-delivery-change').textContent = 'protocol avg';
  
  // Calculate 24h revenue from snapshots (would come from actual data)
  document.getElementById('kpi-24h-revenue').textContent = formatETH('1250.75');
  document.getElementById('kpi-24h-change').textContent = '+12.5%';
  
  // Total holders (would be aggregated from series)
  document.getElementById('kpi-holders').textContent = '1';
  document.getElementById('kpi-holders-change').textContent = 'unique holders';
}

function renderSeriesTable(series) {
  const tableContent = document.getElementById('table-content');
  
  if (!series || series.length === 0) {
    tableContent.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">📊</div>
        <p>No active series found</p>
      </div>
    `;
    return;
  }

  const tableHTML = `
    <table>
      <thead>
        <tr>
          <th data-sort="name">SERIES NAME</th>
          <th data-sort="type">TYPE</th>
          <th data-sort="protocol">PROTOCOL</th>
          <th data-sort="reputation">REPUTATION</th>
          <th data-sort="revenue-share">REVENUE<br>SHARE</th>
          <th data-sort="revenue">TOTAL<br>REVENUE</th>
          <th data-sort="apy">EST.<br>APY</th>
          <th data-sort="holders">HOLDERS</th>
          <th data-sort="maturity">DAYS TO<br>MATURITY</th>
          <th>ACTION</th>
        </tr>
      </thead>
      <tbody>
        ${series.map(s => renderSeriesRow(s)).join('')}
      </tbody>
    </table>
  `;

  tableContent.innerHTML = tableHTML;
  
  // Add sort listeners
  document.querySelectorAll('th[data-sort]').forEach(th => {
    th.addEventListener('click', () => handleSort(th.dataset.sort));
  });
}

function renderSeriesRow(series) {
  const daysToMaturity = getDaysUntilMaturity(series.maturityDate);
  const reputationScore = parseInt(series.protocol.reputationScore);
  const isBlacklisted = series.protocol.blacklisted;
  const protocolName = series.name.split(' - ')[1] || formatAddress(series.protocol.address);
  
  return `
    <tr data-series-id="${series.id}">
      <td>
        <div style="max-width: 200px;">
          <strong style="display: block; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;" title="${series.name}">${series.name}</strong>
          <small style="color: var(--gray-500);">${series.symbol}</small>
        </div>
      </td>
      <td>
        <span class="badge badge-${series.bondType.toLowerCase()}">${series.bondType}</span>
      </td>
      <td>
        <strong style="color: var(--navy);">${protocolName}</strong><br>
        <a href="https://arbiscan.io/address/${series.protocol.address}" 
           target="_blank" 
           style="color: var(--gray-500); text-decoration: none; font-size: 0.8125rem;">
          ${formatAddress(series.protocol.address)} ↗
        </a>
      </td>
      <td>
        <div class="reputation-score">
          <span style="font-weight: 600; color: ${getReputationColor(reputationScore)};">
            ${reputationScore}
          </span>
          <div class="reputation-bar">
            <div class="reputation-fill" style="width: ${reputationScore}%"></div>
          </div>
        </div>
      </td>
      <td>${formatPercentage(series.revenueSharePercentage)}</td>
      <td>
        <strong>${formatETH(series.totalRevenueReceived)}</strong><br>
        <small style="color: var(--gray-500);">${series.distributionCount} distributions</small>
      </td>
      <td>
        <strong style="color: var(--green);">
          ${series.estimatedAPY ? formatPercentage(series.estimatedAPY) : 'N/A'}
        </strong>
      </td>
      <td>${formatNumber(series.holderCount)}</td>
      <td>
        ${daysToMaturity === 0 
          ? '<span class="badge badge-matured">MATURED</span>' 
          : `<span style="color: ${daysToMaturity < 30 ? 'var(--orange)' : 'var(--gray-600)'};">${daysToMaturity} days</span>`
        }
      </td>
      <td>
        <a href="/series.html?address=${series.id}" class="btn btn-outline" style="padding: 0.5rem 1rem; font-size: 0.875rem;">
          View Details
        </a>
      </td>
    </tr>
  `;
}

function getReputationColor(score) {
  if (score >= 80) return 'var(--green)';
  if (score >= 60) return 'var(--orange)';
  return 'var(--red)';
}

// ============================================
// FILTERING & SORTING
// ============================================

let currentSeries = [];
let filteredSeries = [];

function applyFilters() {
  const searchTerm = document.getElementById('search-input').value.toLowerCase();
  const typeFilter = document.getElementById('type-filter').value;
  
  filteredSeries = currentSeries.filter(series => {
    // Search filter
    const matchesSearch = 
      series.name.toLowerCase().includes(searchTerm) ||
      series.symbol.toLowerCase().includes(searchTerm) ||
      series.protocol.address.toLowerCase().includes(searchTerm);
    
    // Type filter
    const matchesType = typeFilter === 'all' || series.bondType === typeFilter;
    
    return matchesSearch && matchesType;
  });
  
  applySorting();
}

function applySorting() {
  const sortFilter = document.getElementById('sort-filter').value;
  
  filteredSeries.sort((a, b) => {
    switch (sortFilter) {
      case 'revenue-desc':
        return parseFloat(b.totalRevenueReceived) - parseFloat(a.totalRevenueReceived);
      case 'revenue-asc':
        return parseFloat(a.totalRevenueReceived) - parseFloat(b.totalRevenueReceived);
      case 'apy-desc':
        return parseFloat(b.estimatedAPY || 0) - parseFloat(a.estimatedAPY || 0);
      case 'reputation-desc':
        return parseInt(b.protocol.reputationScore) - parseInt(a.protocol.reputationScore);
      case 'recent':
        return parseInt(b.createdAt) - parseInt(a.createdAt);
      default:
        return 0;
    }
  });
  
  renderSeriesTable(filteredSeries);
}

function handleSort(column) {
  // This would implement column-specific sorting
  console.log('Sorting by:', column);
}

// ============================================
// INITIALIZATION
// ============================================

async function initDashboard() {
  try {
    // Fetch global stats
    const statsData = await fetchGraphQL(GLOBAL_STATS_QUERY);
    if (statsData.protocolStats) {
      renderHeroStats(statsData.protocolStats);
      renderKPIs(statsData.protocolStats);
    }

    // Fetch active series
    const seriesData = await fetchGraphQL(ACTIVE_SERIES_QUERY, {
      first: 100,
      skip: 0,
      orderBy: 'totalRevenueReceived',
      orderDirection: 'desc',
    });
    
    if (seriesData.revenueSeries) {
      currentSeries = seriesData.revenueSeries;
      filteredSeries = [...currentSeries];
      renderSeriesTable(filteredSeries);
    }

    // Setup event listeners
    document.getElementById('search-input').addEventListener('input', applyFilters);
    document.getElementById('type-filter').addEventListener('change', applyFilters);
    document.getElementById('sort-filter').addEventListener('change', applySorting);

  } catch (error) {
    console.error('Error initializing dashboard:', error);
    document.getElementById('table-content').innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">⚠️</div>
        <p>Error loading data. Please try again later.</p>
      </div>
    `;
  }
}

// ============================================
// AUTO-REFRESH
// ============================================

function startAutoRefresh() {
  // Refresh data every 30 seconds
  setInterval(async () => {
    try {
      const statsData = await fetchGraphQL(GLOBAL_STATS_QUERY);
      if (statsData.protocolStats) {
        renderHeroStats(statsData.protocolStats);
        renderKPIs(statsData.protocolStats);
      }

      const seriesData = await fetchGraphQL(ACTIVE_SERIES_QUERY, {
        first: 100,
        skip: 0,
        orderBy: 'totalRevenueReceived',
        orderDirection: 'desc',
      });
      
      if (seriesData.revenueSeries) {
        currentSeries = seriesData.revenueSeries;
        applyFilters();
      }
    } catch (error) {
      console.error('Error refreshing data:', error);
    }
  }, 30000); // 30 seconds
}

// ============================================
// CALCULATOR FUNCTIONS
// ============================================

let calculatorMode = 'generic';
let selectedSeriesForCalc = null;

function switchCalculatorMode(mode) {
  calculatorMode = mode;
  
  // Update button states
  document.getElementById('calc-mode-generic').classList.toggle('active', mode === 'generic');
  document.getElementById('calc-mode-series').classList.toggle('active', mode === 'series');
  
  // Show/hide series selector
  const seriesSelector = document.getElementById('series-selector');
  if (seriesSelector) {
    seriesSelector.style.display = mode === 'series' ? 'block' : 'none';
  }
  
  // Populate series dropdown if in series mode
  if (mode === 'series' && currentSeries.length > 0) {
    populateSeriesDropdown();
  }
  
  // Enable/disable inputs based on mode
  const inputs = ['calc-revenue-share', 'calc-protocol-revenue', 'calc-duration'];
  inputs.forEach(id => {
    const input = document.getElementById(id);
    if (input) {
      input.disabled = mode === 'series';
      input.style.opacity = mode === 'series' ? '0.6' : '1';
    }
  });
}

function populateSeriesDropdown() {
  const select = document.getElementById('calc-series-select');
  if (!select) return;
  
  // Clear existing options except first
  select.innerHTML = '<option value="">-- Select a series --</option>';
  
  // Add series options
  currentSeries.forEach(series => {
    const option = document.createElement('option');
    option.value = series.id;
    option.textContent = `${series.name} (${series.symbol})`;
    select.appendChild(option);
  });
}

function loadSeriesDataToCalculator() {
  const select = document.getElementById('calc-series-select');
  if (!select || !select.value) return;
  
  const series = currentSeries.find(s => s.id === select.value);
  if (!series) return;
  
  selectedSeriesForCalc = series;
  
  // Auto-fill calculator inputs
  document.getElementById('calc-revenue-share').value = parseFloat(series.revenueSharePercentage);
  
  // Calculate expected monthly revenue from historical data
  const totalRevenue = parseFloat(series.totalRevenueReceived);
  const daysElapsed = series.createdAt ? (Date.now() / 1000 - series.createdAt) / 86400 : 30;
  const monthlyRevenue = totalRevenue > 0 ? (totalRevenue / daysElapsed) * 30 : 0;
  document.getElementById('calc-protocol-revenue').value = monthlyRevenue.toFixed(2);
  
  // Duration (days to maturity)
  const daysToMaturity = getDaysUntilMaturity(series.maturityDate);
  document.getElementById('calc-duration').value = daysToMaturity;
  
  // Recalculate
  calculateReturns();
}

function calculateReturns() {
  const investment = parseFloat(document.getElementById('calc-investment').value) || 0;
  const revenueShare = parseFloat(document.getElementById('calc-revenue-share').value) || 0;
  const protocolRevenue = parseFloat(document.getElementById('calc-protocol-revenue').value) || 0;
  const duration = parseFloat(document.getElementById('calc-duration').value) || 0;
  const ownership = parseFloat(document.getElementById('calc-ownership').value) || 0;

  // Calculate monthly revenue to series
  const monthlyRevenueToSeries = protocolRevenue * (revenueShare / 100);
  
  // Calculate your share of monthly revenue
  const yourMonthlyRevenue = monthlyRevenueToSeries * (ownership / 100);
  
  // Calculate total months
  const totalMonths = duration / 30;
  
  // Calculate total revenue over duration
  const totalRevenue = yourMonthlyRevenue * totalMonths;
  
  // Calculate ROI
  const roi = investment > 0 ? ((totalRevenue / investment) * 100) : 0;
  
  // Calculate APY (annualized)
  const yearlyRevenue = yourMonthlyRevenue * 12;
  const apy = investment > 0 ? ((yearlyRevenue / investment) * 100) : 0;

  // Update UI
  document.getElementById('result-monthly').textContent = formatETH(yourMonthlyRevenue.toString());
  document.getElementById('result-monthly-breakdown').textContent = 
    `${formatETH(monthlyRevenueToSeries.toString())} total to series × ${ownership}% ownership`;

  document.getElementById('result-total').textContent = formatETH(totalRevenue.toString());
  document.getElementById('result-total-breakdown').textContent = 
    `${formatETH(yourMonthlyRevenue.toString())} per month × ${totalMonths.toFixed(1)} months`;

  document.getElementById('result-apy').textContent = formatPercentage(apy.toString());
  document.getElementById('result-roi').textContent = formatPercentage(roi.toString());
}

function setupCalculator() {
  const inputs = [
    'calc-investment',
    'calc-revenue-share',
    'calc-protocol-revenue',
    'calc-duration',
    'calc-ownership'
  ];

  inputs.forEach(id => {
    const element = document.getElementById(id);
    if (element) {
      element.addEventListener('input', calculateReturns);
    }
  });

  // Calculate initial values
  calculateReturns();
}

// ============================================
// START APPLICATION
// ============================================

document.addEventListener('DOMContentLoaded', async () => {
  console.log('Dashboard initializing...');
  
  await initDashboard();
  setupCalculator();
  startAutoRefresh();
  
  // Initialize wallet connection button
  const connectBtn = document.getElementById('connect-wallet-btn');
  console.log('Connect button found:', !!connectBtn);
  console.log('Web3Manager available:', typeof Web3Manager !== 'undefined');
  console.log('Ethereum provider available:', !!window.ethereum);
  
  if (connectBtn) {
    if (typeof Web3Manager !== 'undefined') {
      connectBtn.onclick = async () => {
        console.log('Connect button clicked!');
        try {
          await Web3Manager.connectWallet();
        } catch (error) {
          console.error('Failed to connect wallet:', error);
          alert('Failed to connect wallet: ' + error.message);
        }
      };
      console.log('Connect button initialized successfully');
    } else {
      console.error('Web3Manager not available!');
      connectBtn.onclick = () => {
        alert('Web3 functionality not loaded. Please refresh the page.');
      };
    }
  } else {
    console.error('Connect button not found in DOM!');
  }
  
  // Auto-connect if previously connected
  if (typeof Web3Manager !== 'undefined' && window.ethereum && window.ethereum.selectedAddress) {
    console.log('Auto-connecting to previously connected wallet...');
    try {
      await Web3Manager.connectWallet();
    } catch (error) {
      console.log('Auto-connect failed:', error);
    }
  }
  
  console.log('Dashboard initialization complete');
});
