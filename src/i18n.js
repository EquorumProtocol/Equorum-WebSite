import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  pt: {
    translation: {
      nav: { about: 'Sobre', products: 'Produtos', community: 'Comunidade', faq: 'FAQ' },
      hero: {
        badge: 'REVENUE BONDS',
        title: 'Compartilhe Receita com sua Comunidade',
        description1: 'Revenue Bonds Protocol permite que protocolos DeFi compartilhem receita com sua comunidade através de bonds tokenizados.',
        description2: 'Crie séries de revenue bonds ERC-20 que distribuem automaticamente uma porcentagem da sua receita para os holders.',
        cta: 'Acessar Aplicação'
      },
      participate: {
        title: 'Como funciona?',
        subtitle: 'Três passos simples para compartilhar receita',
        step1: { title: 'Crie uma Série', description: 'Defina nome, símbolo, % de receita e duração da série.', link: 'Ver Documentação' },
        step2: { title: 'Distribua Tokens', description: 'Envie os tokens da série para sua comunidade.', link: 'Acessar App' },
        step3: { title: 'Compartilhe Receita', description: 'Envie receita e holders fazem claim automaticamente.', link: 'Ver Contratos' }
      },
      voting: {
        badge: 'ON-CHAIN',
        title: 'Distribuição Automática',
        description1: 'Revenue é distribuída proporcionalmente aos holders de forma totalmente on-chain.',
        description2: 'Cada holder pode fazer claim da sua parte a qualquer momento.',
        votes: 'tokens'
      },
      community: {
        title: 'Faça parte da comunidade',
        subtitle: 'Junte-se a milhares de pessoas construindo o futuro da governança descentralizada',
        discord: { title: 'Discord', description: 'Participe das discussões', cta: 'Entrar no Discord' },
        twitter: { title: 'Twitter', description: 'Acompanhe novidades', cta: 'Seguir' },
        github: { title: 'GitHub', description: 'Código open-source', cta: 'Ver código' }
      },
      faq: {
        title: 'Perguntas Frequentes',
        subtitle: 'Tudo que você precisa saber sobre Revenue Bonds',
        q1: { question: 'O que é Revenue Bonds Protocol?', answer: 'Um protocolo para protocolos DeFi compartilharem receita com sua comunidade através de bonds tokenizados ERC-20.' },
        q2: { question: 'Como funciona a distribuição?', answer: 'Revenue é enviada para o router e distribuída proporcionalmente aos holders. Cada holder faz claim da sua parte.' },
        q3: { question: 'Quanto custa criar uma série?', answer: 'Criar uma série custa aproximadamente $3-4 em gas na Arbitrum One.' },
        q4: { question: 'Quais são os limites?', answer: 'Revenue share máximo: 50%. Duração mínima: 30 dias. Duração máxima: 5 anos.' },
        q5: { question: 'Os contratos são seguros?', answer: 'Sim! Contratos verificados no Arbiscan com 377 testes passando (100%).' },
        q6: { question: 'Por que Arbitrum One?', answer: 'Taxas baixas (~$0.08 para distribuir revenue) e alta velocidade para operações frequentes.' }
      },
      cta: { title: 'Pronto para começar?', subtitle: 'Crie sua primeira série de revenue bonds', button: 'Acessar Aplicação' },
      footer: { description: 'Revenue sharing on-chain na Arbitrum One.', protocol: 'Protocolo', howToParticipate: 'Como funciona', docs: 'Documentação', app: 'Aplicação', contracts: 'Contratos', communityTitle: 'Comunidade', contractsTitle: 'Contratos', factory: 'Factory', treasury: 'Treasury', copyright: ' 2025 Equorum Protocol.', builtOn: 'Construído na' }
    }
  },
  en: {
    translation: {
      nav: { about: 'About', products: 'Products', community: 'Community', faq: 'FAQ' },
      hero: { badge: 'REVENUE BONDS', title: 'Share Revenue with Your Community', description1: 'Revenue Bonds Protocol enables DeFi protocols to share revenue with their community through tokenized bonds.', description2: 'Create ERC-20 revenue bond series that automatically distribute a percentage of your revenue to holders.', cta: 'Launch App' },
      participate: { title: 'How it works?', subtitle: 'Three simple steps to share revenue', step1: { title: 'Create a Series', description: 'Define name, symbol, revenue %, and duration.', link: 'View Docs' }, step2: { title: 'Distribute Tokens', description: 'Send series tokens to your community.', link: 'Launch App' }, step3: { title: 'Share Revenue', description: 'Send revenue and holders claim automatically.', link: 'View Contracts' } },
      voting: { badge: 'ON-CHAIN', title: 'Automatic Distribution', description1: 'Revenue is distributed proportionally to holders fully on-chain.', description2: 'Each holder can claim their share anytime.', votes: 'tokens' },
      community: { title: 'Join the community', subtitle: 'Join thousands building the future', discord: { title: 'Discord', description: 'Join discussions', cta: 'Join Discord' }, twitter: { title: 'Twitter', description: 'Follow for news', cta: 'Follow' }, github: { title: 'GitHub', description: 'Open-source code', cta: 'View source' } },
      faq: { title: 'FAQ', subtitle: 'Everything you need to know', q1: { question: 'What is Revenue Bonds?', answer: 'A protocol for DeFi protocols to share revenue with their community through tokenized ERC-20 bonds.' }, q2: { question: 'How does distribution work?', answer: 'Revenue is sent to the router and distributed proportionally. Each holder claims their share.' }, q3: { question: 'How much to create a series?', answer: 'Approximately $3-4 in gas on Arbitrum One.' }, q4: { question: 'What are the limits?', answer: 'Max revenue share: 50%. Min duration: 30 days. Max duration: 5 years.' }, q5: { question: 'Are contracts safe?', answer: 'Yes! Verified on Arbiscan with 377 tests passing (100%).' }, q6: { question: 'Why Arbitrum One?', answer: 'Low fees (~$0.08 to distribute revenue) and high speed for frequent operations.' } },
      cta: { title: 'Ready to start?', subtitle: 'Create your first revenue bond series', button: 'Launch App' },
      footer: { description: 'On-chain revenue sharing on Arbitrum One.', protocol: 'Protocol', howToParticipate: 'How it works', docs: 'Documentation', app: 'Application', contracts: 'Contracts', communityTitle: 'Community', contractsTitle: 'Contracts', factory: 'Factory', treasury: 'Treasury', copyright: ' 2025 Equorum Protocol.', builtOn: 'Built on' }
    }
  },
  es: {
    translation: {
      nav: { about: 'Sobre', participate: 'Participar', community: 'Comunidad', faq: 'FAQ' },
      hero: { badge: 'PROTOCOLO', title: 'Qué es Equorum?', description1: 'Protocolo de gobernanza descentralizada en Arbitrum One.', description2: 'Las decisiones las toma la comunidad.', cta: 'Comenzar' },
      participate: { title: 'Cómo participar?', subtitle: 'Tres pasos', step1: { title: 'Obtén EQM', description: 'Reclama tokens gratis.', link: 'Ir al Faucet' }, step2: { title: 'Haz stake', description: 'Bloquea para votar.', link: 'Staking' }, step3: { title: 'Vota', description: 'Decide el futuro.', link: 'Gobernanza' } },
      voting: { badge: 'GOBERNANZA', title: 'Votación Cuadrática', description1: 'Equilibramos el poder.', description2: '100 tokens = 10 votos.', votes: 'votos' },
      community: { title: 'Únete', subtitle: 'Construye el futuro', discord: { title: 'Discord', description: 'Discusiones', cta: 'Entrar' }, twitter: { title: 'Twitter', description: 'Novedades', cta: 'Seguir' }, github: { title: 'GitHub', description: 'Open-source', cta: 'Ver código' } },
      faq: { title: 'FAQ', subtitle: 'Todo lo que necesitas saber', q1: { question: 'Qué es Equorum?', answer: 'Protocolo de gobernanza.' }, q2: { question: 'Votación cuadrática?', answer: 'Raíz cuadrada de tokens.' }, q3: { question: 'Cómo reclamar?', answer: 'Función claim en Arbiscan.' }, q4: { question: 'Suministro?', answer: '48 millones EQM.' }, q5: { question: 'Seguro?', answer: 'Verificado.' }, q6: { question: 'Por qué Arbitrum?', answer: 'Bajas tarifas.' } },
      cta: { title: 'Listo?', subtitle: 'Reclama tokens', button: 'Reclamar' },
      footer: { description: 'Gobernanza en Arbitrum One.', protocol: 'Protocolo', howToParticipate: 'Participar', faucet: 'Faucet', staking: 'Staking', governance: 'Gobernanza', communityTitle: 'Comunidad', contracts: 'Contratos', tokenEQM: 'Token EQM', copyright: ' 2025 Equorum.', builtOn: 'En' }
    }
  },
  ja: {
    translation: {
      nav: { about: '概要', participate: '参加', community: 'コミュニティ', faq: 'FAQ' },
      hero: { badge: 'プロトコル', title: 'Equorumとは？', description1: '分散型ガバナンスプロトコル。', description2: 'コミュニティが決定。', cta: '参加' },
      participate: { title: '参加方法', subtitle: '3つのステップ', step1: { title: 'EQM取得', description: '無料トークン請求。', link: 'フォーセット' }, step2: { title: 'ステーク', description: '投票権獲得。', link: 'ステーキング' }, step3: { title: '投票', description: '未来を決定。', link: 'ガバナンス' } },
      voting: { badge: 'ガバナンス', title: '二次投票', description1: '権力バランス。', description2: '100トークン = 10票。', votes: '票' },
      community: { title: 'コミュニティ', subtitle: '未来を構築', discord: { title: 'Discord', description: 'ディスカッション', cta: '参加' }, twitter: { title: 'Twitter', description: 'ニュース', cta: 'フォロー' }, github: { title: 'GitHub', description: 'オープンソース', cta: 'コード' } },
      faq: { title: 'FAQ', subtitle: '必要な情報', q1: { question: 'Equorumとは？', answer: 'ガバナンスプロトコル。' }, q2: { question: '二次投票？', answer: '平方根が投票権。' }, q3: { question: '請求方法？', answer: 'claim関数。' }, q4: { question: '総供給量？', answer: '4800万EQM。' }, q5: { question: '安全？', answer: '検証済み。' }, q6: { question: 'なぜArbitrum？', answer: '低手数料。' } },
      cta: { title: '準備OK？', subtitle: 'トークン請求', button: '請求' },
      footer: { description: 'Arbitrum Oneガバナンス。', protocol: 'プロトコル', howToParticipate: '参加方法', faucet: 'フォーセット', staking: 'ステーキング', governance: 'ガバナンス', communityTitle: 'コミュニティ', contracts: 'コントラクト', tokenEQM: 'EQMトークン', copyright: ' 2025 Equorum.', builtOn: 'プラットフォーム' }
    }
  },
  zh: {
    translation: {
      nav: { about: '关于', participate: '参与', community: '社区', faq: 'FAQ' },
      hero: { badge: '协议', title: '什么是Equorum？', description1: '去中心化治理协议。', description2: '社区决定。', cta: '开始' },
      participate: { title: '如何参与？', subtitle: '三个步骤', step1: { title: '获取EQM', description: '领取免费代币。', link: '水龙头' }, step2: { title: '质押', description: '获得投票权。', link: '质押' }, step3: { title: '投票', description: '决定未来。', link: '治理' } },
      voting: { badge: '治理', title: '二次投票', description1: '平衡权力。', description2: '100代币 = 10票。', votes: '票' },
      community: { title: '加入社区', subtitle: '构建未来', discord: { title: 'Discord', description: '讨论', cta: '加入' }, twitter: { title: 'Twitter', description: '新闻', cta: '关注' }, github: { title: 'GitHub', description: '开源', cta: '代码' } },
      faq: { title: 'FAQ', subtitle: '所需信息', q1: { question: '什么是Equorum？', answer: '治理协议。' }, q2: { question: '二次投票？', answer: '平方根投票权。' }, q3: { question: '如何领取？', answer: 'claim函数。' }, q4: { question: '总供应量？', answer: '4800万EQM。' }, q5: { question: '安全吗？', answer: '已验证。' }, q6: { question: '为什么Arbitrum？', answer: '低费用。' } },
      cta: { title: '准备好了？', subtitle: '领取代币', button: '领取' },
      footer: { description: 'Arbitrum One治理。', protocol: '协议', howToParticipate: '如何参与', faucet: '水龙头', staking: '质押', governance: '治理', communityTitle: '社区', contracts: '合约', tokenEQM: 'EQM代币', copyright: ' 2025 Equorum.', builtOn: '构建于' }
    }
  }
};

i18n.use(initReactI18next).init({
  resources,
  lng: 'pt',
  fallbackLng: 'en',
  interpolation: { escapeValue: false }
});

export default i18n;
