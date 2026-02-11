#!/usr/bin/env python3
"""Remove inline .nav-links { display: none } from media queries in all pages.
Also remove old inline .nav-hamburger CSS blocks since mobile-menu.css handles it."""
import re, os

os.chdir('/home/leo/equorum-website')

pages = [
    'dashboard.html', 'series.html', 'buy.html', 'create.html',
    'faq-investors.html', 'faq-protocols.html', 'faq-help.html',
    'investors.html', 'versions.html'
]

for page in pages:
    with open(page, 'r') as f:
        content = f.read()
    original = content

    # Remove ".nav-links { display: none; }" blocks (with optional whitespace)
    content = re.sub(
        r'\s*\.nav-links\s*\{\s*display:\s*none;?\s*\}',
        '', content
    )

    # Remove ".nav-hamburger { display: block; }" blocks
    content = re.sub(
        r'\s*\.nav-hamburger\s*\{\s*display:\s*block;?\s*\}',
        '', content
    )

    # Remove old inline .nav-hamburger CSS definition blocks
    # Match: .nav-hamburger { ... } .nav-hamburger span { ... } .nav-hamburger.active ...
    content = re.sub(
        r'/\*\s*Mobile hamburger button\s*\*/\s*'
        r'\.nav-hamburger\s*\{[^}]*\}\s*'
        r'\.nav-hamburger\s+span\s*\{[^}]*\}\s*'
        r'\.nav-hamburger\.active\s+span:nth-child\(1\)\s*\{[^}]*\}\s*'
        r'\.nav-hamburger\.active\s+span:nth-child\(2\)\s*\{[^}]*\}\s*'
        r'\.nav-hamburger\.active\s+span:nth-child\(3\)\s*\{[^}]*\}',
        '', content
    )

    # Remove old inline .nav-links.mobile-open blocks
    content = re.sub(
        r'\s*\.nav-links\.mobile-open\s*\{[^}]*\}',
        '', content
    )

    # Remove old inline ".nav-links a { font-size: 1.25rem; }" inside media queries
    content = re.sub(
        r'\s*\.nav-links\s+a\s*\{\s*font-size:\s*1\.25rem;?\s*\}',
        '', content
    )

    if content != original:
        with open(page, 'w') as f:
            f.write(content)
        print(f'Fixed: {page}')
    else:
        print(f'No change: {page}')
