/* ===== Main App Controller ===== */
(function(app) {
    'use strict';

    var utils = app.utils;

    // ---- Navigation ----
    var currentSection = 'home';

    var sectionTitles = {
        home: 'Interactive Learning Suite',
        caesar: 'Caesar Cipher (Shift) Lab',
        monoalphabetic: 'Monoalphabetic Substitution Lab',
        playfair: 'Playfair 5×5 Matrix Lab',
        comparison: 'Comparative Cryptanalysis Guide',
        exam: 'Timed Practical Exam Simulation',
        review: 'Cheat Sheets, Cribs & Fast Reference'
    };

    // Floating jump button targets per cipher section
    var workbenchTargets = {
        caesar: { anchor: 'caesar-encrypt-card' },
        monoalphabetic: { tab: 'mono-tab-alpha', anchor: 'mono-workbench' },
        playfair: { anchor: 'playfair-encrypt-card' }
    };

    function navigateTo(sectionId, skipHash) {
        if (!sectionTitles[sectionId]) sectionId = 'home';

        // Update nav items
        document.querySelectorAll('.nav-item').forEach(function(item) {
            item.classList.toggle('active', item.dataset.section === sectionId);
        });

        // Update sections
        document.querySelectorAll('.section').forEach(function(sec) {
            sec.classList.toggle('active', sec.id === 'section-' + sectionId);
        });

        currentSection = sectionId;

        // Show floating jump button only on cipher workbench sections
        var fab = document.getElementById('workbench-fab');
        if (fab) fab.classList.toggle('visible', !!workbenchTargets[sectionId]);

        // Persist active section
        if (app.storage) {
            app.storage.set('last_section', sectionId);
        }

        // Sync URL Hash (without duplicate reload)
        if (!skipHash) {
            var targetHash = sectionId === 'home' ? '' : '#' + sectionId;
            if (window.location.hash !== targetHash) {
                history.replaceState(null, '', targetHash || window.location.pathname);
            }
        }

        // Update topbar breadcrumbs
        var breadcrumb = document.getElementById('top-breadcrumb');
        if (breadcrumb && sectionTitles[sectionId]) {
            breadcrumb.textContent = sectionTitles[sectionId];
        }

        // Close mobile sidebar
        closeMobileSidebar();

        // Scroll to top
        window.scrollTo(0, 0);
    }

    function openMobileSidebar() {
        var sidebar = document.getElementById('sidebar');
        var backdrop = document.getElementById('sidebar-backdrop');
        var toggleBtn = document.getElementById('menu-toggle');
        if (sidebar) sidebar.classList.add('open');
        if (backdrop) backdrop.classList.add('active');
        if (toggleBtn) {
            toggleBtn.setAttribute('aria-expanded', 'true');
            toggleBtn.textContent = '✕';
        }
        document.body.classList.add('sidebar-open-locked');
    }

    function closeMobileSidebar() {
        var sidebar = document.getElementById('sidebar');
        var backdrop = document.getElementById('sidebar-backdrop');
        var toggleBtn = document.getElementById('menu-toggle');
        if (sidebar) sidebar.classList.remove('open');
        if (backdrop) backdrop.classList.remove('active');
        if (toggleBtn) {
            toggleBtn.setAttribute('aria-expanded', 'false');
            toggleBtn.textContent = '☰';
        }
        document.body.classList.remove('sidebar-open-locked');
    }

    // ---- Theme Controller ----
    function initTheme() {
        var savedTheme = localStorage.getItem('cryptolab_theme') || 'dark';
        applyTheme(savedTheme);

        var toggleBtn = document.getElementById('sidebar-theme-toggle');
        if (toggleBtn) {
            toggleBtn.addEventListener('click', function() {
                var current = document.documentElement.getAttribute('data-theme') || 'dark';
                var next = current === 'dark' ? 'light' : 'dark';
                applyTheme(next);
            });
        }
    }

    function applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        try { localStorage.setItem('cryptolab_theme', theme); } catch(e) {}

        var icon = document.getElementById('theme-btn-icon');
        var text = document.getElementById('theme-btn-text');
        if (icon && text) {
            if (theme === 'dark') {
                icon.textContent = '☀️';
                text.textContent = 'Light Mode';
            } else {
                icon.textContent = '🌙';
                text.textContent = 'Dark Mode';
            }
        }
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
            if (homeBar) {
                homeBar.style.width = pct + '%';
                homeBar.style.backgroundColor = utils.getProgressColor(pct);
                homeBar.style.boxShadow = '0 0 8px ' + utils.getProgressGlow(pct);
            }
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
        var rank = document.getElementById('rank-title');
        
        if (fill) {
            fill.style.width = overall + '%';
            fill.style.backgroundColor = utils.getProgressColor(overall);
            fill.style.boxShadow = '0 0 10px ' + utils.getProgressGlow(overall);
        }
        if (text) text.textContent = overall + '%';

        if (rank) {
            if (overall === 0) rank.textContent = 'Recruit';
            else if (overall < 35) rank.textContent = 'Apprentice';
            else if (overall < 70) rank.textContent = 'Cryptanalyst';
            else if (overall < 100) rank.textContent = 'Senior Specialist';
            else rank.textContent = 'Master Cryptographer 🏆';
        }
    };

    // ---- Live Home Sandbox ----
    function initSandbox() {
        var input = document.getElementById('sandbox-input');
        var caesarOut = document.getElementById('sandbox-caesar-out');
        var monoOut = document.getElementById('sandbox-mono-out');
        var playfairOut = document.getElementById('sandbox-playfair-out');

        if (!input || !caesarOut || !monoOut || !playfairOut) return;

        var sampleMonoKey = 'QWERTYUIOPASDFGHJKLZXCVBNM';
        var sampleAlphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

        function updateSandbox() {
            var val = input.value || '';
            var clean = val.toUpperCase().replace(/[^A-Z]/g, '');

            // 1. Caesar (+3)
            var cRes = '';
            for (var i = 0; i < val.length; i++) {
                var ch = val[i].toUpperCase();
                if (/[A-Z]/.test(ch)) {
                    var code = (ch.charCodeAt(0) - 65 + 3) % 26;
                    cRes += String.fromCharCode(code + 65);
                } else {
                    cRes += val[i];
                }
            }
            caesarOut.textContent = cRes || '---';

            // 2. Monoalphabetic
            var mRes = '';
            for (var j = 0; j < val.length; j++) {
                var mch = val[j].toUpperCase();
                var idx = sampleAlphabet.indexOf(mch);
                if (idx !== -1) {
                    mRes += sampleMonoKey[idx];
                } else {
                    mRes += val[j];
                }
            }
            monoOut.textContent = mRes || '---';

            // 3. Playfair Digraphs Preview
            var cleanPF = val.toUpperCase().replace(/[^A-Z]/g, '').replace(/J/g, 'I');
            var pairs = [];
            var p = 0;
            while (p < cleanPF.length) {
                var first = cleanPF[p];
                var second = cleanPF[p + 1];
                if (!second) {
                    pairs.push(first + 'X');
                    p += 1;
                } else if (first === second) {
                    pairs.push(first + 'X');
                    p += 1;
                } else {
                    pairs.push(first + second);
                    p += 2;
                }
            }
            playfairOut.textContent = pairs.length > 0 ? pairs.join(' · ') : '---';
        }

        input.addEventListener('input', updateSandbox);
        updateSandbox();
    }

    // ---- Init ----
    document.addEventListener('DOMContentLoaded', function() {
        // Init theme
        initTheme();

        // Nav clicks
        document.querySelectorAll('.nav-item').forEach(function(item) {
            item.addEventListener('click', function() {
                navigateTo(this.dataset.section);
            });
        });

        // Any element with data-goto (hero buttons, breadcrumbs, home cards)
        document.addEventListener('click', function(e) {
            var targetEl = e.target.closest('[data-goto]');
            if (targetEl) {
                var target = targetEl.dataset.goto;
                if (target) navigateTo(target);
            }
        });

        // Reset progress button
        var resetBtn = document.getElementById('sidebar-reset-btn');
        if (resetBtn) {
            resetBtn.addEventListener('click', function() {
                if (confirm('Reset all cryptography progress, saved workbench drafts, and exam history across all modules?')) {
                    if (app.storage && app.storage.clearAll) app.storage.clearAll();
                    app.progress.reset();
                    if (app.utils && app.utils.showToast) {
                        app.utils.showToast('All progress and saved data have been reset.', 'info');
                    }
                    setTimeout(function() {
                        window.location.hash = '';
                        window.location.reload();
                    }, 400);
                }
            });
        }

        // Mobile menu toggle & drawer listeners
        var toggleBtn = document.getElementById('menu-toggle');
        var sidebar = document.getElementById('sidebar');
        var backdrop = document.getElementById('sidebar-backdrop');
        var closeBtn = document.getElementById('sidebar-close-btn');

        if (toggleBtn) {
            toggleBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                if (sidebar && sidebar.classList.contains('open')) {
                    closeMobileSidebar();
                } else {
                    openMobileSidebar();
                }
            });
        }

        if (closeBtn) {
            closeBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                closeMobileSidebar();
            });
        }

        if (backdrop) {
            backdrop.addEventListener('click', function() {
                closeMobileSidebar();
            });
        }

        // Close on ESC key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                closeMobileSidebar();
            }
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

        // Floating jump-to-workbench button
        var workbenchFab = document.getElementById('workbench-fab');
        if (workbenchFab) {
            workbenchFab.addEventListener('click', function() {
                var cfg = workbenchTargets[currentSection];
                if (!cfg) return;
                if (cfg.tab) {
                    var tabBtn = document.querySelector('.tab-btn[data-tab="' + cfg.tab + '"]');
                    if (tabBtn) tabBtn.click();
                }
                // Wait a frame so a freshly activated tab is laid out before scrolling
                requestAnimationFrame(function() {
                    var anchor = document.getElementById(cfg.anchor);
                    if (anchor) anchor.scrollIntoView({ behavior: 'smooth', block: 'start' });
                });
            });
        }

        // Copy functionality on double-click or click of result boxes
        document.addEventListener('click', function(e) {
            var resBox = e.target.closest('.result-box');
            if (resBox && e.altKey) {
                app.utils.copyToClipboard(resBox.innerText);
            }
        });

        // Listen for browser Back/Forward navigation
        window.addEventListener('hashchange', function() {
            var hash = (window.location.hash || '').replace('#', '').toLowerCase();
            if (hash && sectionTitles[hash] && hash !== currentSection) {
                navigateTo(hash, true);
            } else if (!hash && currentSection !== 'home') {
                navigateTo('home', true);
            }
        });

        // Restore Session (URL Hash or Last Visited Section)
        var initialHash = (window.location.hash || '').replace('#', '').toLowerCase();
        if (initialHash && sectionTitles[initialHash]) {
            navigateTo(initialHash, true);
        } else {
            var savedSec = app.storage ? app.storage.get('last_section', 'home') : 'home';
            if (savedSec && sectionTitles[savedSec] && savedSec !== 'home') {
                navigateTo(savedSec, true);
            }
        }

        // Init Sandbox
        initSandbox();

        // Update progress display
        app.updateProgress();
    });

    // Expose navigateTo
    app.navigateTo = navigateTo;

})(window.CipherApp);
