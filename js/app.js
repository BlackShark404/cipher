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

        // Update topbar breadcrumbs
        var breadcrumb = document.getElementById('top-breadcrumb');
        if (breadcrumb && sectionTitles[sectionId]) {
            breadcrumb.textContent = sectionTitles[sectionId];
        }

        // Close mobile sidebar
        var sidebar = document.getElementById('sidebar');
        if (sidebar) sidebar.classList.remove('open');

        // Scroll to top
        window.scrollTo(0, 0);
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
                if (confirm('Reset all cryptography progress across all modules?')) {
                    app.progress.reset();
                    if (app.utils && app.utils.showToast) {
                        app.utils.showToast('Progress has been reset.', 'info');
                    }
                }
            });
        }

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

        // Copy functionality on double-click or click of result boxes
        document.addEventListener('click', function(e) {
            var resBox = e.target.closest('.result-box');
            if (resBox && e.altKey) {
                app.utils.copyToClipboard(resBox.innerText);
            }
        });

        // Init Sandbox
        initSandbox();

        // Update progress display
        app.updateProgress();
    });

    // Expose navigateTo
    app.navigateTo = navigateTo;

})(window.CipherApp);
