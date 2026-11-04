/* ===== Monoalphabetic Substitution Cipher Module ===== */
CipherApp.registerModule('monoalphabetic', function(container) {
    'use strict';

    var utils = CipherApp.utils;
    var progress = CipherApp.progress;
    var SECTION = 'monoalphabetic';
    var ALPHA = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    var EXAMPLE_KEY = 'QWERTYUIOPASDFGHJKLZXCVBNM';

    // ---- Pre-loaded frequency analysis example ----
    var FA_PLAIN = 'THE QUICK BROWN FOX JUMPS OVER THE LAZY DOG AND THE BRAVE KNIGHT DEFENDS THE ANCIENT CASTLE FROM THE SHADOW';
    var FA_KEY = 'XYMHTBZWCSADEJOGFVNRUPQKLG'; // a fixed random key for the pre-loaded example
    // Generate it deterministically so we always get the same ciphertext
    // Actually let's compute the key properly - ensure all 26 unique letters
    // Use: A->X, B->Y, C->M, D->H, E->T, F->B, G->Z, H->W, I->C, J->S, K->A, L->D,
    //      M->E, N->J, O->G, P->F, Q->V, R->N, S->R, T->U, U->P, V->Q, W->K, X->L, Y->I, Z->O
    // Verify uniqueness: X Y M H T B Z W C S A D E J G F V N R U P Q K L I O — 26 unique ✓

    function monoEncrypt(plain, key) {
        var cleaned = utils.cleanText(plain);
        var result = '';
        for (var i = 0; i < cleaned.length; i++) {
            var idx = utils.letterToNum(cleaned[i]);
            result += key[idx];
        }
        return result;
    }

    function monoDecrypt(cipher, key) {
        var cleaned = utils.cleanText(cipher);
        var result = '';
        for (var i = 0; i < cleaned.length; i++) {
            var idx = key.indexOf(cleaned[i]);
            if (idx >= 0) result += ALPHA[idx];
            else result += '?';
        }
        return result;
    }

    function monoEncryptPreserveSpaces(plain, key) {
        var upper = plain.toUpperCase();
        var result = '';
        for (var i = 0; i < upper.length; i++) {
            var ch = upper[i];
            if (ch >= 'A' && ch <= 'Z') {
                result += key[ch.charCodeAt(0) - 65];
            } else {
                result += ch;
            }
        }
        return result;
    }

    var FA_CIPHER = monoEncrypt(FA_PLAIN, FA_KEY);

    // ---- Exercise 5: longer ciphertext for frequency analysis ----
    var EX5_PLAIN = 'SECRETS HIDDEN IN THE SHADOWS ARE OFTEN THE MOST DANGEROUS ONES TO REVEAL';
    var EX5_KEY = FA_KEY; // reuse the same key
    var EX5_CIPHER = monoEncrypt(EX5_PLAIN, EX5_KEY);

    // ========================================
    // BUILD HTML
    // ========================================
    var html = '<div class="section-content">';

    // Title
    html += '<div class="card"><div class="card-header" style="background:var(--mono-color)">';
    html += '<h3>🔤 Monoalphabetic Substitution Cipher</h3></div>';
    html += '<div class="card-body">';
    html += '<p>The monoalphabetic substitution cipher replaces each letter in the plaintext with a corresponding letter from a <span class="highlight-key">scrambled alphabet</span>. Unlike the Caesar cipher, which uses a simple shift, monoalphabetic ciphers use an arbitrary permutation of the alphabet as the key.</p>';
    html += '</div></div>';

    // ==== TAB NAVIGATION ====
    html += '<div class="tab-container">';
    html += '<div class="tab-nav">';
    html += '<button class="tab-btn active" data-tab="mono-tab-fund">📖 Fundamentals</button>';
    html += '<button class="tab-btn" data-tab="mono-tab-alpha">🔤 Substitution Alphabet</button>';
    html += '<button class="tab-btn" data-tab="mono-tab-freq">📊 Frequency Analysis</button>';
    html += '<button class="tab-btn" data-tab="mono-tab-exercises">✏️ Exercises</button>';
    html += '</div>';

    // ====================================================
    // TAB A: FUNDAMENTALS
    // ====================================================
    html += '<div id="mono-tab-fund" class="tab-content active">';

    // What is it
    html += '<div class="subsection"><div class="subsection-title">What is a Monoalphabetic Substitution Cipher?</div>';
    html += '<p>A monoalphabetic substitution cipher encrypts text by replacing each letter of the alphabet with a fixed corresponding letter. The "key" is a complete scrambled alphabet — a permutation of all 26 letters. Each plaintext letter always maps to the <strong>same</strong> ciphertext letter throughout the entire message.</p>';

    html += '<div class="alert alert-info">💡 <strong>Key Insight:</strong> "Mono" means "one." In a monoalphabetic cipher, there is exactly <strong>one</strong> fixed substitution alphabet used for the entire message. Each letter is consistently replaced by the same substitute.</div>';
    html += '</div>';

    // How it works
    html += '<div class="subsection"><div class="subsection-title">How the Key Works</div>';
    html += '<p>The key is a scrambled version of the standard alphabet. The position of each letter in the key determines the substitution mapping:</p>';

    html += '<div class="mapping-table">';
    html += '<div class="mapping-row"><div class="mapping-row-label" style="color:var(--plain-color)">Plain:</div>';
    for (var i = 0; i < 26; i++) {
        html += '<div class="alphabet-cell plain-cell" style="width:30px;height:30px;font-size:0.75rem">' + ALPHA[i] + '</div>';
    }
    html += '</div>';
    html += '<div class="mapping-row"><div class="mapping-row-label">&nbsp;</div>';
    for (var i = 0; i < 26; i++) {
        html += '<div style="width:30px;text-align:center;color:var(--gray-400);font-size:0.75rem">↓</div>';
    }
    html += '</div>';
    html += '<div class="mapping-row"><div class="mapping-row-label" style="color:var(--cipher-color)">Cipher:</div>';
    for (var i = 0; i < 26; i++) {
        html += '<div class="alphabet-cell cipher-cell" style="width:30px;height:30px;font-size:0.75rem">' + EXAMPLE_KEY[i] + '</div>';
    }
    html += '</div>';
    html += '</div>';

    html += '<p style="margin-top:1rem">With this key, <span class="highlight-plain">A</span> → <span class="highlight-cipher">Q</span>, <span class="highlight-plain">B</span> → <span class="highlight-cipher">W</span>, <span class="highlight-plain">C</span> → <span class="highlight-cipher">E</span>, and so on.</p>';
    html += '</div>';

    // Letter-by-letter example
    html += '<div class="subsection"><div class="subsection-title">Letter-by-Letter Example</div>';
    html += '<p>Let\'s encrypt the word <span class="highlight-plain">HELLO</span> using the key <span class="highlight-key">QWERTYUIOPASDFGHJKLZXCVBNM</span>:</p>';

    var helloPlain = 'HELLO';
    var helloCipher = monoEncrypt(helloPlain, EXAMPLE_KEY);

    html += '<div class="step-display">';
    for (var i = 0; i < helloPlain.length; i++) {
        var pChar = helloPlain[i];
        var pIdx = utils.letterToNum(pChar);
        var cChar = EXAMPLE_KEY[pIdx];
        html += '<div class="step-item"><div class="step-number">' + (i + 1) + '</div>';
        html += '<div class="step-content">';
        html += '<span class="highlight-plain">' + pChar + '</span> is letter #' + (pIdx + 1) + ' in the alphabet → position ' + (pIdx + 1) + ' in the key is <span class="highlight-cipher">' + cChar + '</span>';
        html += '</div></div>';
    }
    html += '</div>';

    html += '<div class="result-box info">';
    html += '<div class="result-label">Result</div>';
    html += '<span class="highlight-plain">HELLO</span> → <span class="highlight-cipher">' + helloCipher + '</span>';
    html += '</div>';
    html += '</div>';

    // Caesar vs Monoalphabetic
    html += '<div class="subsection"><div class="subsection-title">Caesar vs. Monoalphabetic</div>';
    html += '<div class="table-responsive"><table class="styled-table comparison-table">';
    html += '<thead><tr><th>Feature</th><th>Caesar Cipher</th><th>Monoalphabetic Cipher</th></tr></thead>';
    html += '<tbody>';
    html += '<tr><td>Key Type</td><td>Single number (0–25)</td><td>Full alphabet permutation</td></tr>';
    html += '<tr><td>Key Space</td><td>26 possible keys</td><td>26! ≈ 4×10²⁶ keys</td></tr>';
    html += '<tr><td>Pattern</td><td>Regular shift</td><td>Arbitrary permutation</td></tr>';
    html += '<tr><td>Brute Force</td><td>Trivially easy (try 26 keys)</td><td>Computationally impossible</td></tr>';
    html += '<tr><td>Vulnerability</td><td>Brute force + frequency analysis</td><td>Frequency analysis</td></tr>';
    html += '<tr><td>Relationship</td><td colspan="2" class="text-center">Caesar is a <em>special case</em> of monoalphabetic (only 26 of the 26! possible keys)</td></tr>';
    html += '</tbody></table></div>';
    html += '</div>';

    // Key space
    html += '<div class="subsection"><div class="subsection-title">Key Space: Why Brute Force Fails</div>';
    html += '<p>The number of possible keys for a monoalphabetic cipher is <strong>26!</strong> (26 factorial) — the number of ways to arrange 26 letters:</p>';
    html += '<div class="formula">26! = 26 × 25 × 24 × ... × 2 × 1 ≈ <span class="formula-var key">4.03 × 10²⁶</span></div>';
    html += '<p>That\'s <strong>403,291,461,126,605,635,584,000,000</strong> possible keys!</p>';
    html += '<div class="alert alert-warning">⚠️ Even if a computer could test <strong>1 billion keys per second</strong>, it would take approximately <strong>12.8 billion years</strong> to try all possible keys — nearly the age of the universe! Brute force is completely impractical.</div>';

    html += '<div class="collapsible"><div class="collapsible-header">🧮 Why exactly 26! ?</div>';
    html += '<div class="collapsible-body">';
    html += '<p>Think of building the cipher alphabet position by position:</p>';
    html += '<div class="step-display">';
    html += '<div class="step-item"><div class="step-number">1</div><div class="step-content">For position A, choose any of <strong>26</strong> letters</div></div>';
    html += '<div class="step-item"><div class="step-number">2</div><div class="step-content">For position B, choose any of the remaining <strong>25</strong> letters</div></div>';
    html += '<div class="step-item"><div class="step-number">3</div><div class="step-content">For position C, choose any of the remaining <strong>24</strong> letters</div></div>';
    html += '<div class="step-item"><div class="step-number">⋮</div><div class="step-content">Continue until...</div></div>';
    html += '<div class="step-item"><div class="step-number">26</div><div class="step-content">For position Z, only <strong>1</strong> letter remains</div></div>';
    html += '</div>';
    html += '<p>Total: 26 × 25 × 24 × ... × 1 = 26!</p>';
    html += '</div></div>';

    html += '<p style="margin-top:1rem">However, despite the enormous key space, monoalphabetic ciphers have a critical weakness: <strong>they preserve letter frequency patterns</strong>. This makes them vulnerable to <em>frequency analysis</em> — the star technique you\'ll learn in the Frequency Analysis tab!</p>';
    html += '</div>';

    // Mark fundamentals complete button
    html += '<div style="text-align:center;margin-top:1.5rem">';
    html += '<button class="btn btn-success" id="mono-fund-done-btn">✅ I understand the fundamentals — Mark Complete</button>';
    html += '</div>';

    html += '</div>'; // end tab-fund

    // ====================================================
    // TAB B: INTERACTIVE SUBSTITUTION ALPHABET
    // ====================================================
    html += '<div id="mono-tab-alpha" class="tab-content">';

    html += '<div class="card"><div class="card-header" style="background:var(--mono-color)"><h3>Interactive Substitution Alphabet Builder</h3></div>';
    html += '<div class="card-body">';
    html += '<p>Build your own substitution alphabet! Click any cell in the <span class="highlight-cipher">cipher row</span> to change its letter. Each letter must appear exactly once.</p>';

    // Control buttons
    html += '<div class="btn-group" style="margin-bottom:1rem">';
    html += '<button class="btn btn-primary btn-sm" id="mono-alpha-random">🎲 Generate Random</button>';
    html += '<button class="btn btn-warning btn-sm" id="mono-alpha-example">📋 Use Example (QWERTY…)</button>';
    html += '<button class="btn btn-secondary btn-sm" id="mono-alpha-reset">↺ Reset to ABC…</button>';
    html += '</div>';

    // Alphabet mapping display
    html += '<div class="mapping-table" id="mono-alpha-mapping">';

    // Plain row
    html += '<div class="mapping-row"><div class="mapping-row-label" style="color:var(--plain-color)">Plain:</div>';
    for (var i = 0; i < 26; i++) {
        html += '<div class="alphabet-cell plain-cell" style="width:32px;height:32px;font-size:0.8rem">' + ALPHA[i] + '</div>';
    }
    html += '</div>';

    // Arrows
    html += '<div class="mapping-row"><div class="mapping-row-label">&nbsp;</div>';
    for (var i = 0; i < 26; i++) {
        html += '<div id="mono-arrow-' + i + '" style="width:32px;text-align:center;color:var(--gray-400);font-size:0.75rem">↓</div>';
    }
    html += '</div>';

    // Cipher row (editable)
    html += '<div class="mapping-row"><div class="mapping-row-label" style="color:var(--cipher-color)">Cipher:</div>';
    for (var i = 0; i < 26; i++) {
        html += '<div class="alphabet-cell cipher-cell editable" id="mono-c-' + i + '" data-index="' + i + '" tabindex="0" style="width:32px;height:32px;font-size:0.8rem">' + ALPHA[i] + '</div>';
    }
    html += '</div>';
    html += '</div>';

    // Validation message
    html += '<div id="mono-alpha-validation" class="alert alert-info" style="margin-top:0.75rem">✅ Valid alphabet — all 26 letters are unique.</div>';

    html += '</div></div>'; // end card

    // Encrypt / Decrypt area
    html += '<div class="grid-2col" style="margin-top:1.5rem">';

    // Encrypt
    html += '<div class="card"><div class="card-header" style="background:var(--plain-color)"><h3>🔒 Encrypt</h3></div>';
    html += '<div class="card-body">';
    html += '<div class="input-group"><label>Plaintext</label><textarea id="mono-enc-input" placeholder="Enter plaintext to encrypt...">HELLO WORLD</textarea></div>';
    html += '<button class="btn btn-primary" id="mono-enc-btn">Encrypt →</button>';
    html += '<div id="mono-enc-result" class="result-box info" style="display:none"></div>';
    html += '<div id="mono-enc-steps" style="display:none"></div>';
    html += '</div></div>';

    // Decrypt
    html += '<div class="card"><div class="card-header" style="background:var(--cipher-color)"><h3>🔓 Decrypt</h3></div>';
    html += '<div class="card-body">';
    html += '<div class="input-group"><label>Ciphertext</label><textarea id="mono-dec-input" placeholder="Enter ciphertext to decrypt..."></textarea></div>';
    html += '<button class="btn btn-danger" id="mono-dec-btn">← Decrypt</button>';
    html += '<div id="mono-dec-result" class="result-box info" style="display:none"></div>';
    html += '<div id="mono-dec-steps" style="display:none"></div>';
    html += '</div></div>';

    html += '</div>'; // end grid

    html += '</div>'; // end tab-alpha

    // ====================================================
    // TAB C: FREQUENCY ANALYSIS LABORATORY
    // ====================================================
    html += '<div id="mono-tab-freq" class="tab-content">';

    // Explanation card
    html += '<div class="card"><div class="card-header" style="background:var(--danger)"><h3>📊 Frequency Analysis — The Key to Breaking Monoalphabetic Ciphers</h3></div>';
    html += '<div class="card-body">';
    html += '<p><strong>Frequency analysis</strong> exploits the fact that in any language, certain letters appear more frequently than others. Because a monoalphabetic cipher replaces each letter consistently, the frequency patterns of the plaintext are <em>preserved</em> in the ciphertext — just with different letter labels.</p>';

    html += '<div class="alert alert-success">🎯 <strong>The Technique:</strong> Count how often each letter appears in the ciphertext, then match the most frequent ciphertext letters to the most frequent English letters (E, T, A, O, I, N, S, H, R…). Combine this with bigram analysis and contextual guessing to reconstruct the key.</div>';

    // English frequency table
    html += '<div class="subsection"><div class="subsection-title">Standard English Letter Frequencies</div>';
    html += '<div class="table-responsive"><table class="styled-table">';
    html += '<thead><tr><th>Letter</th>';
    var topLetters = ['E','T','A','O','I','N','S','H','R','D','L','U'];
    for (var i = 0; i < topLetters.length; i++) {
        html += '<th>' + topLetters[i] + '</th>';
    }
    html += '</tr></thead><tbody><tr><td><strong>Freq %</strong></td>';
    var topFreqs = [12.7, 9.1, 8.2, 7.5, 7.0, 6.7, 6.3, 6.1, 6.0, 4.3, 4.0, 2.8];
    for (var i = 0; i < topFreqs.length; i++) {
        html += '<td class="mono">' + topFreqs[i] + '%</td>';
    }
    html += '</tr></tbody></table></div>';
    html += '</div>';

    // Common bigrams
    html += '<div class="subsection"><div class="subsection-title">Common English Bigrams</div>';
    html += '<p>Two-letter combinations that appear frequently in English text:</p>';
    html += '<div style="display:flex;flex-wrap:wrap;gap:6px">';
    var bigrams = ['TH','HE','IN','ER','AN','RE','ON','AT','EN','ND'];
    for (var i = 0; i < bigrams.length; i++) {
        html += '<span class="badge" style="font-size:0.85rem;padding:0.3rem 0.6rem;background:var(--mono-color)">' + bigrams[i] + '</span>';
    }
    html += '</div>';
    html += '</div>';

    // Why it works
    html += '<div class="subsection"><div class="subsection-title">Why Frequency Analysis Works</div>';
    html += '<p>In a monoalphabetic cipher, if <span class="highlight-plain">E</span> always maps to <span class="highlight-cipher">X</span>, then every occurrence of E becomes X. Since E is the most common letter in English (~12.7%), X will be the most common letter in the ciphertext. By matching frequencies, we can deduce the mapping!</p>';
    html += '</div>';

    html += '</div></div>'; // end explanation card

    // ---- Interactive Tool ----
    html += '<div class="card" style="margin-top:1.5rem"><div class="card-header" style="background:var(--danger)"><h3>🔬 Interactive Frequency Analysis Lab</h3></div>';
    html += '<div class="card-body">';

    // Input area
    html += '<div class="input-group"><label>Enter or paste ciphertext to analyze:</label>';
    html += '<textarea id="mono-freq-input" rows="5" placeholder="Paste your ciphertext here...">' + FA_CIPHER + '</textarea></div>';

    html += '<div class="btn-group">';
    html += '<button class="btn btn-danger" id="mono-freq-analyze-btn">📊 Analyze Frequencies</button>';
    html += '<button class="btn btn-warning btn-sm" id="mono-freq-load-example">Load Practice Example</button>';
    html += '</div>';

    // Analysis results (initially hidden)
    html += '<div id="mono-freq-results" style="display:none;margin-top:1.5rem">';

    // Frequency chart
    html += '<div class="subsection"><div class="subsection-title">Letter Frequency Chart</div>';
    html += '<p class="text-sm text-muted">Colored bars = ciphertext frequencies | Gray bars = standard English frequencies</p>';
    html += '<div class="chart-container" id="mono-freq-chart"></div>';
    html += '<div class="chart-labels" id="mono-freq-labels"></div>';
    html += '</div>';

    // Frequency table
    html += '<div class="subsection"><div class="subsection-title">Frequency Table</div>';
    html += '<div id="mono-freq-table" class="table-responsive"></div>';
    html += '</div>';

    // Most common letters
    html += '<div class="subsection"><div class="subsection-title">Most Common Letters in Ciphertext</div>';
    html += '<div id="mono-freq-ranking"></div>';
    html += '</div>';

    // Bigram analysis
    html += '<div class="subsection"><div class="subsection-title">Bigram Analysis</div>';
    html += '<div id="mono-freq-bigrams"></div>';
    html += '</div>';

    // Interactive Mapping Workspace
    html += '<div class="subsection" style="border-left-color:var(--danger)"><div class="subsection-title">🧩 Interactive Mapping Workspace</div>';
    html += '<p>Assign plaintext guesses to ciphertext letters. Partially decrypted text updates live below.</p>';

    html += '<div class="btn-group" style="margin-bottom:1rem">';
    html += '<button class="btn btn-warning btn-sm" id="mono-freq-auto-suggest">💡 Auto-Suggest (by frequency)</button>';
    html += '<button class="btn btn-secondary btn-sm" id="mono-freq-clear-mappings">🗑️ Clear All Mappings</button>';
    html += '</div>';

    // Mapping inputs
    html += '<div id="mono-freq-mapping-grid" style="display:grid;grid-template-columns:repeat(auto-fill,minmax(60px,1fr));gap:6px;margin:1rem 0"></div>';

    // Mapping validation/conflict
    html += '<div id="mono-freq-mapping-status" class="alert alert-info" style="display:none"></div>';

    // Partially decrypted text
    html += '<div class="subsection-title" style="margin-top:1rem">Partially Decrypted Text</div>';
    html += '<p class="text-sm text-muted">Assigned letters appear as <strong style="color:var(--success)">lowercase green</strong>. Unresolved letters remain as <strong style="color:var(--cipher-color)">UPPERCASE red</strong>.</p>';
    html += '<div id="mono-freq-partial" class="result-box" style="font-size:1.1rem;letter-spacing:1px;line-height:2;min-height:60px"></div>';

    html += '</div>'; // end mapping workspace subsection

    html += '</div>'; // end freq-results

    html += '</div></div>'; // end interactive tool card

    html += '</div>'; // end tab-freq

    // ====================================================
    // TAB D: PRACTICE EXERCISES
    // ====================================================
    html += '<div id="mono-tab-exercises" class="tab-content">';
    html += '<h3 style="margin-bottom:1rem">✏️ Practice Exercises</h3>';

    // Exercise 1: Encrypt with Key
    html += buildExerciseHtml(1, 'easy', 'Encrypt with Key',
        'Using the cipher alphabet <span class="highlight-key">QWERTYUIOPASDFGHJKLZXCVBNM</span>, encrypt the plaintext <span class="highlight-plain">HELLO</span>.',
        'Type the ciphertext',
        'H→I, E→T, L→S, L→S, O→G. Look up each plaintext letter\'s position and find the corresponding cipher letter.',
        'mono-exercise-1');

    // Exercise 2: Decrypt with Key
    html += buildExerciseHtml(2, 'easy', 'Decrypt with Key',
        'Using the same cipher alphabet <span class="highlight-key">QWERTYUIOPASDFGHJKLZXCVBNM</span>, decrypt the ciphertext <span class="highlight-cipher">JXHER</span>.',
        'Type the plaintext',
        'Find each ciphertext letter in the cipher alphabet, then look at which position it\'s in. J is at position 16 (P), X is at position 21 (U), H is at position 8 (H)... wait, let me recalculate: J→P (J is position 10 in key → plain O)... Actually: find J in QWERTYUIOPASDFGHJKLZXCVBNM — it\'s at index 9 → plain letter is J? No — find where J appears: Q(0)W(1)E(2)R(3)T(4)Y(5)U(6)I(7)O(8)P(9) — P is at index 9. J is at index... A(10)S(11)D(12)F(13)G(14)H(15)J(16) — so J is at index 16, which maps to plain Q. Hmm, let\'s use the reverse lookup properly.',
        'mono-exercise-2');

    // Exercise 3: Missing Mapping
    html += buildExerciseHtml(3, 'medium', 'Missing Letters in Cipher Alphabet',
        'The cipher alphabet is: <code>Q_ER_YUIOPASDFGHJKLZXCVBNM</code>. Two letters are missing at positions for <span class="highlight-plain">B</span> and <span class="highlight-plain">E</span>. What are the missing letters? (Enter them as two letters, e.g., "WT")',
        'Enter the two missing letters',
        'The full alphabet must contain all 26 letters exactly once. Compare with the known example: QWERTYUIOPASDFGHJKLZXCVBNM. Position 2 (B) should be W, position 5 (E) should be T.',
        'mono-exercise-3');

    // Exercise 4: Reconstruct Alphabet
    html += buildExerciseHtml(4, 'medium', 'Identify the Pattern',
        'If a cipher has the mappings A→M, B→N, C→O, D→P, E→Q... what type of cipher is this, and what is the key number?<br><em>(Answer format: the shift number, e.g., "12")</em>',
        'Enter the shift value',
        'Check if the shifts are consistent: A(0)→M(12) = shift 12, B(1)→N(13) = shift 12, C(2)→O(14) = shift 12. If all shifts are the same, it\'s a Caesar cipher!',
        'mono-exercise-4');

    // Exercise 5: Frequency Analysis
    html += '<div class="exercise-box" id="mono-ex5-box">';
    html += '<span class="exercise-badge hard">Hard</span>';
    html += '<div class="exercise-question">Exercise 5: Frequency Analysis Challenge</div>';
    html += '<p>The following ciphertext was encrypted with a monoalphabetic substitution cipher. Use frequency analysis to identify at least 5 correct letter mappings.</p>';
    html += '<div class="result-box" style="margin:0.75rem 0;letter-spacing:1px">' + EX5_CIPHER + '</div>';
    html += '<p class="text-sm text-muted">Hint: Count the letter frequencies and compare with standard English frequencies (E≈12.7%, T≈9.1%, A≈8.2%…)</p>';

    // Provide 5 mapping inputs
    html += '<div style="display:grid;grid-template-columns:repeat(5,1fr);gap:8px;margin:1rem 0">';
    for (var m = 0; m < 5; m++) {
        html += '<div style="text-align:center">';
        html += '<label class="text-sm" style="display:block;margin-bottom:4px">Mapping ' + (m+1) + '</label>';
        html += '<div style="display:flex;gap:4px;align-items:center;justify-content:center">';
        html += '<input type="text" maxlength="1" class="mono-ex5-cipher" id="mono-ex5-c' + m + '" style="width:32px;height:32px;text-align:center;font-family:var(--font-mono);font-weight:700;border:2px solid var(--cipher-color);border-radius:4px;color:var(--cipher-color);text-transform:uppercase" placeholder="?">';
        html += '<span>→</span>';
        html += '<input type="text" maxlength="1" class="mono-ex5-plain" id="mono-ex5-p' + m + '" style="width:32px;height:32px;text-align:center;font-family:var(--font-mono);font-weight:700;border:2px solid var(--plain-color);border-radius:4px;color:var(--plain-color);text-transform:uppercase" placeholder="?">';
        html += '</div></div>';
    }
    html += '</div>';

    html += '<div class="btn-group">';
    html += '<button class="btn btn-primary btn-sm" id="mono-ex5-check">Check Mappings</button>';
    html += '<button class="btn btn-secondary btn-sm" id="mono-ex5-hint">💡 Hint</button>';
    html += '</div>';
    html += '<div class="exercise-hint" id="mono-ex5-hint-text">Count each letter in the ciphertext. The most frequent ciphertext letter likely maps to E. Look at the ciphertext: which letters appear most often? Match them to E, T, A, O, I, N in order.</div>';
    html += '<div class="exercise-feedback" id="mono-ex5-feedback"></div>';
    html += '</div>';

    html += '</div>'; // end tab-exercises

    html += '</div>'; // end tab-container
    html += '</div>'; // end section-content

    // Set HTML
    container.innerHTML = html;

    // ========================================
    // HELPER: Build exercise HTML
    // ========================================
    function buildExerciseHtml(num, difficulty, title, question, placeholder, hint, taskId) {
        var h = '<div class="exercise-box" id="mono-ex' + num + '-box">';
        h += '<span class="exercise-badge ' + difficulty + '">' + difficulty.charAt(0).toUpperCase() + difficulty.slice(1) + '</span>';
        h += '<div class="exercise-question">Exercise ' + num + ': ' + title + '</div>';
        h += '<p>' + question + '</p>';
        h += '<div class="input-group"><input type="text" id="mono-ex' + num + '-input" placeholder="' + placeholder + '" style="font-family:var(--font-mono);text-transform:uppercase"></div>';
        h += '<div class="btn-group">';
        h += '<button class="btn btn-primary btn-sm" id="mono-ex' + num + '-check">Check Answer</button>';
        h += '<button class="btn btn-secondary btn-sm" id="mono-ex' + num + '-hint-btn">💡 Show Hint</button>';
        h += '</div>';
        h += '<div class="exercise-hint" id="mono-ex' + num + '-hint">' + hint + '</div>';
        h += '<div class="exercise-feedback" id="mono-ex' + num + '-feedback"></div>';
        h += '</div>';
        return h;
    }

    // ========================================
    // EVENT LISTENERS
    // ========================================

    // ---- Tab switching ----
    container.querySelectorAll('.tab-btn').forEach(function(btn) {
        btn.addEventListener('click', function() {
            var tabId = this.dataset.tab;
            container.querySelectorAll('.tab-btn').forEach(function(b) { b.classList.remove('active'); });
            container.querySelectorAll('.tab-content').forEach(function(tc) { tc.classList.remove('active'); });
            this.classList.add('active');
            var target = container.querySelector('#' + tabId);
            if (target) target.classList.add('active');
        });
    });

    // ---- FUNDAMENTALS ----
    container.querySelector('#mono-fund-done-btn').addEventListener('click', function() {
        progress.complete(SECTION, 'mono-fundamentals');
        this.textContent = '✅ Fundamentals Complete!';
        this.classList.remove('btn-success');
        this.classList.add('btn-secondary');
        this.disabled = true;
    });

    // ---- ALPHABET BUILDER STATE ----
    var cipherAlpha = ALPHA.split('');

    function getCurrentKey() {
        return cipherAlpha.join('');
    }

    function updateAlphabetDisplay() {
        for (var i = 0; i < 26; i++) {
            var cell = container.querySelector('#mono-c-' + i);
            if (cell) {
                cell.textContent = cipherAlpha[i];
                cell.classList.remove('error', 'matched');
            }
        }
        validateAlphabet();
    }

    function validateAlphabet() {
        var counts = {};
        var duplicates = {};
        var hasDuplicates = false;
        var missingLetters = [];

        for (var i = 0; i < 26; i++) {
            var ch = cipherAlpha[i];
            if (!counts[ch]) counts[ch] = [];
            counts[ch].push(i);
        }

        for (var ch in counts) {
            if (counts[ch].length > 1) {
                hasDuplicates = true;
                counts[ch].forEach(function(idx) {
                    duplicates[idx] = true;
                });
            }
        }

        for (var i = 0; i < 26; i++) {
            if (!counts[ALPHA[i]]) {
                missingLetters.push(ALPHA[i]);
            }
        }

        // Update cell styling
        for (var i = 0; i < 26; i++) {
            var cell = container.querySelector('#mono-c-' + i);
            if (cell) {
                cell.classList.remove('error', 'matched');
                if (duplicates[i]) {
                    cell.classList.add('error');
                } else if (!hasDuplicates) {
                    cell.classList.add('matched');
                }
            }
        }

        var valDiv = container.querySelector('#mono-alpha-validation');
        if (hasDuplicates) {
            valDiv.className = 'alert alert-danger';
            valDiv.innerHTML = '❌ <strong>Duplicate letters detected!</strong> Each letter must appear exactly once. Missing: ' + missingLetters.join(', ');
        } else {
            valDiv.className = 'alert alert-success';
            valDiv.innerHTML = '✅ Valid alphabet — all 26 letters are unique!';
            progress.complete(SECTION, 'mono-alphabet');
        }

        return !hasDuplicates;
    }

    // Editable cipher cells
    container.querySelectorAll('.alphabet-cell.editable').forEach(function(cell) {
        cell.addEventListener('click', function() {
            var idx = parseInt(this.dataset.index);
            var currentVal = cipherAlpha[idx];

            // Create inline input
            this.innerHTML = '';
            var inp = document.createElement('input');
            inp.type = 'text';
            inp.maxLength = 1;
            inp.value = currentVal;
            inp.style.cssText = 'width:100%;height:100%;border:none;text-align:center;font-family:var(--font-mono);font-weight:700;font-size:0.8rem;background:transparent;outline:none;text-transform:uppercase;color:var(--cipher-color)';
            this.appendChild(inp);
            inp.focus();
            inp.select();

            function finishEdit() {
                var val = inp.value.toUpperCase();
                if (val.length === 1 && val >= 'A' && val <= 'Z') {
                    cipherAlpha[idx] = val;
                } else {
                    // revert
                }
                cell.textContent = cipherAlpha[idx];
                validateAlphabet();
            }

            inp.addEventListener('blur', finishEdit);
            inp.addEventListener('keydown', function(e) {
                if (e.key === 'Enter') {
                    inp.blur();
                } else if (e.key === 'Escape') {
                    cell.textContent = cipherAlpha[idx];
                    validateAlphabet();
                } else if (e.key.length === 1 && e.key.match(/[a-zA-Z]/)) {
                    // Auto-advance: type letter and move to next cell
                    cipherAlpha[idx] = e.key.toUpperCase();
                    cell.textContent = cipherAlpha[idx];
                    validateAlphabet();
                    e.preventDefault();
                    // Focus next cell
                    var next = container.querySelector('#mono-c-' + (idx + 1));
                    if (next) next.click();
                }
            });
        });
    });

    // Generate Random
    container.querySelector('#mono-alpha-random').addEventListener('click', function() {
        cipherAlpha = utils.shuffleArray(ALPHA.split(''));
        updateAlphabetDisplay();
    });

    // Use Example
    container.querySelector('#mono-alpha-example').addEventListener('click', function() {
        cipherAlpha = EXAMPLE_KEY.split('');
        updateAlphabetDisplay();
    });

    // Reset
    container.querySelector('#mono-alpha-reset').addEventListener('click', function() {
        cipherAlpha = ALPHA.split('');
        updateAlphabetDisplay();
    });

    // Encrypt button
    container.querySelector('#mono-enc-btn').addEventListener('click', function() {
        var key = getCurrentKey();
        if (!validateAlphabet()) {
            var resDiv = container.querySelector('#mono-enc-result');
            resDiv.style.display = 'block';
            resDiv.className = 'result-box error';
            resDiv.innerHTML = '<div class="result-label">Error</div>Fix the cipher alphabet first — it has duplicate letters!';
            container.querySelector('#mono-enc-steps').style.display = 'none';
            return;
        }

        var plain = container.querySelector('#mono-enc-input').value;
        if (!plain.trim()) return;

        var cleaned = utils.cleanText(plain);
        var cipher = monoEncrypt(plain, key);

        var resDiv = container.querySelector('#mono-enc-result');
        resDiv.style.display = 'block';
        resDiv.className = 'result-box success';
        resDiv.innerHTML = '<div class="result-label">Ciphertext</div><span class="highlight-cipher">' + cipher + '</span>';

        // Show steps
        var stepsDiv = container.querySelector('#mono-enc-steps');
        stepsDiv.style.display = 'block';
        var stepHtml = '<div class="transform-display">';
        for (var i = 0; i < cleaned.length; i++) {
            var pChar = cleaned[i];
            var pIdx = utils.letterToNum(pChar);
            var cChar = key[pIdx];
            stepHtml += '<div class="transform-item">';
            stepHtml += '<div class="transform-plain">' + pChar + '</div>';
            stepHtml += '<div class="transform-arrow">↓</div>';
            stepHtml += '<div class="transform-cipher">' + cChar + '</div>';
            stepHtml += '<div class="transform-math">pos ' + (pIdx + 1) + '</div>';
            stepHtml += '</div>';
        }
        stepHtml += '</div>';
        stepsDiv.innerHTML = stepHtml;

        progress.complete(SECTION, 'mono-encrypt-decrypt');
        utils.animateElement(resDiv, 'fade-in');
    });

    // Decrypt button
    container.querySelector('#mono-dec-btn').addEventListener('click', function() {
        var key = getCurrentKey();
        if (!validateAlphabet()) {
            var resDiv = container.querySelector('#mono-dec-result');
            resDiv.style.display = 'block';
            resDiv.className = 'result-box error';
            resDiv.innerHTML = '<div class="result-label">Error</div>Fix the cipher alphabet first — it has duplicate letters!';
            container.querySelector('#mono-dec-steps').style.display = 'none';
            return;
        }

        var cipher = container.querySelector('#mono-dec-input').value;
        if (!cipher.trim()) return;

        var cleaned = utils.cleanText(cipher);
        var plain = monoDecrypt(cipher, key);

        var resDiv = container.querySelector('#mono-dec-result');
        resDiv.style.display = 'block';
        resDiv.className = 'result-box success';
        resDiv.innerHTML = '<div class="result-label">Plaintext</div><span class="highlight-plain">' + plain + '</span>';

        // Show steps
        var stepsDiv = container.querySelector('#mono-dec-steps');
        stepsDiv.style.display = 'block';
        var stepHtml = '<div class="transform-display">';
        for (var i = 0; i < cleaned.length; i++) {
            var cChar = cleaned[i];
            var cIdx = key.indexOf(cChar);
            var pChar = cIdx >= 0 ? ALPHA[cIdx] : '?';
            stepHtml += '<div class="transform-item">';
            stepHtml += '<div class="transform-cipher">' + cChar + '</div>';
            stepHtml += '<div class="transform-arrow">↓</div>';
            stepHtml += '<div class="transform-plain">' + pChar + '</div>';
            stepHtml += '<div class="transform-math">pos ' + (cIdx + 1) + '</div>';
            stepHtml += '</div>';
        }
        stepHtml += '</div>';
        stepsDiv.innerHTML = stepHtml;

        progress.complete(SECTION, 'mono-encrypt-decrypt');
        utils.animateElement(resDiv, 'fade-in');
    });

    // ---- FREQUENCY ANALYSIS ----
    var freqMappings = {}; // cipher letter → plaintext guess

    container.querySelector('#mono-freq-load-example').addEventListener('click', function() {
        container.querySelector('#mono-freq-input').value = FA_CIPHER;
    });

    container.querySelector('#mono-freq-analyze-btn').addEventListener('click', function() {
        var text = container.querySelector('#mono-freq-input').value;
        var cleaned = utils.cleanText(text);
        if (cleaned.length < 2) {
            alert('Please enter some ciphertext to analyze (at least 2 letters).');
            return;
        }
        performFrequencyAnalysis(cleaned);
        container.querySelector('#mono-freq-results').style.display = 'block';
        utils.animateElement(container.querySelector('#mono-freq-results'), 'fade-in');
    });

    function performFrequencyAnalysis(text) {
        // Count frequencies
        var counts = {};
        var total = text.length;
        for (var i = 0; i < 26; i++) counts[ALPHA[i]] = 0;
        for (var i = 0; i < text.length; i++) {
            if (counts[text[i]] !== undefined) counts[text[i]]++;
        }

        // Calculate percentages
        var freqs = {};
        for (var i = 0; i < 26; i++) {
            freqs[ALPHA[i]] = total > 0 ? (counts[ALPHA[i]] / total * 100) : 0;
        }

        // Find max frequency for scaling
        var maxFreq = 0;
        for (var l in freqs) { if (freqs[l] > maxFreq) maxFreq = freqs[l]; }
        var maxEng = 0;
        for (var l in utils.englishFrequencies) { if (utils.englishFrequencies[l] > maxEng) maxEng = utils.englishFrequencies[l]; }
        var maxScale = Math.max(maxFreq, maxEng, 1);

        // Build chart
        var chartHtml = '';
        var labelsHtml = '';
        for (var i = 0; i < 26; i++) {
            var letter = ALPHA[i];
            var cipherPct = freqs[letter];
            var engPct = utils.englishFrequencies[letter];
            var cipherHeight = (cipherPct / maxScale * 100);
            var engHeight = (engPct / maxScale * 100);

            chartHtml += '<div class="chart-bar" style="flex-direction:row;align-items:flex-end;gap:1px">';
            // English bar (gray)
            chartHtml += '<div class="chart-bar-fill english" style="height:' + engHeight + '%;max-width:12px">';
            chartHtml += '</div>';
            // Ciphertext bar (colored)
            var barColor = cipherPct > 0 ? 'var(--mono-color)' : 'var(--gray-200)';
            chartHtml += '<div class="chart-bar-fill" style="height:' + cipherHeight + '%;background:' + barColor + ';max-width:12px">';
            if (cipherPct > 0) chartHtml += '<div class="chart-bar-value">' + cipherPct.toFixed(1) + '</div>';
            chartHtml += '</div>';
            chartHtml += '</div>';
            labelsHtml += '<div class="chart-label">' + letter + '</div>';
        }

        container.querySelector('#mono-freq-chart').innerHTML = chartHtml;
        container.querySelector('#mono-freq-labels').innerHTML = labelsHtml;

        // Frequency table
        var sorted = ALPHA.split('').sort(function(a, b) { return freqs[b] - freqs[a]; });
        var tableHtml = '<table class="styled-table"><thead><tr><th>Rank</th><th>Letter</th><th>Count</th><th>Frequency</th><th>English Expected</th></tr></thead><tbody>';
        for (var i = 0; i < 26; i++) {
            var l = sorted[i];
            if (counts[l] === 0 && i > 10) continue; // skip zero-count letters after top ones
            tableHtml += '<tr' + (i < 5 ? ' style="font-weight:700"' : '') + '>';
            tableHtml += '<td>' + (i + 1) + '</td>';
            tableHtml += '<td class="mono" style="color:var(--cipher-color)">' + l + '</td>';
            tableHtml += '<td>' + counts[l] + '</td>';
            tableHtml += '<td>' + freqs[l].toFixed(1) + '%</td>';
            tableHtml += '<td>' + utils.englishFrequencies[l].toFixed(1) + '%</td>';
            tableHtml += '</tr>';
        }
        tableHtml += '</tbody></table>';
        container.querySelector('#mono-freq-table').innerHTML = tableHtml;

        // Most common letters ranking
        var top10 = sorted.slice(0, 10).filter(function(l) { return counts[l] > 0; });
        var rankHtml = '<div style="display:flex;flex-wrap:wrap;gap:8px">';
        var engSorted = 'ETAOINSHRDLCUMWFGYPBVKJXQZ';
        for (var i = 0; i < top10.length; i++) {
            rankHtml += '<div style="text-align:center;padding:0.5rem;background:var(--gray-50);border-radius:var(--radius);border:1px solid var(--gray-200);min-width:55px">';
            rankHtml += '<div style="font-size:0.7rem;color:var(--gray-500)">#' + (i + 1) + '</div>';
            rankHtml += '<div style="font-family:var(--font-mono);font-weight:700;font-size:1.2rem;color:var(--cipher-color)">' + top10[i] + '</div>';
            rankHtml += '<div style="font-size:0.7rem;color:var(--gray-500)">' + freqs[top10[i]].toFixed(1) + '%</div>';
            rankHtml += '<div style="font-size:0.65rem;color:var(--gray-400)">≈ ' + engSorted[i] + '?</div>';
            rankHtml += '</div>';
        }
        rankHtml += '</div>';
        container.querySelector('#mono-freq-ranking').innerHTML = rankHtml;

        // Bigram analysis
        var bigramCounts = {};
        for (var i = 0; i < text.length - 1; i++) {
            var bg = text[i] + text[i + 1];
            bigramCounts[bg] = (bigramCounts[bg] || 0) + 1;
        }
        var bigramSorted = Object.keys(bigramCounts).sort(function(a, b) { return bigramCounts[b] - bigramCounts[a]; });
        var topBigrams = bigramSorted.slice(0, 10);

        var bgHtml = '<div style="display:flex;flex-wrap:wrap;gap:8px">';
        for (var i = 0; i < topBigrams.length; i++) {
            var bg = topBigrams[i];
            bgHtml += '<div style="text-align:center;padding:0.4rem 0.6rem;background:var(--gray-50);border-radius:var(--radius);border:1px solid var(--gray-200)">';
            bgHtml += '<div style="font-family:var(--font-mono);font-weight:700;color:var(--cipher-color);font-size:1rem">' + bg + '</div>';
            bgHtml += '<div style="font-size:0.7rem;color:var(--gray-500)">×' + bigramCounts[bg] + '</div>';
            bgHtml += '</div>';
        }
        bgHtml += '</div>';
        bgHtml += '<p class="text-sm text-muted" style="margin-top:0.5rem">The most common bigram in the ciphertext likely corresponds to TH, HE, IN, or ER in English.</p>';
        container.querySelector('#mono-freq-bigrams').innerHTML = bgHtml;

        // Build mapping grid
        buildMappingGrid(text, freqs, counts);
    }

    function buildMappingGrid(text, freqs, counts) {
        var grid = container.querySelector('#mono-freq-mapping-grid');
        var gridHtml = '';

        // Only show letters that actually appear in the ciphertext, sorted by frequency
        var presentLetters = ALPHA.split('').filter(function(l) { return counts && counts[l] > 0; });
        // But also show all 26 for completeness
        for (var i = 0; i < 26; i++) {
            var letter = ALPHA[i];
            gridHtml += '<div style="text-align:center">';
            gridHtml += '<div style="font-family:var(--font-mono);font-weight:700;color:var(--cipher-color);font-size:0.9rem">' + letter + '</div>';
            gridHtml += '<div style="font-size:0.6rem;color:var(--gray-500)">' + (counts ? counts[letter] : 0) + '</div>';
            gridHtml += '<input type="text" maxlength="1" class="mono-freq-map-input" data-cipher="' + letter + '" value="' + (freqMappings[letter] || '') + '" style="width:30px;height:30px;text-align:center;font-family:var(--font-mono);font-weight:700;border:2px solid var(--plain-color);border-radius:4px;font-size:0.8rem;text-transform:uppercase;color:var(--plain-color);margin-top:2px">';
            gridHtml += '</div>';
        }
        grid.innerHTML = gridHtml;

        // Store reference data
        grid._ciphertext = text;

        // Attach mapping input listeners
        grid.querySelectorAll('.mono-freq-map-input').forEach(function(inp) {
            inp.addEventListener('input', function() {
                var cipherLetter = this.dataset.cipher;
                var val = this.value.toUpperCase().replace(/[^A-Z]/g, '');
                this.value = val;

                if (val) {
                    freqMappings[cipherLetter] = val;
                } else {
                    delete freqMappings[cipherLetter];
                }

                validateFreqMappings();
                updatePartialDecrypt();
                checkFreqProgress();
            });
        });

        updatePartialDecrypt();
    }

    function validateFreqMappings() {
        var usedPlain = {};
        var conflicts = [];

        for (var cipher in freqMappings) {
            var plain = freqMappings[cipher];
            if (!usedPlain[plain]) {
                usedPlain[plain] = [cipher];
            } else {
                usedPlain[plain].push(cipher);
                conflicts.push(plain);
            }
        }

        var statusDiv = container.querySelector('#mono-freq-mapping-status');

        // Highlight conflicting inputs
        container.querySelectorAll('.mono-freq-map-input').forEach(function(inp) {
            inp.style.borderColor = 'var(--plain-color)';
            inp.style.background = 'var(--bg-input)';
        });

        if (conflicts.length > 0) {
            // Highlight all inputs with conflicting values
            for (var p in usedPlain) {
                if (usedPlain[p].length > 1) {
                    usedPlain[p].forEach(function(c) {
                        var inp = container.querySelector('.mono-freq-map-input[data-cipher="' + c + '"]');
                        if (inp) {
                            inp.style.borderColor = 'var(--danger)';
                            inp.style.background = 'rgba(244, 63, 94, 0.2)';
                        }
                    });
                }
            }
            statusDiv.style.display = 'block';
            statusDiv.className = 'alert alert-danger';
            statusDiv.innerHTML = '⚠️ Conflict: Multiple ciphertext letters mapped to the same plaintext letter (' + conflicts.filter(function(v, i, a) { return a.indexOf(v) === i; }).join(', ') + ')';
        } else {
            var count = Object.keys(freqMappings).length;
            if (count > 0) {
                statusDiv.style.display = 'block';
                statusDiv.className = 'alert alert-info';
                statusDiv.innerHTML = '✏️ ' + count + ' mapping' + (count > 1 ? 's' : '') + ' assigned. ' + (26 - count) + ' remaining.';
            } else {
                statusDiv.style.display = 'none';
            }
        }
    }

    function updatePartialDecrypt() {
        var grid = container.querySelector('#mono-freq-mapping-grid');
        var text = grid._ciphertext || container.querySelector('#mono-freq-input').value.toUpperCase();
        var partialDiv = container.querySelector('#mono-freq-partial');
        if (!partialDiv) return;

        var result = '';
        for (var i = 0; i < text.length; i++) {
            var ch = text[i];
            if (ch >= 'A' && ch <= 'Z') {
                if (freqMappings[ch]) {
                    result += '<span style="color:var(--success);font-weight:700">' + freqMappings[ch].toLowerCase() + '</span>';
                } else {
                    result += '<span style="color:var(--cipher-color)">' + ch + '</span>';
                }
            } else {
                result += ch;
            }
        }
        partialDiv.innerHTML = result;
    }

    function checkFreqProgress() {
        var count = Object.keys(freqMappings).length;
        if (count >= 5) {
            progress.complete(SECTION, 'mono-frequency');
        }
    }

    // Auto-suggest
    container.querySelector('#mono-freq-auto-suggest').addEventListener('click', function() {
        var text = utils.cleanText(container.querySelector('#mono-freq-input').value);
        if (text.length < 2) {
            alert('Please analyze some ciphertext first.');
            return;
        }

        // Count ciphertext frequencies
        var counts = {};
        for (var i = 0; i < 26; i++) counts[ALPHA[i]] = 0;
        for (var i = 0; i < text.length; i++) {
            if (counts[text[i]] !== undefined) counts[text[i]]++;
        }

        // Sort ciphertext letters by frequency (descending)
        var cipherSorted = ALPHA.split('').sort(function(a, b) { return counts[b] - counts[a]; });
        // Standard English frequency order
        var engOrder = 'ETAOINSHRDLCUMWFGYPBVKJXQZ';

        // Map top letters by frequency
        freqMappings = {};
        for (var i = 0; i < 26; i++) {
            if (counts[cipherSorted[i]] > 0) {
                freqMappings[cipherSorted[i]] = engOrder[i];
            }
        }

        // Update inputs
        container.querySelectorAll('.mono-freq-map-input').forEach(function(inp) {
            var cipher = inp.dataset.cipher;
            inp.value = freqMappings[cipher] || '';
        });

        validateFreqMappings();
        updatePartialDecrypt();
        checkFreqProgress();
    });

    // Clear mappings
    container.querySelector('#mono-freq-clear-mappings').addEventListener('click', function() {
        freqMappings = {};
        container.querySelectorAll('.mono-freq-map-input').forEach(function(inp) {
            inp.value = '';
            inp.style.borderColor = 'var(--plain-color)';
            inp.style.background = 'var(--bg-input)';
        });
        container.querySelector('#mono-freq-mapping-status').style.display = 'none';
        updatePartialDecrypt();
    });

    // ---- EXERCISES ----

    // Exercise 1: Encrypt HELLO with QWERTYUIOPASDFGHJKLZXCVBNM
    var ex1Answer = monoEncrypt('HELLO', EXAMPLE_KEY); // ITSSG
    setupExercise(1, ex1Answer, function() {
        return 'Correct! 🎉 ' +
            '<strong>H</strong>(pos 8)→<strong>I</strong>, ' +
            '<strong>E</strong>(pos 5)→<strong>T</strong>, ' +
            '<strong>L</strong>(pos 12)→<strong>S</strong>, ' +
            '<strong>L</strong>(pos 12)→<strong>S</strong>, ' +
            '<strong>O</strong>(pos 15)→<strong>G</strong>. ' +
            'HELLO → <span class="highlight-cipher">' + ex1Answer + '</span>';
    });

    // Exercise 2: Decrypt JXHER with QWERTYUIOPASDFGHJKLZXCVBNM
    var ex2Answer = monoDecrypt('JXHER', EXAMPLE_KEY);
    setupExercise(2, ex2Answer, function() {
        return 'Correct! 🎉 Reverse lookup: ' +
            'Find each ciphertext letter in the key and note its position:<br>' +
            '<strong>J</strong> is at index 16 → plain <strong>' + ALPHA[EXAMPLE_KEY.indexOf('J')] + '</strong>, ' +
            '<strong>X</strong> is at index 20 → plain <strong>' + ALPHA[EXAMPLE_KEY.indexOf('X')] + '</strong>, ' +
            '<strong>H</strong> is at index 15 → plain <strong>' + ALPHA[EXAMPLE_KEY.indexOf('H')] + '</strong>, ' +
            '<strong>E</strong> is at index 2 → plain <strong>' + ALPHA[EXAMPLE_KEY.indexOf('E')] + '</strong>, ' +
            '<strong>R</strong> is at index 3 → plain <strong>' + ALPHA[EXAMPLE_KEY.indexOf('R')] + '</strong>. ' +
            'JXHER → <span class="highlight-plain">' + ex2Answer + '</span>';
    });

    // Exercise 3: Missing letters: positions B(1) and E(4) → W and T
    setupExercise(3, 'WT', function() {
        return 'Correct! 🎉 The full alphabet is QWERTYUIOPASDFGHJKLZXCVBNM. ' +
            'Position B (index 1) = <strong>W</strong>, Position E (index 4) = <strong>T</strong>. ' +
            'Every letter must appear exactly once in a valid substitution alphabet.';
    });

    // Exercise 4: Caesar with key 12
    setupExercise(4, '12', function() {
        return 'Correct! 🎉 This is a Caesar cipher with shift 12. ' +
            'A(0)→M(12): shift = 12. B(1)→N(13): shift = 12. ' +
            'Since all shifts are identical, this is a simple Caesar cipher — a special case of the monoalphabetic cipher where the permutation follows a regular pattern.';
    });

    function setupExercise(num, answer, successMsg) {
        var checkBtn = container.querySelector('#mono-ex' + num + '-check');
        var hintBtn = container.querySelector('#mono-ex' + num + '-hint-btn');
        var hintDiv = container.querySelector('#mono-ex' + num + '-hint');
        var feedbackDiv = container.querySelector('#mono-ex' + num + '-feedback');
        var inputEl = container.querySelector('#mono-ex' + num + '-input');
        var box = container.querySelector('#mono-ex' + num + '-box');

        if (hintBtn) {
            hintBtn.addEventListener('click', function() {
                hintDiv.classList.toggle('show');
                this.textContent = hintDiv.classList.contains('show') ? '🙈 Hide Hint' : '💡 Show Hint';
            });
        }

        if (checkBtn) {
            checkBtn.addEventListener('click', function() {
                var userAnswer = utils.cleanText(inputEl.value);
                var correct = utils.cleanText(answer);

                feedbackDiv.classList.add('show');
                box.classList.remove('correct', 'incorrect');

                if (userAnswer === correct) {
                    feedbackDiv.className = 'exercise-feedback show correct-feedback';
                    feedbackDiv.innerHTML = successMsg();
                    box.classList.add('correct');
                    progress.complete(SECTION, 'mono-exercise-' + num);
                } else {
                    feedbackDiv.className = 'exercise-feedback show incorrect-feedback';
                    feedbackDiv.innerHTML = '❌ Not quite. You entered "<strong>' + (inputEl.value.toUpperCase() || '(empty)') + '</strong>". The correct answer is "<strong>' + answer + '</strong>". Try again or check the hint!';
                }
                utils.animateElement(feedbackDiv, 'fade-in');
            });
        }
    }

    // Exercise 5: Frequency analysis challenge
    container.querySelector('#mono-ex5-hint').addEventListener('click', function() {
        var hintDiv = container.querySelector('#mono-ex5-hint-text');
        hintDiv.classList.toggle('show');
        this.textContent = hintDiv.classList.contains('show') ? '🙈 Hide Hint' : '💡 Hint';
    });

    container.querySelector('#mono-ex5-check').addEventListener('click', function() {
        var correctCount = 0;
        var total = 5;
        var details = [];

        for (var m = 0; m < 5; m++) {
            var cInput = container.querySelector('#mono-ex5-c' + m).value.toUpperCase();
            var pInput = container.querySelector('#mono-ex5-p' + m).value.toUpperCase();

            if (cInput.length === 1 && pInput.length === 1) {
                // Check if this mapping is correct according to EX5_KEY
                var expectedPlainIdx = EX5_KEY.indexOf(cInput);
                var expectedPlain = expectedPlainIdx >= 0 ? ALPHA[expectedPlainIdx] : '?';

                if (pInput === expectedPlain) {
                    correctCount++;
                    details.push('<span style="color:var(--success)">✅ ' + cInput + '→' + pInput + ' (correct!)</span>');
                } else {
                    details.push('<span style="color:var(--danger)">❌ ' + cInput + '→' + pInput + ' (should be ' + cInput + '→' + expectedPlain + ')</span>');
                }
            } else {
                details.push('<span style="color:var(--gray-500)">⬜ Mapping ' + (m + 1) + ' incomplete</span>');
            }
        }

        var feedbackDiv = container.querySelector('#mono-ex5-feedback');
        feedbackDiv.classList.add('show');
        var box = container.querySelector('#mono-ex5-box');
        box.classList.remove('correct', 'incorrect');

        if (correctCount >= 5) {
            feedbackDiv.className = 'exercise-feedback show correct-feedback';
            feedbackDiv.innerHTML = '🎉 Excellent! All ' + correctCount + ' mappings are correct! You\'ve cracked the cipher!<br>' + details.join('<br>');
            box.classList.add('correct');
            progress.complete(SECTION, 'mono-exercise-5');
        } else if (correctCount >= 3) {
            feedbackDiv.className = 'exercise-feedback show correct-feedback';
            feedbackDiv.innerHTML = '👍 Good progress! ' + correctCount + ' out of ' + total + ' correct. Keep going!<br>' + details.join('<br>');
            if (correctCount >= 5) progress.complete(SECTION, 'mono-exercise-5');
        } else {
            feedbackDiv.className = 'exercise-feedback show incorrect-feedback';
            feedbackDiv.innerHTML = correctCount + ' out of ' + total + ' correct. Try counting letter frequencies in the ciphertext and matching them to English frequency order (E, T, A, O, I, N, S…).<br>' + details.join('<br>');
        }
        utils.animateElement(feedbackDiv, 'fade-in');
    });

    // Initial validation
    validateAlphabet();
});
