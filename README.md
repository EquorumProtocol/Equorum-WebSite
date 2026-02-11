# Equorum Protocol — Website

Official website for **Equorum Protocol**, a decentralized revenue bond platform on Arbitrum One.

**Live:** [equorumprotocol.org](https://equorumprotocol.org)

## What is Equorum?

Equorum enables protocols to raise capital by issuing **revenue-backed bonds** — no token sales, no VCs, no dilution. Investors earn yield from real protocol revenue.

### Bond Types (V2)

- **Soft Bonds** — Reputation-based, flexible revenue sharing
- **Guaranteed Bonds** — Escrowed principal with trustless protection

## Pages

| Page | Description |
|------|-------------|
| `index.html` | Landing page |
| `dashboard.html` | Explore active bond series |
| `buy.html` | Buy bonds from active series |
| `create.html` | Create a new bond series |
| `series.html` | Individual series details |
| `investors.html` | Information for investors |
| `versions.html` | V1 vs V2 comparison |
| `faq-investors.html` | FAQ for investors |
| `faq-protocols.html` | FAQ for protocols |
| `faq-help.html` | General help & troubleshooting |

## Tech Stack

- **Frontend:** Vanilla HTML/CSS/JS (no framework)
- **Blockchain:** ethers.js v5 with multi-RPC fallback
- **Network:** Arbitrum One (chainId: 42161)
- **Wallet:** EIP-6963 multi-wallet detection (MetaMask, Rabby, etc.)
- **Hosting:** cPanel (static files)

## V2 Contracts (Arbitrum One)

| Contract | Address |
|----------|---------|
| ProtocolReputationRegistry | `0xfe0A22D77fdf98cC556CBc2dC6B3749EBa4E89bA` |
| RevenueSeriesFactory (Soft Bonds) | `0x280E83c47E243267753B7E2f322f55c52d4D2C3a` |
| RevenueBondEscrowFactory (Guaranteed Bonds) | `0x2CfE9a33050EB77fC124ec3eAac4fA4D687bE650` |
| EscrowDeployer | `0x989BCB780EEE189Bc85e04505e59Fd2Fb3CAA843` |
| RouterDeployer | `0x7c80F6312BFD762B958Ccf9DF2E397840c7856d3` |

All contracts are verified on [Arbiscan](https://arbiscan.io).

## Local Development

```bash
# Serve with no-cache headers
python3 nocache_server.py
# Open http://localhost:8888
```

## License

All rights reserved. © 2026 Equorum Protocol.
