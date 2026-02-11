// Mobile Menu - Shared across all pages
// Creates a separate mobile panel OUTSIDE the nav to avoid stacking context issues
(function() {
    var mobilePanel = null;
    var overlay = null;

    function createMobilePanel() {
        var nav = document.getElementById('nav-links');
        if (!nav || document.getElementById('mobile-panel')) return;

        // Create panel outside nav, directly on body
        mobilePanel = document.createElement('div');
        mobilePanel.id = 'mobile-panel';

        // Clone all links from nav
        var items = nav.children;
        for (var i = 0; i < items.length; i++) {
            var item = items[i];
            // Skip buttons (connect wallet, language buttons handled separately)
            if (item.tagName === 'BUTTON') continue;
            var clone = item.cloneNode(true);
            mobilePanel.appendChild(clone);
        }

        document.body.appendChild(mobilePanel);

        // Create overlay if not exists
        overlay = document.getElementById('mobile-overlay');
        if (!overlay) {
            overlay = document.createElement('div');
            overlay.id = 'mobile-overlay';
            overlay.className = 'mobile-overlay';
            document.body.appendChild(overlay);
        }
        overlay.addEventListener('click', closeMobileMenu);

        // Attach click to all links in the panel
        var links = mobilePanel.querySelectorAll('a');
        for (var j = 0; j < links.length; j++) {
            links[j].addEventListener('click', function(e) {
                var href = this.getAttribute('href');
                if (!href || href === '#') return;
                closeMobileMenu();
                if (this.hasAttribute('download')) return;
                e.preventDefault();
                window.location.href = href;
            });
        }
    }

    function openMobileMenu() {
        if (!mobilePanel) createMobilePanel();
        if (!mobilePanel) return;
        mobilePanel.classList.add('open');
        var btn = document.getElementById('hamburger-btn');
        if (btn) btn.classList.add('active');
        if (overlay) overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeMobileMenu() {
        if (mobilePanel) mobilePanel.classList.remove('open');
        var btn = document.getElementById('hamburger-btn');
        if (btn) btn.classList.remove('active');
        if (overlay) overlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    window.toggleMobileMenu = function() {
        if (mobilePanel && mobilePanel.classList.contains('open')) {
            closeMobileMenu();
        } else {
            openMobileMenu();
        }
    };

    // Initialize on DOM ready
    function init() {
        createMobilePanel();
    }
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
