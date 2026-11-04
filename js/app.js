/* ===== Main App Controller ===== */
(function(app) {
    'use strict';

    // ---- Navigation ----
    var currentSection = 'home';

    function navigateTo(sectionId) {
        // Update nav items
        document.querySelectorAll('.nav-item').forEach(function(item) {
            item.classList.toggle('active', item.dataset.section === sectionId);
        });

        // Update sections
        document.querySelectorAll('.section').forEach(function(sec) {
            sec.classList.toggle('active', sec.id === 'section-' + sectionId);
        });

        currentSection = sectionId;

        // Close mobile sidebar
        document.getElementById('sidebar').classList.remove('open');

        // Scroll to top
        window.scrollTo(0, 0);
    }

    // ---- Progress Update ----
    app.updateProgress = function() {
        ['caesar', 'monoalphabetic', 'playfair'].forEach(function(sec) {
            var pct = app.progress.getProgress(sec);
            var dot = document.getElementById('prog-' + sec);
            if (dot) {
                dot.classList.remove('partial', 'complete');
                if (pct >= 100) dot.classList.add('complete');
                else if (pct > 0) dot.classList.add('partial');
            }
            // Home cards
            var homeBar = document.getElementById('home-prog-' + (sec === 'monoalphabetic' ? 'mono' : sec));
            if (homeBar) homeBar.style.width = pct + '%';
        });

        // Overall progress
        var total = 0, count = 0;
        ['caesar', 'monoalphabetic', 'playfair'].forEach(function(sec) {
            total += app.progress.getProgress(sec);
            count++;
        });
        var overall = Math.round(total / count);
        var fill = document.getElementById('overall-progress-fill');
        var text = document.getElementById('overall-progress-text');
        if (fill) fill.style.width = overall + '%';
        if (text) text.textContent = overall + '%';
    };

    // ---- Init ----
    document.addEventListener('DOMContentLoaded', function() {
        // Nav clicks
        document.querySelectorAll('.nav-item').forEach(function(item) {
            item.addEventListener('click', function() {
                navigateTo(this.dataset.section);
            });
        });

        // Home card clicks
        document.querySelectorAll('.home-card').forEach(function(card) {
            card.addEventListener('click', function() {
                var target = this.dataset.goto;
                if (target) navigateTo(target);
            });
        });

        // Mobile menu toggle
        var toggleBtn = document.getElementById('menu-toggle');
        var sidebar = document.getElementById('sidebar');
        if (toggleBtn) {
            toggleBtn.addEventListener('click', function() {
                sidebar.classList.toggle('open');
            });
        }

        // Close sidebar when clicking outside on mobile
        document.getElementById('main-content').addEventListener('click', function() {
            sidebar.classList.remove('open');
        });

        // Initialize all registered modules
        Object.keys(app.modules).forEach(function(name) {
            var container = document.getElementById('section-' + name);
            if (container && app.modules[name]) {
                try {
                    app.modules[name](container);
                } catch(e) {
                    console.error('Error initializing module ' + name + ':', e);
                    container.innerHTML = '<div class="section-content"><div class="alert alert-danger">Error loading ' + name + ' module. Check console for details.</div></div>';
                }
            }
        });

        // Collapsible sections (delegated)
        document.addEventListener('click', function(e) {
            var header = e.target.closest('.collapsible-header');
            if (header) {
                var collapsible = header.closest('.collapsible');
                if (collapsible) collapsible.classList.toggle('open');
            }
        });

        // Update progress display
        app.updateProgress();
    });

    // Expose navigateTo
    app.navigateTo = navigateTo;

})(window.CipherApp);

