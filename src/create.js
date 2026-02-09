// ============================================
// CREATE SERIES WIZARD
// ============================================

let currentStep = 1;
let formData = {};
let safetyLimits = null;
let feeConfig = null;
let createdSeriesAddress = null;

// ============================================
// INITIALIZATION
// ============================================

document.addEventListener('DOMContentLoaded', async () => {
  // Initialize wallet button
  const connectBtn = document.getElementById('connect-wallet-btn');
  if (connectBtn) {
    connectBtn.onclick = async () => {
      try {
        await Web3Manager.connectWallet();
        await loadProtocolData();
      } catch (error) {
        console.error('Failed to connect wallet:', error);
      }
    };
  }

  // Auto-connect if previously connected
  if (window.ethereum && window.ethereum.selectedAddress) {
    try {
      await Web3Manager.connectWallet();
      await loadProtocolData();
    } catch (error) {
      console.log('Auto-connect failed:', error);
    }
  }

  // Setup form listeners
  setupFormListeners();

  // Load protocol data
  await loadProtocolData();
});

// ============================================
// PROTOCOL DATA
// ============================================

async function loadProtocolData() {
  try {
    if (!Web3Manager.isConnected()) return;

    const factoryContract = Web3Manager.getContract(
      Web3Manager.FACTORY_ADDRESS,
      Web3Manager.FACTORY_ABI
    );

    // Get safety limits from V2 Factory
    // Returns: (maxShareBPS, minDurationDays, maxDurationDays, minSupply)
    const limits = await factoryContract.getSafetyLimits();
    safetyLimits = {
      maxShareBPS: limits[0].toNumber(),
      minDurationDays: limits[1].toNumber(),
      maxDurationDays: limits[2].toNumber(),
      minSupply: limits[3],
    };
    console.log('Safety limits loaded:', safetyLimits);

    // Get policies (fee, safety, access)
    const policies = await factoryContract.getPolicies();
    const hasFeePolicy = policies[0] !== ethers.constants.AddressZero;
    feeConfig = {
      feesEnabled: hasFeePolicy,
      feePolicyAddress: policies[0],
      safetyPolicyAddress: policies[1],
      accessPolicyAddress: policies[2],
    };
    console.log('Policies loaded:', feeConfig);
  } catch (error) {
    console.error('Error loading protocol data:', error);
    // Fallback: V2 hardcoded defaults
    safetyLimits = {
      maxShareBPS: 5000,       // Max 50%
      minDurationDays: 30,     // Min 30 days
      maxDurationDays: 1825,   // Max 5 years
      minSupply: ethers.BigNumber.from(ethers.utils.parseEther('1000')), // Min 1000 tokens
    };
    feeConfig = {
      feesEnabled: false,
      feePolicyAddress: ethers.constants.AddressZero,
      safetyPolicyAddress: ethers.constants.AddressZero,
      accessPolicyAddress: ethers.constants.AddressZero,
    };
  }
}

// ============================================
// FORM LISTENERS
// ============================================

function setupFormListeners() {
  // Revenue Share slider
  const revenueShareSlider = document.getElementById('revenue-share');
  const revenueShareValue = document.getElementById('revenue-share-value');
  revenueShareSlider.addEventListener('input', (e) => {
    revenueShareValue.textContent = e.target.value + '%';
  });

  // Duration slider
  const durationSlider = document.getElementById('duration');
  const durationValue = document.getElementById('duration-value');
  durationSlider.addEventListener('input', (e) => {
    durationValue.textContent = e.target.value + ' days';
  });
}

// ============================================
// WIZARD NAVIGATION
// ============================================

function nextStep(step) {
  // Validate current step
  if (!validateStep(currentStep)) {
    return;
  }

  // Collect form data
  collectFormData();

  // Update UI
  document.getElementById(`step-${currentStep}`).classList.remove('active');
  document.querySelector(`.wizard-step[data-step="${currentStep}"]`).classList.add('completed');
  document.querySelector(`.wizard-step[data-step="${currentStep}"]`).classList.remove('active');

  currentStep = step;

  document.getElementById(`step-${currentStep}`).classList.add('active');
  document.querySelector(`.wizard-step[data-step="${currentStep}"]`).classList.add('active');

  // Execute step-specific logic
  if (step === 2) {
    validateParameters();
  } else if (step === 3) {
    calculateFees();
  } else if (step === 4) {
    showFinalSummary();
  }

  // Scroll to top
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function prevStep(step) {
  document.getElementById(`step-${currentStep}`).classList.remove('active');
  document.querySelector(`.wizard-step[data-step="${currentStep}"]`).classList.remove('active');

  currentStep = step;

  document.getElementById(`step-${currentStep}`).classList.add('active');
  document.querySelector(`.wizard-step[data-step="${currentStep}"]`).classList.add('active');

  // Remove completed status from future steps
  for (let i = currentStep + 1; i <= 4; i++) {
    document.querySelector(`.wizard-step[data-step="${i}"]`).classList.remove('completed');
  }

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ============================================
// VALIDATION
// ============================================

function validateStep(step) {
  if (step === 1) {
    // Validate all inputs are filled
    const tokenName = document.getElementById('token-name').value.trim();
    const tokenSymbol = document.getElementById('token-symbol').value.trim();
    const revenueShare = parseFloat(document.getElementById('revenue-share').value);
    const duration = parseInt(document.getElementById('duration').value);
    const totalSupply = parseFloat(document.getElementById('total-supply').value);
    const minDistribution = parseFloat(document.getElementById('min-distribution').value);
    const expectedRevenue = parseFloat(document.getElementById('expected-revenue').value);
    const cadence = parseInt(document.getElementById('cadence').value);
    const principalAmount = parseFloat(document.getElementById('principal-amount').value);
    const depositDeadline = parseInt(document.getElementById('deposit-deadline').value);

    if (!tokenName || tokenName.length < 3) {
      alert('Please enter a valid token name (at least 3 characters)');
      return false;
    }

    if (!tokenSymbol || tokenSymbol.length < 2) {
      alert('Please enter a valid token symbol (at least 2 characters)');
      return false;
    }

    if (!totalSupply || totalSupply <= 0) {
      alert('Please enter a valid total supply');
      return false;
    }

    if (!minDistribution || minDistribution < 0) {
      alert('Please enter a valid minimum distribution');
      return false;
    }

    if (!expectedRevenue || expectedRevenue < 0) {
      alert('Please enter a valid expected revenue');
      return false;
    }

    if (!cadence || cadence <= 0) {
      alert('Please enter a valid cadence');
      return false;
    }

    if (!principalAmount || principalAmount <= 0) {
      alert('Please enter a valid principal amount');
      return false;
    }

    if (!depositDeadline || depositDeadline < 1 || depositDeadline > 90) {
      alert('Please enter a valid deposit deadline (1-90 days)');
      return false;
    }

    return true;
  }

  return true;
}

function collectFormData() {
  formData = {
    tokenName: document.getElementById('token-name').value.trim(),
    tokenSymbol: document.getElementById('token-symbol').value.trim().toUpperCase(),
    revenueShareBPS: parseFloat(document.getElementById('revenue-share').value) * 100,
    durationDays: parseInt(document.getElementById('duration').value),
    totalSupply: parseFloat(document.getElementById('total-supply').value),
    minDistribution: parseFloat(document.getElementById('min-distribution').value),
    expectedRevenue: parseFloat(document.getElementById('expected-revenue').value),
    cadenceDays: parseInt(document.getElementById('cadence').value),
    principalAmount: parseFloat(document.getElementById('principal-amount').value),
    depositDeadlineDays: parseInt(document.getElementById('deposit-deadline').value),
  };
}

function validateParameters() {
  const validationList = document.getElementById('validation-list');
  validationList.innerHTML = '';

  const validations = [];

  // Revenue Share (V2: max only, no min enforced by factory)
  const maxShareBPS = safetyLimits ? safetyLimits.maxShareBPS : 5000;
  const shareValid = formData.revenueShareBPS > 0 && formData.revenueShareBPS <= maxShareBPS;
  validations.push({
    label: `Revenue Share: ${formData.revenueShareBPS / 100}% (max ${maxShareBPS / 100}%)`,
    valid: shareValid,
  });

  // Duration
  const minDuration = safetyLimits ? safetyLimits.minDurationDays : 30;
  const maxDuration = safetyLimits ? safetyLimits.maxDurationDays : 1825;
  const durationValid = formData.durationDays >= minDuration && formData.durationDays <= maxDuration;
  validations.push({
    label: `Duration: ${formData.durationDays} days (${minDuration} - ${maxDuration} days)`,
    valid: durationValid,
  });

  // Total Supply (V2: min 1000 tokens, no max)
  const minSupplyWei = safetyLimits ? safetyLimits.minSupply : ethers.utils.parseEther('1000');
  const minSupplyTokens = parseFloat(ethers.utils.formatEther(minSupplyWei));
  const supplyValid = formData.totalSupply >= minSupplyTokens;
  validations.push({
    label: `Total Supply: ${formData.totalSupply.toLocaleString()} tokens (min ${minSupplyTokens.toLocaleString()})`,
    valid: supplyValid,
  });

  // Min Distribution (V2: must be >= 0.001 ETH)
  const minDistValid = formData.minDistribution >= 0.001;
  validations.push({
    label: `Min Distribution: ${formData.minDistribution} ETH (≥ 0.001 ETH)`,
    valid: minDistValid,
  });

  // Expected Revenue
  const revenueValid = formData.expectedRevenue >= 0;
  validations.push({
    label: `Expected Revenue: ${formData.expectedRevenue} ETH/month (≥ 0)`,
    valid: revenueValid,
  });

  // Cadence
  const cadenceValid = formData.cadenceDays > 0 && formData.cadenceDays <= 365;
  validations.push({
    label: `Cadence: ${formData.cadenceDays} days (1 - 365 days)`,
    valid: cadenceValid,
  });

  // Render validations
  const allValid = validations.every(v => v.valid);
  validations.forEach(v => {
    const li = document.createElement('li');
    li.className = `validation-item ${v.valid ? 'valid' : 'invalid'}`;
    li.innerHTML = `${v.valid ? '✓' : '✗'} ${v.label}`;
    validationList.appendChild(li);
  });

  // Show/hide warning
  const warning = document.getElementById('validation-warning');
  const nextBtn = document.getElementById('validation-next-btn');
  if (!allValid) {
    warning.style.display = 'block';
    nextBtn.disabled = true;
  } else {
    warning.style.display = 'none';
    nextBtn.disabled = false;
  }
}

function calculateFees() {
  const feesEnabled = feeConfig ? feeConfig.feesEnabled : false;

  // V2: Fees are determined by the feePolicy contract (if set)
  // When no feePolicy is set, creation is free (gas only)
  document.getElementById('creation-fee').textContent = feesEnabled 
    ? 'Determined by Fee Policy' 
    : '0 ETH (No Fee Policy)';
  document.getElementById('refund-amount').textContent = 'N/A';
  document.getElementById('gas-estimate').textContent = '~$5-10';
  document.getElementById('total-cost').textContent = feesEnabled 
    ? 'Fee + gas (confirm in wallet)' 
    : 'Gas only';
}

function showFinalSummary() {
  document.getElementById('final-name').textContent = formData.tokenName;
  document.getElementById('final-symbol').textContent = formData.tokenSymbol;
  document.getElementById('final-share').textContent = (formData.revenueShareBPS / 100) + '%';
  document.getElementById('final-duration').textContent = formData.durationDays + ' days';
  document.getElementById('final-supply').textContent = formData.totalSupply.toLocaleString() + ' tokens';
  document.getElementById('final-min-dist').textContent = formData.minDistribution + ' ETH';
  document.getElementById('final-revenue').textContent = formData.expectedRevenue + ' ETH/month';
  document.getElementById('final-cadence').textContent = formData.cadenceDays + ' days';
  document.getElementById('final-principal').textContent = formData.principalAmount + ' ETH';
  document.getElementById('final-deadline').textContent = formData.depositDeadlineDays + ' days';
}

// ============================================
// DEPLOY
// ============================================

async function deploySeries() {
  if (!Web3Manager.isConnected()) {
    alert('Please connect your wallet first');
    return;
  }

  try {
    // Show loading
    showLoading('Deploying Revenue Bond Series...', 'Please confirm the transaction in your wallet');

    // Get V2 Factory contract
    const factory = Web3Manager.getContract(
      Web3Manager.FACTORY_ADDRESS,
      Web3Manager.FACTORY_ABI
    );

    // Prepare parameters for V2 createSeries
    const protocolAddress = Web3Manager.getAddress();
    const tokenName = formData.tokenName;
    const tokenSymbol = formData.tokenSymbol;
    const revenueShareBPS = Math.floor(formData.revenueShareBPS);
    const durationDays = formData.durationDays;
    const totalSupply = ethers.utils.parseEther(formData.totalSupply.toString());
    const minDistribution = ethers.utils.parseEther(formData.minDistribution.toString());

    // V2: Fee is determined by feePolicy (if set). For now, send 0 ETH.
    // If a feePolicy is active, the contract will revert with "Insufficient fee"
    // and the user needs to send the correct amount.
    const creationFee = ethers.BigNumber.from(0);

    // Call V2 createSeries(name, symbol, protocol, revenueShareBPS, durationDays, totalSupply, minDistributionAmount)
    const tx = await factory.createSeries(
      tokenName,
      tokenSymbol,
      protocolAddress,
      revenueShareBPS,
      durationDays,
      totalSupply,
      minDistribution,
      { value: creationFee }
    );

    showLoading('Transaction Submitted', 'Waiting for confirmation...');

    // Wait for transaction
    const receipt = await tx.wait();

    // Extract series address from SeriesCreated event
    const seriesCreatedEvent = receipt.events.find(e => e.event === 'SeriesCreated');
    if (seriesCreatedEvent) {
      createdSeriesAddress = seriesCreatedEvent.args.series || seriesCreatedEvent.args[0];
    }

    // Hide loading
    hideLoading();

    // Show success
    showSuccess(createdSeriesAddress);
  } catch (error) {
    console.error('Error deploying series:', error);
    hideLoading();
    alert('Failed to deploy series: ' + (error.reason || error.message));
  }
}

// ============================================
// UI HELPERS
// ============================================

function showLoading(title, message) {
  document.getElementById('loading-title').textContent = title;
  document.getElementById('loading-message').textContent = message;
  document.getElementById('loading-overlay').style.display = 'flex';
}

function hideLoading() {
  document.getElementById('loading-overlay').style.display = 'none';
}

function showSuccess(address) {
  document.getElementById('success-address').textContent = address;
  document.getElementById('success-modal').style.display = 'flex';
}

function viewSeries() {
  window.location.href = `/series.html?address=${createdSeriesAddress}`;
}
