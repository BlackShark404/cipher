/* ===== Caesar Cipher Module ===== */
CipherApp.registerModule('caesar', function(container) {
    'use strict';

    var utils = CipherApp.utils;
    var progress = CipherApp.progress;
    var mod = utils.mod;
    var letterToNum = utils.letterToNum;
    var numToLetter = utils.numToLetter;
    var cleanText = utils.cleanText;

    // ==================== CORE CIPHER FUNCTIONS ====================

    function caesarEncryptLetter(letter, key) {
        var p = letterToNum(letter);
        var c = mod(p + key, 26);
        return numToLetter(c);
    }

    function caesarDecryptLetter(letter, key) {
        var c = letterToNum(letter);
        var p = mod(c - key, 26);
        return numToLetter(p);
    }

    function caesarEncrypt(text, key) {
        var result = '';
        for (var i = 0; i < text.length; i++) {
            var ch = text[i];
            if (/[A-Z]/i.test(ch)) {
                result += caesarEncryptLetter(ch.toUpperCase(), key);
            } else {
                result += ch;
            }
        }
        return result;
    }

    function caesarDecrypt(text, key) {
        var result = '';
        for (var i = 0; i < text.length; i++) {
            var ch = text[i];
            if (/[A-Z]/i.test(ch)) {
                result += caesarDecryptLetter(ch.toUpperCase(), key);
            } else {
                result += ch;
            }
        }
        return result;
    }

    // Score plaintext based on English letter frequency correlation
    function scoreText(text) {
        var clean = cleanText(text);
        if (clean.length === 0) return 0;
        var freq = {};
        for (var i = 0; i < clean.length; i++) {
            var ch = clean[i];
            freq[ch] = (freq[ch] || 0) + 1;
        }
        var score = 0;
        var engFreq = utils.englishFrequencies;
        for (var letter in engFreq) {
            var observed = ((freq[letter] || 0) / clean.length) * 100;
            var expected = engFreq[letter];
            score += observed * expected;
        }
        // Bonus for common English words
        var commonWords = ['THE', 'AND', 'FOR', 'ARE', 'BUT', 'NOT', 'YOU', 'ALL', 'CAN', 'HER',
                           'WAS', 'ONE', 'OUR', 'OUT', 'HAS', 'HAVE', 'THIS', 'THAT', 'WITH', 'HELLO',
                           'WORLD', 'ATTACK', 'SECRET', 'MESSAGE', 'THINK'];
        var upper = text.toUpperCase();
        for (var w = 0; w < commonWords.length; w++) {
            if (upper.indexOf(commonWords[w]) !== -1) {
                score += 30;
            }
        }
        return score;
    }

    // ==================== BUILD HTML ====================

    // Generate A=0..Z=25 mapping table HTML
    function alphabetNumberTable() {
        var html = '<div class="alphabet-row">';
        for (var i = 0; i < 26; i++) {
            html += '<div class="alphabet-cell" style="flex-direction:column;height:auto;padding:4px 0;font-size:0.7rem;">' +
                    '<span style="font-size:0.85rem;font-weight:700;">' + numToLetter(i) + '</span>' +
                    '<span style="color:var(--gray-500);">' + i + '</span></div>';
        }
        html += '</div>';
        return html;
    }

    // ==================== MAIN HTML ====================

    container.innerHTML = '<div class="section-content">' +

    /* ===== HERO BANNER ===== */
    '<div class="hero-banner" style="background:linear-gradient(135deg, var(--caesar-color) 0%, var(--primary-dark) 100%);">' +
        '<h1>🔄 Caesar Cipher</h1>' +
        '<p class="hero-subtitle">The oldest and simplest substitution cipher — shift letters to hide your message</p>' +
    '</div>' +

    /* ===================================================================
       SECTION A: FUNDAMENTALS
    =================================================================== */
    '<div class="card" id="caesar-fundamentals-card">' +
        '<div class="card-header"><h3>📖 A. Fundamentals — What is the Caesar Cipher?</h3></div>' +
        '<div class="card-body">' +

            '<div class="subsection">' +
                '<div class="subsection-title">What is the Caesar Cipher?</div>' +
                '<p>The <strong>Caesar Cipher</strong> (also known as the shift cipher) is one of the oldest known encryption methods, ' +
                'famously used by <strong>Julius Caesar</strong> to communicate with his generals. It works by <em>shifting</em> ' +
                'every letter in the plaintext by a fixed number of positions in the alphabet.</p>' +
                '<p>For example, with a shift of <span class="highlight-key">3</span>: ' +
                '<span class="highlight-plain">A</span> → <span class="highlight-cipher">D</span>, ' +
                '<span class="highlight-plain">B</span> → <span class="highlight-cipher">E</span>, ' +
                '<span class="highlight-plain">C</span> → <span class="highlight-cipher">F</span>, and so on.</p>' +
            '</div>' +

            '<div class="subsection">' +
                '<div class="subsection-title">Key Terminology</div>' +
                '<div class="grid-3col" style="gap:1rem;">' +
                    '<div class="alert alert-info" style="flex-direction:column;text-align:center;">' +
                        '<strong class="highlight-plain" style="font-size:1.1rem;">Plaintext (P)</strong>' +
                        '<span>The original readable message you want to encrypt.</span>' +
                    '</div>' +
                    '<div class="alert alert-danger" style="flex-direction:column;text-align:center;background:#fef2f2;color:#991b1b;border-color:#fecaca;">' +
                        '<strong class="highlight-cipher" style="font-size:1.1rem;">Ciphertext (C)</strong>' +
                        '<span>The encrypted, unreadable output after applying the cipher.</span>' +
                    '</div>' +
                    '<div class="alert alert-success" style="flex-direction:column;text-align:center;">' +
                        '<strong class="highlight-key" style="font-size:1.1rem;">Key (k)</strong>' +
                        '<span>The number of positions to shift (0–25).</span>' +
                    '</div>' +
                '</div>' +
            '</div>' +

            '<div class="subsection">' +
                '<div class="subsection-title">Why is it a Substitution Cipher?</div>' +
                '<p>The Caesar Cipher is a <strong>monoalphabetic substitution cipher</strong> because each letter in the plaintext ' +
                'is <em>substituted</em> with exactly one corresponding letter in the ciphertext. The same plaintext letter always ' +
                'maps to the same ciphertext letter for a given key. The substitution is defined entirely by the shift value.</p>' +
            '</div>' +

            '<div class="subsection">' +
                '<div class="subsection-title">Encryption vs Decryption</div>' +
                '<div class="grid-2col">' +
                    '<div>' +
                        '<h4>🔒 Encryption</h4>' +
                        '<p>Move each letter <strong>forward</strong> in the alphabet by <span class="highlight-key">k</span> positions. ' +
                        'If you go past Z, wrap around to A.</p>' +
                        '<div class="formula">' +
                            '<span class="formula-var cipher">C</span> = (<span class="formula-var plain">P</span> + <span class="formula-var key">k</span>) mod 26' +
                        '</div>' +
                    '</div>' +
                    '<div>' +
                        '<h4>🔓 Decryption</h4>' +
                        '<p>Move each letter <strong>backward</strong> in the alphabet by <span class="highlight-key">k</span> positions. ' +
                        'If you go before A, wrap around to Z.</p>' +
                        '<div class="formula">' +
                            '<span class="formula-var plain">P</span> = (<span class="formula-var cipher">C</span> − <span class="formula-var key">k</span> + 26) mod 26' +
                        '</div>' +
                    '</div>' +
                '</div>' +
                '<div class="formula" style="margin-top:1rem;">' +
                    '<div class="formula-explain">' +
                        '<strong>Variable definitions:</strong><br>' +
                        '<span class="formula-var plain">P</span> = plaintext letter number (A=0, B=1, ..., Z=25)<br>' +
                        '<span class="formula-var cipher">C</span> = ciphertext letter number (A=0, B=1, ..., Z=25)<br>' +
                        '<span class="formula-var key">k</span> = key / shift amount (0 to 25)<br>' +
                        '<strong>mod 26</strong> = the remainder after dividing by 26 (ensures we stay within A–Z)' +
                    '</div>' +
                '</div>' +
            '</div>' +

            '<div class="subsection">' +
                '<div class="subsection-title">Letter ↔ Number Mapping</div>' +
                '<p>Each letter is mapped to a number for the math to work:</p>' +
                alphabetNumberTable() +
            '</div>' +

            /* Interactive Modular Arithmetic Demo */
            '<div class="subsection">' +
                '<div class="subsection-title">🧮 Interactive Modular Arithmetic Demo</div>' +
                '<p>Pick a letter and a key to see the encryption calculation broken down step by step:</p>' +
                '<div class="input-inline">' +
                    '<div class="input-group">' +
                        '<label for="mod-demo-letter">Letter (Plaintext)</label>' +
                        '<input type="text" id="mod-demo-letter" maxlength="1" value="H" placeholder="A-Z" style="text-transform:uppercase;">' +
                    '</div>' +
                    '<div class="input-group">' +
                        '<label for="mod-demo-key">Key (k)</label>' +
                        '<input type="number" id="mod-demo-key" min="0" max="25" value="3">' +
                    '</div>' +
                    '<button class="btn btn-primary" id="mod-demo-btn">Calculate ➜</button>' +
                '</div>' +
                '<div id="mod-demo-result" class="step-display" style="margin-top:1rem;"></div>' +
            '</div>' +

        '</div>' +
    '</div>' +

    /* ===================================================================
       SECTION B: INTERACTIVE CIPHER WHEEL (SVG)
    =================================================================== */
    '<div class="card" id="caesar-wheel-card">' +
        '<div class="card-header"><h3>🎡 B. Interactive Caesar Cipher Wheel</h3></div>' +
        '<div class="card-body">' +
            '<p>Rotate the inner wheel to set your key. Click a letter on the <span class="highlight-plain">outer ring (plaintext)</span> ' +
            'to see its <span class="highlight-cipher">encrypted counterpart</span> on the inner ring, or click an inner ring letter to decrypt.</p>' +
            '<div class="input-inline" style="justify-content:center;margin-bottom:1rem;">' +
                '<div class="input-group" style="max-width:140px;">' +
                    '<label for="wheel-key-input">Key (Shift)</label>' +
                    '<input type="number" id="wheel-key-input" min="0" max="25" value="3">' +
                '</div>' +
                '<div style="display:flex;align-items:flex-end;gap:8px;">' +
                    '<button class="btn btn-secondary btn-sm" id="wheel-key-minus">◀ −1</button>' +
                    '<button class="btn btn-secondary btn-sm" id="wheel-key-plus">+1 ▶</button>' +
                '</div>' +
            '</div>' +
            '<div id="wheel-key-display" style="text-align:center;font-size:1.1rem;font-weight:700;margin-bottom:0.5rem;">' +
                'Current Shift: <span class="highlight-key">3</span>' +
            '</div>' +
            '<div class="wheel-container" id="caesar-wheel-container">' +
                '<svg id="caesar-wheel-svg" class="wheel-svg" viewBox="0 0 320 320"></svg>' +
            '</div>' +
            '<div id="wheel-mapping-display" class="result-box info" style="text-align:center;display:none;"></div>' +
        '</div>' +
    '</div>' +

    /* ===================================================================
       SECTION C: INTERACTIVE ENCRYPTION / DECRYPTION
    =================================================================== */
    '<div class="card" id="caesar-encrypt-card">' +
        '<div class="card-header"><h3>🔐 C. Interactive Encryption & Decryption</h3></div>' +
        '<div class="card-body">' +
            '<div class="input-inline">' +
                '<div class="input-group" style="flex:3;">' +
                    '<label for="enc-input">Text Input</label>' +
                    '<input type="text" id="enc-input" placeholder="Enter plaintext or ciphertext..." value="HELLO WORLD">' +
                '</div>' +
                '<div class="input-group" style="max-width:100px;">' +
                    '<label for="enc-key">Key (0–25)</label>' +
                    '<input type="number" id="enc-key" min="0" max="25" value="3">' +
                '</div>' +
                '<div class="input-group" style="max-width:140px;">' +
                    '<label for="enc-mode">Mode</label>' +
                    '<select id="enc-mode">' +
                        '<option value="encrypt">🔒 Encrypt</option>' +
                        '<option value="decrypt">🔓 Decrypt</option>' +
                    '</select>' +
                '</div>' +
            '</div>' +
            '<div class="btn-group">' +
                '<button class="btn btn-primary" id="enc-go-btn">Process ➜</button>' +
                '<button class="btn btn-secondary" id="enc-clear-btn">Clear</button>' +
            '</div>' +
            '<div id="enc-result-box" class="result-box" style="display:none;">' +
                '<div class="result-label" id="enc-result-label">Result</div>' +
                '<div id="enc-result-text" style="font-size:1.2rem;font-weight:700;"></div>' +
            '</div>' +
            '<div id="enc-transform-display"></div>' +
        '</div>' +
    '</div>' +

    /* ===================================================================
       SECTION D: BRUTE-FORCE ATTACK
    =================================================================== */
    '<div class="card" id="caesar-brute-card">' +
        '<div class="card-header" style="background:var(--danger);"><h3>💥 D. Brute-Force Attack</h3></div>' +
        '<div class="card-body">' +
            '<div class="subsection">' +
                '<div class="subsection-title">Why is Caesar Vulnerable?</div>' +
                '<p>The Caesar cipher has a <strong>key space of only 26</strong> (including key=0 which does nothing). ' +
                'This means an attacker can simply try <em>every possible key</em> — a technique called <strong>brute-force attack</strong>. ' +
                'With just 26 attempts, the attacker is guaranteed to find the original plaintext. ' +
                'Modern computers can do this in microseconds, making Caesar trivially breakable.</p>' +
                '<div class="alert alert-warning">⚠️ Any cipher with such a small key space is considered <strong>cryptographically insecure</strong>. ' +
                'A secure cipher needs a key space so large that brute-force is computationally infeasible.</div>' +
            '</div>' +
            '<div class="input-group">' +
                '<label for="brute-input">Ciphertext to Crack</label>' +
                '<input type="text" id="brute-input" placeholder="Enter ciphertext..." value="KHOOR ZRUOG">' +
            '</div>' +
            '<button class="btn btn-danger" id="brute-go-btn">🔓 Try All 26 Keys</button>' +
            '<div id="brute-results" style="margin-top:1rem;"></div>' +
        '</div>' +
    '</div>' +

    /* ===================================================================
       SECTION E: PRACTICE EXERCISES
    =================================================================== */
    '<div class="card" id="caesar-exercises-card">' +
        '<div class="card-header" style="background:var(--success);"><h3>✏️ E. Practice Exercises</h3></div>' +
        '<div class="card-body">' +

            /* Exercise 1 */
            '<div class="exercise-box" id="exercise-1-box">' +
                '<span class="exercise-badge easy">Easy</span>' +
                '<div class="exercise-question">1. Basic Encryption: Given plaintext <span class="highlight-plain">"HELLO"</span> and key <span class="highlight-key">3</span>, what is the ciphertext?</div>' +
                '<div class="input-inline">' +
                    '<div class="input-group"><label for="ex1-answer">Your Answer</label>' +
                        '<input type="text" id="ex1-answer" placeholder="Enter ciphertext..." style="text-transform:uppercase;"></div>' +
                    '<button class="btn btn-primary btn-sm" id="ex1-check">Check</button>' +
                    '<button class="btn btn-warning btn-sm" id="ex1-hint">💡 Hint</button>' +
                '</div>' +
                '<div class="exercise-hint" id="ex1-hint-text">H=7, add 3 → 10 = K. E=4, add 3 → 7 = H. L=11, add 3 → 14 = O. Do this for each letter.</div>' +
                '<div class="exercise-feedback" id="ex1-feedback"></div>' +
            '</div>' +

            /* Exercise 2 */
            '<div class="exercise-box" id="exercise-2-box">' +
                '<span class="exercise-badge easy">Easy</span>' +
                '<div class="exercise-question">2. Basic Decryption: Given ciphertext <span class="highlight-cipher">"WKLQN"</span> and key <span class="highlight-key">3</span>, what is the plaintext?</div>' +
                '<div class="input-inline">' +
                    '<div class="input-group"><label for="ex2-answer">Your Answer</label>' +
                        '<input type="text" id="ex2-answer" placeholder="Enter plaintext..." style="text-transform:uppercase;"></div>' +
                    '<button class="btn btn-primary btn-sm" id="ex2-check">Check</button>' +
                    '<button class="btn btn-warning btn-sm" id="ex2-hint">💡 Hint</button>' +
                '</div>' +
                '<div class="exercise-hint" id="ex2-hint-text">Subtract 3 from each letter\'s number. W=22, 22−3=19=T. K=10, 10−3=7=H. Continue for each letter.</div>' +
                '<div class="exercise-feedback" id="ex2-feedback"></div>' +
            '</div>' +

            /* Exercise 3 */
            '<div class="exercise-box" id="exercise-3-box">' +
                '<span class="exercise-badge medium">Medium</span>' +
                '<div class="exercise-question">3. Find the Key: The plaintext <span class="highlight-plain">"A"</span> was encrypted to <span class="highlight-cipher">"D"</span>. What is the key?</div>' +
                '<div class="input-inline">' +
                    '<div class="input-group"><label for="ex3-answer">Your Answer (0–25)</label>' +
                        '<input type="number" id="ex3-answer" min="0" max="25" placeholder="Key value..."></div>' +
                    '<button class="btn btn-primary btn-sm" id="ex3-check">Check</button>' +
                    '<button class="btn btn-warning btn-sm" id="ex3-hint">💡 Hint</button>' +
                '</div>' +
                '<div class="exercise-hint" id="ex3-hint-text">D=3, A=0, so k = C − P = 3 − 0 = <strong>3</strong>. The key is the difference between the ciphertext and plaintext letter numbers.</div>' +
                '<div class="exercise-feedback" id="ex3-feedback"></div>' +
            '</div>' +

            /* Exercise 4 */
            '<div class="exercise-box" id="exercise-4-box">' +
                '<span class="exercise-badge medium">Medium</span>' +
                '<div class="exercise-question">4. Modular Arithmetic: What is <code>(24 + 5) mod 26</code>?</div>' +
                '<div class="input-inline">' +
                    '<div class="input-group"><label for="ex4-answer">Your Answer (0–25)</label>' +
                        '<input type="number" id="ex4-answer" min="0" max="25" placeholder="Result..."></div>' +
                    '<button class="btn btn-primary btn-sm" id="ex4-check">Check</button>' +
                    '<button class="btn btn-warning btn-sm" id="ex4-hint">💡 Hint</button>' +
                '</div>' +
                '<div class="exercise-hint" id="ex4-hint-text">24 + 5 = 29. 29 mod 26 = 29 − 26 = <strong>3</strong>. The mod operation gives the remainder when dividing by 26.</div>' +
                '<div class="exercise-feedback" id="ex4-feedback"></div>' +
            '</div>' +

            /* Exercise 5 */
            '<div class="exercise-box" id="exercise-5-box">' +
                '<span class="exercise-badge hard">Hard</span>' +
                '<div class="exercise-question">5. Brute-Force Identification: Given ciphertext <span class="highlight-cipher">"EBIIL"</span>, identify the plaintext and the key used.</div>' +
                '<div class="input-inline">' +
                    '<div class="input-group"><label for="ex5-answer-text">Plaintext</label>' +
                        '<input type="text" id="ex5-answer-text" placeholder="Plaintext word..." style="text-transform:uppercase;"></div>' +
                    '<div class="input-group" style="max-width:100px;"><label for="ex5-answer-key">Key</label>' +
                        '<input type="number" id="ex5-answer-key" min="0" max="25" placeholder="Key..."></div>' +
                    '<button class="btn btn-primary btn-sm" id="ex5-check">Check</button>' +
                    '<button class="btn btn-warning btn-sm" id="ex5-hint">💡 Hint</button>' +
                '</div>' +
                '<div class="exercise-hint" id="ex5-hint-text">Try all 26 shifts and look for a recognizable English word. For example, shift back by 23 (or forward by 3): E→H, B→E, I→L, I→L, L→O → HELLO!</div>' +
                '<div class="exercise-feedback" id="ex5-feedback"></div>' +
            '</div>' +

        '</div>' +
    '</div>' +

    '</div>'; // end section-content


    // ==================== EVENT LISTENERS ====================

    // ===== A. Modular Arithmetic Demo =====
    var modDemoBtn = container.querySelector('#mod-demo-btn');
    var modDemoLetterInput = container.querySelector('#mod-demo-letter');
    var modDemoKeyInput = container.querySelector('#mod-demo-key');
    var modDemoResult = container.querySelector('#mod-demo-result');

    function runModDemo() {
        var raw = modDemoLetterInput.value.trim().toUpperCase();
        var key = parseInt(modDemoKeyInput.value, 10);
        if (!/^[A-Z]$/.test(raw)) {
            modDemoResult.innerHTML = '<div class="alert alert-danger">Please enter a single letter A–Z.</div>';
            return;
        }
        if (isNaN(key) || key < 0 || key > 25) {
            modDemoResult.innerHTML = '<div class="alert alert-danger">Key must be between 0 and 25.</div>';
            return;
        }
        var P = letterToNum(raw);
        var sum = P + key;
        var C = mod(sum, 26);
        var resultLetter = numToLetter(C);
        var wrapNote = sum >= 26 ? ' (wraps around past Z!)' : '';

        modDemoResult.innerHTML =
            '<div class="step-item fade-in"><div class="step-number">1</div><div class="step-content">' +
                'Convert letter to number: <span class="highlight-plain">' + raw + '</span> = <span class="highlight-step">' + P + '</span>' +
            '</div></div>' +
            '<div class="step-item fade-in"><div class="step-number">2</div><div class="step-content">' +
                'Add the key: <span class="highlight-step">' + P + '</span> + <span class="highlight-key">' + key + '</span> = <span class="highlight-step">' + sum + '</span>' +
            '</div></div>' +
            '<div class="step-item fade-in"><div class="step-number">3</div><div class="step-content">' +
                'Apply mod 26: <span class="highlight-step">' + sum + '</span> mod 26 = <strong>' + C + '</strong>' + wrapNote +
            '</div></div>' +
            '<div class="step-item fade-in" style="background:#f0fdf4;border-color:var(--success);"><div class="step-number" style="background:var(--success);">✓</div><div class="step-content">' +
                'Convert back to letter: <strong>' + C + '</strong> = <span class="highlight-cipher">' + resultLetter + '</span>' +
                '<br><span style="font-size:0.85rem;">So <span class="highlight-plain">' + raw + '</span> encrypted with key <span class="highlight-key">' + key + '</span> becomes <span class="highlight-cipher">' + resultLetter + '</span></span>' +
            '</div></div>';

        progress.complete('caesar', 'caesar-fundamentals');
    }

    modDemoBtn.addEventListener('click', runModDemo);
    modDemoLetterInput.addEventListener('keydown', function(e) { if (e.key === 'Enter') runModDemo(); });
    modDemoKeyInput.addEventListener('keydown', function(e) { if (e.key === 'Enter') runModDemo(); });


    // ===== B. Caesar Cipher Wheel (SVG) =====
    var wheelSvg = container.querySelector('#caesar-wheel-svg');
    var wheelKeyInput = container.querySelector('#wheel-key-input');
    var wheelKeyDisplay = container.querySelector('#wheel-key-display');
    var wheelMappingDisplay = container.querySelector('#wheel-mapping-display');
    var wheelKeyMinus = container.querySelector('#wheel-key-minus');
    var wheelKeyPlus = container.querySelector('#wheel-key-plus');
    var savedWheelKey = (utils.storage && utils.storage.get) ? utils.storage.get('draft_caesar_key', 3) : 3;
    var currentWheelKey = (typeof savedWheelKey === 'number' && !isNaN(savedWheelKey)) ? savedWheelKey : 3;
    var selectedOuterIndex = -1;
    var selectedInnerIndex = -1;

    // SVG constants
    var CX = 160, CY = 160;
    var OUTER_R = 145, OUTER_TEXT_R = 130;
    var INNER_R = 105, INNER_TEXT_R = 90;
    var INNER_BG_R = 68;

    function buildWheel() {
        var svgNS = 'http://www.w3.org/2000/svg';

        // Clear
        while (wheelSvg.firstChild) wheelSvg.removeChild(wheelSvg.firstChild);

        // Defs for filters
        var defs = document.createElementNS(svgNS, 'defs');
        var filter = document.createElementNS(svgNS, 'filter');
        filter.setAttribute('id', 'wheel-shadow');
        var feDropShadow = document.createElementNS(svgNS, 'feDropShadow');
        feDropShadow.setAttribute('dx', '0');
        feDropShadow.setAttribute('dy', '2');
        feDropShadow.setAttribute('stdDeviation', '3');
        feDropShadow.setAttribute('flood-opacity', '0.15');
        filter.appendChild(feDropShadow);
        defs.appendChild(filter);
        wheelSvg.appendChild(defs);

        // Outer ring background
        var outerCircle = document.createElementNS(svgNS, 'circle');
        outerCircle.setAttribute('id', 'wheel-outer-circle');
        outerCircle.setAttribute('cx', CX);
        outerCircle.setAttribute('cy', CY);
        outerCircle.setAttribute('r', OUTER_R);
        outerCircle.setAttribute('fill', '#e8ecf5');
        outerCircle.setAttribute('stroke', '#4361ee');
        outerCircle.setAttribute('stroke-width', '2');
        wheelSvg.appendChild(outerCircle);

        // Inner ring background
        var innerCircle = document.createElementNS(svgNS, 'circle');
        innerCircle.setAttribute('id', 'wheel-inner-circle');
        innerCircle.setAttribute('cx', CX);
        innerCircle.setAttribute('cy', CY);
        innerCircle.setAttribute('r', INNER_R);
        innerCircle.setAttribute('fill', '#fff5f5');
        innerCircle.setAttribute('stroke', '#dc2626');
        innerCircle.setAttribute('stroke-width', '2');
        innerCircle.setAttribute('filter', 'url(#wheel-shadow)');
        wheelSvg.appendChild(innerCircle);

        // Center circle
        var centerCircle = document.createElementNS(svgNS, 'circle');
        centerCircle.setAttribute('id', 'wheel-center-circle');
        centerCircle.setAttribute('cx', CX);
        centerCircle.setAttribute('cy', CY);
        centerCircle.setAttribute('r', INNER_BG_R);
        centerCircle.setAttribute('fill', '#fff');
        centerCircle.setAttribute('stroke', '#e5e7eb');
        centerCircle.setAttribute('stroke-width', '1');
        wheelSvg.appendChild(centerCircle);

        // Center key display
        var keyText = document.createElementNS(svgNS, 'text');
        keyText.setAttribute('x', CX);
        keyText.setAttribute('y', CY - 8);
        keyText.setAttribute('text-anchor', 'middle');
        keyText.setAttribute('dominant-baseline', 'central');
        keyText.setAttribute('font-size', '14');
        keyText.setAttribute('fill', '#6b7280');
        keyText.setAttribute('font-family', 'system-ui, sans-serif');
        keyText.textContent = 'Key';
        wheelSvg.appendChild(keyText);

        var keyValText = document.createElementNS(svgNS, 'text');
        keyValText.setAttribute('id', 'wheel-center-key');
        keyValText.setAttribute('x', CX);
        keyValText.setAttribute('y', CY + 14);
        keyValText.setAttribute('text-anchor', 'middle');
        keyValText.setAttribute('dominant-baseline', 'central');
        keyValText.setAttribute('font-size', '28');
        keyValText.setAttribute('fill', '#16a34a');
        keyValText.setAttribute('font-weight', '700');
        keyValText.setAttribute('font-family', 'monospace');
        keyValText.textContent = currentWheelKey;
        wheelSvg.appendChild(keyValText);

        // Create the inner ring group (for rotation)
        var innerGroup = document.createElementNS(svgNS, 'g');
        innerGroup.setAttribute('id', 'wheel-inner-group');
        innerGroup.style.transition = 'transform 0.5s cubic-bezier(0.4,0,0.2,1)';
        innerGroup.style.transformOrigin = CX + 'px ' + CY + 'px';

        // Draw letters
        for (var i = 0; i < 26; i++) {
            var angle = (i * 360 / 26) - 90; // start from top
            var rad = angle * Math.PI / 180;

            // Outer ring letter
            var ox = CX + OUTER_TEXT_R * Math.cos(rad);
            var oy = CY + OUTER_TEXT_R * Math.sin(rad);
            var outerText = document.createElementNS(svgNS, 'text');
            outerText.setAttribute('x', ox);
            outerText.setAttribute('y', oy);
            outerText.setAttribute('text-anchor', 'middle');
            outerText.setAttribute('dominant-baseline', 'central');
            outerText.setAttribute('font-size', '13');
            outerText.setAttribute('font-weight', '700');
            outerText.setAttribute('fill', '#2563eb');
            outerText.setAttribute('font-family', 'monospace');
            outerText.setAttribute('data-outer-index', i);
            outerText.setAttribute('cursor', 'pointer');
            outerText.textContent = numToLetter(i);
            wheelSvg.appendChild(outerText);

            // Outer click circle (invisible, bigger hit area)
            var outerHit = document.createElementNS(svgNS, 'circle');
            outerHit.setAttribute('cx', ox);
            outerHit.setAttribute('cy', oy);
            outerHit.setAttribute('r', '12');
            outerHit.setAttribute('fill', 'transparent');
            outerHit.setAttribute('cursor', 'pointer');
            outerHit.setAttribute('data-outer-index', i);
            wheelSvg.appendChild(outerHit);

            // Inner ring letter
            var ix = CX + INNER_TEXT_R * Math.cos(rad);
            var iy = CY + INNER_TEXT_R * Math.sin(rad);
            var innerText = document.createElementNS(svgNS, 'text');
            innerText.setAttribute('x', ix);
            innerText.setAttribute('y', iy);
            innerText.setAttribute('text-anchor', 'middle');
            innerText.setAttribute('dominant-baseline', 'central');
            innerText.setAttribute('font-size', '12');
            innerText.setAttribute('font-weight', '700');
            innerText.setAttribute('fill', '#dc2626');
            innerText.setAttribute('font-family', 'monospace');
            innerText.setAttribute('data-inner-index', i);
            innerText.setAttribute('cursor', 'pointer');
            innerText.textContent = numToLetter(i);
            innerGroup.appendChild(innerText);

            // Inner click circle
            var innerHit = document.createElementNS(svgNS, 'circle');
            innerHit.setAttribute('cx', ix);
            innerHit.setAttribute('cy', iy);
            innerHit.setAttribute('r', '11');
            innerHit.setAttribute('fill', 'transparent');
            innerHit.setAttribute('cursor', 'pointer');
            innerHit.setAttribute('data-inner-index', i);
            innerGroup.appendChild(innerHit);
        }

        wheelSvg.appendChild(innerGroup);
        updateWheelRotation();
    }

    function updateWheelRotation() {
        var innerGroup = wheelSvg.querySelector('#wheel-inner-group');
        if (innerGroup) {
            var rotDeg = currentWheelKey * (360 / 26);
            innerGroup.style.transform = 'rotate(-' + rotDeg + 'deg)';
        }
        var centerKey = wheelSvg.querySelector('#wheel-center-key');
        if (centerKey) centerKey.textContent = currentWheelKey;
        wheelKeyDisplay.innerHTML = 'Current Shift: <span class="highlight-key">' + currentWheelKey + '</span>';
        wheelKeyInput.value = currentWheelKey;

        // Clear highlighting
        clearWheelHighlights();
    }

    function clearWheelHighlights() {
        selectedOuterIndex = -1;
        selectedInnerIndex = -1;
        wheelMappingDisplay.style.display = 'none';
        // Reset colors
        var outerTexts = wheelSvg.querySelectorAll('text[data-outer-index]');
        outerTexts.forEach(function(t) {
            t.classList.remove('wheel-highlight-active');
            t.setAttribute('fill', '#2563eb');
            t.setAttribute('font-size', '13');
        });
        var innerTexts = wheelSvg.querySelectorAll('text[data-inner-index]');
        innerTexts.forEach(function(t) {
            t.classList.remove('wheel-highlight-active');
            t.setAttribute('fill', '#dc2626');
            t.setAttribute('font-size', '12');
        });
    }

    function highlightWheelPair(outerIdx, innerIdx, fromOuter) {
        clearWheelHighlights();
        // Highlight outer
        var outerText = wheelSvg.querySelector('text[data-outer-index="' + outerIdx + '"]');
        if (outerText) {
            outerText.classList.add('wheel-highlight-active');
            outerText.setAttribute('fill', '#1d4ed8');
            outerText.setAttribute('font-size', '16');
        }
        // Highlight inner (need to find the letter that appears at position outerIdx after rotation)
        var innerText = wheelSvg.querySelector('text[data-inner-index="' + innerIdx + '"]');
        if (innerText) {
            innerText.classList.add('wheel-highlight-active');
            innerText.setAttribute('fill', '#b91c1c');
            innerText.setAttribute('font-size', '15');
        }

        var plainLetter = numToLetter(outerIdx);
        var cipherLetter = numToLetter(innerIdx);

        if (fromOuter) {
            wheelMappingDisplay.innerHTML =
                '<span class="highlight-plain" style="font-size:1.2rem;">' + plainLetter + '</span>' +
                ' <span style="color:var(--gray-400);">encrypts to</span> ' +
                '<span class="highlight-cipher" style="font-size:1.2rem;">' + cipherLetter + '</span>' +
                '<br><span style="font-size:0.85rem;color:var(--gray-500);">' +
                    plainLetter + '=' + outerIdx + ', (' + outerIdx + ' + ' + currentWheelKey + ') mod 26 = ' + mod(outerIdx + currentWheelKey, 26) + ' = ' + cipherLetter +
                '</span>';
        } else {
            wheelMappingDisplay.innerHTML =
                '<span class="highlight-cipher" style="font-size:1.2rem;">' + numToLetter(outerIdx) + '</span>' +
                ' <span style="color:var(--gray-400);">decrypts to</span> ' +
                '<span class="highlight-plain" style="font-size:1.2rem;">' + numToLetter(innerIdx) + '</span>' +
                '<br><span style="font-size:0.85rem;color:var(--gray-500);">' +
                    numToLetter(outerIdx) + '=' + outerIdx + ', (' + outerIdx + ' − ' + currentWheelKey + ' + 26) mod 26 = ' + mod(outerIdx - currentWheelKey, 26) + ' = ' + numToLetter(innerIdx) +
                '</span>';
        }
        wheelMappingDisplay.style.display = 'block';
        utils.animateElement(wheelMappingDisplay, 'fade-in');
    }

    function setWheelKey(k) {
        currentWheelKey = mod(k, 26);
        if (utils.storage && utils.storage.set) {
            utils.storage.set('draft_caesar_key', currentWheelKey);
        }
        updateWheelRotation();
        progress.complete('caesar', 'caesar-wheel');
    }

    wheelKeyInput.addEventListener('input', function() {
        var k = parseInt(this.value, 10);
        if (!isNaN(k)) setWheelKey(k);
    });
    wheelKeyMinus.addEventListener('click', function() { setWheelKey(currentWheelKey - 1); });
    wheelKeyPlus.addEventListener('click', function() { setWheelKey(currentWheelKey + 1); });

    // Handle clicks on wheel letters
    wheelSvg.addEventListener('click', function(e) {
        var target = e.target;
        var outerIdx = target.getAttribute('data-outer-index');
        var innerIdx = target.getAttribute('data-inner-index');
        if (outerIdx !== null) {
            outerIdx = parseInt(outerIdx, 10);
            // Clicking outer = encrypt: find what inner letter aligns here
            var cipherIdx = mod(outerIdx + currentWheelKey, 26);
            highlightWheelPair(outerIdx, cipherIdx, true);
        } else if (innerIdx !== null) {
            innerIdx = parseInt(innerIdx, 10);
            // Clicking inner = decrypt: this inner letter represents the ciphertext letter that aligns at a position
            // The inner ring is rotated by -key, so inner letter at original position i is now at visual position i
            // The actual inner letter at visual position = original position since we see the rotated state
            // innerIdx is the original letter index. After rotation, it sits at visual position (innerIdx + key) mod 26 on the outer ring
            var outerPosition = mod(innerIdx + currentWheelKey, 26);
            // So outer letter at that position maps to this inner letter
            // But user wants to know: "If I see ciphertext letter X on inner ring, what's the plaintext?"
            // The inner letter at index innerIdx visually aligns with outer letter at position (innerIdx + key) mod 26
            // So: ciphertext = outer letter at that position, plaintext = decrypt it
            // Actually: inner ring shows A-Z, rotated by -key. 
            // Inner letter innerIdx sits at the visual position of outer letter (innerIdx + key) mod 26
            // So clicking inner letter innerIdx means: outer[outerPosition] -> inner[innerIdx]
            // This means: plaintext letter numToLetter(outerPosition) encrypts to numToLetter(innerIdx)?
            // No. Let me rethink.
            // The wheel works: outer ring is plaintext (fixed). Inner ring is ciphertext (rotated).
            // Inner ring rotated by -key degrees. So inner letter 0 (A) moves to where outer letter key was.
            // At outer position p, the inner letter that appears is (p + key) mod 26. Wait no.
            // Inner ring rotated by -key * (360/26) degrees. So inner letter i moves from position i to position (i - key) mod 26 visually? No...
            // Let's think carefully. rotate(-key * 360/26) means each inner letter i moves clockwise by key positions.
            // Originally inner letter i is at angular position i. After rotation by -key, inner letter i is at angular position (i - key) mod 26? No.
            // rotate(-X degrees) means counter-clockwise by X. So if we rotate by -key*(360/26), inner letter at position i goes to visual position... 
            // Actually, rotation is applied to the group. A negative rotation is clockwise (in standard SVG). Wait, in SVG: positive angle = clockwise.
            // We do rotate(-rotDeg). So rotate(-key*360/26) = counter-clockwise by key positions.
            // Inner letter i was at angle position i. After rotating the group CCW by key steps, inner letter i is now at visual position (i + key) mod 26? No.
            // If we rotate CCW, letter at position 0 goes to position -key mod 26 = (26-key). Hmm, this is getting confusing.
            // Let me just verify with key=3: inner A should align with outer D (since encrypt A with key 3 = D).
            // Actually that's wrong for a cipher wheel. In a standard cipher wheel: 
            // Outer = plaintext, Inner = ciphertext. Inner rotated so that for key=3:
            // Outer A aligns with Inner D? No. Outer A aligns with inner letter that is 3 positions... 
            // Actually: to encrypt, find plaintext letter on outer, read aligned inner letter = ciphertext.
            // For key=3: plaintext A should give ciphertext D. So inner D should align with outer A.
            // We rotate inner by -3 * (360/26). This rotates inner ring so that inner D (originally at position 3) 
            // moves to position 3 + (-3) = position 0. Wait, rotate the group by -3*360/26 means rotating CW by 3 slots? 
            // SVG rotate: positive = clockwise. We use rotate(-rotDeg) where rotDeg=key*360/26.
            // So for key=3: rotate(-(3*360/26)) = rotate CW by... negative angle in rotate() means counter-clockwise.
            // Hmm. Let me just look at the code: transform = 'rotate(-' + rotDeg + 'deg)'. 
            // In CSS, rotate with negative = counter-clockwise.
            // So we rotate CCW by key * (360/26). For key=3, CCW by ~41.5 degrees.
            // Inner letter at position 3 (D, angle = 3*360/26 - 90 from top) gets rotated CCW by 3*360/26.
            // New angle = 3*360/26 - 90 - 3*360/26 = -90. That's the top position = outer A. So inner D aligns with outer A. ✓
            // So: at outer position p, the inner letter is the one whose original position i satisfies:
            // i * 360/26 - key * 360/26 = p * 360/26 => i - key = p => i = p + key
            // Inner letter at outer position p is numToLetter((p + key) mod 26). 
            // So: plaintext p -> ciphertext (p + key) mod 26. ✓
            // And inner letter i is at outer position (i - key) mod 26.
            // So clicking inner letter i: it's visually at outer position (i - key) mod 26.
            // The outer letter there is (i - key) mod 26, which is the plaintext. So:
            // Clicking inner letter i (ciphertext i): plaintext = (i - key) mod 26.
            var plaintextIdx = mod(innerIdx - currentWheelKey, 26);
            // For display: the outer letter at that position is the plaintext
            // We want to show: ciphertext innerIdx decrypts to plaintext plaintextIdx
            highlightWheelPair(plaintextIdx, innerIdx, false);
        }
    });

    // Drag support for inner ring rotation
    (function() {
        var dragging = false;
        var startAngle = 0;
        var startKey = 0;

        function getAngle(x, y) {
            var rect = wheelSvg.getBoundingClientRect();
            var cx = rect.left + rect.width / 2;
            var cy = rect.top + rect.height / 2;
            return Math.atan2(y - cy, x - cx) * 180 / Math.PI;
        }

        wheelSvg.addEventListener('mousedown', function(e) {
            // Check if clicking near the inner ring area
            var rect = wheelSvg.getBoundingClientRect();
            var scale = 320 / rect.width;
            var mx = (e.clientX - rect.left) * scale;
            var my = (e.clientY - rect.top) * scale;
            var dist = Math.sqrt((mx - CX) * (mx - CX) + (my - CY) * (my - CY));
            if (dist > INNER_BG_R && dist < INNER_R + 5) {
                dragging = true;
                startAngle = getAngle(e.clientX, e.clientY);
                startKey = currentWheelKey;
                e.preventDefault();
            }
        });

        document.addEventListener('mousemove', function(e) {
            if (!dragging) return;
            var currentAngle = getAngle(e.clientX, e.clientY);
            var diff = currentAngle - startAngle;
            var keyDiff = Math.round(diff / (360 / 26));
            var newKey = mod(startKey - keyDiff, 26);
            if (newKey !== currentWheelKey) {
                setWheelKey(newKey);
            }
        });

        document.addEventListener('mouseup', function() { dragging = false; });

        // Touch support
        wheelSvg.addEventListener('touchstart', function(e) {
            var touch = e.touches[0];
            var rect = wheelSvg.getBoundingClientRect();
            var scale = 320 / rect.width;
            var mx = (touch.clientX - rect.left) * scale;
            var my = (touch.clientY - rect.top) * scale;
            var dist = Math.sqrt((mx - CX) * (mx - CX) + (my - CY) * (my - CY));
            if (dist > INNER_BG_R && dist < INNER_R + 5) {
                dragging = true;
                startAngle = getAngle(touch.clientX, touch.clientY);
                startKey = currentWheelKey;
                e.preventDefault();
            }
        }, { passive: false });

        document.addEventListener('touchmove', function(e) {
            if (!dragging) return;
            var touch = e.touches[0];
            var currentAngle = getAngle(touch.clientX, touch.clientY);
            var diff = currentAngle - startAngle;
            var keyDiff = Math.round(diff / (360 / 26));
            var newKey = mod(startKey - keyDiff, 26);
            if (newKey !== currentWheelKey) {
                setWheelKey(newKey);
            }
        }, { passive: true });

        document.addEventListener('touchend', function() { dragging = false; });
    })();

    buildWheel();


    // ===== C. Interactive Encryption / Decryption =====
    var encInput = container.querySelector('#enc-input');
    var encKey = container.querySelector('#enc-key');
    var encMode = container.querySelector('#enc-mode');
    var encGoBtn = container.querySelector('#enc-go-btn');
    var encClearBtn = container.querySelector('#enc-clear-btn');
    var encResultBox = container.querySelector('#enc-result-box');
    var encResultLabel = container.querySelector('#enc-result-label');
    var encResultText = container.querySelector('#enc-result-text');
    var encTransformDisplay = container.querySelector('#enc-transform-display');

    function runEncryption() {
        var text = encInput.value;
        var key = parseInt(encKey.value, 10);
        var mode = encMode.value;

        if (!text.trim()) {
            encResultBox.style.display = 'block';
            encResultBox.className = 'result-box error';
            encResultLabel.textContent = 'Error';
            encResultText.textContent = 'Please enter some text.';
            encTransformDisplay.innerHTML = '';
            return;
        }
        if (isNaN(key) || key < 0 || key > 25) {
            encResultBox.style.display = 'block';
            encResultBox.className = 'result-box error';
            encResultLabel.textContent = 'Error';
            encResultText.textContent = 'Key must be between 0 and 25.';
            encTransformDisplay.innerHTML = '';
            return;
        }

        var isEncrypt = (mode === 'encrypt');
        var result = isEncrypt ? caesarEncrypt(text, key) : caesarDecrypt(text, key);

        encResultBox.style.display = 'block';
        encResultBox.className = 'result-box ' + (isEncrypt ? 'info' : 'success');
        encResultLabel.textContent = isEncrypt ? 'Ciphertext' : 'Plaintext';
        encResultText.innerHTML = isEncrypt
            ? '<span class="highlight-cipher">' + utils.escapeHtml(result) + '</span>'
            : '<span class="highlight-plain">' + utils.escapeHtml(result) + '</span>';
        utils.animateElement(encResultBox, 'fade-in');

        // Build letter-by-letter transform display
        var transformHTML = '<div class="transform-display">';
        for (var i = 0; i < text.length; i++) {
            var ch = text[i].toUpperCase();
            if (/[A-Z]/.test(ch)) {
                var inputNum = letterToNum(ch);
                var outputNum, calcStr, outputLetter;
                if (isEncrypt) {
                    var rawSum = inputNum + key;
                    outputNum = mod(rawSum, 26);
                    calcStr = inputNum + ' + ' + key + ' = ' + rawSum + (rawSum >= 26 ? ' → ' + outputNum : '');
                    outputLetter = numToLetter(outputNum);
                } else {
                    var rawDiff = inputNum - key;
                    outputNum = mod(rawDiff, 26);
                    calcStr = inputNum + ' − ' + key + ' = ' + rawDiff + (rawDiff < 0 ? ' → ' + outputNum : '');
                    outputLetter = numToLetter(outputNum);
                }
                transformHTML +=
                    '<div class="transform-item">' +
                        '<div class="transform-plain">' + ch + '</div>' +
                        '<div class="transform-math">' + calcStr + '<br>mod 26 = ' + outputNum + '</div>' +
                        '<div class="transform-arrow">↓</div>' +
                        '<div class="transform-cipher">' + outputLetter + '</div>' +
                    '</div>';
            } else {
                transformHTML +=
                    '<div class="transform-item space-item">' +
                        '<div class="transform-plain" style="color:var(--gray-400);">' + (ch === ' ' ? '␣' : utils.escapeHtml(ch)) + '</div>' +
                        '<div class="transform-math" style="color:var(--gray-400);">kept</div>' +
                        '<div class="transform-arrow">↓</div>' +
                        '<div class="transform-cipher" style="color:var(--gray-400);">' + (ch === ' ' ? '␣' : utils.escapeHtml(ch)) + '</div>' +
                    '</div>';
            }
        }
        transformHTML += '</div>';
        encTransformDisplay.innerHTML = transformHTML;
        utils.animateElement(encTransformDisplay, 'fade-in');

        progress.complete('caesar', 'caesar-encrypt-decrypt');
    }

    encGoBtn.addEventListener('click', runEncryption);
    encInput.addEventListener('keydown', function(e) { if (e.key === 'Enter') runEncryption(); });
    encClearBtn.addEventListener('click', function() {
        encInput.value = '';
        encResultBox.style.display = 'none';
        encTransformDisplay.innerHTML = '';
    });


    // ===== D. Brute-Force Attack =====
    var bruteInput = container.querySelector('#brute-input');
    var bruteGoBtn = container.querySelector('#brute-go-btn');
    var bruteResults = container.querySelector('#brute-results');

    function runBruteForce() {
        var ciphertext = bruteInput.value.trim();
        if (!ciphertext) {
            bruteResults.innerHTML = '<div class="alert alert-danger">Please enter some ciphertext to crack.</div>';
            return;
        }

        var results = [];
        for (var k = 0; k < 26; k++) {
            var decrypted = caesarDecrypt(ciphertext, k);
            var score = scoreText(decrypted);
            results.push({ key: k, text: decrypted, score: score });
        }

        // Find best score
        var bestScore = -Infinity;
        var bestKey = 0;
        for (var j = 0; j < results.length; j++) {
            if (results[j].score > bestScore) {
                bestScore = results[j].score;
                bestKey = results[j].key;
            }
        }

        var html = '<div class="result-box success" style="margin-bottom:1rem;">' +
            '<div class="result-label">Most Likely Plaintext (Key = ' + bestKey + ')</div>' +
            '<div style="font-size:1.2rem;font-weight:700;" class="highlight-plain">' + utils.escapeHtml(results[bestKey].text) + '</div>' +
        '</div>';

        html += '<div class="brute-force-list">';
        for (var r = 0; r < results.length; r++) {
            var isLikely = (r === bestKey);
            html += '<div class="brute-force-row' + (isLikely ? ' likely' : '') + '">' +
                '<span class="brute-force-key">Key ' + (r < 10 ? '&nbsp;' : '') + r + '</span>' +
                '<span style="flex:1;">' + utils.escapeHtml(results[r].text) + '</span>' +
                (isLikely ? '<span class="badge badge-success">Best Match</span>' : '') +
            '</div>';
        }
        html += '</div>';

        bruteResults.innerHTML = html;
        utils.animateElement(bruteResults, 'fade-in');

        progress.complete('caesar', 'caesar-brute-force');
    }

    bruteGoBtn.addEventListener('click', runBruteForce);
    bruteInput.addEventListener('keydown', function(e) { if (e.key === 'Enter') runBruteForce(); });


    // ===== E. Practice Exercises =====

    function setupExercise(num, checkFn, solutionFn) {
        var checkBtn = container.querySelector('#ex' + num + '-check');
        var hintBtn = container.querySelector('#ex' + num + '-hint');
        var hintText = container.querySelector('#ex' + num + '-hint-text');
        var feedback = container.querySelector('#ex' + num + '-feedback');
        var box = container.querySelector('#exercise-' + num + '-box');

        hintBtn.addEventListener('click', function() {
            hintText.classList.toggle('show');
        });

        checkBtn.addEventListener('click', function() {
            var result = checkFn();
            feedback.style.display = 'block';
            feedback.classList.add('show');
            if (result.correct) {
                feedback.className = 'exercise-feedback show correct-feedback';
                feedback.innerHTML = '✅ <strong>Correct!</strong> ' + result.explanation;
                box.classList.remove('incorrect');
                box.classList.add('correct');
                progress.complete('caesar', 'caesar-exercise-' + num);
            } else {
                feedback.className = 'exercise-feedback show incorrect-feedback';
                feedback.innerHTML = '❌ <strong>Not quite.</strong> ' + result.explanation;
                box.classList.remove('correct');
                box.classList.add('incorrect');
            }
            utils.animateElement(feedback, 'fade-in');
        });
    }

    // Exercise 1: Encrypt HELLO with key 3
    setupExercise(1, function() {
        var answer = cleanText(container.querySelector('#ex1-answer').value);
        var correct = caesarEncrypt('HELLO', 3); // KHOOR
        if (answer === correct) {
            return {
                correct: true,
                explanation: 'HELLO encrypts to <span class="highlight-cipher">KHOOR</span> with key 3.<br>' +
                    '<span class="text-sm">H(7)+3=10(K), E(4)+3=7(H), L(11)+3=14(O), L(11)+3=14(O), O(14)+3=17(R)</span>'
            };
        }
        return {
            correct: false,
            explanation: 'The correct answer is <span class="highlight-cipher">KHOOR</span>. ' +
                'Apply C = (P + 3) mod 26 to each letter of HELLO.<br>' +
                '<span class="text-sm">H(7)+3=10(K), E(4)+3=7(H), L(11)+3=14(O), L(11)+3=14(O), O(14)+3=17(R)</span>'
        };
    });

    // Exercise 2: Decrypt WKLQN with key 3
    setupExercise(2, function() {
        var answer = cleanText(container.querySelector('#ex2-answer').value);
        var correct = caesarDecrypt('WKLQN', 3); // THINK
        if (answer === correct) {
            return {
                correct: true,
                explanation: 'WKLQN decrypts to <span class="highlight-plain">THINK</span> with key 3.<br>' +
                    '<span class="text-sm">W(22)−3=19(T), K(10)−3=7(H), L(11)−3=8(I), Q(16)−3=13(N), N(13)−3=10(K)</span>'
            };
        }
        return {
            correct: false,
            explanation: 'The correct answer is <span class="highlight-plain">THINK</span>. ' +
                'Apply P = (C − 3 + 26) mod 26 to each letter of WKLQN.<br>' +
                '<span class="text-sm">W(22)−3=19(T), K(10)−3=7(H), L(11)−3=8(I), Q(16)−3=13(N), N(13)−3=10(K)</span>'
        };
    });

    // Exercise 3: Find the key (A -> D)
    setupExercise(3, function() {
        var answer = parseInt(container.querySelector('#ex3-answer').value, 10);
        if (answer === 3) {
            return {
                correct: true,
                explanation: 'The key is <span class="highlight-key">3</span>. Since D=3 and A=0, k = 3 − 0 = 3.'
            };
        }
        return {
            correct: false,
            explanation: 'The correct key is <span class="highlight-key">3</span>. ' +
                'Since A=0 and D=3: k = C − P = 3 − 0 = <strong>3</strong>.'
        };
    });

    // Exercise 4: (24 + 5) mod 26
    setupExercise(4, function() {
        var answer = parseInt(container.querySelector('#ex4-answer').value, 10);
        if (answer === 3) {
            return {
                correct: true,
                explanation: '<span class="highlight-step">(24 + 5) mod 26 = 29 mod 26 = 3</span>. Since 29 ÷ 26 = 1 remainder 3.'
            };
        }
        return {
            correct: false,
            explanation: 'The correct answer is <span class="highlight-step">3</span>. ' +
                '24 + 5 = 29. 29 mod 26 = 29 − 26 = <strong>3</strong> (the remainder when dividing 29 by 26).'
        };
    });

    // Exercise 5: Brute-force EBIIL -> HELLO with key 23
    setupExercise(5, function() {
        var answerText = cleanText(container.querySelector('#ex5-answer-text').value);
        var answerKey = parseInt(container.querySelector('#ex5-answer-key').value, 10);
        // EBIIL encrypted from HELLO: HELLO + k = EBIIL
        // H(7)+k=E(4) => k=4-7=-3 => mod 26 = 23. So key=23 to encrypt, or equivalently shift back by 3.
        // Decrypt EBIIL with key 23: P = (C - 23 + 26) mod 26 = (C + 3) mod 26
        // E(4)+3=7(H), B(1)+3=4(E), I(8)+3=11(L), I(8)+3=11(L), L(11)+3=14(O) = HELLO ✓
        var isCorrect = (answerText === 'HELLO' && (answerKey === 23));
        if (isCorrect) {
            return {
                correct: true,
                explanation: 'The plaintext is <span class="highlight-plain">HELLO</span> and the key is <span class="highlight-key">23</span>.<br>' +
                    '<span class="text-sm">Decrypting EBIIL with key 23: P = (C − 23 + 26) mod 26 = (C + 3) mod 26<br>' +
                    'E(4)→H(7), B(1)→E(4), I(8)→L(11), I(8)→L(11), L(11)→O(14) = HELLO</span>'
            };
        }
        return {
            correct: false,
            explanation: 'The correct answer is plaintext <span class="highlight-plain">HELLO</span> with key <span class="highlight-key">23</span>.<br>' +
                '<span class="text-sm">Try decrypting EBIIL with each key 0–25. With key 23: (C − 23 + 26) mod 26 = (C + 3) mod 26.<br>' +
                'E(4)+3=7(H), B(1)+3=4(E), I(8)+3=11(L), I(8)+3=11(L), L(11)+3=14(O) = HELLO ✓</span>'
        };
    });

    // Restore exercise completion states
    var caesarAnswers = {
        1: function() { var el = container.querySelector('#ex1-answer'); if (el) el.value = 'KHOOR'; },
        2: function() { var el = container.querySelector('#ex2-answer'); if (el) el.value = 'THINK'; },
        3: function() { var el = container.querySelector('#ex3-answer'); if (el) el.value = '3'; },
        4: function() { var el = container.querySelector('#ex4-answer'); if (el) el.value = '3'; },
        5: function() {
            var t = container.querySelector('#ex5-answer-text');
            var k = container.querySelector('#ex5-answer-key');
            if (t) t.value = 'HELLO';
            if (k) k.value = '23';
        }
    };
    for (var ce = 1; ce <= 5; ce++) {
        if (progress.isComplete('caesar', 'caesar-exercise-' + ce)) {
            if (caesarAnswers[ce]) caesarAnswers[ce]();
            var exBox = container.querySelector('#exercise-' + ce + '-box');
            var exCheck = container.querySelector('#ex' + ce + '-check');
            if (exBox) exBox.classList.add('correct');
            if (exCheck) exCheck.click();
        }
    }

});
