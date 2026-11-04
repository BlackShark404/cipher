/* ===== Playfair Cipher Module ===== */
CipherApp.registerModule('playfair', function(container) {
    'use strict';

    var utils = CipherApp.utils;
    var progress = CipherApp.progress;
    var SECTION_ID = 'playfair';

    // ============================
    // PLAYFAIR CORE ALGORITHMS
    // ============================

    /** Build the 5x5 Playfair matrix from a keyword */
    function buildMatrix(keyword) {
        var kw = utils.cleanText(keyword).replace(/J/g, 'I');
        var seen = {};
        var letters = [];
        // Add keyword letters (deduplicated)
        for (var i = 0; i < kw.length; i++) {
            if (!seen[kw[i]]) {
                seen[kw[i]] = true;
                letters.push(kw[i]);
            }
        }
        var kwLen = letters.length;
        // Fill remaining alphabet (I/J combined)
        var alpha = 'ABCDEFGHIKLMNOPQRSTUVWXYZ'; // no J
        for (var j = 0; j < alpha.length; j++) {
            if (!seen[alpha[j]]) {
                seen[alpha[j]] = true;
                letters.push(alpha[j]);
            }
        }
        // Build 5x5 grid
        var matrix = [];
        for (var r = 0; r < 5; r++) {
            matrix.push(letters.slice(r * 5, r * 5 + 5));
        }
        return { matrix: matrix, keywordLen: kwLen, letters: letters };
    }

    /** Find position of a letter in the matrix */
    function findPosition(matrix, letter) {
        var ch = letter === 'J' ? 'I' : letter;
        for (var r = 0; r < 5; r++) {
            for (var c = 0; c < 5; c++) {
                if (matrix[r][c] === ch) return { row: r, col: c };
            }
        }
        return null;
    }

    /** Prepare plaintext into digraphs */
    function prepareText(text) {
        var clean = utils.cleanText(text).replace(/J/g, 'I');
        var digraphs = [];
        var fillerPositions = [];
        var i = 0;
        while (i < clean.length) {
            var a = clean[i];
            if (i + 1 >= clean.length) {
                // Single trailing letter, append X
                digraphs.push(a + 'X');
                fillerPositions.push({ pair: digraphs.length - 1, pos: 1 });
                i++;
            } else if (clean[i] === clean[i + 1]) {
                // Double letters, insert X
                digraphs.push(a + 'X');
                fillerPositions.push({ pair: digraphs.length - 1, pos: 1 });
                i++;
            } else {
                digraphs.push(a + clean[i + 1]);
                i += 2;
            }
        }
        return { digraphs: digraphs, fillers: fillerPositions, cleaned: clean };
    }

    /** Determine the rule for a pair */
    function getRule(pos1, pos2) {
        if (pos1.row === pos2.row) return 'row';
        if (pos1.col === pos2.col) return 'col';
        return 'rect';
    }

    /** Encrypt a single digraph */
    function encryptDigraph(matrix, d) {
        var pos1 = findPosition(matrix, d[0]);
        var pos2 = findPosition(matrix, d[1]);
        var rule = getRule(pos1, pos2);
        var r1, c1, r2, c2;
        if (rule === 'row') {
            r1 = pos1.row; c1 = (pos1.col + 1) % 5;
            r2 = pos2.row; c2 = (pos2.col + 1) % 5;
        } else if (rule === 'col') {
            r1 = (pos1.row + 1) % 5; c1 = pos1.col;
            r2 = (pos2.row + 1) % 5; c2 = pos2.col;
        } else {
            r1 = pos1.row; c1 = pos2.col;
            r2 = pos2.row; c2 = pos1.col;
        }
        return {
            input: d,
            output: matrix[r1][c1] + matrix[r2][c2],
            rule: rule,
            pos1: pos1, pos2: pos2,
            outPos1: { row: r1, col: c1 },
            outPos2: { row: r2, col: c2 }
        };
    }

    /** Decrypt a single digraph */
    function decryptDigraph(matrix, d) {
        var pos1 = findPosition(matrix, d[0]);
        var pos2 = findPosition(matrix, d[1]);
        var rule = getRule(pos1, pos2);
        var r1, c1, r2, c2;
        if (rule === 'row') {
            r1 = pos1.row; c1 = utils.mod(pos1.col - 1, 5);
            r2 = pos2.row; c2 = utils.mod(pos2.col - 1, 5);
        } else if (rule === 'col') {
            r1 = utils.mod(pos1.row - 1, 5); c1 = pos1.col;
            r2 = utils.mod(pos2.row - 1, 5); c2 = pos2.col;
        } else {
            r1 = pos1.row; c1 = pos2.col;
            r2 = pos2.row; c2 = pos1.col;
        }
        return {
            input: d,
            output: matrix[r1][c1] + matrix[r2][c2],
            rule: rule,
            pos1: pos1, pos2: pos2,
            outPos1: { row: r1, col: c1 },
            outPos2: { row: r2, col: c2 }
        };
    }

    /** Render rule badge HTML */
    function ruleBadge(rule) {
        var labels = { row: 'Same Row', col: 'Same Column', rect: 'Rectangle' };
        var classes = { row: 'row-rule', col: 'col-rule', rect: 'rect-rule' };
        return '<span class="rule-badge ' + classes[rule] + '">' + labels[rule] + '</span>';
    }

    /** Render rule explanation */
    function ruleExplanation(rule, isDecrypt) {
        if (rule === 'row') {
            return isDecrypt
                ? 'Both letters are in the <strong>same row</strong>. Move each letter to the <strong>LEFT</strong> (wrap from column 0 to column 4).'
                : 'Both letters are in the <strong>same row</strong>. Replace each with the letter to the <strong>RIGHT</strong> (wrap from column 4 to column 0).';
        }
        if (rule === 'col') {
            return isDecrypt
                ? 'Both letters are in the <strong>same column</strong>. Move each letter <strong>UP</strong> (wrap from row 0 to row 4).'
                : 'Both letters are in the <strong>same column</strong>. Replace each with the letter <strong>BELOW</strong> (wrap from row 4 to row 0).';
        }
        return 'Letters are in <strong>different rows and columns</strong> (rectangle). Each letter stays in its row but moves to the <strong>column of the other letter</strong>.' + (isDecrypt ? ' (Rectangle rule is symmetric — same operation for encrypt and decrypt.)' : '');
    }

    /** Generate matrix HTML with optional highlights */
    function renderMatrix(matrixData, highlights, id) {
        var matrix = matrixData.matrix;
        var kwLen = matrixData.keywordLen;
        var html = '<div class="matrix-5x5" id="' + (id || '') + '">';
        var cellIdx = 0;
        for (var r = 0; r < 5; r++) {
            for (var c = 0; c < 5; c++) {
                var classes = ['matrix-cell'];
                if (cellIdx < kwLen) classes.push('keyword-cell');
                // Check highlights
                if (highlights) {
                    for (var h = 0; h < highlights.length; h++) {
                        if (highlights[h].row === r && highlights[h].col === c) {
                            classes.push(highlights[h].cls || 'highlight');
                        }
                    }
                }
                html += '<div class="' + classes.join(' ') + '" data-row="' + r + '" data-col="' + c + '">';
                html += '<span class="cell-index">' + r + ',' + c + '</span>';
                html += matrix[r][c];
                html += '</div>';
                cellIdx++;
            }
        }
        html += '</div>';
        return html;
    }

    /** Render digraphs with optional active index and fillers */
    function renderDigraphs(digraphs, fillers, activeIdx) {
        var fillerMap = {};
        if (fillers) {
            fillers.forEach(function(f) { fillerMap[f.pair + '-' + f.pos] = true; });
        }
        var html = '<div class="digraph-display">';
        digraphs.forEach(function(d, i) {
            var cls = 'digraph-pair' + (i === activeIdx ? ' active' : '');
            html += '<span class="' + cls + '">';
            for (var ci = 0; ci < d.length; ci++) {
                if (fillerMap[i + '-' + ci]) {
                    html += '<span class="filler">' + d[ci] + '</span>';
                } else {
                    html += d[ci];
                }
            }
            html += '</span>';
        });
        html += '</div>';
        return html;
    }

    // ============================
    // BUILD ALL SECTION HTML
    // ============================

    var html = '<div class="section-content">';

    // ---- HERO ----
    html += '<div class="hero-banner" style="background: linear-gradient(135deg, #0891b2 0%, #065f6e 100%)">';
    html += '<h1>🔲 Playfair Cipher</h1>';
    html += '<p class="hero-subtitle">Digraph substitution using a 5×5 key matrix</p>';
    html += '</div>';

    // ---- PROGRESS ----
    html += '<div class="card mb-2"><div class="card-body" style="padding:0.75rem 1.5rem;">';
    html += '<div style="display:flex;align-items:center;gap:1rem;flex-wrap:wrap;">';
    html += '<strong style="font-size:0.9rem;">Section Progress:</strong>';
    html += '<div class="progress-bar" style="flex:1;min-width:120px;"><div class="progress-fill" id="pf-progress-fill" style="width:0%"></div></div>';
    html += '<span id="pf-progress-text" style="font-size:0.85rem;font-weight:600;">0%</span>';
    html += '</div></div></div>';

    // =============================================================
    // A. FUNDAMENTALS
    // =============================================================
    html += '<div class="card"><div class="card-header"><h3>A. Fundamentals — What is the Playfair Cipher?</h3></div><div class="card-body">';

    html += '<div class="subsection"><div class="subsection-title">Historical Context</div>';
    html += '<p>The Playfair cipher was invented by <strong>Charles Wheatstone</strong> in 1854 but was named after <strong>Lord Playfair</strong>, who championed its use. It was the first <em>digraph substitution cipher</em> to be used practically and was employed by the British in the Boer War and World War I.</p>';
    html += '<p>Unlike simple substitution ciphers that replace one letter at a time, the Playfair cipher encrypts <strong>pairs of letters</strong> (called <span class="highlight-step">digraphs</span>), making it significantly harder to break with basic frequency analysis.</p>';
    html += '</div>';

    html += '<div class="subsection"><div class="subsection-title">What is a Digraph?</div>';
    html += '<p>A <strong>digraph</strong> (or bigram) is a pair of two consecutive letters. For example, the word "<span class="highlight-plain">HELLO</span>" would be split into digraphs: <code>HE</code> <code>LL</code> <code>O?</code></p>';
    html += '<p>Because Playfair works on pairs rather than individual letters, there are <strong>25 × 25 = 625</strong> possible digraph combinations (using the 25-letter Playfair alphabet), compared to only 26 possible substitutions in a simple Caesar cipher. This dramatically increases the cipher\'s resistance to frequency analysis.</p>';
    html += '</div>';

    html += '<div class="subsection"><div class="subsection-title">The 5×5 Key Matrix</div>';
    html += '<p>The Playfair cipher uses a <span class="highlight-key">keyword</span> to construct a 5×5 matrix containing all 25 letters of the alphabet. The keyword determines the scrambling of the alphabet within this matrix, and it is this matrix that drives both encryption and decryption.</p>';
    html += '</div>';

    html += '<div class="subsection"><div class="subsection-title">Why I and J are Combined</div>';
    html += '<p>The English alphabet has 26 letters, but a 5×5 grid only holds <strong>25 cells</strong>. To solve this, the letters <span class="highlight-step">I</span> and <span class="highlight-step">J</span> are treated as the <strong>same letter</strong> (typically I replaces J). During decryption, context is used to determine whether an I should actually be a J.</p>';
    html += '</div>';

    html += '<div class="subsection"><div class="subsection-title">Comparison: Monoalphabetic vs. Playfair</div>';
    html += '<div class="table-responsive"><table class="styled-table comparison-table"><thead><tr>';
    html += '<th>Feature</th><th>Monoalphabetic</th><th>Playfair</th></tr></thead><tbody>';
    html += '<tr><td>Unit of encryption</td><td>Single letter</td><td>Pair of letters (digraph)</td></tr>';
    html += '<tr><td>Substitution space</td><td>26 mappings</td><td>625 digraph mappings</td></tr>';
    html += '<tr><td>Frequency analysis</td><td>Easy — single letter frequencies visible</td><td>Harder — digraph frequencies are flatter</td></tr>';
    html += '<tr><td>Key</td><td>Full 26-letter mapping</td><td>Keyword + 5×5 matrix</td></tr>';
    html += '<tr><td>Type</td><td>Monoalphabetic substitution</td><td>Polygraphic substitution</td></tr>';
    html += '</tbody></table></div>';
    html += '</div>';

    html += '<button class="btn btn-primary" id="btn-fundamentals-done">✓ I understand the fundamentals</button>';
    html += '</div></div>';

    // =============================================================
    // B. INTERACTIVE 5×5 KEY MATRIX GENERATOR
    // =============================================================
    html += '<div class="card"><div class="card-header" style="background: var(--key-color);"><h3>B. Interactive 5×5 Key Matrix Generator</h3></div><div class="card-body">';

    html += '<p>Enter a keyword below to generate a Playfair 5×5 matrix. Watch how the matrix is constructed step by step.</p>';

    html += '<div class="input-inline"><div class="input-group">';
    html += '<label for="pf-matrix-keyword">Keyword</label>';
    html += '<input type="text" id="pf-matrix-keyword" value="MONARCHY" placeholder="Enter a keyword...">';
    html += '</div>';
    html += '<button class="btn btn-success" id="btn-gen-matrix">🔨 Generate Matrix</button></div>';

    html += '<div id="pf-matrix-steps" class="mt-2"></div>';
    html += '<div id="pf-matrix-display" class="mt-2"></div>';

    html += '</div></div>';

    // =============================================================
    // C. PLAINTEXT PREPARATION
    // =============================================================
    html += '<div class="card"><div class="card-header" style="background: var(--step-color);"><h3>C. Plaintext Preparation</h3></div><div class="card-body">';

    html += '<p>Before encryption, plaintext must be prepared following specific rules. The Playfair cipher requires text to be split into <strong>digraphs</strong> (pairs of letters), with special handling for duplicate letters and odd-length texts.</p>';

    html += '<div class="subsection"><div class="subsection-title">Preparation Rules</div>';
    html += '<ol>';
    html += '<li><strong>Convert</strong> to uppercase and remove all spaces, punctuation, and numbers.</li>';
    html += '<li><strong>Replace</strong> every J with I (since I and J share a cell).</li>';
    html += '<li><strong>Split</strong> into pairs (digraphs) of two letters.</li>';
    html += '<li>If a pair has <strong>two identical letters</strong>, insert an <span class="highlight-step">X</span> between them (e.g., LL → L<span class="highlight-step">X</span> L...).</li>';
    html += '<li>If the final group has only <strong>one letter</strong>, append <span class="highlight-step">X</span> to complete the pair.</li>';
    html += '</ol>';
    html += '<div class="alert alert-warning">⚠️ During decryption, filler X characters must be identified and removed <strong>manually</strong> using context to recover the original message.</div>';
    html += '</div>';

    html += '<div class="subsection"><div class="subsection-title">Interactive Demonstration</div>';
    html += '<div class="input-inline"><div class="input-group">';
    html += '<label for="pf-prep-input">Plaintext Message</label>';
    html += '<input type="text" id="pf-prep-input" value="BALLOON" placeholder="Enter a message...">';
    html += '</div>';
    html += '<button class="btn btn-warning" id="btn-prepare">📝 Prepare Text</button></div>';
    html += '<div id="pf-prep-result" class="mt-2"></div>';
    html += '</div>';

    // Quick demos
    html += '<div class="subsection"><div class="subsection-title">Edge Case Examples</div>';
    html += '<div class="btn-group">';
    html += '<button class="btn btn-sm btn-secondary pf-prep-example" data-text="BALLOON">BALLOON (double L)</button>';
    html += '<button class="btn btn-sm btn-secondary pf-prep-example" data-text="JAZZ">JAZZ (J→I, double Z)</button>';
    html += '<button class="btn btn-sm btn-secondary pf-prep-example" data-text="HELLO">HELLO (trailing letter)</button>';
    html += '<button class="btn btn-sm btn-secondary pf-prep-example" data-text="MEET ME AT NOON">MEET ME AT NOON</button>';
    html += '</div></div>';

    html += '</div></div>';

    // =============================================================
    // D. INTERACTIVE PLAYFAIR ENCRYPTION
    // =============================================================
    html += '<div class="card"><div class="card-header" style="background: var(--cipher-color);"><h3>D. Interactive Playfair Encryption</h3></div><div class="card-body">';

    html += '<p>Enter a keyword and plaintext to encrypt using the Playfair cipher. Each digraph pair is encrypted individually using one of three rules.</p>';

    // Three rules explanation
    html += '<div class="subsection"><div class="subsection-title">The Three Encryption Rules</div>';
    html += '<div class="grid-3col">';
    html += '<div class="card"><div class="card-body text-center">';
    html += '<span class="rule-badge row-rule">Same Row</span>';
    html += '<p class="mt-1 text-sm">Both letters are in the same row. Replace each with the letter to its <strong>RIGHT</strong>. Wrap from column 4 → column 0.</p>';
    html += '</div></div>';
    html += '<div class="card"><div class="card-body text-center">';
    html += '<span class="rule-badge col-rule">Same Column</span>';
    html += '<p class="mt-1 text-sm">Both letters are in the same column. Replace each with the letter <strong>BELOW</strong>. Wrap from row 4 → row 0.</p>';
    html += '</div></div>';
    html += '<div class="card"><div class="card-body text-center">';
    html += '<span class="rule-badge rect-rule">Rectangle</span>';
    html += '<p class="mt-1 text-sm">Letters are in different rows and columns. Each stays in its row but moves to the <strong>column of the other letter</strong>.</p>';
    html += '</div></div>';
    html += '</div></div>';

    html += '<div class="grid-2col"><div class="input-group">';
    html += '<label for="pf-enc-keyword">Keyword</label>';
    html += '<input type="text" id="pf-enc-keyword" value="MONARCHY" placeholder="Keyword...">';
    html += '</div><div class="input-group">';
    html += '<label for="pf-enc-plaintext">Plaintext</label>';
    html += '<input type="text" id="pf-enc-plaintext" value="INSTRUMENTS" placeholder="Plaintext...">';
    html += '</div></div>';
    html += '<button class="btn btn-danger" id="btn-encrypt">🔒 Encrypt</button>';

    html += '<div id="pf-enc-result" class="mt-2"></div>';

    html += '</div></div>';

    // =============================================================
    // E. INTERACTIVE PLAYFAIR DECRYPTION
    // =============================================================
    html += '<div class="card"><div class="card-header" style="background: var(--info-dark);"><h3>E. Interactive Playfair Decryption</h3></div><div class="card-body">';

    html += '<p>Decryption reverses the encryption rules: Same Row → move <strong>LEFT</strong>, Same Column → move <strong>UP</strong>, Rectangle → same swap (symmetric).</p>';

    html += '<div class="grid-2col"><div class="input-group">';
    html += '<label for="pf-dec-keyword">Keyword</label>';
    html += '<input type="text" id="pf-dec-keyword" value="MONARCHY" placeholder="Keyword...">';
    html += '</div><div class="input-group">';
    html += '<label for="pf-dec-ciphertext">Ciphertext</label>';
    html += '<input type="text" id="pf-dec-ciphertext" value="GATLMZCLRQTX" placeholder="Ciphertext...">';
    html += '</div></div>';
    html += '<button class="btn btn-primary" id="btn-decrypt">🔓 Decrypt</button>';

    html += '<div id="pf-dec-result" class="mt-2"></div>';

    html += '<div class="alert alert-info mt-2">ℹ️ <strong>Note:</strong> Filler X characters may need to be removed manually to recover the original message. Use context to determine which X\'s are fillers.</div>';

    html += '</div></div>';

    // =============================================================
    // F. PRACTICE EXERCISES
    // =============================================================
    html += '<div class="card"><div class="card-header" style="background: var(--success-dark);"><h3>F. Practice Exercises</h3></div><div class="card-body">';

    // Exercise 1: Build Matrix
    html += '<div class="exercise-box" id="pf-ex1">';
    html += '<span class="exercise-badge easy">Easy</span>';
    html += '<div class="exercise-question">Exercise 1: Given the keyword "<span class="highlight-key">KEYWORD</span>", construct the 5×5 Playfair matrix. Enter the first row of the matrix (5 letters, no spaces).</div>';
    html += '<div class="input-inline"><div class="input-group"><input type="text" id="pf-ex1-input" placeholder="e.g., KEYWO" maxlength="5" style="text-transform:uppercase;font-family:var(--font-mono);"></div>';
    html += '<button class="btn btn-success btn-sm" id="btn-ex1-check">Check</button>';
    html += '<button class="btn btn-secondary btn-sm" id="btn-ex1-hint">💡 Hint</button></div>';
    html += '<div class="exercise-hint" id="pf-ex1-hint">Remove duplicate letters from "KEYWORD": K, E, Y, W, O, R, D. Then fill with remaining alphabet (I/J combined). First row = the first 5 of these letters.</div>';
    html += '<div class="exercise-feedback" id="pf-ex1-feedback"></div>';
    html += '</div>';

    // Exercise 2: Prepare Plaintext
    html += '<div class="exercise-box" id="pf-ex2">';
    html += '<span class="exercise-badge easy">Easy</span>';
    html += '<div class="exercise-question">Exercise 2: Prepare "<span class="highlight-plain">BALLOON</span>" for Playfair encryption. Enter the digraph pairs separated by spaces.</div>';
    html += '<div class="input-inline"><div class="input-group"><input type="text" id="pf-ex2-input" placeholder="e.g., BA LX LO ON" style="text-transform:uppercase;font-family:var(--font-mono);"></div>';
    html += '<button class="btn btn-success btn-sm" id="btn-ex2-check">Check</button>';
    html += '<button class="btn btn-secondary btn-sm" id="btn-ex2-hint">💡 Hint</button></div>';
    html += '<div class="exercise-hint" id="pf-ex2-hint">Split into pairs: BA, LL... but LL has duplicate letters! Insert X between them: BA, LX, LO, ON. The X is a filler inserted to break the double-L pair.</div>';
    html += '<div class="exercise-feedback" id="pf-ex2-feedback"></div>';
    html += '</div>';

    // Exercise 3: Encrypt Digraph — Same Row
    html += '<div class="exercise-box" id="pf-ex3">';
    html += '<span class="exercise-badge medium">Medium</span>';
    html += '<div class="exercise-question">Exercise 3: Using the <span class="highlight-key">MONARCHY</span> matrix, encrypt the digraph "<span class="highlight-plain">AR</span>". What is the resulting ciphertext pair?</div>';
    html += '<div class="input-inline"><div class="input-group"><input type="text" id="pf-ex3-input" placeholder="e.g., XX" maxlength="2" style="text-transform:uppercase;font-family:var(--font-mono);"></div>';
    html += '<button class="btn btn-success btn-sm" id="btn-ex3-check">Check</button>';
    html += '<button class="btn btn-secondary btn-sm" id="btn-ex3-hint">💡 Hint</button></div>';
    html += '<div class="exercise-hint" id="pf-ex3-hint">In the MONARCHY matrix, find A and R. They are in the same row (row 1). Apply the Same Row rule: shift each letter one position to the RIGHT (wrapping around).</div>';
    html += '<div class="exercise-feedback" id="pf-ex3-feedback"></div>';
    html += '</div>';

    // Exercise 4: Encrypt Digraph — Rectangle
    html += '<div class="exercise-box" id="pf-ex4">';
    html += '<span class="exercise-badge medium">Medium</span>';
    html += '<div class="exercise-question">Exercise 4: Using the <span class="highlight-key">MONARCHY</span> matrix, encrypt the digraph "<span class="highlight-plain">HS</span>". What is the resulting ciphertext pair?</div>';
    html += '<div class="input-inline"><div class="input-group"><input type="text" id="pf-ex4-input" placeholder="e.g., XX" maxlength="2" style="text-transform:uppercase;font-family:var(--font-mono);"></div>';
    html += '<button class="btn btn-success btn-sm" id="btn-ex4-check">Check</button>';
    html += '<button class="btn btn-secondary btn-sm" id="btn-ex4-hint">💡 Hint</button></div>';
    html += '<div class="exercise-hint" id="pf-ex4-hint">Find H and S in the MONARCHY matrix. They are in different rows AND different columns, so the Rectangle rule applies. Each letter stays in its row but moves to the column of the other letter.</div>';
    html += '<div class="exercise-feedback" id="pf-ex4-feedback"></div>';
    html += '</div>';

    // Exercise 5: Full Message
    html += '<div class="exercise-box" id="pf-ex5">';
    html += '<span class="exercise-badge hard">Hard</span>';
    html += '<div class="exercise-question">Exercise 5: Using keyword "<span class="highlight-key">MONARCHY</span>", encrypt the message "<span class="highlight-plain">INSTRUMENTS</span>". Enter the full ciphertext (no spaces).</div>';
    html += '<div class="input-inline"><div class="input-group"><input type="text" id="pf-ex5-input" placeholder="Full ciphertext..." style="text-transform:uppercase;font-family:var(--font-mono);"></div>';
    html += '<button class="btn btn-success btn-sm" id="btn-ex5-check">Check</button>';
    html += '<button class="btn btn-secondary btn-sm" id="btn-ex5-hint">💡 Hint</button></div>';
    html += '<div class="exercise-hint" id="pf-ex5-hint">First prepare: INSTRUMENTS → IN ST RU ME NT SX (6 pairs — trailing S gets X appended). Then encrypt each pair using the MONARCHY matrix with the three rules.</div>';
    html += '<div class="exercise-feedback" id="pf-ex5-feedback"></div>';
    html += '</div>';

    html += '</div></div>';

    html += '</div>'; // end section-content

    // ============================
    // INJECT HTML & ATTACH EVENTS
    // ============================
    container.innerHTML = html;

    // ---- Helper: update section progress bar ----
    function updateSectionProgress() {
        var pct = progress.getProgress(SECTION_ID);
        var fill = container.querySelector('#pf-progress-fill');
        var text = container.querySelector('#pf-progress-text');
        if (fill) {
            fill.style.width = pct + '%';
            if (utils.getProgressColor) {
                fill.style.backgroundColor = utils.getProgressColor(pct);
                fill.style.boxShadow = '0 0 8px ' + utils.getProgressGlow(pct);
            }
        }
        if (text) text.textContent = pct + '%';
    }

    // ---- A. FUNDAMENTALS: mark complete ----
    container.querySelector('#btn-fundamentals-done').addEventListener('click', function() {
        progress.complete(SECTION_ID, 'playfair-fundamentals');
        this.textContent = '✅ Fundamentals Complete!';
        this.classList.remove('btn-primary');
        this.classList.add('btn-success');
        this.disabled = true;
        updateSectionProgress();
    });
    // If already complete
    if (progress.isComplete(SECTION_ID, 'playfair-fundamentals')) {
        var fb = container.querySelector('#btn-fundamentals-done');
        fb.textContent = '✅ Fundamentals Complete!';
        fb.classList.remove('btn-primary');
        fb.classList.add('btn-success');
    }

    // ---- B. MATRIX GENERATOR ----
    function generateMatrixUI() {
        var keyword = container.querySelector('#pf-matrix-keyword').value.trim();
        if (!keyword) { alert('Please enter a keyword.'); return; }

        var kw = utils.cleanText(keyword).replace(/J/g, 'I');
        if (kw.length === 0) { alert('Keyword must contain at least one letter.'); return; }

        // Dedup keyword
        var seen = {};
        var kwDedup = '';
        for (var i = 0; i < kw.length; i++) {
            if (!seen[kw[i]]) { seen[kw[i]] = true; kwDedup += kw[i]; }
        }

        // Remaining alphabet
        var alpha = 'ABCDEFGHIKLMNOPQRSTUVWXYZ';
        var remaining = '';
        for (var j = 0; j < alpha.length; j++) {
            if (!seen[alpha[j]]) remaining += alpha[j];
        }

        var fullSeq = kwDedup + remaining;

        // Build steps
        var stepsHtml = '<div class="step-display">';
        stepsHtml += '<div class="step-item"><div class="step-number">1</div><div class="step-content">Keyword entered: <span class="highlight-key">' + utils.escapeHtml(keyword.toUpperCase()) + '</span></div></div>';
        stepsHtml += '<div class="step-item"><div class="step-number">2</div><div class="step-content">Replace J with I, remove non-letters: <span class="highlight-key">' + kw + '</span></div></div>';
        stepsHtml += '<div class="step-item"><div class="step-number">3</div><div class="step-content">Remove duplicate letters: <span class="highlight-key">' + kwDedup + '</span>';
        if (kw.length !== kwDedup.length) {
            stepsHtml += ' <span class="text-muted text-sm">(removed ' + (kw.length - kwDedup.length) + ' duplicate' + (kw.length - kwDedup.length > 1 ? 's' : '') + ')</span>';
        }
        stepsHtml += '</div></div>';
        stepsHtml += '<div class="step-item"><div class="step-number">4</div><div class="step-content">Place keyword letters in first cells, fill remaining with: <span class="text-muted" style="font-family:var(--font-mono);word-break:break-all;">' + remaining + '</span></div></div>';
        stepsHtml += '<div class="step-item"><div class="step-number">5</div><div class="step-content">Complete sequence: <span style="font-family:var(--font-mono)"><span class="highlight-key">' + kwDedup + '</span>' + remaining + '</span></div></div>';
        stepsHtml += '</div>';

        container.querySelector('#pf-matrix-steps').innerHTML = stepsHtml;

        // Build matrix
        var matrixData = buildMatrix(keyword);
        var matrixHtml = '<div class="subsection-title">Final 5×5 Matrix</div>';
        matrixHtml += renderMatrix(matrixData, null, 'pf-main-matrix');
        matrixHtml += '<p class="text-muted text-sm text-center mt-1">Green-bordered cells are from the keyword. Indices shown as (row, col).</p>';

        container.querySelector('#pf-matrix-display').innerHTML = matrixHtml;

        // Animate cells
        var cells = container.querySelectorAll('#pf-main-matrix .matrix-cell');
        cells.forEach(function(cell, idx) {
            cell.style.opacity = '0';
            cell.style.transform = 'scale(0.5)';
            setTimeout(function() {
                cell.style.transition = 'all 0.3s ease';
                cell.style.opacity = '1';
                cell.style.transform = 'scale(1)';
            }, idx * 60);
        });

        progress.complete(SECTION_ID, 'playfair-matrix');
        updateSectionProgress();
    }

    container.querySelector('#btn-gen-matrix').addEventListener('click', generateMatrixUI);
    // Auto-generate on load
    setTimeout(generateMatrixUI, 300);

    // ---- C. PLAINTEXT PREPARATION ----
    function prepareTextUI() {
        var input = container.querySelector('#pf-prep-input').value.trim();
        if (!input) { alert('Please enter a plaintext message.'); return; }

        var original = input;
        var upper = input.toUpperCase().replace(/[^A-Z]/g, '');
        var afterJ = upper.replace(/J/g, 'I');
        var prepared = prepareText(input);

        var stepsHtml = '<div class="step-display">';
        stepsHtml += '<div class="step-item"><div class="step-number">1</div><div class="step-content">Original text: <span class="highlight-plain">' + utils.escapeHtml(original) + '</span></div></div>';
        stepsHtml += '<div class="step-item"><div class="step-number">2</div><div class="step-content">Uppercase, remove spaces/punctuation: <span class="highlight-plain">' + upper + '</span></div></div>';

        if (upper !== afterJ) {
            stepsHtml += '<div class="step-item"><div class="step-number">3</div><div class="step-content">Replace J with I: <span class="highlight-plain">' + afterJ + '</span></div></div>';
        } else {
            stepsHtml += '<div class="step-item"><div class="step-number">3</div><div class="step-content">Replace J with I: <span class="text-muted">No J found — no change.</span> <span class="highlight-plain">' + afterJ + '</span></div></div>';
        }

        // Show pair splitting explanation
        var splitExplanation = '';
        var fillerMap = {};
        prepared.fillers.forEach(function(f) { fillerMap[f.pair] = f; });

        prepared.digraphs.forEach(function(d, i) {
            if (fillerMap[i]) {
                var f = fillerMap[i];
                if (i === prepared.digraphs.length - 1 && f.pos === 1 && afterJ.length % 2 !== 0 && !fillerMap[i - 1]) {
                    // Could be trailing letter or double-letter; check
                }
                splitExplanation += '<span class="digraph-pair" style="border-color:var(--warning)">' + d[0] + '<span class="filler">' + d[1] + '</span></span> ';
            } else {
                splitExplanation += '<span class="digraph-pair">' + d + '</span> ';
            }
        });

        stepsHtml += '<div class="step-item"><div class="step-number">4</div><div class="step-content">Split into digraphs (insert <span class="highlight-step">X</span> between identical pairs or to pad):<br>';
        stepsHtml += '<div class="digraph-display mt-1" style="justify-content:flex-start">' + splitExplanation + '</div>';
        if (prepared.fillers.length > 0) {
            stepsHtml += '<p class="text-sm text-muted mt-1">Orange <span class="highlight-step">X</span> characters are fillers inserted by the algorithm.</p>';
        }
        stepsHtml += '</div></div>';

        stepsHtml += '<div class="step-item active-step"><div class="step-number">5</div><div class="step-content"><strong>Final digraph pairs:</strong><br>';
        stepsHtml += renderDigraphs(prepared.digraphs, prepared.fillers);
        stepsHtml += '<p class="text-sm mono mt-1">Pairs: <strong>' + prepared.digraphs.join(' ') + '</strong></p>';
        stepsHtml += '</div></div>';
        stepsHtml += '</div>';

        container.querySelector('#pf-prep-result').innerHTML = stepsHtml;

        progress.complete(SECTION_ID, 'playfair-preparation');
        updateSectionProgress();
    }

    container.querySelector('#btn-prepare').addEventListener('click', prepareTextUI);

    // Example buttons
    container.querySelectorAll('.pf-prep-example').forEach(function(btn) {
        btn.addEventListener('click', function() {
            container.querySelector('#pf-prep-input').value = this.dataset.text;
            prepareTextUI();
        });
    });

    // ---- D. ENCRYPTION ----
    function encryptUI() {
        var keyword = container.querySelector('#pf-enc-keyword').value.trim();
        var plaintext = container.querySelector('#pf-enc-plaintext').value.trim();
        if (!keyword || !plaintext) { alert('Please enter both a keyword and plaintext.'); return; }

        var matrixData = buildMatrix(keyword);
        var prepared = prepareText(plaintext);

        if (prepared.digraphs.length === 0) { alert('No valid text to encrypt.'); return; }

        var results = [];
        prepared.digraphs.forEach(function(d) {
            results.push(encryptDigraph(matrixData.matrix, d));
        });

        var ciphertext = results.map(function(r) { return r.output; }).join('');

        // Build result HTML
        var rhtml = '';

        // Show matrix
        rhtml += '<div class="subsection"><div class="subsection-title">Key Matrix</div>';
        rhtml += renderMatrix(matrixData, null, 'pf-enc-matrix');
        rhtml += '</div>';

        // Show prepared digraphs
        rhtml += '<div class="subsection"><div class="subsection-title">Prepared Digraphs</div>';
        rhtml += renderDigraphs(prepared.digraphs, prepared.fillers);
        rhtml += '</div>';

        // Show step-by-step for each digraph
        rhtml += '<div class="subsection"><div class="subsection-title">Step-by-Step Encryption</div>';
        rhtml += '<div class="step-display" id="pf-enc-steps">';
        results.forEach(function(r, i) {
            rhtml += '<div class="step-item" id="pf-enc-step-' + i + '">';
            rhtml += '<div class="step-number">' + (i + 1) + '</div>';
            rhtml += '<div class="step-content">';
            rhtml += '<div style="display:flex;align-items:center;gap:0.5rem;flex-wrap:wrap;margin-bottom:0.5rem;">';
            rhtml += '<span class="highlight-plain mono bold" style="font-size:1.1rem;">' + r.input + '</span>';
            rhtml += '<span style="color:var(--gray-400)">→</span>';
            rhtml += '<span class="highlight-cipher mono bold" style="font-size:1.1rem;">' + r.output + '</span>';
            rhtml += ruleBadge(r.rule);
            rhtml += '</div>';
            rhtml += '<p class="text-sm">' + ruleExplanation(r.rule, false) + '</p>';
            rhtml += '<p class="text-sm mono text-muted">';
            rhtml += '<span class="highlight-plain">' + r.input[0] + '</span> at (' + r.pos1.row + ',' + r.pos1.col + ') → <span class="highlight-cipher">' + r.output[0] + '</span> at (' + r.outPos1.row + ',' + r.outPos1.col + ') &nbsp;|&nbsp; ';
            rhtml += '<span class="highlight-plain">' + r.input[1] + '</span> at (' + r.pos2.row + ',' + r.pos2.col + ') → <span class="highlight-cipher">' + r.output[1] + '</span> at (' + r.outPos2.row + ',' + r.outPos2.col + ')';
            rhtml += '</p>';

            // Mini matrix with highlights
            var highlights = [
                { row: r.pos1.row, col: r.pos1.col, cls: 'highlight' },
                { row: r.pos2.row, col: r.pos2.col, cls: 'highlight-alt' },
                { row: r.outPos1.row, col: r.outPos1.col, cls: 'highlight' },
                { row: r.outPos2.row, col: r.outPos2.col, cls: 'highlight-alt' }
            ];
            rhtml += '<div class="collapsible"><div class="collapsible-header">Show matrix highlighting for ' + r.input + ' → ' + r.output + '</div>';
            rhtml += '<div class="collapsible-body">';
            rhtml += '<p class="text-sm text-muted mb-1"><span style="display:inline-block;width:12px;height:12px;background:var(--primary);border-radius:3px;vertical-align:middle;"></span> First letter &nbsp; <span style="display:inline-block;width:12px;height:12px;background:var(--warning);border-radius:3px;vertical-align:middle;"></span> Second letter</p>';
            rhtml += renderMatrix(matrixData, highlights, 'pf-enc-mini-' + i);
            rhtml += '</div></div>';

            rhtml += '</div></div>';
        });
        rhtml += '</div></div>';

        // Final result
        rhtml += '<div class="result-box success">';
        rhtml += '<div class="result-label">Ciphertext</div>';
        rhtml += '<span class="highlight-cipher" style="font-size:1.3rem;letter-spacing:2px;">' + ciphertext + '</span>';
        rhtml += '</div>';

        rhtml += '<div class="result-box info">';
        rhtml += '<div class="result-label">Encrypted Digraphs</div>';
        var encDigraphs = results.map(function(r) { return r.output; });
        rhtml += renderDigraphs(encDigraphs);
        rhtml += '</div>';

        container.querySelector('#pf-enc-result').innerHTML = rhtml;

        // Animate steps sequentially
        var steps = container.querySelectorAll('#pf-enc-steps .step-item');
        steps.forEach(function(step, idx) {
            step.style.opacity = '0';
            step.style.transform = 'translateY(10px)';
            setTimeout(function() {
                step.style.transition = 'all 0.4s ease';
                step.style.opacity = '1';
                step.style.transform = 'translateY(0)';
            }, idx * 200);
        });

        progress.complete(SECTION_ID, 'playfair-encrypt');
        updateSectionProgress();
    }

    container.querySelector('#btn-encrypt').addEventListener('click', encryptUI);

    // ---- E. DECRYPTION ----
    function decryptUI() {
        var keyword = container.querySelector('#pf-dec-keyword').value.trim();
        var ciphertext = container.querySelector('#pf-dec-ciphertext').value.trim();
        if (!keyword || !ciphertext) { alert('Please enter both a keyword and ciphertext.'); return; }

        var matrixData = buildMatrix(keyword);
        var clean = utils.cleanText(ciphertext).replace(/J/g, 'I');
        if (clean.length === 0) { alert('Ciphertext must contain letters.'); return; }
        if (clean.length % 2 !== 0) {
            clean += 'X'; // pad if odd
        }

        var digraphs = [];
        for (var i = 0; i < clean.length; i += 2) {
            digraphs.push(clean[i] + clean[i + 1]);
        }

        var results = [];
        digraphs.forEach(function(d) {
            results.push(decryptDigraph(matrixData.matrix, d));
        });

        var plaintext = results.map(function(r) { return r.output; }).join('');

        // Build result HTML
        var rhtml = '';

        // Show matrix
        rhtml += '<div class="subsection"><div class="subsection-title">Key Matrix</div>';
        rhtml += renderMatrix(matrixData, null, 'pf-dec-matrix');
        rhtml += '</div>';

        // Show ciphertext digraphs
        rhtml += '<div class="subsection"><div class="subsection-title">Ciphertext Digraphs</div>';
        rhtml += renderDigraphs(digraphs);
        rhtml += '</div>';

        // Step-by-step
        rhtml += '<div class="subsection"><div class="subsection-title">Step-by-Step Decryption</div>';
        rhtml += '<div class="step-display" id="pf-dec-steps">';
        results.forEach(function(r, i) {
            rhtml += '<div class="step-item" id="pf-dec-step-' + i + '">';
            rhtml += '<div class="step-number">' + (i + 1) + '</div>';
            rhtml += '<div class="step-content">';
            rhtml += '<div style="display:flex;align-items:center;gap:0.5rem;flex-wrap:wrap;margin-bottom:0.5rem;">';
            rhtml += '<span class="highlight-cipher mono bold" style="font-size:1.1rem;">' + r.input + '</span>';
            rhtml += '<span style="color:var(--gray-400)">→</span>';
            rhtml += '<span class="highlight-plain mono bold" style="font-size:1.1rem;">' + r.output + '</span>';
            rhtml += ruleBadge(r.rule);
            rhtml += '</div>';
            rhtml += '<p class="text-sm">' + ruleExplanation(r.rule, true) + '</p>';
            rhtml += '<p class="text-sm mono text-muted">';
            rhtml += '<span class="highlight-cipher">' + r.input[0] + '</span> at (' + r.pos1.row + ',' + r.pos1.col + ') → <span class="highlight-plain">' + r.output[0] + '</span> at (' + r.outPos1.row + ',' + r.outPos1.col + ') &nbsp;|&nbsp; ';
            rhtml += '<span class="highlight-cipher">' + r.input[1] + '</span> at (' + r.pos2.row + ',' + r.pos2.col + ') → <span class="highlight-plain">' + r.output[1] + '</span> at (' + r.outPos2.row + ',' + r.outPos2.col + ')';
            rhtml += '</p>';

            // Mini matrix with highlights
            var highlights = [
                { row: r.pos1.row, col: r.pos1.col, cls: 'highlight' },
                { row: r.pos2.row, col: r.pos2.col, cls: 'highlight-alt' },
                { row: r.outPos1.row, col: r.outPos1.col, cls: 'highlight' },
                { row: r.outPos2.row, col: r.outPos2.col, cls: 'highlight-alt' }
            ];
            rhtml += '<div class="collapsible"><div class="collapsible-header">Show matrix highlighting for ' + r.input + ' → ' + r.output + '</div>';
            rhtml += '<div class="collapsible-body">';
            rhtml += '<p class="text-sm text-muted mb-1"><span style="display:inline-block;width:12px;height:12px;background:var(--primary);border-radius:3px;vertical-align:middle;"></span> First letter &nbsp; <span style="display:inline-block;width:12px;height:12px;background:var(--warning);border-radius:3px;vertical-align:middle;"></span> Second letter</p>';
            rhtml += renderMatrix(matrixData, highlights, 'pf-dec-mini-' + i);
            rhtml += '</div></div>';

            rhtml += '</div></div>';
        });
        rhtml += '</div></div>';

        // Final result
        rhtml += '<div class="result-box success">';
        rhtml += '<div class="result-label">Decrypted Plaintext (raw)</div>';
        rhtml += '<span class="highlight-plain" style="font-size:1.3rem;letter-spacing:2px;">' + plaintext + '</span>';
        rhtml += '</div>';

        rhtml += '<div class="alert alert-warning">⚠️ The decrypted text may contain filler X characters that were inserted during encryption. For example, "<code>BALXLOON</code>" should be read as "<code>BALLOON</code>". Use context to remove filler X\'s.</div>';

        container.querySelector('#pf-dec-result').innerHTML = rhtml;

        // Animate steps
        var steps = container.querySelectorAll('#pf-dec-steps .step-item');
        steps.forEach(function(step, idx) {
            step.style.opacity = '0';
            step.style.transform = 'translateY(10px)';
            setTimeout(function() {
                step.style.transition = 'all 0.4s ease';
                step.style.opacity = '1';
                step.style.transform = 'translateY(0)';
            }, idx * 200);
        });

        progress.complete(SECTION_ID, 'playfair-decrypt');
        updateSectionProgress();
    }

    container.querySelector('#btn-decrypt').addEventListener('click', decryptUI);

    // ---- F. PRACTICE EXERCISES ----

    // Helper: show exercise feedback
    function showFeedback(exId, correct, message) {
        var fb = container.querySelector('#' + exId + '-feedback');
        var box = container.querySelector('#' + exId);
        fb.innerHTML = message;
        fb.className = 'exercise-feedback show ' + (correct ? 'correct-feedback' : 'incorrect-feedback');
        box.classList.remove('correct', 'incorrect');
        box.classList.add(correct ? 'correct' : 'incorrect');
    }

    // Exercise 1: Build Matrix first row
    container.querySelector('#btn-ex1-check').addEventListener('click', function() {
        var input = utils.cleanText(container.querySelector('#pf-ex1-input').value);
        var matrixData = buildMatrix('KEYWORD');
        var firstRow = matrixData.matrix[0].join('');
        if (input === firstRow) {
            showFeedback('pf-ex1', true, '✅ <strong>Correct!</strong> The first row of the KEYWORD matrix is <span class="highlight-key mono">' + firstRow + '</span>.<br><br>Full matrix:<br>' + renderMatrix(matrixData));
            progress.complete(SECTION_ID, 'playfair-exercise-1');
            updateSectionProgress();
        } else {
            showFeedback('pf-ex1', false, '❌ <strong>Not quite.</strong> You entered <span class="mono">' + (input || '(empty)') + '</span>. Try again! Remember: remove duplicate letters from KEYWORD, then fill with remaining alphabet (I/J combined).');
        }
    });
    container.querySelector('#btn-ex1-hint').addEventListener('click', function() {
        container.querySelector('#pf-ex1-hint').classList.toggle('show');
    });

    // Exercise 2: Prepare BALLOON
    container.querySelector('#btn-ex2-check').addEventListener('click', function() {
        var input = utils.cleanText(container.querySelector('#pf-ex2-input').value.replace(/\s+/g, ' ').trim());
        // Normalize: remove spaces and compare
        var userPairs = container.querySelector('#pf-ex2-input').value.toUpperCase().trim().split(/\s+/);
        var correct = prepareText('BALLOON');
        var correctStr = correct.digraphs.join(' ');
        if (userPairs.join(' ') === correctStr) {
            showFeedback('pf-ex2', true, '✅ <strong>Correct!</strong> BALLOON → <span class="mono highlight-step">' + correctStr + '</span><br><br>' +
                'Explanation: BA is fine, then LL has double letters so insert X → L<span class="highlight-step">X</span>, then LO, then ON.');
            progress.complete(SECTION_ID, 'playfair-exercise-2');
            updateSectionProgress();
        } else {
            showFeedback('pf-ex2', false, '❌ <strong>Not quite.</strong> You entered: <span class="mono">' + userPairs.join(' ') + '</span>. The correct answer is <span class="mono">' + correctStr + '</span>. Remember to insert X between identical letter pairs!');
        }
    });
    container.querySelector('#btn-ex2-hint').addEventListener('click', function() {
        container.querySelector('#pf-ex2-hint').classList.toggle('show');
    });

    // Exercise 3: Encrypt AR with MONARCHY
    container.querySelector('#btn-ex3-check').addEventListener('click', function() {
        var input = utils.cleanText(container.querySelector('#pf-ex3-input').value);
        var matrixData = buildMatrix('MONARCHY');
        var result = encryptDigraph(matrixData.matrix, 'AR');
        if (input === result.output) {
            showFeedback('pf-ex3', true, '✅ <strong>Correct!</strong> AR → <span class="highlight-cipher mono">' + result.output + '</span><br><br>' +
                ruleBadge(result.rule) + ' ' + ruleExplanation(result.rule, false) + '<br>' +
                '<span class="text-sm mono">A at (' + result.pos1.row + ',' + result.pos1.col + ') → ' + result.output[0] + ' at (' + result.outPos1.row + ',' + result.outPos1.col + '), R at (' + result.pos2.row + ',' + result.pos2.col + ') → ' + result.output[1] + ' at (' + result.outPos2.row + ',' + result.outPos2.col + ')</span><br>' +
                renderMatrix(matrixData, [
                    { row: result.pos1.row, col: result.pos1.col, cls: 'highlight' },
                    { row: result.pos2.row, col: result.pos2.col, cls: 'highlight-alt' }
                ]));
            progress.complete(SECTION_ID, 'playfair-exercise-3');
            updateSectionProgress();
        } else {
            showFeedback('pf-ex3', false, '❌ <strong>Not quite.</strong> You entered <span class="mono">' + (input || '(empty)') + '</span>. Find A and R in the MONARCHY matrix and check which rule applies.');
        }
    });
    container.querySelector('#btn-ex3-hint').addEventListener('click', function() {
        container.querySelector('#pf-ex3-hint').classList.toggle('show');
    });

    // Exercise 4: Encrypt HS with MONARCHY
    container.querySelector('#btn-ex4-check').addEventListener('click', function() {
        var input = utils.cleanText(container.querySelector('#pf-ex4-input').value);
        var matrixData = buildMatrix('MONARCHY');
        var result = encryptDigraph(matrixData.matrix, 'HS');
        if (input === result.output) {
            showFeedback('pf-ex4', true, '✅ <strong>Correct!</strong> HS → <span class="highlight-cipher mono">' + result.output + '</span><br><br>' +
                ruleBadge(result.rule) + ' ' + ruleExplanation(result.rule, false) + '<br>' +
                '<span class="text-sm mono">H at (' + result.pos1.row + ',' + result.pos1.col + ') → ' + result.output[0] + ' at (' + result.outPos1.row + ',' + result.outPos1.col + '), S at (' + result.pos2.row + ',' + result.pos2.col + ') → ' + result.output[1] + ' at (' + result.outPos2.row + ',' + result.outPos2.col + ')</span><br>' +
                renderMatrix(matrixData, [
                    { row: result.pos1.row, col: result.pos1.col, cls: 'highlight' },
                    { row: result.pos2.row, col: result.pos2.col, cls: 'highlight-alt' }
                ]));
            progress.complete(SECTION_ID, 'playfair-exercise-4');
            updateSectionProgress();
        } else {
            showFeedback('pf-ex4', false, '❌ <strong>Not quite.</strong> You entered <span class="mono">' + (input || '(empty)') + '</span>. Find H and S in the MONARCHY matrix — they should be in different rows and columns (rectangle rule).');
        }
    });
    container.querySelector('#btn-ex4-hint').addEventListener('click', function() {
        container.querySelector('#pf-ex4-hint').classList.toggle('show');
    });

    // Exercise 5: Full message INSTRUMENTS with MONARCHY
    container.querySelector('#btn-ex5-check').addEventListener('click', function() {
        var input = utils.cleanText(container.querySelector('#pf-ex5-input').value);
        var matrixData = buildMatrix('MONARCHY');
        var prepared = prepareText('INSTRUMENTS');
        var results = [];
        prepared.digraphs.forEach(function(d) {
            results.push(encryptDigraph(matrixData.matrix, d));
        });
        var correctCipher = results.map(function(r) { return r.output; }).join('');

        if (input === correctCipher) {
            var detailHtml = '✅ <strong>Correct!</strong> INSTRUMENTS → <span class="highlight-cipher mono">' + correctCipher + '</span><br><br>';
            detailHtml += '<strong>Preparation:</strong> ' + prepared.digraphs.join(' ') + '<br><br>';
            detailHtml += '<strong>Encryption steps:</strong><br>';
            results.forEach(function(r, i) {
                detailHtml += '<span class="text-sm">' + (i + 1) + '. ' + ruleBadge(r.rule) + ' <span class="highlight-plain mono">' + r.input + '</span> → <span class="highlight-cipher mono">' + r.output + '</span></span><br>';
            });
            showFeedback('pf-ex5', true, detailHtml);
            progress.complete(SECTION_ID, 'playfair-exercise-5');
            updateSectionProgress();
        } else {
            var hintDetail = '❌ <strong>Not quite.</strong> You entered <span class="mono">' + (input || '(empty)') + '</span>.<br>';
            hintDetail += 'Preparation: ' + prepared.digraphs.join(' ') + ' (' + prepared.digraphs.length + ' pairs)<br>';
            hintDetail += 'Expected ciphertext: <span class="highlight-cipher mono">' + correctCipher + '</span>';
            showFeedback('pf-ex5', false, hintDetail);
        }
    });
    container.querySelector('#btn-ex5-hint').addEventListener('click', function() {
        container.querySelector('#pf-ex5-hint').classList.toggle('show');
    });

    // ---- Restore exercise completion states ----
    for (var ei = 1; ei <= 5; ei++) {
        if (progress.isComplete(SECTION_ID, 'playfair-exercise-' + ei)) {
            var exBox = container.querySelector('#pf-ex' + ei);
            if (exBox) exBox.classList.add('correct');
        }
    }

    // ---- Initial progress update ----
    updateSectionProgress();
});
