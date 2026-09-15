#!/usr/bin/env python3
"""
Generate the content pages of equorumprotocol.org from one template.

Every page shares the same head, nav and footer, so they live here once.
Run from the repository root:

    python3 tools/build_pages.py

Pages produced: faq-protocols, faq-investors, faq-help, versions, development, blog.
index.html, contact.html, investors.html and the app pages are hand-written.
"""
import html as html_mod
import os

CONTACT_ISSUER = "leonardomondaine@gmail.com"
CONTACT_SUPPORT = "suport@equorumprotocol.org"
GITHUB = "https://github.com/EquorumProtocol"

NAV_ITEMS = [
    ("home", "/#how-it-works", "How it works"),
    ("investors", "/investors.html", "For investors"),
    ("dashboard", "/dashboard.html", "Explore bonds"),
    ("status", "/development.html", "Status"),
    ("contact", "/contact.html", "Contact"),
]

TEMPLATE = """<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <title>{title}</title>
    <meta name="description" content="{description}">
    <meta name="robots" content="index, follow">
    <link rel="canonical" href="https://equorumprotocol.org/{slug}">

    <link rel="icon" type="image/x-icon" href="/favicon.ico">
    <link rel="icon" type="image/svg+xml" href="/favicon.svg">
    <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
    <link rel="manifest" href="/site.webmanifest">

    <meta property="og:type" content="website">
    <meta property="og:url" content="https://equorumprotocol.org/{slug}">
    <meta property="og:title" content="{title}">
    <meta property="og:description" content="{description}">
    <meta property="og:image" content="https://equorumprotocol.org/og-image.png">

    <link rel="stylesheet" href="/css/equorum.css">
{extra_css}</head>
<body>

<nav class="navbar">
    <div class="nav-container">
        <a href="/" class="nav-brand"><img src="/logo-orange.svg" alt="Equorum" class="logo"><span>Equorum</span></a>
        <div class="nav-links" id="nav-links">
{nav_links}
        </div>
        <div class="row">
            <a href="{github}" class="btn btn-secondary btn-sm btn-inline" target="_blank" rel="noopener">GitHub</a>
            <a href="/contact.html" class="btn btn-primary btn-sm btn-inline">Apply as issuer</a>
            <button class="nav-hamburger" id="hamburger-btn" aria-label="Menu" onclick="toggleMobileMenu()">
                <svg width="26" height="26" viewBox="0 0 26 26" fill="none"><path d="M4 8h18M4 13h18M4 18h18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
            </button>
        </div>
    </div>
</nav>

<header class="hero" style="padding-bottom: 44px;">
    <div class="container">
        <span class="eyebrow">{eyebrow}</span>
        <h1 style="max-width: 820px;">{heading}</h1>
        <p class="muted" style="font-size: 18px; max-width: 640px;">{intro}</p>
    </div>
</header>

{body}

<footer class="footer">
    <div class="container">
        <div class="footer-content">
            <div class="footer-section">
                <a href="/" class="nav-brand"><img src="/logo-orange.svg" alt="Equorum" class="logo"><span>Equorum</span></a>
                <p class="dim" style="font-size: 13.5px; max-width: 300px;">Revenue bonds for protocols that earn. Built on Arbitrum One.</p>
            </div>
            <div class="footer-section">
                <h4>Protocol</h4>
                <a href="/#how-it-works">How it works</a>
                <a href="/development.html">Status &amp; roadmap</a>
                <a href="/versions.html">V2 (legacy)</a>
                <a href="/WHITEPAPER.pdf">Whitepaper (PDF)</a>
            </div>
            <div class="footer-section">
                <h4>Learn</h4>
                <a href="/investors.html">For investors</a>
                <a href="/faq-protocols.html">FAQ for protocols</a>
                <a href="/faq-investors.html">FAQ for investors</a>
                <a href="/blog.html">Blog</a>
            </div>
            <div class="footer-section">
                <h4>Community</h4>
                <a href="{github}" target="_blank" rel="noopener">GitHub</a>
                <a href="/faq-help.html">Help</a>
                <a href="/dashboard.html">Explore bonds</a>
            </div>
            <div class="footer-section">
                <h4>Contact</h4>
                <a href="mailto:{issuer_mail}" class="mono" style="font-size: 13px;">{issuer_mail}</a>
                <a href="mailto:{support_mail}" class="mono" style="font-size: 13px;">{support_mail}</a>
            </div>
        </div>
        <div class="footer-text">
            <span>© 2026 Equorum Protocol</span>
            <span style="max-width: 720px;">Revenue-linked tokens may be regulated as securities in your jurisdiction. Nothing here is investment advice.</span>
        </div>
    </div>
</footer>

<script src="/src/mobile-menu.js"></script>
{extra_js}</body>
</html>
"""

FAQ_JS = """<script>
document.querySelectorAll('.faq-question').forEach(function (q) {
    q.addEventListener('click', function () {
        var a = q.nextElementSibling;
        var open = !a.hidden;
        a.hidden = open;
        q.querySelector('.faq-icon').textContent = open ? '+' : '−';
    });
});
</script>
"""


def nav(active):
    out = []
    for key, href, label in NAV_ITEMS:
        cls = ' class="active"' if key == active else ''
        out.append(f'            <a href="{href}"{cls}>{label}</a>')
    return "\n".join(out)


def faq_section(title, items, intro=None):
    parts = [f'<section class="section">\n    <div class="container">']
    if title:
        parts.append(f"        <h2>{title}</h2>")
    if intro:
        parts.append(f'        <p class="muted" style="max-width: 740px;">{intro}</p>')
    parts.append('        <div class="faq-section" style="margin-top: 24px;">')
    for q, a in items:
        parts.append(
            '            <div class="faq-item">\n'
            f'                <button class="faq-question">{q}<span class="faq-icon">+</span></button>\n'
            f'                <div class="faq-answer" hidden>{a}</div>\n'
            "            </div>"
        )
    parts.append("        </div>\n    </div>\n</section>")
    return "\n".join(parts)


def render(slug, title, description, eyebrow, heading, intro, body, active="", extra_css="", extra_js=""):
    page = TEMPLATE.format(
        slug=slug,
        title=html_mod.escape(title, quote=True),
        description=html_mod.escape(description, quote=True),
        eyebrow=eyebrow,
        heading=heading,
        intro=intro,
        body=body,
        nav_links=nav(active),
        github=GITHUB,
        issuer_mail=CONTACT_ISSUER,
        support_mail=CONTACT_SUPPORT,
        extra_css=extra_css,
        extra_js=extra_js,
    )
    with open(slug, "w", encoding="utf-8") as fh:
        fh.write(page)
    print("wrote", slug)


# --------------------------------------------------------------- content ---

PROTOCOL_FAQ = [
    ("Do I need a token to issue a bond?",
     "<p>No. The bond is its own ERC-20, minted only against the ETH investors pay. If you already have a token, nothing about it changes: no new supply, no governance change, no unlock.</p>"),
    ("How much can I raise?",
     "<p>Whatever investors fund up to the cap you set. What matters more is the coupon: across the term, minimum payments must add up to at least 100% of the raise, so set a number your revenue covers in a bad month.</p>"),
    ("When do I actually get the money?",
     "<p>An initial share on the day the sale closes — you choose how much — and the rest in tranches. Each tranche unlocks after the coupons due so far are paid, so the capital arrives at the pace you prove you can service.</p>"),
    ("What happens if I miss a coupon?",
     "<p>You have a grace period you set at issuance. After it, anyone can trigger the default: the tap closes for good, and bondholders redeem the undrawn capital plus any collateral you posted. Capital you already drew stays with you, and the default is recorded permanently in the registry.</p>"),
    ("What does it cost?",
     "<p>2% of the capital you actually draw, capped at 3% for the life of the protocol. There is no listing fee, no fee on a sale that doesn't fill, and no fee on the coupons you pay.</p>"),
    ("Can Equorum touch my bond after it's created?",
     "<p>No. Terms are immutable and there are no admin functions on a live bond. The multisig can only set the fee for new bonds and pause new creation.</p>"),
    ("Do I have to route my protocol revenue through Equorum?",
     "<p>Today it is your choice: you can pay coupons from any source, and the router is optional. A future release (Locked Revenue) will let you hand your fee-switch admin to a lock contract, which makes the revenue share enforceable rather than voluntary.</p>"),
    ("Is this debt? Do I owe it on my balance sheet?",
     "<p>Economically it behaves like an amortizing obligation: you receive capital and pay it back with a premium. How it is treated legally and in accounting depends on your jurisdiction and structure — talk to a lawyer before issuing.</p>"),
]

INVESTOR_FAQ = [
    ("What am I actually buying?",
     "<p>An ERC-20 token that carries a claim on a fixed schedule of payments from one issuer, plus a share of revenue when the issuer routes it. It is transferable, so the claim moves with the token.</p>"),
    ("Where is my money while I wait?",
     "<p>In the bond contract. The issuer draws it in tranches as coupons are paid, so at any moment part of your capital is still escrowed and can only leave to you if the issuer defaults.</p>"),
    ("What do I get if the issuer stops paying?",
     "<p>The coupons already paid, plus your pro-rata share of the capital never drawn, plus the collateral the issuer posted. You burn your bonds to claim it. Capital already drawn is not covered beyond that collateral.</p>"),
    ("How do I know the issuer is good for it?",
     "<p>The registry records, permanently, every raise, every payment and every default per issuer address. Read it before you buy, and weight it by money at risk rather than by the number of bonds issued.</p>"),
    ("Is the yield guaranteed?",
     "<p>No. The minimum coupon is a contractual obligation, not a guarantee of payment: an issuer that stops paying defaults instead. The escrow protects the undrawn part, nothing more.</p>"),
    ("Can I sell before maturity?",
     "<p>The token is a plain ERC-20, so yes, to anyone willing to buy. There is no guarantee a buyer exists, and no protocol-run secondary market.</p>"),
    ("Who can trigger a default?",
     "<p>Anyone, once a coupon is late past the grace period. It is a public function with no privileged caller.</p>"),
    ("Has this been audited?",
     "<p>Not yet. V3 has 82 automated tests, including ones that reproduce every issue found in V2. The first external audit is scheduled for [AUDIT DATE]. Treat anything unaudited as experimental.</p>"),
]

HELP_FAQ = [
    ("My wallet won't connect",
     "<p>Make sure you are on Arbitrum One (chain ID 42161) and that only one wallet extension is enabled. Reload the page after switching networks.</p>"),
    ("My transaction failed",
     "<p>Check that you have enough ETH on Arbitrum for gas, and that the sale you are buying into is still open. Send us the transaction hash and we'll look at the revert reason.</p>"),
    ("My bond isn't showing up",
     "<p>The explorer reads directly from the contracts, so a missing bond usually means a slow RPC. Wait a minute and reload. If it persists, mail support with your wallet address.</p>"),
    ("I can't claim my revenue",
     "<p>Claims are pull-based: if your address is a contract that rejects ETH (an AMM pool, for instance), the claim reverts by design. Move the bonds to an address that can receive ETH.</p>"),
    ("Someone is offering me support in a DM",
     "<p>It is a scam. Equorum never DMs first, never asks for a seed phrase or private key, and never asks you to move funds to a \"safe\" wallet. Support answers only from the address on the contact page.</p>"),
    ("How do I verify I'm on the real contracts?",
     "<p>Every deployed address is listed on this site and verified on Arbiscan, and the source is public on GitHub. Compare the address in your wallet prompt against the list before signing.</p>"),
]

# ------------------------------------------------------------------ build ---

def build_faq_protocols():
    render(
        "faq-protocols.html",
        "FAQ for protocols — Equorum Protocol",
        "How issuing a revenue bond works: how much you can raise, when the capital arrives, what a default means and what it costs.",
        "FAQ · protocols",
        "Issuing a bond, question by question.",
        "If yours isn't here, mail the issuer inbox and we'll answer it — and add it to this page.",
        faq_section("", PROTOCOL_FAQ) + cta_block(
            "Still deciding?",
            "Send us what you'd raise and on what revenue. We model the schedule with you before anything is deployed.",
            "/contact.html", "Talk to the team", "/investors.html", "See the investor side"),
        active="",
        extra_js=FAQ_JS,
    )


def build_faq_investors():
    render(
        "faq-investors.html",
        "FAQ for investors — Equorum Protocol",
        "What a revenue bond pays, where your capital sits, what you recover on default, and what is not guaranteed.",
        "FAQ · investors",
        "Before you put money in.",
        "Short answers, including the uncomfortable ones.",
        faq_section("", INVESTOR_FAQ) + cta_block(
            "Look at the live bonds",
            "The explorer reads the contracts directly, so what you see is what is on-chain.",
            "/dashboard.html", "Explore bonds", "/investors.html", "How bonds work"),
        active="investors",
        extra_js=FAQ_JS,
    )


def build_faq_help():
    render(
        "faq-help.html",
        "Help — Equorum Protocol",
        "Wallet, transaction and claim problems, plus how to tell a real Equorum message from a scam.",
        "Help",
        "Something isn't working.",
        "The problems people actually write in about.",
        faq_section("", HELP_FAQ) + cta_block(
            "Still stuck?",
            "Mail support with your wallet address and the transaction hash. That is usually all we need.",
            "mailto:" + CONTACT_SUPPORT, "Mail support", "/contact.html", "All contacts"),
        active="",
        extra_js=FAQ_JS,
    )


def cta_block(title, text, href1, label1, href2, label2):
    return f"""
<section class="cta-section">
    <div class="container">
        <h2 style="font-size: clamp(26px, 3.2vw, 36px);">{title}</h2>
        <p class="muted" style="max-width: 560px; margin: 0 auto 24px auto;">{text}</p>
        <div class="cta-buttons" style="justify-content: center;">
            <a href="{href1}" class="btn btn-primary">{label1}</a>
            <a href="{href2}" class="btn btn-secondary">{label2}</a>
        </div>
    </div>
</section>
"""


def build_versions():
    body = """
<section class="section">
    <div class="container">
        <div class="table-wrap">
            <table>
                <thead>
                    <tr><th>&nbsp;</th><th>V1</th><th>V2</th><th>V3 — Tap Bonds</th></tr>
                </thead>
                <tbody>
                    <tr><td>Status</td><td>Deprecated</td><td>Live, unaudited</td><td>In development</td></tr>
                    <tr><td>Net capital the issuer raises</td><td>Full amount, no protection</td><td>Zero on Guaranteed Bonds</td><td>Real, released in tranches</td></tr>
                    <tr><td>What protects the investor</td><td>Nothing</td><td>Escrowed principal, if any</td><td>Undrawn capital + collateral</td></tr>
                    <tr><td>Payment enforcement</td><td>None</td><td>Reputation only</td><td>Tap stops, then default</td></tr>
                    <tr><td>Default recorded</td><td>No</td><td>No — the call fails silently</td><td>Yes, permanently</td></tr>
                    <tr><td>Admin power over live bonds</td><td>Owner functions</td><td>Owner + pausable router</td><td>None</td></tr>
                    <tr><td>Protocol fee</td><td>None</td><td>2% on sales, bypassable</td><td>2% on capital drawn, enforced</td></tr>
                </tbody>
            </table>
        </div>
    </div>
</section>

<section class="section section-alt">
    <div class="container">
        <h2>Why V2 is being replaced</h2>
        <div class="grid grid-2" style="margin-top: 24px;">
            <div class="warning-box">
                <h3>The Guaranteed Bond raised nothing</h3>
                <p class="muted">The issuer had to deposit the full principal before selling, and the buyers' ETH went straight back to it. Locking 500 ETH to receive 500 ETH is not financing. V3 replaces it with the tap.</p>
            </div>
            <div class="warning-box">
                <h3>Defaults were never recorded</h3>
                <p class="muted">Authorising a series as a reporter required the registry owner, so the factory's call failed silently. A defaulting issuer kept a clean record. Fixed in V3, with a test that reproduces the old behaviour.</p>
            </div>
        </div>
        <p class="muted" style="margin-top: 24px; max-width: 760px;">
            Eight further issues — a bypassable fee, an issuer-chosen fee recipient, principal that could be
            locked forever, a farmable reputation score and more — are listed in the V3 spec, each with a
            test that proves it against the deployed V2 contracts.
        </p>
        <p style="margin-top: 16px;"><a href="https://github.com/EquorumProtocol/Equorum-Revenue-Bonds/blob/main/docs/V3_SPEC.md" target="_blank" rel="noopener">Read the V3 spec →</a></p>
    </div>
</section>

<section class="section">
    <div class="container">
        <h2>Deployed contracts</h2>
        <p class="muted">V2, Arbitrum One. Verified on Arbiscan.</p>
        <div class="table-wrap" style="margin-top: 20px;">
            <table>
                <tbody>
                    <tr><td>RevenueSeriesFactory</td><td class="mono">0x280E83c47E243267753B7E2f322f55c52d4D2C3a</td></tr>
                    <tr><td>RevenueBondEscrowFactory</td><td class="mono">0x2CfE9a33050EB77fC124ec3eAac4fA4D687bE650</td></tr>
                    <tr><td>ProtocolReputationRegistry</td><td class="mono">0xfe0A22D77fdf98cC556CBc2dC6B3749EBa4E89bA</td></tr>
                    <tr><td>EscrowDeployer</td><td class="mono">0x989BCB780EEE189Bc85e04505e59Fd2Fb3CAA843</td></tr>
                    <tr><td>RouterDeployer</td><td class="mono">0x7c80F6312BFD762B958Ccf9DF2E397840c7856d3</td></tr>
                    <tr><td>Treasury (Safe)</td><td class="mono">0xBa69aEd75E8562f9D23064aEBb21683202c5279B</td></tr>
                    <tr><td>V1 Factory (deprecated)</td><td class="mono">0x8afA0318363FfBc29Cc28B3C98d9139C08Af737b</td></tr>
                </tbody>
            </table>
        </div>
    </div>
</section>
"""
    render(
        "versions.html",
        "Versions — Equorum Protocol",
        "What changed between V1, V2 and V3 of Equorum, why the V2 Guaranteed Bond is being retired, and every deployed contract address.",
        "Versions",
        "V1, V2 and what V3 fixes.",
        "The contracts are immutable, so a new version means new contracts. Here is what each one does and does not do.",
        body,
        active="status",
    )


def build_development():
    body = """
<section class="section">
    <div class="container">
        <div class="grid grid-4">
            <div class="card"><div class="hero-stat-value">82</div><div class="hero-stat-label">tests passing on V3</div></div>
            <div class="card"><div class="hero-stat-value">10</div><div class="hero-stat-label">V2 issues fixed and reproduced</div></div>
            <div class="card"><div class="hero-stat-value">0</div><div class="hero-stat-label">external audits so far</div></div>
            <div class="card"><div class="hero-stat-value">1</div><div class="hero-stat-label">series ever issued on V2</div></div>
        </div>
    </div>
</section>

<section class="section section-alt">
    <div class="container">
        <h2>Where V3 stands</h2>
        <div class="stack" style="gap: 18px; margin-top: 26px; max-width: 860px;">
            <div class="feature-item">
                <span class="feature-icon" style="color: var(--green);">✓</span>
                <p><strong>Contracts written and merged.</strong> TapBond, TapRouter, TapBondFactory, FeeSplitter and the registry, with unit, fuzz and invariant tests.</p>
            </div>
            <div class="feature-item">
                <span class="feature-icon" style="color: var(--green);">✓</span>
                <p><strong>V2 reviewed in public.</strong> Every issue found is reproduced in a test against the real deployed V2 contracts, not described in prose.</p>
            </div>
            <div class="feature-item">
                <span class="feature-icon" style="color: var(--amber);">→</span>
                <p><strong>Testnet deployment.</strong> Next step: Arbitrum Sepolia, with a scripted end-to-end run from sale to coupon to claim.</p>
            </div>
            <div class="feature-item">
                <span class="feature-icon" style="color: var(--text-dim);">·</span>
                <p><strong>Multisig with real signers.</strong> The treasury is a 1-of-1 Safe today. Before mainnet it becomes a multisig with people who are not the founder.</p>
            </div>
            <div class="feature-item">
                <span class="feature-icon" style="color: var(--text-dim);">·</span>
                <p><strong>External audit.</strong> Scheduled for [AUDIT DATE]. Nothing goes to mainnet before it.</p>
            </div>
            <div class="feature-item">
                <span class="feature-icon" style="color: var(--text-dim);">·</span>
                <p><strong>Locked Revenue.</strong> The fee-switch lock that turns the revenue share from voluntary into enforced. Deferred to the release after V3.</p>
            </div>
        </div>
    </div>
</section>

<section class="section">
    <div class="container grid grid-2" style="gap: 48px;">
        <div>
            <h2>What we will not do</h2>
            <ul class="muted" style="padding-left: 20px; margin-top: 16px;">
                <li>Deploy V3 to mainnet before an external audit.</li>
                <li>Launch a token before the protocol has issuers and fees.</li>
                <li>Publish a TVL number that counts our own money.</li>
                <li>Call a 1-of-1 Safe a multisig.</li>
            </ul>
        </div>
        <div class="card">
            <h3>Follow the work</h3>
            <p class="muted">Everything happens in the open: contracts, tests, the spec and the review of our own V2.</p>
            <div class="cta-buttons" style="margin-top: 18px;">
                <a href="https://github.com/EquorumProtocol/Equorum-Revenue-Bonds" class="btn btn-secondary btn-sm" target="_blank" rel="noopener">Contracts on GitHub</a>
            </div>
        </div>
    </div>
</section>
"""
    render(
        "development.html",
        "Status & roadmap — Equorum Protocol",
        "Exactly where Equorum V3 is: what is built, what is next, and what will not happen before an external audit.",
        "Status",
        "Where the protocol actually is.",
        "No roadmap theatre. This page says what exists today, what is next, and what we refuse to do early.",
        body,
        active="status",
    )


def build_blog():
    posts = [
        ("/blog/why-protocols-should-sell-revenue.html", "Why protocols should sell revenue, not tokens",
         "The DeFi fundraising model is broken. Stop selling dreams, start selling cash flows.", "$"),
        ("/blog/principal-protection-changes-defi-trust.html", "How principal protection changes DeFi trust",
         "Yield without trust is speculation. Revenue with guarantees is finance.", "◆"),
        ("/blog/lifecycle-of-revenue-bond-series.html", "The lifecycle of a revenue bond series",
         "From deployment to maturity: a step-by-step operational guide.", "↻"),
    ]
    cards = "\n".join(
        f"""            <a href="{href}" class="blog-card">
                <div class="blog-card-image">{glyph}</div>
                <h3 class="blog-card-title">{title}</h3>
                <p class="blog-card-excerpt">{excerpt}</p>
            </a>""" for href, title, excerpt, glyph in posts
    )
    body = f"""
<section class="section" style="border-top: 0;">
    <div class="container">
        <div class="blog-grid">
{cards}
        </div>
    </div>
</section>
"""
    render(
        "blog.html",
        "Blog — Equorum Protocol",
        "Writing about revenue-based financing on-chain: why it beats token sales, how protection actually works, and how a series runs.",
        "Blog",
        "Notes on financing a protocol with its own revenue.",
        "Long-form pieces on the mechanics behind Equorum.",
        body,
    )


if __name__ == "__main__":
    os.chdir(os.path.join(os.path.dirname(os.path.abspath(__file__)), ".."))
    build_faq_protocols()
    build_faq_investors()
    build_faq_help()
    build_versions()
    build_development()
    build_blog()
