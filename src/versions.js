// ============================================
// EQUORUM PROTOCOL - VERSION MANAGEMENT
// ============================================
// Transparência total: Todas as versões visíveis para o público

const PROTOCOL_VERSIONS = {
  v2: {
    version: '2.0.0',
    name: 'V2 (Recommended)',
    status: 'active',
    recommended: true,
    network: 'Arbitrum One',
    chainId: 42161,
    
    // Contratos V2 (será preenchido após deploy)
    contracts: {
      factory: null, // '0x????...????'
      reputationRegistry: null, // '0x????...????'
    },
    
    features: [
      'Dual Bond Model (Soft + Hybrid)',
      'On-Chain Reputation System',
      'Enhanced Security (22 fixes)',
      'Overflow Protection',
      'Double-Claim Prevention'
    ],
    
    improvements: [
      '22 security issues fixed',
      'Gas optimizations',
      'Better UX for protocols',
      'Reputation tracking'
    ],
    
    audit: {
      completed: true,
      date: '2026-01',
      issuesFixed: 22
    },
    
    links: {
      docs: 'https://docs.equorumprotocol.org/v2',
      github: 'https://github.com/EquorumProtocol/Equorum-Revenue-Bonds/tree/main/contracts/v2',
      audit: 'https://github.com/EquorumProtocol/Equorum-Revenue-Bonds/tree/main/audits'
    }
  },
  
  v1: {
    version: '1.0.0',
    name: 'V1 (Legacy - Not Recommended)',
    status: 'legacy', // Active but deprecated due to security issues
    recommended: false,
    deprecated: true,
    network: 'Arbitrum One',
    chainId: 42161,
    
    // Contratos V1 (já deployados)
    contracts: {
      factory: '0x8afA0318363FfBc29Cc28B3C98d9139C08Af737b',
      treasury: '0xBa69aEd75E8562f9D23064aEBb21683202c5279B',
    },
    
    series: [
      {
        name: 'Revenue Bonds Genesis',
        address: '0x88122C5805281bAbF3B172fA212a6F6300Bb1EF3',
        router: '0x8a4796F943Ed862671115fefAB860AC12B2772eE',
        symbol: 'UNDERDOG-RB',
        status: 'active'
      }
    ],
    
    features: [
      'Single Bond Model (Soft Bonds)',
      'Basic Revenue Distribution',
      'ERC-20 Fungible Tokens'
    ],
    
    // Transparência sobre problemas identificados
    knownIssues: [
      {
        severity: 'critical',
        count: 12,
        description: 'Critical security vulnerabilities identified in audit'
      },
      {
        severity: 'medium',
        count: 7,
        description: 'Medium-risk issues affecting functionality'
      },
      {
        severity: 'low',
        count: 3,
        description: 'Low-priority improvements needed'
      }
    ],
    
    deprecationReason: 'V1 has been deprecated due to 22 security issues identified during audit. All issues have been fixed in V2. While V1 remains functional, we strongly recommend using V2 for new series.',
    
    warning: '⚠️ V1 is deprecated due to security issues. Please use V2 for new series. Existing V1 series remain functional but are not recommended for new investments.',
    
    migrationInfo: {
      required: false,
      recommended: true,
      note: 'V1 series remain functional. Users can continue using existing V1 series or migrate to V2 voluntarily. No forced migration.'
    },
    
    links: {
      docs: 'https://docs.equorumprotocol.org/v1',
      github: 'https://github.com/EquorumProtocol/Equorum-Revenue-Bonds/tree/main/contracts/v1',
      factory: 'https://arbiscan.io/address/0x8afA0318363FfBc29Cc28B3C98d9139C08Af737b',
      auditReport: 'https://github.com/EquorumProtocol/Equorum-Revenue-Bonds/tree/main/audits',
      migrationGuide: 'https://docs.equorumprotocol.org/migration'
    }
  }
};

// Get recommended version
function getRecommendedVersion() {
  return Object.entries(PROTOCOL_VERSIONS)
    .find(([_, config]) => config.recommended)?.[0] || 'v2';
}

// Get all active versions
function getActiveVersions() {
  return Object.entries(PROTOCOL_VERSIONS)
    .filter(([_, config]) => config.status === 'active' || config.status === 'legacy')
    .map(([version, config]) => ({ version, ...config }));
}

// Get factory address for a specific version
function getFactoryAddress(version = 'v2') {
  return PROTOCOL_VERSIONS[version]?.contracts?.factory;
}

// Get all series across all versions
function getAllSeries() {
  const allSeries = [];
  
  Object.entries(PROTOCOL_VERSIONS).forEach(([version, config]) => {
    if (config.series) {
      config.series.forEach(series => {
        allSeries.push({
          ...series,
          version,
          versionName: config.name
        });
      });
    }
  });
  
  return allSeries;
}

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    PROTOCOL_VERSIONS,
    getRecommendedVersion,
    getActiveVersions,
    getFactoryAddress,
    getAllSeries
  };
}
