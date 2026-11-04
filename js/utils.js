/* ===== Shared Utilities & Namespace ===== */
window.CipherApp = window.CipherApp || {};
var CipherApp = window.CipherApp;

(function(app) {
    'use strict';

    // ---- Utility Functions ----
    app.utils = {
        // Proper modulo that handles negative numbers
        mod: function(n, m) {
            return ((n % m) + m) % m;
        },

        // Convert letter to number: A=0, B=1, ..., Z=25
        letterToNum: function(letter) {
            return letter.toUpperCase().charCodeAt(0) - 65;
        },

        // Convert number to letter: 0=A, 1=B, ..., 25=Z
        numToLetter: function(num) {
            return String.fromCharCode(app.utils.mod(num, 26) + 65);
        },

        // Clean text: uppercase, letters only
        cleanText: function(text) {
            return text.toUpperCase().replace(/[^A-Z]/g, '');
        },

        // Fisher-Yates shuffle (returns new array)
        shuffleArray: function(arr) {
            var a = arr.slice();
            for (var i = a.length - 1; i > 0; i--) {
                var j = Math.floor(Math.random() * (i + 1));
                var tmp = a[i]; a[i] = a[j]; a[j] = tmp;
            }
            return a;
        },

        // Standard English letter frequencies (percentage)
        englishFrequencies: {
            A: 8.167, B: 1.492, C: 2.782, D: 4.253, E: 12.702,
            F: 2.228, G: 2.015, H: 6.094, I: 6.966, J: 0.153,
            K: 0.772, L: 4.025, M: 2.406, N: 6.749, O: 7.507,
            P: 1.929, Q: 0.095, R: 5.987, S: 6.327, T: 9.056,
            U: 2.758, V: 0.978, W: 2.360, X: 0.150, Y: 1.974, Z: 0.074
        },

        // Common English bigrams
        commonBigrams: ['TH','HE','IN','ER','AN','RE','ON','AT','EN','ND',
                        'TI','ES','OR','TE','OF','ED','IS','IT','AL','AR'],

        // Generate random ID
        generateId: function() {
            return 'id_' + Math.random().toString(36).substr(2, 9);
        },

        // Animate element with a CSS class
        animateElement: function(el, className) {
            el.classList.remove(className);
            void el.offsetWidth; // trigger reflow
            el.classList.add(className);
            el.addEventListener('animationend', function handler() {
                el.classList.remove(className);
                el.removeEventListener('animationend', handler);
            });
        },

        // Get the full alphabet as an array
        alphabet: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split(''),

        // Random integer between min and max inclusive
        randInt: function(min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        },

        // Pick random element from array
        randPick: function(arr) {
            return arr[Math.floor(Math.random() * arr.length)];
        },

        // Common English words for exercise generation
        commonWords: [
            'HELLO', 'WORLD', 'ATTACK', 'DEFEND', 'SECRET', 'MESSAGE',
            'CIPHER', 'DECODE', 'CRYPTO', 'ENCRYPT', 'DECRYPT', 'HIDDEN',
            'TREASURE', 'MYSTERY', 'PUZZLE', 'ANSWER', 'SECURITY',
            'MORNING', 'SUNSET', 'CASTLE', 'KINGDOM', 'DRAGON', 'KNIGHT',
            'SHIELD', 'BATTLE', 'VICTORY', 'DANGER', 'ESCAPE', 'RESCUE',
            'SHADOW', 'FOREST', 'RIVER', 'MOUNTAIN', 'BRIDGE', 'TOWER',
            'DIAMOND', 'GOLDEN', 'SILVER', 'THUNDER', 'STORM', 'FLAME'
        ],

        commonPhrases: [
            'ATTACK AT DAWN', 'MEET ME AT NOON', 'THE EAGLE HAS LANDED',
            'SEND MORE TROOPS', 'RETREAT TO BASE', 'HOLD YOUR POSITION',
            'MISSION COMPLETE', 'ALL IS WELL', 'TRUST NO ONE',
            'THE SECRET IS SAFE', 'BEWARE THE ENEMY', 'CROSS THE RIVER',
            'DEFEND THE CASTLE', 'HIDE THE TREASURE', 'SECURE THE BRIDGE'
        ],

        // Playfair keywords for exercises
        playfairKeywords: [
            'MONARCHY', 'KEYWORD', 'PLAYFAIR', 'CHARLES', 'SECURITY',
            'ZEBRA', 'ENIGMA', 'DRAGON', 'CASTLE', 'MATRIX'
        ],

        // Escape HTML
        escapeHtml: function(str) {
            var div = document.createElement('div');
            div.textContent = str;
            return div.innerHTML;
        },

        // Create an element with attributes and children
        createElement: function(tag, attrs, children) {
            var el = document.createElement(tag);
            if (attrs) {
                Object.keys(attrs).forEach(function(key) {
                    if (key === 'className') el.className = attrs[key];
                    else if (key === 'innerHTML') el.innerHTML = attrs[key];
                    else if (key === 'textContent') el.textContent = attrs[key];
                    else if (key.startsWith('on')) el.addEventListener(key.slice(2).toLowerCase(), attrs[key]);
                    else el.setAttribute(key, attrs[key]);
                });
            }
            if (children) {
                children.forEach(function(child) {
                    if (typeof child === 'string') el.appendChild(document.createTextNode(child));
                    else if (child) el.appendChild(child);
                });
            }
            return el;
        }
    };

    // ---- Progress Tracking ----
    app.progress = (function() {
        var STORAGE_KEY = 'cryptolab_progress';
        var data = {};

        // Load from localStorage
        function load() {
            try {
                var stored = localStorage.getItem(STORAGE_KEY);
                if (stored) data = JSON.parse(stored);
            } catch(e) { data = {}; }
        }

        // Save to localStorage
        function save() {
            try { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); } catch(e) {}
        }

        load();

        return {
            complete: function(sectionId, taskId) {
                if (!data[sectionId]) data[sectionId] = {};
                data[sectionId][taskId] = true;
                save();
                if (app.updateProgress) app.updateProgress();
            },

            isComplete: function(sectionId, taskId) {
                return !!(data[sectionId] && data[sectionId][taskId]);
            },

            getProgress: function(sectionId) {
                var tasks = app.progress.getSectionTasks(sectionId);
                if (!tasks || tasks.length === 0) return 0;
                var completed = tasks.filter(function(t) {
                    return app.progress.isComplete(sectionId, t);
                }).length;
                return Math.round((completed / tasks.length) * 100);
            },

            getSectionTasks: function(sectionId) {
                return app._sectionTasks[sectionId] || [];
            },

            reset: function() {
                data = {};
                save();
                if (app.updateProgress) app.updateProgress();
            },

            getData: function() { return JSON.parse(JSON.stringify(data)); }
        };
    })();

    // Section tasks registry - each module registers its tasks
    app._sectionTasks = {
        caesar: [
            'caesar-fundamentals', 'caesar-wheel', 'caesar-encrypt-decrypt',
            'caesar-brute-force', 'caesar-exercise-1', 'caesar-exercise-2',
            'caesar-exercise-3', 'caesar-exercise-4', 'caesar-exercise-5'
        ],
        monoalphabetic: [
            'mono-fundamentals', 'mono-alphabet', 'mono-encrypt-decrypt',
            'mono-frequency', 'mono-exercise-1', 'mono-exercise-2',
            'mono-exercise-3', 'mono-exercise-4', 'mono-exercise-5'
        ],
        playfair: [
            'playfair-fundamentals', 'playfair-matrix', 'playfair-preparation',
            'playfair-encrypt', 'playfair-decrypt',
            'playfair-exercise-1', 'playfair-exercise-2', 'playfair-exercise-3',
            'playfair-exercise-4', 'playfair-exercise-5'
        ]
    };

    // ---- Module Registry ----
    app.modules = {};

    app.registerModule = function(name, initFn) {
        app.modules[name] = initFn;
    };

})(window.CipherApp);

