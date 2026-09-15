#!/usr/bin/env python3
"""
Apply the shared Equorum chrome (stylesheet link, nav, footer) to a page.

The 2026 redesign moved every page onto /css/equorum.css. This script does the
mechanical part so the markup below lives in exactly one place:

    python3 tools/apply_chrome.py dashboard.html --app --active dashboard

  --app     keep the wallet button, network warning and language selector
  --active  which nav link to mark as current (home|investors|dashboard|status|contact)
  --keep-style  leave the page's own <style> block in place (it is replaced by
                a link to the shared stylesheet by default)
"""
import argparse
import re
import sys

CSS_LINK = '    <link rel="stylesheet" href="/css/equorum.css">'

HAMBURGER = (
    '            <button class="nav-hamburger" id="hamburger-btn" aria-label="Menu" onclick="toggleMobileMenu()">\n'
    '                <svg width="26" height="26" viewBox="0 0 26 26" fill="none">'
    '<path d="M4 8h18M4 13h18M4 18h18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>\n'
    '            </button>'
)

LINKS = [
    ("home", '/#how-it-works', 'How it works'),
    ("investors", '/investors.html', 'For investors'),
    ("dashboard", '/dashboard.html', 'Explore bonds'),
    ("status", '/development.html', 'Status'),
    ("contact", '/contact.html', 'Contact'),
]

APP_EXTRA = """
                <button id="connect-wallet-btn" class="btn btn-primary btn-sm btn-inline">Connect Wallet</button>
                <div class="language-selector">
                    <button class="lang-current" onclick="toggleLanguageDropdown()" id="current-lang">English</button>
                    <div class="lang-dropdown" id="lang-dropdown">
                        <button class="lang-option active" onclick="selectLanguage('en', 'English')">English</button>
                        <button class="lang-option" onclick="selectLanguage('pt-BR', 'Português')">Português</button>
                        <button class="lang-option" onclick="selectLanguage('es', 'Español')">Español</button>
                        <button class="lang-option" onclick="selectLanguage('ja', '日本語')">日本語</button>
                        <button class="lang-option" onclick="selectLanguage('zh', '中文')">中文</button>
                    </div>
                </div>"""

NETWORK_WARNING = """
        <div id="network-warning" class="alert alert-warning" style="display: none; position: fixed; top: 84px; right: 20px; z-index: 1000;">
            <strong>Wrong network</strong>
            <p style="margin: 6px 0 10px 0;">Please switch to Arbitrum One.</p>
            <button id="switch-network-btn" class="btn btn-primary btn-sm">Switch network</button>
        </div>"""

FOOTER = """<footer class="footer">
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
                <a href="https://github.com/EquorumProtocol" target="_blank" rel="noopener">GitHub</a>
                <a href="/faq-help.html">Help</a>
                <a href="/dashboard.html">Explore bonds</a>
            </div>
            <div class="footer-section">
                <h4>Contact</h4>
                <a href="mailto:leonardomondaine@gmail.com" class="mono" style="font-size: 13px;">leonardomondaine@gmail.com</a>
                <a href="mailto:suport@equorumprotocol.org" class="mono" style="font-size: 13px;">suport@equorumprotocol.org</a>
            </div>
        </div>
        <div class="footer-text">
            <span>© 2026 Equorum Protocol</span>
            <span style="max-width: 720px;">Revenue-linked tokens may be regulated as securities in your jurisdiction. Nothing here is investment advice.</span>
        </div>
    </div>
</footer>"""


def build_nav(active: str, app: bool) -> str:
    links = []
    for key, href, label in LINKS:
        cls = ' class="active"' if key == active else ''
        links.append(f'            <a href="{href}"{cls}>{label}</a>')
    if app:
        links.insert(3, '            <a href="/buy.html">Buy bonds</a>')
        links.insert(4, '            <a href="/create.html">Create series</a>')
    nav_links = "\n".join(links)
    extra = APP_EXTRA if app else ""
    cta = ('            <a href="/contact.html" class="btn btn-primary btn-sm btn-inline">Apply as issuer</a>\n'
           if not app else "")
    warning = NETWORK_WARNING if app else ""
    return f"""<nav class="navbar">
    <div class="nav-container">
        <a href="/" class="nav-brand"><img src="/logo-orange.svg" alt="Equorum" class="logo"><span>Equorum</span></a>
        <div class="nav-links" id="nav-links">
{nav_links}{extra}
        </div>
        <div class="row">
            <a href="https://github.com/EquorumProtocol" class="btn btn-secondary btn-sm btn-inline" target="_blank" rel="noopener">GitHub</a>
{cta}{HAMBURGER}
        </div>{warning}
    </div>
</nav>"""


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("page")
    ap.add_argument("--app", action="store_true")
    ap.add_argument("--active", default="")
    ap.add_argument("--keep-style", action="store_true")
    args = ap.parse_args()

    html = open(args.page, encoding="utf-8").read()

    # 1. stylesheet
    if not args.keep_style:
        html = re.sub(r"[ \t]*<style>.*?</style>\n?", "", html, count=1, flags=re.S)
    if "/css/equorum.css" not in html:
        html = html.replace("</head>", CSS_LINK + "\n</head>", 1)
    # drop the old per-page stylesheets that the shared one replaces
    html = re.sub(r'[ \t]*<link[^>]+mobile-menu\.css[^>]*>\n?', "", html)

    # 2. nav
    nav = build_nav(args.active, args.app)
    html, n = re.subn(r"<nav\b.*?</nav>", lambda _m: nav, html, count=1, flags=re.S)
    if not n:
        print(f"{args.page}: no <nav> found", file=sys.stderr)

    # 3. footer
    html, f = re.subn(r"<footer\b.*?</footer>", lambda _m: FOOTER, html, count=1, flags=re.S)
    if not f:
        html = html.replace("</body>", FOOTER + "\n</body>", 1)

    # 4. mobile menu script
    if "mobile-menu.js" not in html:
        html = html.replace("</body>", '<script src="/src/mobile-menu.js"></script>\n</body>', 1)

    open(args.page, "w", encoding="utf-8").write(html)
    print(f"{args.page}: chrome applied (app={args.app}, active={args.active or '-'})")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
