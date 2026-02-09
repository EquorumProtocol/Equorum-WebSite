// ============================================
// EQUORUM PROTOCOL - MULTI-LANGUAGE SUPPORT
// ============================================

const translations = {
  'pt-BR': {
    // Navigation
    'nav.dashboard': 'Explorar',
    'nav.launchApp': 'Acessar App',
    'nav.connectWallet': 'Conectar Carteira',
    'nav.wrongNetwork': 'Rede Incorreta',
    'nav.switchNetwork': 'Trocar para Arbitrum',
    
    // Dashboard Hero
    'dashboard.title': 'Explorar Revenue Bonds',
    'dashboard.subtitle': 'O Bloomberg do Financiamento de Receita On-Chain. Análises em tempo real para Revenue Bonds na Arbitrum One.',
    'hero.totalBonds': 'Total de Bonds',
    'hero.capitalRaised': 'Capital Levantado',
    'hero.revenueDistributed': 'Receita Distribuída',
    'hero.activeSeries': 'Séries Ativas',
    
    // My Position
    'myPosition.title': 'Minha Posição',
    'myPosition.bondsHeld': 'Bonds Detidos',
    'myPosition.claimableRevenue': 'Receita Disponível',
    'myPosition.investedPrincipal': 'Principal Investido',
    'myPosition.claimAll': 'Resgatar Tudo',
    'myPosition.noClaims': 'Nenhuma receita disponível',
    
    // Global Metrics
    'metrics.title': 'Métricas Globais',
    'metrics.subtitle': 'Indicadores chave de desempenho do protocolo',
    'metrics.totalProtocols': 'Total de Protocolos',
    'metrics.avgDeliveryRate': 'Taxa Média de Entrega',
    'metrics.24hRevenue': 'Receita 24h',
    'metrics.totalHolders': 'Total de Holders',
    
    // Series Table
    'table.title': 'Séries Ativas de Revenue Bonds',
    'table.search': 'Buscar por nome ou protocolo...',
    'table.filterAll': 'Todos os Tipos',
    'table.filterSoft': 'Soft Bonds',
    'table.filterHybrid': 'Hybrid Bonds',
    'table.sortNewest': 'Mais Recentes',
    'table.sortOldest': 'Mais Antigas',
    'table.sortRevenue': 'Maior Receita',
    'table.sortApy': 'Maior APY',
    'table.colSeries': 'SÉRIE',
    'table.colType': 'TIPO',
    'table.colProtocol': 'PROTOCOLO',
    'table.colRevShare': 'REV SHARE',
    'table.colTotalRevenue': 'RECEITA TOTAL',
    'table.colHolders': 'HOLDERS',
    'table.colMaturity': 'DIAS ATÉ VENCIMENTO',
    'table.colActions': 'AÇÕES',
    'table.viewDetails': 'Ver Detalhes',
    'table.matured': 'VENCIDO',
    'table.noResults': 'Nenhuma série encontrada',
    'table.tryDifferent': 'Tente termos de busca diferentes',
    
    // Calculator
    'calc.title': 'Calculadora de Revenue Bonds',
    'calc.subtitle': 'Estime seus retornos potenciais ao investir em Revenue Bonds',
    'calc.modeGeneric': 'Simulação Genérica',
    'calc.modeSeries': 'Baseado em Série',
    'calc.selectSeries': 'Selecionar Série',
    'calc.selectPlaceholder': '-- Selecione uma série --',
    'calc.investment': 'Investimento Inicial',
    'calc.revenueShare': 'Revenue Share %',
    'calc.protocolRevenue': 'Receita Mensal Esperada do Protocolo',
    'calc.duration': 'Duração (dias)',
    'calc.ownership': 'Sua % de Propriedade',
    'calc.results': 'Resultados Estimados',
    'calc.monthlyRevenue': 'Receita Mensal',
    'calc.totalRevenue': 'Receita Total',
    'calc.apy': 'APY Estimado',
    'calc.roi': 'ROI Total',
    
    // CTA
    'cta.title': 'Pronto para Criar Seu Próprio Revenue Bond?',
    'cta.subtitle': 'Lance sua série de revenue bonds em minutos e comece a compartilhar receita com sua comunidade',
    'cta.button': 'Criar Série',
    
    // Footer
    'footer.description': 'Compartilhamento de receita on-chain na Arbitrum One.',
    'footer.protocol': 'Protocolo',
    'footer.dashboard': 'Painel',
    'footer.launchApp': 'Acessar App',
    'footer.docs': 'Documentação',
    'footer.community': 'Comunidade',
    'footer.contracts': 'Contratos',
    'footer.factory': 'Factory',
    'footer.treasury': 'Treasury',
    'footer.copyright': '© 2025 Equorum Protocol. Construído na',
    
    // Series Detail
    'series.loading': 'Carregando...',
    'series.loadingDetails': 'Carregando detalhes da série...',
    'series.identity': 'Identidade da Série',
    'series.address': 'Endereço',
    'series.type': 'Tipo',
    'series.status': 'Status',
    'series.protocol': 'Protocolo',
    'series.router': 'Router',
    'series.created': 'Criado em',
    'series.maturity': 'Vencimento',
    'series.metrics': 'Métricas On-Chain',
    'series.totalSupply': 'Supply Total',
    'series.totalRevenue': 'Receita Total',
    'series.revenueDistributed': 'Receita Distribuída',
    'series.holders': 'Holders',
    'series.distributions': 'Distribuições',
    'series.revenueShare': 'Revenue Share',
    'series.reputation': 'Reputação do Protocolo',
    'series.countdown': 'Tempo até Vencimento',
    'series.days': 'dias',
    'series.hours': 'horas',
    'series.minutes': 'minutos',
    'series.seconds': 'segundos',
    'series.matured': 'Série Vencida',
    'series.yourPosition': 'Sua Posição',
    'series.yourBalance': 'Seu Saldo',
    'series.yourClaimable': 'Receita Disponível',
    'series.claim': 'Resgatar Receita',
    'series.protocolActions': 'Ações do Protocolo',
    'series.routerStatus': 'Status do Router',
    'series.routerBalance': 'Saldo do Router',
    'series.availableWithdraw': 'Disponível para Saque',
    'series.distribute': 'Distribuir Receita',
    'series.route': 'Rotear Receita',
    'series.withdraw': 'Sacar Disponível',
    
    // Create Series
    'create.title': 'Criar Série de Revenue Bonds',
    'create.subtitle': 'Lance sua própria série de revenue bonds em minutos',
    'create.step1': 'Parâmetros',
    'create.step2': 'Validação',
    'create.step3': 'Taxas',
    'create.step4': 'Deploy',
    'create.seriesName': 'Nome da Série',
    'create.seriesSymbol': 'Símbolo',
    'create.revenueShare': 'Revenue Share',
    'create.duration': 'Duração',
    'create.totalSupply': 'Supply Total',
    'create.minDistribution': 'Distribuição Mínima',
    'create.expectedRevenue': 'Receita Esperada',
    'create.cadence': 'Cadência',
    'create.next': 'Próximo',
    'create.back': 'Voltar',
    'create.deploy': 'Fazer Deploy',
    'create.validating': 'Validando parâmetros...',
    'create.validation.revenueShare': 'Revenue share deve ser ≤ 50%',
    'create.validation.duration': 'Duração deve estar entre 30 dias e 5 anos',
    'create.validation.supply': 'Supply deve ser > 0',
    'create.validation.minDist': 'Distribuição mínima deve ser > 0',
    'create.fees.title': 'Resumo de Taxas',
    'create.fees.creation': 'Taxa de Criação',
    'create.fees.gas': 'Estimativa de Gas',
    'create.fees.total': 'Total Estimado',
    'create.fees.disabled': 'Desabilitada',
    'create.review.title': 'Revisar Parâmetros',
    'create.deploying': 'Fazendo deploy da série...',
    'create.success': 'Série Criada com Sucesso!',
    'create.successMsg': 'Sua série de revenue bonds foi criada',
    'create.seriesAddress': 'Endereço da Série',
    'create.viewSeries': 'Ver Série',
    'create.createAnother': 'Criar Outra',
    
    // Status
    'status.active': 'ATIVO',
    'status.matured': 'VENCIDO',
    'status.paused': 'PAUSADO',
    'status.defaulted': 'INADIMPLENTE',
    'status.blacklisted': 'BLOQUEADO',
    
    // Types
    'type.soft': 'SOFT',
    'type.hybrid': 'HYBRID',
    
    // Common
    'common.loading': 'Carregando...',
    'common.error': 'Erro',
    'common.success': 'Sucesso',
    'common.confirm': 'Confirmar',
    'common.cancel': 'Cancelar',
    'common.close': 'Fechar',
    'common.copy': 'Copiar',
    'common.copied': 'Copiado!',
  },
  
  'en': {
    // Navigation
    'nav.dashboard': 'Dashboard',
    'nav.launchApp': 'Launch App',
    'nav.connectWallet': 'Connect Wallet',
    'nav.wrongNetwork': 'Wrong Network',
    'nav.switchNetwork': 'Switch to Arbitrum',
    
    // Dashboard Hero
    'dashboard.title': 'Revenue Bonds Dashboard',
    'dashboard.subtitle': 'The Bloomberg of On-Chain Revenue Financing. Real-time analytics for Revenue Bonds on Arbitrum One.',
    'hero.totalBonds': 'Total Bonds',
    'hero.capitalRaised': 'Capital Raised',
    'hero.revenueDistributed': 'Revenue Distributed',
    'hero.activeSeries': 'Active Series',
    
    // My Position
    'myPosition.title': 'My Position',
    'myPosition.bondsHeld': 'Bonds Held',
    'myPosition.claimableRevenue': 'Claimable Revenue',
    'myPosition.investedPrincipal': 'Invested Principal',
    'myPosition.claimAll': 'Claim All Revenue',
    'myPosition.noClaims': 'No claimable revenue',
    
    // Global Metrics
    'metrics.title': 'Global Metrics',
    'metrics.subtitle': 'Key performance indicators across the protocol',
    'metrics.totalProtocols': 'Total Protocols',
    'metrics.avgDeliveryRate': 'Avg Delivery Rate',
    'metrics.24hRevenue': '24h Revenue',
    'metrics.totalHolders': 'Total Holders',
    
    // Series Table
    'table.title': 'Active Revenue Bond Series',
    'table.search': 'Search by name or protocol...',
    'table.filterAll': 'All Types',
    'table.filterSoft': 'Soft Bonds',
    'table.filterHybrid': 'Hybrid Bonds',
    'table.sortNewest': 'Newest First',
    'table.sortOldest': 'Oldest First',
    'table.sortRevenue': 'Highest Revenue',
    'table.sortApy': 'Highest APY',
    'table.colSeries': 'SERIES',
    'table.colType': 'TYPE',
    'table.colProtocol': 'PROTOCOL',
    'table.colRevShare': 'REV SHARE',
    'table.colTotalRevenue': 'TOTAL REVENUE',
    'table.colHolders': 'HOLDERS',
    'table.colMaturity': 'DAYS TO MATURITY',
    'table.colActions': 'ACTIONS',
    'table.viewDetails': 'View Details',
    'table.matured': 'MATURED',
    'table.noResults': 'No series found',
    'table.tryDifferent': 'Try different search terms',
    
    // Calculator
    'calc.title': 'Revenue Bond Calculator',
    'calc.subtitle': 'Estimate your potential returns from investing in Revenue Bonds',
    'calc.modeGeneric': 'Generic Simulation',
    'calc.modeSeries': 'Based on Series',
    'calc.selectSeries': 'Select Series',
    'calc.selectPlaceholder': '-- Select a series --',
    'calc.investment': 'Initial Investment',
    'calc.revenueShare': 'Revenue Share %',
    'calc.protocolRevenue': 'Expected Monthly Protocol Revenue',
    'calc.duration': 'Duration (days)',
    'calc.ownership': 'Your Ownership %',
    'calc.results': 'Estimated Results',
    'calc.monthlyRevenue': 'Monthly Revenue',
    'calc.totalRevenue': 'Total Revenue',
    'calc.apy': 'Estimated APY',
    'calc.roi': 'Total ROI',
    
    // CTA
    'cta.title': 'Ready to Create Your Own Revenue Bond?',
    'cta.subtitle': 'Launch your revenue bond series in minutes and start sharing revenue with your community',
    'cta.button': 'Create Series',
    
    // Footer
    'footer.description': 'On-chain revenue sharing on Arbitrum One.',
    'footer.protocol': 'Protocol',
    'footer.dashboard': 'Dashboard',
    'footer.launchApp': 'Launch App',
    'footer.docs': 'Documentation',
    'footer.community': 'Community',
    'footer.contracts': 'Contracts',
    'footer.factory': 'Factory',
    'footer.treasury': 'Treasury',
    'footer.copyright': '© 2025 Equorum Protocol. Built on',
    
    // Series Detail
    'series.loading': 'Loading...',
    'series.loadingDetails': 'Loading series details...',
    'series.identity': 'Series Identity',
    'series.address': 'Address',
    'series.type': 'Type',
    'series.status': 'Status',
    'series.protocol': 'Protocol',
    'series.router': 'Router',
    'series.created': 'Created',
    'series.maturity': 'Maturity',
    'series.metrics': 'On-Chain Metrics',
    'series.totalSupply': 'Total Supply',
    'series.totalRevenue': 'Total Revenue',
    'series.revenueDistributed': 'Revenue Distributed',
    'series.holders': 'Holders',
    'series.distributions': 'Distributions',
    'series.revenueShare': 'Revenue Share',
    'series.reputation': 'Protocol Reputation',
    'series.countdown': 'Time to Maturity',
    'series.days': 'days',
    'series.hours': 'hours',
    'series.minutes': 'minutes',
    'series.seconds': 'seconds',
    'series.matured': 'Series Matured',
    'series.yourPosition': 'Your Position',
    'series.yourBalance': 'Your Balance',
    'series.yourClaimable': 'Claimable Revenue',
    'series.claim': 'Claim Revenue',
    'series.protocolActions': 'Protocol Actions',
    'series.routerStatus': 'Router Status',
    'series.routerBalance': 'Router Balance',
    'series.availableWithdraw': 'Available to Withdraw',
    'series.distribute': 'Distribute Revenue',
    'series.route': 'Route Revenue',
    'series.withdraw': 'Withdraw Available',
    
    // Create Series
    'create.title': 'Create Revenue Bond Series',
    'create.subtitle': 'Launch your own revenue bond series in minutes',
    'create.step1': 'Parameters',
    'create.step2': 'Validation',
    'create.step3': 'Fees',
    'create.step4': 'Deploy',
    'create.seriesName': 'Series Name',
    'create.seriesSymbol': 'Symbol',
    'create.revenueShare': 'Revenue Share',
    'create.duration': 'Duration',
    'create.totalSupply': 'Total Supply',
    'create.minDistribution': 'Min Distribution',
    'create.expectedRevenue': 'Expected Revenue',
    'create.cadence': 'Cadence',
    'create.next': 'Next',
    'create.back': 'Back',
    'create.deploy': 'Deploy Series',
    'create.validating': 'Validating parameters...',
    'create.validation.revenueShare': 'Revenue share must be ≤ 50%',
    'create.validation.duration': 'Duration must be between 30 days and 5 years',
    'create.validation.supply': 'Supply must be > 0',
    'create.validation.minDist': 'Min distribution must be > 0',
    'create.fees.title': 'Fee Summary',
    'create.fees.creation': 'Creation Fee',
    'create.fees.gas': 'Gas Estimate',
    'create.fees.total': 'Total Estimate',
    'create.fees.disabled': 'Disabled',
    'create.review.title': 'Review Parameters',
    'create.deploying': 'Deploying series...',
    'create.success': 'Series Created Successfully!',
    'create.successMsg': 'Your revenue bond series has been created',
    'create.seriesAddress': 'Series Address',
    'create.viewSeries': 'View Series',
    'create.createAnother': 'Create Another',
    
    // Status
    'status.active': 'ACTIVE',
    'status.matured': 'MATURED',
    'status.paused': 'PAUSED',
    'status.defaulted': 'DEFAULTED',
    'status.blacklisted': 'BLACKLISTED',
    
    // Types
    'type.soft': 'SOFT',
    'type.hybrid': 'HYBRID',
    
    // Common
    'common.loading': 'Loading...',
    'common.error': 'Error',
    'common.success': 'Success',
    'common.confirm': 'Confirm',
    'common.cancel': 'Cancel',
    'common.close': 'Close',
    'common.copy': 'Copy',
    'common.copied': 'Copied!',
  },
  
  'es': {
    'nav.dashboard': 'Panel',
    'nav.launchApp': 'Abrir App',
    'nav.connectWallet': 'Conectar Billetera',
    'dashboard.title': 'Panel de Revenue Bonds',
    'hero.totalBonds': 'Total de Bonds',
    'hero.capitalRaised': 'Capital Recaudado',
    'hero.revenueDistributed': 'Ingresos Distribuidos',
    'hero.activeSeries': 'Series Activas',
    'myPosition.title': 'Mi Posición',
    'myPosition.claimAll': 'Reclamar Todo',
    'table.title': 'Series Activas de Revenue Bonds',
    'table.search': 'Buscar por nombre o protocolo...',
    'table.viewDetails': 'Ver Detalles',
    'calc.title': 'Calculadora de Revenue Bonds',
    'cta.button': 'Crear Serie',
    'common.loading': 'Cargando...',
  },
  
  'ja': {
    'nav.dashboard': 'ダッシュボード',
    'nav.launchApp': 'アプリ起動',
    'nav.connectWallet': 'ウォレット接続',
    'dashboard.title': 'Revenue Bondsダッシュボード',
    'hero.totalBonds': '総ボンド数',
    'hero.capitalRaised': '調達資本',
    'hero.revenueDistributed': '配分収益',
    'hero.activeSeries': 'アクティブシリーズ',
    'myPosition.title': 'マイポジション',
    'myPosition.claimAll': '全て請求',
    'table.title': 'アクティブRevenue Bondシリーズ',
    'table.search': '名前またはプロトコルで検索...',
    'table.viewDetails': '詳細を見る',
    'calc.title': 'Revenue Bond計算機',
    'cta.button': 'シリーズ作成',
    'common.loading': '読み込み中...',
  },
  
  'zh': {
    'nav.dashboard': '仪表板',
    'nav.launchApp': '启动应用',
    'nav.connectWallet': '连接钱包',
    'dashboard.title': 'Revenue Bonds仪表板',
    'hero.totalBonds': '总债券数',
    'hero.capitalRaised': '筹集资本',
    'hero.revenueDistributed': '分配收入',
    'hero.activeSeries': '活跃系列',
    'myPosition.title': '我的持仓',
    'myPosition.claimAll': '领取全部',
    'table.title': '活跃Revenue Bond系列',
    'table.search': '按名称或协议搜索...',
    'table.viewDetails': '查看详情',
    'calc.title': 'Revenue Bond计算器',
    'cta.button': '创建系列',
    'common.loading': '加载中...',
  }
};

// Current language (default: Portuguese)
let currentLang = localStorage.getItem('equorum_lang') || 'pt-BR';

// Translation function
function t(key) {
  return translations[currentLang]?.[key] || translations['en'][key] || key;
}

// Change language
function setLanguage(lang) {
  if (translations[lang]) {
    currentLang = lang;
    localStorage.setItem('equorum_lang', lang);
    updatePageTranslations();
  }
}

// Update all translations on page
function updatePageTranslations() {
  document.querySelectorAll('[data-i18n]').forEach(element => {
    const key = element.getAttribute('data-i18n');
    const translation = t(key);
    
    if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
      element.placeholder = translation;
    } else {
      element.textContent = translation;
    }
  });
  
  // Update select options
  document.querySelectorAll('[data-i18n-value]').forEach(element => {
    const key = element.getAttribute('data-i18n-value');
    element.textContent = t(key);
  });
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
  updatePageTranslations();
});
