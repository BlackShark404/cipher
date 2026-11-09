/* ===== Exam Simulation, Comparison Guide, and Review Modules ===== */
(function(app) {
    'use strict';

    var utils = app.utils;
    var progress = app.progress;

    // =========================================================================
    // MODULE 1: COMPARISON GUIDE (section-comparison)
    // =========================================================================
    app.registerModule('comparison', function(container) {
        var html = `
        <div class="section-content">
            <div class="hero-banner" style="background: linear-gradient(135deg, #4b5563 0%, #1f2937 100%);">
                <h1>📊 Classical Cryptography Comparison Guide</h1>
                <p class="hero-subtitle">Comprehensive side-by-side analysis of Caesar, Monoalphabetic, and Playfair Ciphers</p>
            </div>

            <!-- Visual Comparison Table Card -->
            <div class="card">
                <div class="card-header" style="background: var(--bg-surface-elevated);">
                    <h3>⚔️ Side-by-Side Cipher Comparison</h3>
                </div>
                <div class="card-body">
                    <p class="text-sm text-muted mb-2">Use this quick-comparison table to master the architectural differences, key sizes, vulnerabilities, and solving strategies for your practical exam.</p>
                    
                    <div class="table-responsive">
                        <table class="styled-table comparison-table">
                            <thead>
                                <tr>
                                    <th style="width: 22%;">Feature</th>
                                    <th style="width: 26%; color: var(--caesar-color);">🔄 Caesar Cipher</th>
                                    <th style="width: 26%; color: var(--mono-color);">🔤 Monoalphabetic</th>
                                    <th style="width: 26%; color: var(--playfair-color);">🔲 Playfair Cipher</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td><strong>Cipher Type</strong></td>
                                    <td>Simple Substitution (Periodic shift)</td>
                                    <td>General Monoalphabetic Substitution</td>
                                    <td>Polygraphic / Digraph Substitution</td>
                                </tr>
                                <tr>
                                    <td><strong>Key Structure</strong></td>
                                    <td>Single integer shift <span class="mono highlight-key">k ∈ [0, 25]</span></td>
                                    <td>Permuted 26-letter alphabet (1-to-1 mapping)</td>
                                    <td>Keyword-derived 5×5 matrix (25 letters, I/J merged)</td>
                                </tr>
                                <tr>
                                    <td><strong>Encryption Unit</strong></td>
                                    <td>Single letter (<span class="mono">1-gram</span>)</td>
                                    <td>Single letter (<span class="mono">1-gram</span>)</td>
                                    <td>Pair of letters (<span class="mono">digraph / 2-gram</span>)</td>
                                </tr>
                                <tr>
                                    <td><strong>Key Space Size</strong></td>
                                    <td><span class="badge" style="background: var(--danger);">26 shifts</span> (25 effective)</td>
                                    <td><span class="badge" style="background: var(--success);">$26! \\approx 4.03 \\times 10^{26}$</span></td>
                                    <td><span class="badge" style="background: var(--warning);">$25! \\approx 1.55 \\times 10^{25}$</span> ($600$ valid digraphs)</td>
                                </tr>
                                <tr>
                                    <td><strong>Primary Vulnerability</strong></td>
                                    <td><strong>Exhaustive Brute Force</strong> (instantaneous)</td>
                                    <td><strong>Frequency Analysis</strong> &amp; Pattern Matching</td>
                                    <td><strong>Digraph Frequency</strong> &amp; Matrix Geometry</td>
                                </tr>
                                <tr>
                                    <td><strong>Preserves Letter Frequency?</strong></td>
                                    <td><span class="badge badge-danger">Yes (Shifted)</span> Peak frequency directly leaks shift $k$</td>
                                    <td><span class="badge badge-danger">Yes (Scrambled)</span> Letter frequencies map 1-to-1 intact</td>
                                    <td><span class="badge badge-success">Disrupted</span> Single-letter frequencies are flattened across pairs</td>
                                </tr>
                                <tr>
                                    <td><strong>Mathematical Basis</strong></td>
                                    <td>Modular arithmetic: $C = (P + k) \\pmod{26}$</td>
                                    <td>Bijective mapping: $f: \\Sigma \\to \\Sigma$</td>
                                    <td>2D Geometric coordinates: $(r_1, c_1), (r_2, c_2)$</td>
                                </tr>
                                <tr>
                                    <td><strong>Manual Crack Time</strong></td>
                                    <td>1 to 2 minutes by hand</td>
                                    <td>5 to 15 minutes with frequency count</td>
                                    <td>20 to 45 minutes with digraph cribs</td>
                                </tr>
                                <tr>
                                    <td><strong>Modern Security</strong></td>
                                    <td><span class="badge badge-danger">Zero</span> (&lt; 0.001 ms on phone)</td>
                                    <td><span class="badge badge-danger">Zero</span> (&lt; 1 ms on computer)</td>
                                    <td><span class="badge badge-danger">Zero</span> (&lt; 5 ms on computer)</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <!-- Key Space Comparison Interactive Bar -->
            <div class="card">
                <div class="card-header" style="background: var(--primary);">
                    <h3>📐 Key Space Scale &amp; Computational Reality</h3>
                </div>
                <div class="card-body">
                    <p>Why does key space alone not equal security? Even though a Monoalphabetic cipher has a mammoth key space of $26!$, it is effortlessly broken because frequency analysis completely bypasses brute force!</p>
                    
                    <div style="margin: 1.5rem 0;">
                        <div style="margin-bottom: 1rem;">
                            <div style="display: flex; justify-content: space-between; font-size: 0.85rem; font-weight: 700;">
                                <span>Caesar: 26 keys ($10^{1.4}$)</span>
                                <span class="highlight-cipher">Broken in 0.00001 seconds</span>
                            </div>
                            <div class="progress-bar" style="height: 12px;">
                                <div class="progress-fill" style="width: 2%; background: var(--danger);"></div>
                            </div>
                        </div>

                        <div style="margin-bottom: 1rem;">
                            <div style="display: flex; justify-content: space-between; font-size: 0.85rem; font-weight: 700;">
                                <span>Playfair: $25!$ matrix orientations ($10^{25}$)</span>
                                <span class="highlight-step">Digraph analysis cracks it in seconds</span>
                            </div>
                            <div class="progress-bar" style="height: 12px;">
                                <div class="progress-fill" style="width: 38%; background: var(--warning);"></div>
                            </div>
                        </div>

                        <div style="margin-bottom: 1rem;">
                            <div style="display: flex; justify-content: space-between; font-size: 0.85rem; font-weight: 700;">
                                <span>Monoalphabetic: $26! \\approx 4 \\times 10^{26}$ keys</span>
                                <span class="highlight-plain">Frequency analysis breaks it without brute force</span>
                            </div>
                            <div class="progress-bar" style="height: 12px;">
                                <div class="progress-fill" style="width: 42%; background: var(--mono-color);"></div>
                            </div>
                        </div>

                        <div style="margin-bottom: 1rem;">
                            <div style="display: flex; justify-content: space-between; font-size: 0.85rem; font-weight: 700;">
                                <span>Legacy DES (1977): $2^{56} \\approx 7.2 \\times 10^{16}$ keys</span>
                                <span class="highlight-danger">Cracked by custom hardware in 1999</span>
                            </div>
                            <div class="progress-bar" style="height: 12px;">
                                <div class="progress-fill" style="width: 26%; background: var(--gray-500);"></div>
                            </div>
                        </div>

                        <div style="margin-bottom: 0.5rem;">
                            <div style="display: flex; justify-content: space-between; font-size: 0.85rem; font-weight: 700;">
                                <span>Modern AES-128: $2^{128} \\approx 3.4 \\times 10^{38}$ keys</span>
                                <span class="highlight-key">Unbreakable: would take trillions of years for all Earth's computers</span>
                            </div>
                            <div class="progress-bar" style="height: 12px;">
                                <div class="progress-fill" style="width: 100%; background: var(--success);"></div>
                            </div>
                        </div>
                    </div>

                    <div class="alert alert-info">
                        💡 <strong>The Golden Rule of Cryptanalysis:</strong> A large key space is a <em>necessary</em> condition for security, but NOT a <em>sufficient</em> one. If statistical properties (letter frequencies, repeating patterns, grammar) leak through the cipher, an attacker never has to test all keys.
                    </div>
                </div>
            </div>

            <!-- Deep Dive Collapsible Cards -->
            <div class="card">
                <div class="card-header" style="background: var(--bg-surface-elevated);">
                    <h3>🔍 In-Depth Conceptual Comparisons</h3>
                </div>
                <div class="card-body">
                    <div class="collapsible open">
                        <div class="collapsible-header">
                            <span>1. Single-Letter vs. Digraph Substitution: Why Playfair Was Revolutionary</span>
                        </div>
                        <div class="collapsible-body">
                            <p>In Caesar and Monoalphabetic ciphers, every individual letter is replaced by another single letter. This produces an Achilles' heel:</p>
                            <ul>
                                <li>The letter <strong>'E'</strong> is always encrypted to the exact same ciphertext letter throughout the entire message.</li>
                                <li>Double letters like <strong>'LL'</strong> or <strong>'SS'</strong> always produce double ciphertext letters (e.g. <strong>'XX'</strong> or <strong>'ZZ'</strong>).</li>
                            </ul>
                            <p>Playfair fundamentally changed this by encrypting <strong>digraphs</strong> (2-letter pairs):</p>
                            <ul>
                                <li>There are $26$ letters, but $25 \\times 25 = 625$ potential digraph combinations ($600$ valid non-repeating pairs).</li>
                                <li>The letter <strong>'E'</strong> in the pair <strong>"ME"</strong> encrypts completely differently than the <strong>'E'</strong> in <strong>"ET"</strong> or <strong>"HE"</strong>.</li>
                                <li>Double letters are forbidden inside a digraph (a filler <strong>'X'</strong> is injected: <strong>"LL" $\\to$ "LX" + "L_"</strong>), destroying double-letter signatures!</li>
                            </ul>
                        </div>
                    </div>

                    <div class="collapsible">
                        <div class="collapsible-header">
                            <span>2. Why Frequency Analysis Destroys Monoalphabetic Substitution</span>
                        </div>
                        <div class="collapsible-body">
                            <p>In English prose, letters do not appear with uniform probability. Evolution and grammar dictate that:</p>
                            <ul>
                                <li><strong>E</strong> appears $\\approx 12.7\\%$ of the time.</li>
                                <li><strong>T</strong> appears $\\approx 9.1\\%$, <strong>A</strong> appears $\\approx 8.2\\%$, <strong>O</strong> appears $\\approx 7.5\\%$.</li>
                                <li>Rare letters like <strong>Q, X, Z</strong> appear less than $0.2\\%$.</li>
                            </ul>
                            <p>Because monoalphabetic substitution is a static 1-to-1 permutation, whatever ciphertext letter represents 'E' will simply inherit E's $12.7\\%$ frequency! By sorting the ciphertext letters from most frequent to least frequent, an analyst can immediately map high peaks to <strong>E, T, A, O, I, N</strong>, cracking the cipher without checking any keys.</p>
                        </div>
                    </div>

                    <div class="collapsible">
                        <div class="collapsible-header">
                            <span>3. Why Classical Ciphers Are Completely Obsolete</span>
                        </div>
                        <div class="collapsible-body">
                            <p>Claude Shannon established the two pillars of modern cryptographic design:</p>
                            <ol>
                                <li><strong>Confusion:</strong> Making the relationship between the key and the ciphertext as complex and involved as possible.</li>
                                <li><strong>Diffusion:</strong> Spreading the statistical structure of the plaintext across the ciphertext so that changing a single plaintext bit flips $\\approx 50\\%$ of the ciphertext bits (the <em>Avalanche Effect</em>).</li>
                            </ol>
                            <p>Classical substitution ciphers possess almost <strong>zero diffusion</strong>. Changing 'H' to 'J' in Caesar or Mono changes exactly one letter in the ciphertext. Modern block ciphers like <strong>AES</strong> pass 128-bit blocks through multiple rounds of substitution (S-boxes), byte permutation (ShiftRows), matrix multiplication (MixColumns), and key addition (AddRoundKey), ensuring unbreakable diffusion.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>`;
        container.innerHTML = html;
    });


    // =========================================================================
    // MODULE 2: PRACTICAL EXAM SIMULATION (section-exam)
    // =========================================================================
    // Bank of questions generator
    function generateExamQuestions(cipherFilter, difficulty, count) {
            var pool = [];
            var ciphers = (cipherFilter === 'all') ? ['caesar', 'monoalphabetic', 'playfair'] : [cipherFilter];
            
            // Candidate words for questions
            var shortWords = ['KEY', 'LAB', 'FOX', 'NET', 'MAP', 'SUN', 'CIPHER', 'GUARD', 'SHIELD', 'MATRIX'];
            var mediumWords = ['CRYPTOGRAPHY', 'SECRETKEY', 'DEFENDER', 'TRANSMIT', 'SECURITY', 'ALGORITHM'];

            // =================================================================
            // 1. Caesar Cipher Question Bank (15 Questions: 10 Easy, 2 Med, 3 Hard)
            // =================================================================
            if (ciphers.indexOf('caesar') !== -1) {
                // Easy: Manual encryption drills with varied shifts (5 items)
                var caesarEncDrills = [
                    { word: 'LAB', k: 4, enc: 'PEF' },
                    { word: 'SUN', k: 5, enc: 'XZS' },
                    { word: 'CIPHER', k: 7, enc: 'JPWOLY' },
                    { word: 'GUARD', k: 11, enc: 'RFLCO' },
                    { word: 'SHIELD', k: 3, enc: 'VKLHOG' }
                ];

                caesarEncDrills.forEach(function(d) {
                    pool.push({
                        cipher: 'caesar',
                        difficulty: 'easy',
                        type: 'text',
                        title: 'Caesar Cipher: Manual Encryption',
                        question: `Encrypt the word <strong>"${d.word}"</strong> using a Caesar shift key of <span class="highlight-key">k = ${d.k}</span>.<br><small class="text-muted">Use formula $C = (P + ${d.k}) \\pmod{26}$. Enter ciphertext in uppercase.</small>`,
                        correctAnswer: d.enc,
                        hint: `Shift each letter forward by ${d.k}. For example, ${d.word[0]} (${utils.letterToNum(d.word[0])}) + ${d.k} = ${utils.letterToNum(d.word[0]) + d.k} mod 26 = ${d.enc[0]}.`,
                        explanation: `Plaintext <strong>${d.word}</strong> shifted by +${d.k}:<br>` +
                            d.word.split('').map((ch, idx) => `${ch} (${utils.letterToNum(ch)}) + ${d.k} = ${(utils.letterToNum(ch)+d.k)%26} (${d.enc[idx]})`).join(', ') +
                            `<br>Result: <strong>${d.enc}</strong>`
                    });

                    pool.push({
                        cipher: 'caesar',
                        difficulty: 'easy',
                        type: 'text',
                        title: 'Caesar Cipher: Modular Decryption',
                        question: `Decrypt the ciphertext <strong>"${d.enc}"</strong> which was encrypted with Caesar key <span class="highlight-key">k = ${d.k}</span>.<br><small class="text-muted">Formula: $P = (C - ${d.k} + 26) \\pmod{26}$.</small>`,
                        correctAnswer: d.word,
                        hint: `Shift each letter backward by ${d.k}. ${d.enc[0]} (${utils.letterToNum(d.enc[0])}) - ${d.k} = ${utils.letterToNum(d.word[0])} = ${d.word[0]}.`,
                        explanation: `Ciphertext <strong>${d.enc}</strong> shifted back by -${d.k}:<br>` +
                            d.enc.split('').map((ch, idx) => `${ch} (${utils.letterToNum(ch)}) - ${d.k} = ${utils.mod(utils.letterToNum(ch)-d.k, 26)} (${d.word[idx]})`).join(', ') +
                            `<br>Original Plaintext: <strong>${d.word}</strong>`
                    });
                });

                // Medium: Known-Plaintext Key Deduction (Single Letter)
                pool.push({
                    cipher: 'caesar',
                    difficulty: 'medium',
                    type: 'number',
                    title: 'Caesar Cipher: Known-Plaintext Key Deduction',
                    question: `An intercepted transmission shows that plaintext letter <strong>'D'</strong> was encrypted to ciphertext letter <strong>'Q'</strong>.<br>What numerical shift key $k$ (0–25) was used?`,
                    correctAnswer: '13',
                    hint: `D is position 3 (0-indexed) and Q is position 16. Solve $16 = (3 + k) \\pmod{26}$.`,
                    explanation: `Formula: $k = (C - P + 26) \\pmod{26}$.<br>$P = 'D' = 3$, $C = 'Q' = 16$.<br>$k = (16 - 3) = 13$. The key is <strong>13</strong> (ROT13).`
                });

                // Medium: Word Known-Plaintext Deduction
                pool.push({
                    cipher: 'caesar',
                    difficulty: 'medium',
                    type: 'number',
                    title: 'Caesar Cipher: Crib Deduction from Word',
                    question: `A military crib indicates that the intercepted ciphertext word <strong>"AOL"</strong> corresponds to the plaintext word <strong>"THE"</strong>.<br>What is the shift key $k$?`,
                    correctAnswer: '7',
                    hint: `T is position 19, and A is position 0. Calculate $(0 - 19 + 26) \\pmod{26}$.`,
                    explanation: `Formula: $k = (C - P + 26) \\pmod{26}$.<br>For first letter: $T = 19$, $A = 0$.<br>$k = (0 - 19 + 26) \\pmod{26} = 7$.<br>Verification: $H(7) + 7 = 14 (O)$, $E(4) + 7 = 11 (L)$. The key is <strong>7</strong>.`
                });

                // Hard: Negative Modulo Arithmetic wrap-around
                pool.push({
                    cipher: 'caesar',
                    difficulty: 'hard',
                    type: 'text',
                    title: 'Caesar Cipher: Negative Modulo Arithmetic',
                    question: `During decryption with key $k = 18$, the ciphertext letter is <strong>'E'</strong> ($C = 4$).<br>Calculate the exact plaintext letter $P$ showing proper non-negative modulo reduction.`,
                    correctAnswer: 'M',
                    hint: `P = (4 - 18 + 26) mod 26 = (-14 + 26) mod 26 = 12 mod 26. Position 12 is 'M'.`,
                    explanation: `$P = (C - k + 26) \\pmod{26} = (4 - 18 + 26) \\pmod{26} = 12 \\pmod{26}$.<br>Letter at index 12 is <strong>'M'</strong>.`
                });

                // Hard: Modulo Wrap Boundary Calculation
                pool.push({
                    cipher: 'caesar',
                    difficulty: 'hard',
                    type: 'text',
                    title: 'Caesar Cipher: Wrap-Around Boundary',
                    question: `Encrypt the letter <strong>'Z'</strong> ($P = 25$) with shift key $k = 9$.<br>Enter the single resulting ciphertext letter.`,
                    correctAnswer: 'I',
                    hint: `Calculate (25 + 9) mod 26 = 34 mod 26. Index 8 is 'I'.`,
                    explanation: `$C = (P + k) \\pmod{26} = (25 + 9) \\pmod{26} = 34 \\pmod{26} = 8$.<br>Letter at index 8 is <strong>'I'</strong>.`
                });

                // Hard: Frequency Analysis Peak Deduction
                pool.push({
                    cipher: 'caesar',
                    difficulty: 'hard',
                    type: 'number',
                    title: 'Caesar Cryptanalysis: Frequency Peak Shift',
                    question: `You perform single-letter frequency analysis on a Caesar-encrypted ciphertext and find that letter <strong>'R'</strong> (index 17) is the dominant peak with 12.8% frequency.<br>Assuming 'R' corresponds to standard English letter <strong>'E'</strong> (index 4), what shift key $k$ was used?`,
                    correctAnswer: '13',
                    hint: `Solve for k in: C = (P + k) mod 26, where C = 17 and P = 4.`,
                    explanation: `Formula: $k = (C - P + 26) \\pmod{26}$.<br>$k = (17 - 4) = 13$. The shift key is <strong>13</strong>.`
                });
            }

            // =================================================================
            // 2. Monoalphabetic Substitution Question Bank (15 Questions)
            // =================================================================
            if (ciphers.indexOf('monoalphabetic') !== -1) {
                var testKey = 'QWERTYUIOPASDFGHJKLZXCVBNM';

                // Easy 1: QWERTY CAB -> EQW
                pool.push({
                    cipher: 'monoalphabetic',
                    difficulty: 'easy',
                    type: 'text',
                    title: 'Monoalphabetic: Substitution Encryption',
                    question: `Given the QWERTY substitution alphabet:<br><span class="mono text-sm">PLAIN : ABCDEFGHIJKLMNOPQRSTUVWXYZ<br>CIPHER: QWERTYUIOPASDFGHJKLZXCVBNM</span><br><br>Encrypt the plaintext word <strong>"CAB"</strong>.`,
                    correctAnswer: 'EQW',
                    hint: `Find each letter in PLAIN and take the corresponding letter in CIPHER: C->E, A->Q, B->W.`,
                    explanation: `Mapping:<br>C (idx 2) $\\to$ E<br>A (idx 0) $\\to$ Q<br>B (idx 1) $\\to$ W<br>Ciphertext: <strong>EQW</strong>`
                });

                // Easy 2: QWERTY BED -> WTR
                pool.push({
                    cipher: 'monoalphabetic',
                    difficulty: 'easy',
                    type: 'text',
                    title: 'Monoalphabetic: Substitution Encryption',
                    question: `Using the QWERTY substitution alphabet:<br><span class="mono text-sm">PLAIN : ABCDEFGHIJKLMNOPQRSTUVWXYZ<br>CIPHER: QWERTYUIOPASDFGHJKLZXCVBNM</span><br><br>Encrypt the plaintext word <strong>"BED"</strong>.`,
                    correctAnswer: 'WTR',
                    hint: `B is index 1 -> W. E is index 4 -> T. D is index 3 -> R.`,
                    explanation: `Mapping:<br>B (idx 1) $\\to$ W<br>E (idx 4) $\\to$ T<br>D (idx 3) $\\to$ R<br>Ciphertext: <strong>WTR</strong>`
                });

                // Easy 3: QWERTY MAP -> DQH
                pool.push({
                    cipher: 'monoalphabetic',
                    difficulty: 'easy',
                    type: 'text',
                    title: 'Monoalphabetic: Substitution Encryption',
                    question: `Using the QWERTY substitution alphabet:<br><span class="mono text-sm">PLAIN : ABCDEFGHIJKLMNOPQRSTUVWXYZ<br>CIPHER: QWERTYUIOPASDFGHJKLZXCVBNM</span><br><br>Encrypt the plaintext word <strong>"MAP"</strong>.`,
                    correctAnswer: 'DQH',
                    hint: `M is index 12 -> D. A is index 0 -> Q. P is index 15 -> H.`,
                    explanation: `Mapping:<br>M (idx 12) $\\to$ D<br>A (idx 0) $\\to$ Q<br>P (idx 15) $\\to$ H<br>Ciphertext: <strong>DQH</strong>`
                });

                // Easy 4: Atbash Encryption
                pool.push({
                    cipher: 'monoalphabetic',
                    difficulty: 'easy',
                    type: 'text',
                    title: 'Atbash Cipher: Reverse Substitution Encryption',
                    question: `In the classic Atbash substitution cipher, the alphabet is reversed ($A \\leftrightarrow Z, B \\leftrightarrow Y, C \\leftrightarrow X, \\dots$).<br>Encrypt the word <strong>"WAR"</strong> into Atbash ciphertext.`,
                    correctAnswer: 'DZI',
                    hint: `Formula: C = 25 - P. W (22) -> 3 (D), A (0) -> 25 (Z), R (17) -> 8 (I).`,
                    explanation: `Atbash maps index $i$ to $25 - i$:<br>W (22) $\\to$ 3 = <strong>D</strong><br>A (0) $\\to$ 25 = <strong>Z</strong><br>R (17) $\\to$ 8 = <strong>I</strong><br>Ciphertext: <strong>DZI</strong>`
                });

                // Medium 1: Decryption ITSSG -> HELLO
                pool.push({
                    cipher: 'monoalphabetic',
                    difficulty: 'medium',
                    type: 'text',
                    title: 'Monoalphabetic: Substitution Decryption',
                    question: `Using the QWERTY substitution alphabet:<br><span class="mono text-sm">PLAIN : ABCDEFGHIJKLMNOPQRSTUVWXYZ<br>CIPHER: QWERTYUIOPASDFGHJKLZXCVBNM</span><br><br>Decrypt the ciphertext word <strong>"ITSSG"</strong>.`,
                    correctAnswer: 'HELLO',
                    hint: `Find each letter in the bottom CIPHER row and read the top PLAIN letter: I->H, T->E, S->L, S->L, G->O.`,
                    explanation: `Mapping in reverse:<br>I $\\to$ H<br>T $\\to$ E<br>S $\\to$ L<br>S $\\to$ L<br>G $\\to$ O<br>Decrypted Plaintext: <strong>HELLO</strong>`
                });

                // Medium 2: Decryption WTZ -> BET
                pool.push({
                    cipher: 'monoalphabetic',
                    difficulty: 'medium',
                    type: 'text',
                    title: 'Monoalphabetic: Substitution Decryption',
                    question: `Using the QWERTY substitution alphabet:<br><span class="mono text-sm">PLAIN : ABCDEFGHIJKLMNOPQRSTUVWXYZ<br>CIPHER: QWERTYUIOPASDFGHJKLZXCVBNM</span><br><br>Decrypt the ciphertext word <strong>"WTZ"</strong>.`,
                    correctAnswer: 'BET',
                    hint: `W is in position 1 in CIPHER (Plain B). T is in position 4 (Plain E). Z is in position 19 (Plain T).`,
                    explanation: `Inverted mapping:<br>W $\\to$ B<br>T $\\to$ E<br>Z $\\to$ T<br>Decrypted Plaintext: <strong>BET</strong>`
                });

                // Medium 3: Decryption QW -> AB
                pool.push({
                    cipher: 'monoalphabetic',
                    difficulty: 'medium',
                    type: 'text',
                    title: 'Monoalphabetic: Substitution Decryption',
                    question: `Using the QWERTY substitution alphabet, decrypt the 2-letter ciphertext <strong>"QW"</strong>.`,
                    correctAnswer: 'AB',
                    hint: `Q maps to A, and W maps to B.`,
                    explanation: `Q $\\to$ A, W $\\to$ B. Decrypted plaintext: <strong>AB</strong>.`
                });

                // Medium 4: Atbash Decryption
                pool.push({
                    cipher: 'monoalphabetic',
                    difficulty: 'medium',
                    type: 'text',
                    title: 'Atbash Cipher: Reverse Substitution Decryption',
                    question: `Decrypt the Atbash ciphertext word <strong>"ML"</strong> ($P = 25 - C$).`,
                    correctAnswer: 'NO',
                    hint: `M is index 12 -> 25 - 12 = 13 (N). L is index 11 -> 25 - 11 = 14 (O).`,
                    explanation: `Atbash decryption:<br>M (12) $\\to 25 - 12 = 13 = $ <strong>N</strong><br>L (11) $\\to 25 - 11 = 14 = $ <strong>O</strong><br>Plaintext: <strong>NO</strong>`
                });

                // Medium 5: Peak Identification
                pool.push({
                    cipher: 'monoalphabetic',
                    difficulty: 'medium',
                    type: 'choice',
                    title: 'Frequency Analysis: Peak Identification',
                    question: `You analyze a 1,000-letter English ciphertext encrypted with a monoalphabetic substitution cipher. The letter <strong>'Z'</strong> appears 128 times (12.8%), and <strong>'P'</strong> appears 92 times (9.2%). Which plaintext letters do 'Z' and 'P' most likely represent?`,
                    options: [
                        'Z represents E, and P represents T',
                        'Z represents T, and P represents E',
                        'Z represents A, and P represents Z',
                        'Z represents S, and P represents H'
                    ],
                    correctAnswer: 'Z represents E, and P represents T',
                    hint: `Recall typical English frequencies: E is ~12.7%, T is ~9.1%.`,
                    explanation: `In standard English text, <strong>'E'</strong> is by far the most frequent letter (~12.7%), followed closely by <strong>'T'</strong> (~9.1%). In monoalphabetic substitution, letter frequencies are fully preserved, so 'Z' (12.8%) is almost certainly 'E' and 'P' (9.2%) is 'T'.`
                });

                // Medium 6: Low Frequency English Letters
                pool.push({
                    cipher: 'monoalphabetic',
                    difficulty: 'medium',
                    type: 'choice',
                    title: 'Frequency Analysis: Low-Frequency Tails',
                    question: `In standard English frequency analysis, which cluster of letters typically exhibits the lowest individual frequencies (under 0.5% each)?`,
                    options: [
                        'Z, Q, X, J',
                        'E, T, A, O',
                        'R, N, S, H',
                        'D, L, C, M'
                    ],
                    correctAnswer: 'Z, Q, X, J',
                    hint: `Think of the rarest letters in English and Scrabble high-value tiles.`,
                    explanation: `The least frequent letters in English are <strong>Z, Q, X, and J</strong> (each typically < 0.2% - 0.5%). Letters like E, T, A, O are top-tier vowels/consonants.`
                });

                // Hard 1: Top English Bigram
                pool.push({
                    cipher: 'monoalphabetic',
                    difficulty: 'hard',
                    type: 'choice',
                    title: 'Cryptanalysis: Digram Frequency Matching',
                    question: `In an English monoalphabetic cryptogram, the bigram <strong>"ZW"</strong> appears far more frequently than any other pair (representing ~3.5% of all bigrams). What English digram does "ZW" most likely represent?`,
                    options: [
                        'TH',
                        'QZ',
                        'XJ',
                        'WW'
                    ],
                    correctAnswer: 'TH',
                    hint: `The most common two-letter pair in the English language starts words like "the", "that", "this".`,
                    explanation: `<strong>TH</strong> is the single most frequent bigram in the English language by a wide margin (~3.56%), followed by HE, IN, ER, AN, and RE.`
                });

                // Hard 2: Pattern Word Analysis
                pool.push({
                    cipher: 'monoalphabetic',
                    difficulty: 'hard',
                    type: 'choice',
                    title: 'Cryptanalysis: Word Pattern Deduction',
                    question: `An encrypted monoalphabetic word has the ciphertext structure <strong>"XYXZWA"</strong>, where the 1st and 3rd letters are identical ($X$). Which English plaintext word matches this letter pattern?`,
                    options: [
                        'SYSTEM',
                        'PEOPLE',
                        'BANANA',
                        'ATTACK'
                    ],
                    correctAnswer: 'SYSTEM',
                    hint: `Look at the pattern: position 1 and 3 are the same letter, and no other letters repeat.`,
                    explanation: `Checking pattern for "XYXZWA":<br>• In <strong>SYSTEM</strong>: S-Y-S-T-E-M has 'S' at index 0 and 2. All other letters (Y, T, E, M) are distinct. Exact match!<br>• PEOPLE has identical letters at 0 and 3 (P-E-O-P).<br>• BANANA repeats at 1, 3, 5 (A-A-A).`
                });

                // Hard 3: Single-Letter English Words
                pool.push({
                    cipher: 'monoalphabetic',
                    difficulty: 'hard',
                    type: 'choice',
                    title: 'Cryptanalysis: Isolated Single-Letter Words',
                    question: `In a monoalphabetic substitution ciphertext with word spaces preserved, you spot two distinct isolated single-letter words: <strong>"X"</strong> and <strong>"Y"</strong>.<br>In standard English grammar, which two letters do these almost certainly represent?`,
                    options: [
                        'A and I',
                        'E and T',
                        'O and U',
                        'S and Z'
                    ],
                    correctAnswer: 'A and I',
                    hint: `What are the only two single-letter words permitted in standard English grammar?`,
                    explanation: `In standard English, the only grammatical single-letter words are <strong>"A"</strong> (indefinite article) and <strong>"I"</strong> (first-person pronoun). Spotting single-letter words provides immediate anchor points in frequency analysis.`
                });

                // Hard 4: Key Space Paradox
                pool.push({
                    cipher: 'monoalphabetic',
                    difficulty: 'hard',
                    type: 'choice',
                    title: 'Monoalphabetic Security: Key Space Paradox',
                    question: `The monoalphabetic cipher key space is $26! \\approx 4.03 \\times 10^{26}$. Why does this enormous key space NOT prevent it from being cracked in minutes by hand?`,
                    options: [
                        'Because frequency analysis eliminates the need to test all keys by directly matching letter probabilities',
                        'Because modular arithmetic can invert the scrambled alphabet in one calculation',
                        'Because computers test 4 × 10²⁶ keys in less than 1 second',
                        'Because the cipher only uses 25 keys effectively'
                    ],
                    correctAnswer: 'Because frequency analysis eliminates the need to test all keys by directly matching letter probabilities',
                    hint: `Exhaustive brute force is impossible ($26!$ takes trillions of years), but frequency analysis is an analytical shortcut.`,
                    explanation: `Exhaustive search of $26!$ is completely impossible by hand or computer. However, an attacker does NOT need to test all keys because each plaintext letter deterministically maps to one ciphertext letter, perfectly preserving English frequency distributions and bigrams.`
                });

                // Hard 5: Caesar vs Monoalphabetic Key Space Comparison
                pool.push({
                    cipher: 'monoalphabetic',
                    difficulty: 'hard',
                    type: 'choice',
                    title: 'Key Space Comparison: Caesar vs Monoalphabetic',
                    question: `How many effective, non-trivial keys exist in the Caesar cipher compared to the Monoalphabetic substitution cipher?`,
                    options: [
                        '25 keys vs 26! (approx 4.03 × 10²⁶) keys',
                        '26 keys vs 26 keys',
                        '500 keys vs 1 million keys',
                        '25 keys vs 25! keys'
                    ],
                    correctAnswer: '25 keys vs 26! (approx 4.03 × 10²⁶) keys',
                    hint: `Caesar shifts by 1 to 25 positions. Monoalphabetic permutes all 26 letters in any order.`,
                    explanation: `Caesar cipher has only <strong>25 non-trivial shift keys</strong> ($k \\in \\{1, \\dots, 25\\}$), easily brute-forced in seconds. Monoalphabetic substitution has <strong>$26! \\approx 4.03 \\times 10^{26}$ keys</strong>.`
                });
            }

            // =================================================================
            // 3. Playfair Cipher Question Bank (15 Questions)
            // =================================================================
            if (ciphers.indexOf('playfair') !== -1) {
                // Easy 1: Digraph prep BALLOON
                pool.push({
                    cipher: 'playfair',
                    difficulty: 'easy',
                    type: 'text',
                    title: 'Playfair Cipher: Digraph Preparation Rules',
                    question: `Prepare the plaintext word <strong>"BALLOON"</strong> into valid Playfair digraph pairs before encryption.<br><small class="text-muted">Separate pairs by spaces (e.g. "AB CD EF"). Handle double letters and odd length with filler 'X'.</small>`,
                    correctAnswer: 'BA LX LO ON',
                    hint: `Pair 1: B-A. Pair 2: L with identical L -> insert X to get L-X. Pair 3: remaining L with O -> L-O. Pair 4: O with N -> O-N.`,
                    explanation: `Tracing "BALLOON":<br>1. Pair 1: 'B', 'A' $\\to$ <strong>BA</strong><br>2. Pair 2: 'L', next is 'L' (same letter in same pair!) $\\to$ insert filler 'X': <strong>LX</strong><br>3. Next letters are 'L', 'O' $\\to$ <strong>LO</strong><br>4. Next letters are 'O', 'N' $\\to$ <strong>ON</strong><br>Resulting digraphs: <strong>BA LX LO ON</strong> (no trailing pad needed as length is 8).`
                });

                // Easy 2: Digraph prep COMMITTEE
                pool.push({
                    cipher: 'playfair',
                    difficulty: 'easy',
                    type: 'text',
                    title: 'Playfair Cipher: Sequential Double Letters',
                    question: `Prepare the plaintext word <strong>"COMMITTEE"</strong> into valid Playfair digraph pairs.<br><small class="text-muted">Separate pairs by spaces (e.g. "AB CD EF..."). Insert filler 'X' for duplicate letters in a pair and pad if needed.</small>`,
                    correctAnswer: 'CO MX MI TX TE EX',
                    hint: `C-O, then M-M splits to M-X, then M-I, then T-T splits to T-X, then T-E, then single E gets padded with X to E-X.`,
                    explanation: `Tracing "COMMITTEE":<br>• C, O $\\to$ <strong>CO</strong><br>• M, M (split with X) $\\to$ <strong>MX</strong><br>• M, I $\\to$ <strong>MI</strong><br>• T, T (split with X) $\\to$ <strong>TX</strong><br>• T, E $\\to$ <strong>TE</strong><br>• E (odd trailing letter, pad with X) $\\to$ <strong>EX</strong><br>Result: <strong>CO MX MI TX TE EX</strong>.`
                });

                // Easy 3: Digraph prep SUCCESS
                pool.push({
                    cipher: 'playfair',
                    difficulty: 'easy',
                    type: 'text',
                    title: 'Playfair Cipher: Double Letter Splitting & Padding',
                    question: `Prepare the word <strong>"SUCCESS"</strong> into valid Playfair digraph pairs.<br><small class="text-muted">Format: pairs separated by single spaces.</small>`,
                    correctAnswer: 'SU CX CE SX SX',
                    hint: `S-U, then C-C splits to C-X, then C-E, then S-S splits to S-X, then trailing S gets padded to S-X.`,
                    explanation: `Digraph division for "SUCCESS":<br>• S, U $\\to$ <strong>SU</strong><br>• C, C (split) $\\to$ <strong>CX</strong><br>• C, E $\\to$ <strong>CE</strong><br>• S, S (split) $\\to$ <strong>SX</strong><br>• S (pad) $\\to$ <strong>SX</strong><br>Result: <strong>SU CX CE SX SX</strong>.`
                });

                // Medium 1: Tricky Digraph LOOKOUT
                pool.push({
                    cipher: 'playfair',
                    difficulty: 'medium',
                    type: 'text',
                    title: 'Playfair Digraphs: Non-Adjacent Pair Integrity',
                    question: `Prepare the word <strong>"LOOKOUT"</strong> into Playfair digraphs.<br>Careful: Do the two 'O' letters get split by 'X'?<br><small class="text-muted">Separate pairs by spaces.</small>`,
                    correctAnswer: 'LO OK OU TX',
                    hint: `Pair 1: L-O. Pair 2: the second O is paired with K (O-K)! Because they are in different pairs, NO filler is inserted between them! Next is O-U, then T-X.`,
                    explanation: `In "LOOKOUT":<br>• Pair 1: 'L', 'O' $\\to$ <strong>LO</strong><br>• Pair 2: The second 'O' falls into the NEXT pair with 'K' $\\to$ <strong>OK</strong> (never insert X if letters are in separate pairs!)<br>• Pair 3: 'O', 'U' $\\to$ <strong>OU</strong><br>• Pair 4: 'T' + pad 'X' $\\to$ <strong>TX</strong><br>Result: <strong>LO OK OU TX</strong>.`
                });

                // Medium 2: Matrix Row 0 for CIPHER
                pool.push({
                    cipher: 'playfair',
                    difficulty: 'medium',
                    type: 'text',
                    title: 'Playfair 5×5 Matrix Construction',
                    question: `Construct the first row (5 letters) of a 5×5 Playfair matrix using the keyword <strong>"CIPHER"</strong>.<br><small class="text-muted">Enter the 5 letters with no spaces.</small>`,
                    correctAnswer: 'CIPHE',
                    hint: `Write the keyword letters without duplicates from left to right. Row 0 holds the first 5 unique letters.`,
                    explanation: `Keyword "CIPHER" has unique letters C, I, P, H, E, R.<br>First row (5 letters): <strong>CIPHE</strong> (letter 'R' starts Row 1).`
                });

                // Medium 3: Matrix Row 0 for MONARCHY
                pool.push({
                    cipher: 'playfair',
                    difficulty: 'medium',
                    type: 'text',
                    title: 'Playfair 5×5 Matrix Construction',
                    question: `Construct the first row (5 letters) of a 5×5 Playfair matrix using the keyword <strong>"MONARCHY"</strong>.`,
                    correctAnswer: 'MONAR',
                    hint: `First 5 unique letters of MONARCHY: M, O, N, A, R.`,
                    explanation: `Keyword letters: M-O-N-A-R-C-H-Y.<br>Row 0 takes the first 5 letters: <strong>MONAR</strong>.`
                });

                // Medium 4: Matrix Deduplication with LABORATORY
                pool.push({
                    cipher: 'playfair',
                    difficulty: 'medium',
                    type: 'text',
                    title: 'Playfair Matrix: Duplicate Keyword Letters',
                    question: `Construct the first row (5 letters) of a 5×5 Playfair matrix using the keyword <strong>"LABORATORY"</strong> (skipping duplicate letters).`,
                    correctAnswer: 'LABOR',
                    hint: `L, A, B, O, R... next A is duplicate, next T is new, next O is duplicate, next R is duplicate, next Y is new. Take first 5.`,
                    explanation: `Unique letters in "LABORATORY": L, A, B, O, R, T, Y.<br>Row 0 takes the first 5 unique letters: <strong>LABOR</strong>.`
                });

                // Medium 5: Same Row Rule AR -> RM
                pool.push({
                    cipher: 'playfair',
                    difficulty: 'medium',
                    type: 'choice',
                    title: 'Playfair Rule Identification: Same Row',
                    question: `In a 5×5 Playfair matrix with keyword <strong>"MONARCHY"</strong>:<br><span class="mono text-sm">M O N A R<br>C H Y B D<br>E F G I K<br>L P Q S T<br>U V W X Z</span><br>What rule applies when encrypting the digraph <strong>"AR"</strong>?`,
                    options: [
                        'Same Row Rule (both letters are in Row 0) -> Shift Right',
                        'Same Column Rule (both letters in same column) -> Shift Down',
                        'Rectangle Rule -> Swap Column Coordinates',
                        'Diagonal Rule -> Invert Matrix'
                    ],
                    correctAnswer: 'Same Row Rule (both letters are in Row 0) -> Shift Right',
                    hint: `Locate 'A' and 'R' in the matrix above: Row 0 has M, O, N, A, R.`,
                    explanation: `'A' is at (row 0, col 3) and 'R' is at (row 0, col 4). Since both letters are in <strong>Row 0</strong>, the <strong>Same Row Rule</strong> applies (shift right with wrap-around). 'A' $\\to$ 'R', and 'R' wraps to 'M'. Encrypted: <strong>RM</strong>.`
                });

                // Medium 6: Same Row Decryption RM -> AR
                pool.push({
                    cipher: 'playfair',
                    difficulty: 'medium',
                    type: 'text',
                    title: 'Playfair Decryption: Same Row Reverse Wrap',
                    question: `Using the "MONARCHY" matrix:<br><span class="mono text-sm">M O N A R<br>C H Y B D<br>E F G I K<br>L P Q S T<br>U V W X Z</span><br>Decrypt the ciphertext digraph <strong>"RM"</strong>.<br><small class="text-muted">Same Row decryption shifts LEFT with circular wrap-around.</small>`,
                    correctAnswer: 'AR',
                    hint: `'R' is at (0, 4) and 'M' is at (0, 0). Move left: R moves left to A. M wraps left to R.`,
                    explanation: `In Row 0: $[M, O, N, A, R]$.<br>Shift left:<br>- 'R' (col 4) moves left to col 3 $\\to$ <strong>'A'</strong>.<br>- 'M' (col 0) wraps left to col 4 $\\to$ <strong>'R'</strong>.<br>Decrypted digraph: <strong>AR</strong>.`
                });

                // Medium 7: Same Column Encryption MC -> CE
                pool.push({
                    cipher: 'playfair',
                    difficulty: 'medium',
                    type: 'text',
                    title: 'Playfair Encryption: Same Column Shift Down',
                    question: `Using the "MONARCHY" matrix:<br><span class="mono text-sm">M O N A R<br>C H Y B D<br>E F G I K<br>L P Q S T<br>U V W X Z</span><br>Encrypt the digraph <strong>"MC"</strong>.<br><small class="text-muted">Both letters are in Column 0. Shift DOWN one row.</small>`,
                    correctAnswer: 'CE',
                    hint: `M is at (0,0) and C is at (1,0). Moving down: M -> C, C -> E.`,
                    explanation: `Column 0 contains $[M, C, E, L, U]$.<br>Shift down:<br>- 'M' (row 0) $\\to$ 'C' (row 1).<br>- 'C' (row 1) $\\to$ 'E' (row 2).<br>Ciphertext: <strong>CE</strong>.`
                });

                // Medium 8: Same Column Decryption CL -> ME
                pool.push({
                    cipher: 'playfair',
                    difficulty: 'medium',
                    type: 'text',
                    title: 'Playfair Decryption: Same Column Shift UP',
                    question: `Using the "MONARCHY" matrix:<br><span class="mono text-sm">M O N A R<br>C H Y B D<br>E F G I K<br>L P Q S T<br>U V W X Z</span><br>Decrypt the ciphertext digraph <strong>"CL"</strong>.`,
                    correctAnswer: 'ME',
                    hint: `'C' (row 1, col 0) moves up to row 0 ('M'). 'L' (row 3, col 0) moves up to row 2 ('E').`,
                    explanation: `Both letters are in Column 0: $[M(0), C(1), E(2), L(3), U(4)]$.<br>Decryption shifts UP:<br>- 'C' at row 1 moves UP to row 0 $\\to$ <strong>'M'</strong>.<br>- 'L' at row 3 moves UP to row 2 $\\to$ <strong>'E'</strong>.<br>Decrypted digraph: <strong>ME</strong>.`
                });

                // Medium 9: Rectangle Rule Encryption EA -> IM
                pool.push({
                    cipher: 'playfair',
                    difficulty: 'medium',
                    type: 'text',
                    title: 'Playfair Encryption: Rectangle Rule',
                    question: `Using the "MONARCHY" matrix:<br><span class="mono text-sm">M O N A R<br>C H Y B D<br>E F G I K<br>L P Q S T<br>U V W X Z</span><br>Encrypt the digraph <strong>"EA"</strong> using the Rectangle Rule.`,
                    correctAnswer: 'IM',
                    hint: `'E' is at (row 2, col 0) and 'A' is at (row 0, col 3). E takes A's column (row 2, col 3) = 'I'. A takes E's column (row 0, col 0) = 'M'.`,
                    explanation: `Rectangle rule:<br>'E' is at $(2, 0)$ and 'A' is at $(0, 3)$.<br>- New first letter: same row as E (2), column of A (3) $\\to$ position $(2, 3) = $ <strong>'I'</strong>.<br>- New second letter: same row as A (0), column of E (0) $\\to$ position $(0, 0) = $ <strong>'M'</strong>.<br>Result: <strong>IM</strong>.`
                });

                // Hard 1: Rectangle Rule Decryption BP -> HS
                pool.push({
                    cipher: 'playfair',
                    difficulty: 'hard',
                    type: 'text',
                    title: 'Playfair Decryption: Rectangle Rule',
                    question: `Using the "MONARCHY" matrix:<br><span class="mono text-sm">M O N A R<br>C H Y B D<br>E F G I K<br>L P Q S T<br>U V W X Z</span><br>Decrypt the ciphertext digraph <strong>"BP"</strong>.`,
                    correctAnswer: 'HS',
                    hint: `'B' is at (1, 3) and 'P' is at (3, 1). B takes P's column (1) -> (1, 1) = 'H'. P takes B's column (3) -> (3, 3) = 'S'.`,
                    explanation: `Rectangle rule in reverse (column swap is self-inverse):<br>• 'B' at $(1, 3)$, 'P' at $(3, 1)$.<br>• B takes column 1 $\\to (1, 1) = $ <strong>'H'</strong>.<br>• P takes column 3 $\\to (3, 3) = $ <strong>'S'</strong>.<br>Decrypted plaintext: <strong>HS</strong>.`
                });

                // Hard 2: Rectangle Rule Encryption HS -> BP
                pool.push({
                    cipher: 'playfair',
                    difficulty: 'hard',
                    type: 'text',
                    title: 'Playfair Encryption: Rectangle Rule',
                    question: `Using the "MONARCHY" matrix:<br><span class="mono text-sm">M O N A R<br>C H Y B D<br>E F G I K<br>L P Q S T<br>U V W X Z</span><br>Encrypt the digraph <strong>"HS"</strong>.`,
                    correctAnswer: 'BP',
                    hint: `'H' is at (1, 1) and 'S' is at (3, 3). H takes S's column (3) -> 'B'. S takes H's column (1) -> 'P'.`,
                    explanation: `'H' $(1, 1)$ and 'S' $(3, 3)$ form a rectangle corners:<br>• H takes column 3 $\\to (1, 3) = $ <strong>'B'</strong>.<br>• S takes column 1 $\\to (3, 1) = $ <strong>'P'</strong>.<br>Ciphertext: <strong>BP</strong>.`
                });

                // Hard 3: Security Invariant / Digraph Frequency
                pool.push({
                    cipher: 'playfair',
                    difficulty: 'hard',
                    type: 'choice',
                    title: 'Cryptanalysis: Playfair Frequency Resistance',
                    question: `Why does the Playfair cipher provide significantly stronger resistance to frequency analysis than Caesar or Monoalphabetic substitution?`,
                    options: [
                        'Because encrypting digraph pairs spreads 26 letters into 600+ pairs, flattening single-letter frequency spikes',
                        'Because it rotates the 5×5 matrix 90 degrees after every pair is encrypted',
                        'Because it uses modern 128-bit modular exponential arithmetic',
                        'Because no consonants are ever encrypted'
                    ],
                    correctAnswer: 'Because encrypting digraph pairs spreads 26 letters into 600+ pairs, flattening single-letter frequency spikes',
                    hint: `Think about analyzing single letters (26 possibilities) versus pairs of letters (25 × 24 = 600 possibilities).`,
                    explanation: `In Playfair, encryption operates on <strong>digraphs (pairs of letters)</strong> rather than individual characters. This expands the unit of substitution from 26 letters to $25 \\times 25 - 25 = 600$ valid digraph pairs, dramatically flattening English single-letter frequency spikes and requiring a much larger ciphertext volume for statistical cryptanalysis.`
                });
            }

            // Shuffle pool and return requested count
            var filtered = pool.filter(function(q) {
                if (difficulty === 'all') return true;
                if (difficulty === 'easy') return q.difficulty === 'easy';
                if (difficulty === 'medium') return q.difficulty === 'medium' || q.difficulty === 'easy';
                if (difficulty === 'hard') return true;
                return true;
            });

            // If not enough questions in filter, use all available
            var selected = (filtered.length >= count) ? filtered : pool;
            var shuffled = utils.shuffleArray(selected);
            return shuffled.slice(0, Math.min(count, shuffled.length));
        }

        app.exam = {
            generateExamQuestions: generateExamQuestions,
            solveChallenge1: function(k, plain) {
                var expected = "THEEXPEDITIONHASSUCCEEDEDMEETATTHERIVER";
                return k === 3 && utils.cleanText(plain) === expected;
            },
            solveChallenge2: function(plain) {
                return utils.cleanText(plain) === "ARBYBGRL";
            },
            solveChallenge3: function(plain) {
                var clean = utils.cleanText(plain);
                return clean === "INSTRUMENTS" || clean === "INSTRUMENTSX";
            },
            solveChallenge4: function(plain) {
                return utils.cleanText(plain) === "THESECRETISSAFE";
            }
        };

        app.registerModule('exam', function(container) {
            var examState = {
                isActive: false,
                timerInterval: null,
                timeRemaining: 0,
                totalSeconds: 0,
                cipherFilter: 'all',
                difficulty: 'medium',
                questionCount: 10,
                currentIndex: 0,
                questions: [],
                userAnswers: [],
                results: null
            };

            // Render configuration screen
        function renderExamConfig() {
            var html = `
            <div class="section-content">
                <div class="hero-banner" style="background: linear-gradient(135deg, #dc2626 0%, #991b1b 100%);">
                    <h1>📝 Cryptography Practical Exam Simulation</h1>
                    <p class="hero-subtitle">Timed mock examination with auto-grading, step-by-step solutions &amp; weak spot diagnosis</p>
                </div>

                <div class="card">
                    <div class="card-header" style="background: var(--bg-surface-elevated);">
                        <h3>⚙️ Exam Setup &amp; Configuration</h3>
                    </div>
                    <div class="card-body">
                        <div class="grid-2col">
                            <div>
                                <div class="input-group">
                                    <label><strong>Select Cipher Scope:</strong></label>
                                    <select id="exam-cipher-select">
                                        <option value="all" selected>All Ciphers (Comprehensive Practical)</option>
                                        <option value="caesar">Caesar Cipher Only</option>
                                        <option value="monoalphabetic">Monoalphabetic Substitution Only</option>
                                        <option value="playfair">Playfair Cipher Only</option>
                                    </select>
                                </div>

                                <div class="input-group">
                                    <label><strong>Difficulty Level:</strong></label>
                                    <div class="difficulty-selector" id="exam-difficulty-btns" style="justify-content: flex-start;">
                                        <button class="btn btn-secondary btn-sm" data-diff="easy">Easy (Fundamentals)</button>
                                        <button class="btn btn-primary btn-sm selected" data-diff="medium">Intermediate</button>
                                        <button class="btn btn-secondary btn-sm" data-diff="hard">Difficult (Exam Tough)</button>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <div class="input-group">
                                    <label><strong>Number of Questions:</strong></label>
                                    <select id="exam-count-select">
                                        <option value="5">5 Questions (Quick Drill - 5 mins)</option>
                                        <option value="10" selected>10 Questions (Standard Lab Exam - 15 mins)</option>
                                        <option value="15">15 Questions (Full Practice Test - 25 mins)</option>
                                    </select>
                                </div>

                                <div class="input-group">
                                    <label><strong>Timer Mode:</strong></label>
                                    <select id="exam-timer-select">
                                        <option value="10" selected>10 Minutes (Recommended)</option>
                                        <option value="15">15 Minutes</option>
                                        <option value="20">20 Minutes</option>
                                        <option value="0">Untimed Practice Mode</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div class="alert alert-warning" style="margin-top: 1rem;">
                            ⚠️ <strong>Exam Instructions:</strong><br>
                            1. Questions require manual problem-solving (modular arithmetic, matrix coordinate lookups, frequency deductions).<br>
                            2. You may use scratch paper. Answers are verified automatically with partial credit where applicable.<br>
                            3. You can review detailed step-by-step solutions after submission to prepare for your laboratory test.
                        </div>

                        <div style="text-align: center; margin-top: 1.5rem;">
                            <button id="btn-start-exam" class="btn btn-danger" style="padding: 0.8rem 2.5rem; font-size: 1.1rem;">
                                🚀 Start Practical Exam Now
                            </button>
                        </div>
                    </div>
                </div>

                ${(function() {
                    var history = (utils.storage && utils.storage.get) ? utils.storage.get('exam_history', []) : [];
                    if (!history || history.length === 0) return '';

                    var bestPct = 0;
                    var bestGrade = 'F';
                    history.forEach(function(h) {
                        if (h.pct > bestPct) {
                            bestPct = h.pct;
                            bestGrade = h.grade;
                        }
                    });

                    var bestColor = bestPct >= 80 ? 'var(--success)' : (bestPct >= 60 ? 'var(--warning)' : 'var(--danger)');

                    return `
                    <div class="card" style="margin-top: 1.5rem;" id="exam-history-card">
                        <div class="card-header" style="background: var(--bg-surface-elevated); display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.5rem;">
                            <div style="display: flex; align-items: center; gap: 0.5rem;">
                                <h3>📊 Past Exam Performance &amp; Records</h3>
                            </div>
                            <div style="display: flex; align-items: center; gap: 0.75rem;">
                                <span class="badge" style="background: ${bestColor}; font-weight: 700;">Personal Best: ${bestPct}% (Grade ${bestGrade})</span>
                                <button class="btn btn-secondary btn-sm" id="btn-clear-exam-history" style="padding: 0.35rem 0.75rem; font-size: 0.8rem;">🗑️ Clear Records</button>
                            </div>
                        </div>
                        <div class="card-body">
                            <div class="table-responsive">
                                <table class="styled-table" style="font-size: 0.88rem;">
                                    <thead>
                                        <tr>
                                            <th>Date &amp; Time</th>
                                            <th>Cipher Scope</th>
                                            <th>Difficulty</th>
                                            <th>Score</th>
                                            <th>Percentage</th>
                                            <th>Grade</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        ${history.map(function(item) {
                                            var badgeCls = item.grade === 'A' ? 'badge-success' : (item.grade === 'B' ? 'badge-info' : (item.grade === 'C' ? 'badge-warning' : 'badge-danger'));
                                            var cipherLabel = item.cipher === 'all' ? 'All Ciphers' : (item.cipher === 'caesar' ? 'Caesar' : (item.cipher === 'monoalphabetic' ? 'Monoalphabetic' : 'Playfair'));
                                            return `
                                            <tr>
                                                <td style="color: var(--text-secondary);">${item.date || 'Recent'}</td>
                                                <td><strong>${cipherLabel}</strong></td>
                                                <td style="text-transform: capitalize;">${item.difficulty}</td>
                                                <td class="mono">${item.score} / ${item.total}</td>
                                                <td class="mono font-bold">${item.pct}%</td>
                                                <td><span class="badge ${badgeCls}">${item.grade}</span></td>
                                            </tr>`;
                                        }).join('')}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>`;
                })()}

            </div>`;

            container.innerHTML = html;

            // Clear history button
            var clearBtn = container.querySelector('#btn-clear-exam-history');
            if (clearBtn) {
                clearBtn.addEventListener('click', function() {
                    if (confirm('Clear your past exam performance history?')) {
                        if (utils.storage && utils.storage.remove) {
                            utils.storage.remove('exam_history');
                        }
                        renderExamConfig();
                        if (utils.showToast) utils.showToast('Exam history cleared.', 'info');
                    }
                });
            }

            // Difficulty buttons
            container.querySelectorAll('#exam-difficulty-btns button').forEach(function(btn) {
                btn.addEventListener('click', function() {
                    container.querySelectorAll('#exam-difficulty-btns button').forEach(b => {
                        b.className = 'btn btn-secondary btn-sm';
                    });
                    this.className = 'btn btn-primary btn-sm selected';
                    examState.difficulty = this.dataset.diff;
                });
            });

            // Start button
            container.querySelector('#btn-start-exam').addEventListener('click', function() {
                var cipherScope = container.querySelector('#exam-cipher-select').value;
                var count = parseInt(container.querySelector('#exam-count-select').value, 10);
                var minutes = parseInt(container.querySelector('#exam-timer-select').value, 10);

                startExam(cipherScope, examState.difficulty, count, minutes);
            });
        }

        // Start active exam
        function startExam(cipherScope, difficulty, count, minutes) {
            examState.isActive = true;
            examState.cipherFilter = cipherScope;
            examState.difficulty = difficulty;
            examState.questionCount = count;
            examState.currentIndex = 0;
            examState.questions = generateExamQuestions(cipherScope, difficulty, count);
            examState.userAnswers = new Array(examState.questions.length).fill(null);
            examState.totalSeconds = minutes * 60;
            examState.timeRemaining = minutes * 60;

            renderActiveQuestion();
            startTimer(minutes);
        }

        function startTimer(minutes) {
            if (examState.timerInterval) clearInterval(examState.timerInterval);
            if (minutes <= 0) return; // Untimed

            examState.timerInterval = setInterval(function() {
                examState.timeRemaining--;
                var timerEl = container.querySelector('#exam-live-timer');
                if (timerEl) {
                    var m = Math.floor(examState.timeRemaining / 60);
                    var s = examState.timeRemaining % 60;
                    timerEl.textContent = (m < 10 ? '0' : '') + m + ':' + (s < 10 ? '0' : '') + s;

                    if (examState.timeRemaining <= 60) {
                        timerEl.className = 'timer-display danger';
                    } else if (examState.timeRemaining <= 300) {
                        timerEl.className = 'timer-display warning';
                    } else {
                        timerEl.className = 'timer-display';
                    }
                }

                if (examState.timeRemaining <= 0) {
                    clearInterval(examState.timerInterval);
                    alert("⏰ Time is up! Submitting your exam automatically...");
                    finishExam();
                }
            }, 1000);
        }

        function renderActiveQuestion() {
            var q = examState.questions[examState.currentIndex];
            var qIndex = examState.currentIndex + 1;
            var totalQ = examState.questions.length;
            var progressPct = Math.round((qIndex / totalQ) * 100);

            var timerDisplayHtml = (examState.totalSeconds > 0) ? `
                <div style="text-align: right;">
                    <div style="font-size: 0.75rem; color: var(--gray-500); text-transform: uppercase; font-weight: 700;">Time Remaining</div>
                    <div id="exam-live-timer" class="timer-display" style="font-size: 1.5rem; padding: 0;">--:--</div>
                </div>` : `
                <div style="text-align: right;">
                    <span class="badge badge-success">Untimed Mode</span>
                </div>`;

            var inputWidgetHtml = '';
            if (q.type === 'choice') {
                inputWidgetHtml = `
                <div style="display: flex; flex-direction: column; gap: 0.5rem; margin: 1.25rem 0;">
                    ${q.options.map((opt, i) => `
                        <label style="display: flex; align-items: center; gap: 0.75rem; padding: 0.75rem 1rem; border: 2px solid var(--gray-200); border-radius: var(--radius); cursor: pointer; transition: all 0.2s;" class="exam-choice-option">
                            <input type="radio" name="exam-choice" value="${utils.escapeHtml(opt)}" style="width: auto;">
                            <span>${opt}</span>
                        </label>
                    `).join('')}
                </div>`;
            } else {
                inputWidgetHtml = `
                <div class="input-group" style="margin: 1.25rem 0;">
                    <label><strong>Your Answer:</strong></label>
                    <input type="text" id="exam-text-answer" class="mono" style="font-size: 1.1rem; text-transform: uppercase;" placeholder="Enter answer here..." autofocus autocomplete="off">
                </div>`;
            }

            var html = `
            <div class="section-content">
                <!-- Exam Top Bar -->
                <div class="exam-top-hud" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; background: var(--bg-surface-elevated); border: 1px solid var(--border-medium); padding: 0.75rem 1.25rem; border-radius: var(--radius); box-shadow: var(--shadow);">
                    <div class="exam-top-meta">
                        <span class="badge" style="background: var(--${q.cipher === 'monoalphabetic' ? 'mono' : q.cipher}-color);">${q.cipher.toUpperCase()}</span>
                        <span class="badge badge-${q.difficulty === 'easy' ? 'success' : q.difficulty === 'medium' ? 'warning' : 'danger'}" style="margin-left: 0.5rem;">${q.difficulty.toUpperCase()}</span>
                        <span class="exam-q-counter" style="margin-left: 0.75rem; font-weight: 700;">Question ${qIndex} of ${totalQ}</span>
                    </div>
                    ${timerDisplayHtml}
                </div>

                <!-- Progress Bar -->
                <div class="progress-bar" style="margin-bottom: 1.5rem; height: 6px;">
                    <div class="progress-fill" style="width: ${progressPct}%; background-color: ${utils.getProgressColor ? utils.getProgressColor(progressPct) : 'var(--primary)'}; box-shadow: 0 0 8px ${utils.getProgressGlow ? utils.getProgressGlow(progressPct) : 'var(--primary-glow)'};"></div>
                </div>

                <!-- Question Card -->
                <div class="card" id="active-question-card">
                    <div class="card-header" style="background: var(--primary);">
                        <h3>${q.title}</h3>
                    </div>
                    <div class="card-body">
                        <div style="font-size: 1.05rem; line-height: 1.6;">
                            ${q.question}
                        </div>

                        ${inputWidgetHtml}

                        <!-- Action Buttons -->
                        <div class="exam-actions-bar" style="display: flex; justify-content: space-between; align-items: center; margin-top: 1.5rem; border-top: 1px solid var(--gray-200); padding-top: 1rem;">
                            <button id="btn-exam-hint" class="btn btn-secondary btn-sm">💡 Request Hint (-10% penalty)</button>
                            <div class="exam-submit-group" style="display: flex; gap: 0.75rem;">
                                <button id="btn-exam-skip" class="btn btn-secondary">Skip ↷</button>
                                <button id="btn-exam-submit" class="btn btn-primary">Submit Answer ✓</button>
                            </div>
                        </div>

                        <!-- Hint Box -->
                        <div id="exam-hint-box" class="exercise-hint" style="margin-top: 1rem;">
                            <strong>Hint:</strong> ${q.hint}
                        </div>

                        <!-- Solution Box (hidden until answered) -->
                        <div id="exam-feedback-box" class="exercise-feedback" style="margin-top: 1rem;"></div>
                    </div>
                </div>
            </div>`;

            container.innerHTML = html;

            // Highlight choice options when clicked
            container.querySelectorAll('.exam-choice-option').forEach(function(opt) {
                opt.addEventListener('click', function() {
                    container.querySelectorAll('.exam-choice-option').forEach(o => o.style.borderColor = 'var(--gray-200)');
                    this.style.borderColor = 'var(--primary)';
                });
            });

            // Hint toggle
            var hintRequested = false;
            container.querySelector('#btn-exam-hint').addEventListener('click', function() {
                hintRequested = true;
                container.querySelector('#exam-hint-box').classList.toggle('show');
            });

            // Skip
            container.querySelector('#btn-exam-skip').addEventListener('click', function() {
                recordAnswer(null, false, 0, "Question skipped");
                advanceNext();
            });

            // Submit
            var submitted = false;
            container.querySelector('#btn-exam-submit').addEventListener('click', function() {
                if (submitted) { advanceNext(); return; }
                var answer = '';
                if (q.type === 'choice') {
                    var selected = container.querySelector('input[name="exam-choice"]:checked');
                    if (!selected) {
                        alert("Please select an answer before submitting.");
                        return;
                    }
                    answer = selected.value;
                } else {
                    answer = container.querySelector('#exam-text-answer').value.trim();
                    if (!answer) {
                        alert("Please enter your answer before submitting.");
                        return;
                    }
                }

                // Verify correctness
                var isCorrect = false;
                var normUser = utils.cleanText(answer);
                var normAns = utils.cleanText(q.correctAnswer);

                if (q.type === 'choice') {
                    isCorrect = (answer === q.correctAnswer);
                } else {
                    isCorrect = (normUser === normAns);
                }

                var points = isCorrect ? (hintRequested ? 0.9 : 1.0) : 0;
                recordAnswer(answer, isCorrect, points, q.explanation);
                submitted = true;

                // Show instant solution and change button to "Next Question"
                var fb = container.querySelector('#exam-feedback-box');
                fb.classList.add('show');
                if (isCorrect) {
                    fb.className = 'exercise-feedback show correct-feedback';
                    fb.innerHTML = `<strong>🎉 Correct!</strong> (${Math.round(points * 100)}% credit)<br>${q.explanation}`;
                } else {
                    fb.className = 'exercise-feedback show incorrect-feedback';
                    fb.innerHTML = `<strong>❌ Incorrect.</strong> Correct answer: <span class="highlight-plain mono">${q.correctAnswer}</span><br>${q.explanation}`;
                }

                // Transform action button into next
                var submitBtn = container.querySelector('#btn-exam-submit');
                submitBtn.textContent = (examState.currentIndex + 1 < examState.questions.length) ? 'Next Question ➜' : 'View Exam Results 🏁';
                submitBtn.className = 'btn btn-success';

                // Disable inputs
                container.querySelectorAll('input').forEach(i => i.disabled = true);
                container.querySelector('#btn-exam-skip').disabled = true;
                container.querySelector('#btn-exam-hint').disabled = true;
            });
        }

        function recordAnswer(answer, isCorrect, points, explanation) {
            examState.userAnswers[examState.currentIndex] = {
                question: examState.questions[examState.currentIndex],
                userAnswer: answer,
                isCorrect: isCorrect,
                points: points,
                explanation: explanation
            };
        }

        function advanceNext() {
            examState.currentIndex++;
            if (examState.currentIndex < examState.questions.length) {
                renderActiveQuestion();
            } else {
                finishExam();
            }
        }

        function finishExam() {
            if (examState.timerInterval) clearInterval(examState.timerInterval);
            examState.isActive = false;

            var totalPossible = examState.questions.length;
            var earnedPoints = 0;
            var correctCount = 0;
            var cipherStats = { caesar: { total: 0, correct: 0 }, monoalphabetic: { total: 0, correct: 0 }, playfair: { total: 0, correct: 0 } };

            examState.userAnswers.forEach(function(rec, idx) {
                var q = examState.questions[idx];
                var c = q.cipher;
                if (!cipherStats[c]) cipherStats[c] = { total: 0, correct: 0 };
                cipherStats[c].total++;

                if (rec && rec.isCorrect) {
                    correctCount++;
                    earnedPoints += rec.points;
                    cipherStats[c].correct++;
                }
            });

            var scorePct = Math.round((earnedPoints / totalPossible) * 100);
            var grade = 'F';
            var gradeColor = 'var(--danger)';
            if (scorePct >= 90) { grade = 'A'; gradeColor = 'var(--success)'; }
            else if (scorePct >= 80) { grade = 'B'; gradeColor = 'var(--info)'; }
            else if (scorePct >= 70) { grade = 'C'; gradeColor = 'var(--warning)'; }
            else if (scorePct >= 60) { grade = 'D'; gradeColor = 'var(--warning-dark)'; }

            // Save attempt to exam history
            if (utils.storage && utils.storage.get && utils.storage.set) {
                var history = utils.storage.get('exam_history', []);
                var newAttempt = {
                    date: new Date().toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
                    score: Number(earnedPoints.toFixed(1)),
                    total: totalPossible,
                    pct: scorePct,
                    grade: grade,
                    difficulty: examState.difficulty,
                    cipher: examState.cipherFilter
                };
                history.unshift(newAttempt);
                if (history.length > 15) history = history.slice(0, 15);
                utils.storage.set('exam_history', history);
            }

            var html = `
            <div class="section-content">
                <div class="hero-banner" style="background: linear-gradient(135deg, #1f2937 0%, #111827 100%);">
                    <h1>🏁 Examination Results &amp; Evaluation</h1>
                    <p class="hero-subtitle">Comprehensive performance breakdown for your Cryptography Practical Exam</p>
                </div>

                <!-- Big Score Card -->
                <div class="card">
                    <div class="card-body" style="text-align: center; padding: 2rem 1.5rem;">
                        <div style="font-size: 1rem; color: var(--gray-500); text-transform: uppercase; font-weight: 700; letter-spacing: 0.05em;">Final Exam Grade</div>
                        <div class="score-big" style="color: ${gradeColor}; font-size: 4rem; line-height: 1;">
                            ${grade}
                        </div>
                        <div style="font-size: 1.5rem; font-weight: 700; margin: 0.5rem 0;">
                            ${earnedPoints.toFixed(1)} / ${totalPossible} Points (${scorePct}%)
                        </div>
                        <p class="text-muted" style="max-width: 500px; margin: 0 auto 1.5rem auto;">
                            ${scorePct >= 80 ? '🎉 Excellent work! You have strong grasp of classical cipher mechanics and are ready for the practical exam.' :
                              scorePct >= 60 ? '👍 Solid foundation, but review weak spots below to ensure high scores in manual calculations.' :
                              '⚠️ More practice recommended. Review the step-by-step solutions below and retry the missed questions.'}
                        </p>

                        <div style="display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap;">
                            <button id="btn-exam-retry-missed" class="btn btn-warning">🔄 Retry Missed Questions</button>
                            <button id="btn-exam-new" class="btn btn-primary">📝 Start New Practice Exam</button>
                        </div>
                    </div>
                </div>

                <!-- Topic Breakdown -->
                <div class="grid-3col">
                    <div class="card">
                        <div class="card-header" style="background: var(--caesar-color);">
                            <h3>🔄 Caesar Cipher</h3>
                        </div>
                        <div class="card-body text-center">
                            <div style="font-size: 2rem; font-weight: 700; color: var(--caesar-color);">
                                ${cipherStats.caesar.total > 0 ? Math.round((cipherStats.caesar.correct / cipherStats.caesar.total)*100) : 0}%
                            </div>
                            <p class="text-sm text-muted">${cipherStats.caesar.correct} of ${cipherStats.caesar.total} correct</p>
                        </div>
                    </div>

                    <div class="card">
                        <div class="card-header" style="background: var(--mono-color);">
                            <h3>🔤 Monoalphabetic</h3>
                        </div>
                        <div class="card-body text-center">
                            <div style="font-size: 2rem; font-weight: 700; color: var(--mono-color);">
                                ${cipherStats.monoalphabetic.total > 0 ? Math.round((cipherStats.monoalphabetic.correct / cipherStats.monoalphabetic.total)*100) : 0}%
                            </div>
                            <p class="text-sm text-muted">${cipherStats.monoalphabetic.correct} of ${cipherStats.monoalphabetic.total} correct</p>
                        </div>
                    </div>

                    <div class="card">
                        <div class="card-header" style="background: var(--playfair-color);">
                            <h3>🔲 Playfair Cipher</h3>
                        </div>
                        <div class="card-body text-center">
                            <div style="font-size: 2rem; font-weight: 700; color: var(--playfair-color);">
                                ${cipherStats.playfair.total > 0 ? Math.round((cipherStats.playfair.correct / cipherStats.playfair.total)*100) : 0}%
                            </div>
                            <p class="text-sm text-muted">${cipherStats.playfair.correct} of ${cipherStats.playfair.total} correct</p>
                        </div>
                    </div>
                </div>

                <!-- Detailed Question Review List -->
                <div class="card" style="margin-top: 1.5rem;">
                    <div class="card-header" style="background: var(--bg-surface-elevated);">
                        <h3>📋 Detailed Question Review &amp; Solutions</h3>
                    </div>
                    <div class="card-body">
                        ${examState.questions.map(function(q, i) {
                            var ans = examState.userAnswers[i];
                            var wasCorrect = ans && ans.isCorrect;
                            return `
                            <div class="exercise-box ${wasCorrect ? 'correct' : 'incorrect'}" style="margin-bottom: 1.5rem;">
                                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
                                    <strong>Question ${i + 1}: ${q.title}</strong>
                                    <span class="badge ${wasCorrect ? 'badge-success' : 'badge-danger'}">
                                        ${wasCorrect ? '✓ Correct' : '✗ Missed'}
                                    </span>
                                </div>
                                <p style="font-size: 0.95rem;">${q.question}</p>
                                
                                <div style="font-size: 0.9rem; margin: 0.5rem 0;">
                                    <div><strong>Your Answer:</strong> <span class="mono">${ans && ans.userAnswer ? utils.escapeHtml(ans.userAnswer) : '<em>(Skipped)</em>'}</span></div>
                                    <div><strong>Correct Answer:</strong> <span class="mono highlight-plain">${q.correctAnswer}</span></div>
                                </div>

                                <div class="alert alert-info text-sm" style="margin-top: 0.5rem; margin-bottom: 0;">
                                    <strong>Step-by-Step Solution:</strong><br>${q.explanation}
                                </div>
                            </div>`;
                        }).join('')}
                    </div>
                </div>
            </div>`;

            container.innerHTML = html;

            container.querySelector('#btn-exam-new').addEventListener('click', function() {
                renderExamConfig();
            });

            container.querySelector('#btn-exam-retry-missed').addEventListener('click', function() {
                var missed = [];
                examState.userAnswers.forEach((ans, i) => {
                    if (!ans || !ans.isCorrect) missed.push(examState.questions[i]);
                });

                if (missed.length === 0) {
                    alert("Awesome! You answered every question correctly. Starting a fresh exam instead.");
                    renderExamConfig();
                    return;
                }

                examState.questions = missed;
                examState.questionCount = missed.length;
                examState.currentIndex = 0;
                examState.userAnswers = new Array(missed.length).fill(null);
                examState.totalSeconds = missed.length * 90;
                examState.timeRemaining = missed.length * 90;
                examState.isActive = true;

                renderActiveQuestion();
                startTimer(Math.ceil(examState.totalSeconds / 60));
            });
        }

        // Initial setup render
        renderExamConfig();
    });


    // =========================================================================
    // MODULE 3: REVIEW & REFERENCE (section-review)
    // =========================================================================
    app.registerModule('review', function(container) {
        var html = `
        <div class="section-content">
            <div class="hero-banner" style="background: linear-gradient(135deg, #10b981 0%, #047857 100%);">
                <h1>📋 Final Review, Cheat Sheets &amp; Challenges</h1>
                <p class="hero-subtitle">Essential formulas, exam pitfalls, solving algorithms &amp; "Can You Solve This?" mystery challenges</p>
            </div>

            <!-- Master Reference Cards Grid -->
            <div class="grid-2col">
                <!-- Caesar Card -->
                <div class="card">
                    <div class="card-header" style="background: var(--caesar-color);">
                        <h3>🔄 Caesar Cipher Quick Reference</h3>
                    </div>
                    <div class="card-body">
                        <div class="formula">
                            <div>Encryption: <span class="formula-var cipher">C</span> = (<span class="formula-var plain">P</span> + <span class="formula-var key">k</span>) mod 26</div>
                            <div style="margin-top: 0.35rem;">Decryption: <span class="formula-var plain">P</span> = (<span class="formula-var cipher">C</span> - <span class="formula-var key">k</span> + 26) mod 26</div>
                        </div>
                        <p class="text-sm"><strong>Key Points to Remember:</strong></p>
                        <ul class="text-sm">
                            <li>$A=0, B=1, C=2, \\dots, Z=25$ ($0$-indexed alphabet).</li>
                            <li>Always add $+26$ before modulo during decryption to prevent negative numbers in JavaScript/C.</li>
                            <li>Only $25$ non-trivial keys ($k=0$ leaves text unencrypted).</li>
                            <li>Brute force is trivially done by writing down the 25 alphabet shifts.</li>
                        </ul>
                    </div>
                </div>

                <!-- Monoalphabetic Card -->
                <div class="card">
                    <div class="card-header" style="background: var(--mono-color);">
                        <h3>🔤 Monoalphabetic Substitution Quick Reference</h3>
                    </div>
                    <div class="card-body">
                        <div class="formula">
                            <div>Key Space = 26! ≈ 4.03 × 10²⁶</div>
                            <div class="formula-explain text-center">Top Frequency: E, T, A, O, I, N, S, H, R, D, L, U</div>
                        </div>
                        <p class="text-sm"><strong>Key Points to Remember:</strong></p>
                        <ul class="text-sm">
                            <li>Key is an arbitrary permutation of all 26 letters (no duplicate mapping allowed).</li>
                            <li>Single-letter frequency is 100% preserved.</li>
                            <li>Top English bigrams to look for: <strong>TH, HE, IN, ER, AN, RE, ON, AT, EN, ND</strong>.</li>
                            <li>Single-letter words in English are almost always <strong>'A'</strong> or <strong>'I'</strong>.</li>
                        </ul>
                    </div>
                </div>
            </div>

            <!-- Playfair Card Full Width -->
            <div class="card">
                <div class="card-header" style="background: var(--playfair-color);">
                    <h3>🔲 Playfair 5×5 Matrix &amp; Three Rules Summary</h3>
                </div>
                <div class="card-body">
                    <div class="grid-2col">
                        <div>
                            <h4>Matrix Construction &amp; Digraph Prep</h4>
                            <ol class="text-sm">
                                <li>Keyword deduplication: write keyword without duplicate letters.</li>
                                <li>Fill 5×5 grid with keyword letters, then remaining alphabet.</li>
                                <li>Combine <strong>I and J</strong> into one cell.</li>
                                <li>Replace all 'J' with 'I' in plaintext.</li>
                                <li>Split into pairs. If identical letters occur in a pair (e.g. "EE"), insert filler <strong>'X'</strong> ("EX", "E_").</li>
                                <li>If final letter is lone, append <strong>'X'</strong> (or 'Z' if ending on X).</li>
                            </ol>
                        </div>
                        <div>
                            <h4>The Three Transformation Rules</h4>
                            <div class="step-display">
                                <div class="step-item">
                                    <div class="step-number" style="background: #ef4444;">1</div>
                                    <div class="step-content"><strong>Same Row:</strong> Shift <strong>RIGHT</strong> (encrypt) / <strong>LEFT</strong> (decrypt) with wrap-around.</div>
                                </div>
                                <div class="step-item">
                                    <div class="step-number" style="background: #3b82f6;">2</div>
                                    <div class="step-content"><strong>Same Column:</strong> Shift <strong>DOWN</strong> (encrypt) / <strong>UP</strong> (decrypt) with wrap-around.</div>
                                </div>
                                <div class="step-item">
                                    <div class="step-number" style="background: #8b5cf6;">3</div>
                                    <div class="step-content"><strong>Rectangle:</strong> Swap columns! Each letter takes its partner's column coordinate in its own row. (Identical in both directions).</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Common Exam Mistakes To Avoid -->
            <div class="card">
                <div class="card-header" style="background: var(--danger);">
                    <h3>⚠️ Top 6 Common Exam Traps &amp; How to Avoid Them</h3>
                </div>
                <div class="card-body">
                    <div class="step-display">
                        <div class="step-item">
                            <div class="step-number" style="background: var(--danger);">1</div>
                            <div class="step-content">
                                <strong>Forgetting +26 in Modular Decryption:</strong><br>
                                In Caesar, if $C = 'B' (1)$ and $k = 5$, calculating $1 - 5 = -4$. Many students write $-4$. Always add 26: $(-4 + 26) \\pmod{26} = 22 = 'W'$.
                            </div>
                        </div>
                        <div class="step-item">
                            <div class="step-number" style="background: var(--danger);">2</div>
                            <div class="step-content">
                                <strong>Failing to Handle Double Letters in Playfair Plaintext:</strong><br>
                                In "BALLOON", students frequently pair it as "BA-LL-OO-NX". <strong>Wrong!</strong> "LL" cannot be a digraph. You must insert 'X' immediately after the first 'L': "BA-LX-LO-ON".
                            </div>
                        </div>
                        <div class="step-item">
                            <div class="step-number" style="background: var(--danger);">3</div>
                            <div class="step-content">
                                <strong>Confusing Playfair Encrypt vs Decrypt Directions:</strong><br>
                                Remember: <em>Encrypt = Right &amp; Down</em>. <em>Decrypt = Left &amp; Up</em>. The Rectangle rule is symmetric (same swap in both directions).
                            </div>
                        </div>
                        <div class="step-item">
                            <div class="step-number" style="background: var(--danger);">4</div>
                            <div class="step-content">
                                <strong>Duplicate Letters in Substitution Alphabet:</strong><br>
                                When constructing a monoalphabetic key manually, ensure all 26 letters appear exactly once. A duplicate letter makes decryption ambiguous.
                            </div>
                        </div>
                        <div class="step-item">
                            <div class="step-number" style="background: var(--danger);">5</div>
                            <div class="step-content">
                                <strong>Playfair Matrix 0-Indexing vs 1-Indexing:</strong><br>
                                A 5×5 matrix coordinates run from row 0 to 4 and col 0 to 4. Wrap-around for position 4 in encryption goes to 0 (not 1).
                            </div>
                        </div>
                        <div class="step-item">
                            <div class="step-number" style="background: var(--danger);">6</div>
                            <div class="step-content">
                                <strong>Assuming Frequency Analysis Directly Reveals Every Letter:</strong><br>
                                Frequencies provide high-probability clues, not absolute answers. In short texts, 'T' might appear more often than 'E'. Always verify with bigrams (TH, HE) and short words (THE, AND, IS).
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- "Can You Solve This?" Challenge Section -->
            <div class="card">
                <div class="card-header" style="background: var(--bg-surface-elevated);">
                    <h3>🎯 "Can You Solve This?" Cryptanalysis Mystery Challenges</h3>
                </div>
                <div class="card-body">
                    <p>Put your knowledge to the test! These practical exam-style challenges require you to identify the cipher, deduce keys, and decrypt real encrypted messages.</p>

                    <!-- Challenge 1 -->
                    <div class="exercise-box" id="challenge-box-1" style="margin-top: 1.5rem;">
                        <span class="exercise-badge easy">Challenge 1</span>
                        <div class="exercise-question">
                            <strong>The Roman Legion's Secret Dispatch (Caesar Mystery)</strong><br>
                            An intercepted transmission reads:<br>
                            <span class="mono highlight-cipher" style="font-size: 1.1rem; display: block; margin: 0.5rem 0;">"WKH HASHGLWLRQ KDV VXFFHHGHG PHHW DW WKH ULYHU"</span>
                            Determine the shift key and recover the plaintext message.
                        </div>

                        <div class="collapsible" id="chal1-hints">
                            <div class="collapsible-header"><span>Need Hints? (Click to reveal progressive clues)</span></div>
                            <div class="collapsible-body">
                                <p><strong>Hint 1:</strong> Look at the 3-letter word "WKH" that appears twice. What is the most common 3-letter word in English?</p>
                                <p><strong>Hint 2:</strong> "WKH" is likely "THE". Check the shift from T (19) to W (22): $22 - 19 = 3$.</p>
                                <p><strong>Hint 3:</strong> The key is $k = 3$. Decrypt by subtracting 3 from each letter ($P = (C - 3 + 26) \\pmod{26}$).</p>
                            </div>
                        </div>

                        <div class="input-inline" style="margin-top: 0.75rem;">
                            <div class="input-group" style="max-width: 150px;">
                                <label>Key (0-25):</label>
                                <input type="number" id="chal1-key-input" min="0" max="25" placeholder="Key">
                            </div>
                            <div class="input-group">
                                <label>Decrypted Plaintext:</label>
                                <input type="text" id="chal1-plain-input" class="mono" placeholder="Enter plaintext...">
                            </div>
                            <button id="btn-check-chal1" class="btn btn-primary">Check Solution</button>
                        </div>
                        <div id="chal1-feedback" class="exercise-feedback"></div>
                    </div>

                    <!-- Challenge 2 -->
                    <div class="exercise-box" id="challenge-box-2" style="margin-top: 1.5rem;">
                        <span class="exercise-badge medium">Challenge 2</span>
                        <div class="exercise-question">
                            <strong>The Diplomat's Scrambled Cable (Playfair Mystery)</strong><br>
                            Intercepted ciphertext digraphs:<br>
                            <span class="mono highlight-cipher" style="font-size: 1.1rem; display: block; margin: 0.5rem 0;">"RM DB YI MT"</span>
                            The secret keyword is <strong>"MONARCHY"</strong>.<br>
                            Decrypt these 4 digraphs back to their prepared plaintext letters using the 5×5 matrix.
                        </div>

                        <div class="collapsible" id="chal2-hints">
                            <div class="collapsible-header"><span>Need Hints? (Click for matrix coordinates)</span></div>
                            <div class="collapsible-body">
                                <p><strong>Hint 1:</strong> The 5×5 matrix for "MONARCHY" is:<br>
                                <span class="mono">M O N A R<br>C H Y B D<br>E F G I K<br>L P Q S T<br>U V W X Z</span></p>
                                <p><strong>Hint 2:</strong> Decrypt "RM": R and M are in Row 0. Same Row in reverse: move LEFT. R moves left to A, M wraps left to R? Wait! In Row 0 (M, O, N, A, R): R moves left to A, M moves left (wraps) to R! Result: "AR".</p>
                                <p><strong>Hint 3:</strong> "DB" are in Row 1 (C, H, Y, B, D). D moves left to B, B moves left to Y $\\to$ "BY".</p>
                            </div>
                        </div>

                        <div class="input-inline" style="margin-top: 0.75rem;">
                            <div class="input-group">
                                <label>Decrypted Plaintext (with or without spaces):</label>
                                <input type="text" id="chal2-plain-input" class="mono" placeholder="e.g. AR BY ...">
                            </div>
                            <button id="btn-check-chal2" class="btn btn-primary">Check Solution</button>
                        </div>
                        <div id="chal2-feedback" class="exercise-feedback"></div>
                    </div>

                    <!-- Challenge 3 -->
                    <div class="exercise-box" id="challenge-box-3" style="margin-top: 1.5rem;">
                        <span class="exercise-badge hard">Challenge 3</span>
                        <div class="exercise-question">
                            <strong>The Field Commander's Grid Intercept (Full Playfair Decryption)</strong><br>
                            An encrypted battlefield transmission has been intercepted:<br>
                            <span class="mono highlight-cipher" style="font-size: 1.15rem; display: block; margin: 0.5rem 0; letter-spacing: 0.1em;">"GATLMZCLRQXA"</span>
                            Intelligence confirms the enemy's keyword is <strong>"MONARCHY"</strong>.<br>
                            Decrypt all 6 digraph pairs to recover the plaintext intelligence dispatch.
                        </div>

                        <div class="collapsible" id="chal3-hints">
                            <div class="collapsible-header"><span>Need Hints? (Click to reveal step-by-step coordinates)</span></div>
                            <div class="collapsible-body">
                                <p><strong>Hint 1:</strong> 5×5 Matrix for "MONARCHY":<br>
                                <span class="mono">M O N A R<br>C H Y B D<br>E F G I K<br>L P Q S T<br>U V W X Z</span></p>
                                <p><strong>Hint 2:</strong> Split into 6 pairs: <code>GA</code>, <code>TL</code>, <code>MZ</code>, <code>CL</code>, <code>RQ</code>, <code>XA</code>.</p>
                                <p><strong>Hint 3:</strong><br>
                                • GA: Rectangle $\to$ IN<br>
                                • TL: Same row 3 (L P Q S T), move left $\to$ ST<br>
                                • MZ: Rectangle $\to$ RU<br>
                                • CL: Same col 0 (M C E L U), move up $\to$ ME<br>
                                • RQ: Rectangle $\to$ NT<br>
                                • XA: Same col 3 (A B I S X), move up $\to$ SX.<br>
                                Combined: "INSTRUMENTSX" (trailing X is padding) $\to$ <strong>INSTRUMENTS</strong>.</p>
                            </div>
                        </div>

                        <div class="input-inline" style="margin-top: 0.75rem;">
                            <div class="input-group">
                                <label>Decrypted Plaintext:</label>
                                <input type="text" id="chal3-plain-input" class="mono" placeholder="Enter plaintext (e.g. INSTRUMENTS)...">
                            </div>
                            <button id="btn-check-chal3" class="btn btn-primary">Check Solution</button>
                        </div>
                        <div id="chal3-feedback" class="exercise-feedback"></div>
                    </div>

                    <!-- Challenge 4 -->
                    <div class="exercise-box" id="challenge-box-4" style="margin-top: 1.5rem;">
                        <span class="exercise-badge medium">Challenge 4</span>
                        <div class="exercise-question">
                            <strong>The Shadow Agent's Code Recognition (Atbash Mystery)</strong><br>
                            A covert agent left a short intercepted message before vanishing:<br>
                            <span class="mono highlight-cipher" style="font-size: 1.15rem; display: block; margin: 0.5rem 0; letter-spacing: 0.1em;">"GSV HVXIVG RH HZUV"</span>
                            Identify the ancient symmetric reverse-alphabet cipher and recover the plaintext dispatch.
                        </div>

                        <div class="collapsible" id="chal4-hints">
                            <div class="collapsible-header"><span>Need Hints? (Click to reveal cipher clues)</span></div>
                            <div class="collapsible-body">
                                <p><strong>Hint 1:</strong> Look at "GSV". G is letter #6 and T is letter #19 ($6 + 19 = 25$). S is #18 and H is #7 ($18 + 7 = 25$). V is #21 and E is #4 ($21 + 4 = 25$).</p>
                                <p><strong>Hint 2:</strong> This is the biblical/classical <strong>Atbash cipher</strong>, where $A \leftrightarrow Z$, $B \leftrightarrow Y$, $C \leftrightarrow X$, etc. (formula $P = 25 - C$).</p>
                                <p><strong>Hint 3:</strong> "GSV" $\to$ THE. "RH" $\to$ IS. "HZUV" $\to$ SAFE. What does "HVXIVG" translate to?</p>
                            </div>
                        </div>

                        <div class="input-inline" style="margin-top: 0.75rem;">
                            <div class="input-group">
                                <label>Decrypted Plaintext:</label>
                                <input type="text" id="chal4-plain-input" class="mono" placeholder="e.g. THE SECRET...">
                            </div>
                            <button id="btn-check-chal4" class="btn btn-primary">Check Solution</button>
                        </div>
                        <div id="chal4-feedback" class="exercise-feedback"></div>
                    </div>
                </div>
            </div>

            <!-- ⚡ Rapid-Fire Speed Drill Mode -->
            <div class="card" id="speed-drill-card" style="margin-top: 2rem;">
                <div class="card-header" style="background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); color: #fff;">
                    <div style="display: flex; align-items: center; gap: 0.6rem;">
                        <span style="font-size: 1.35rem;">⚡</span>
                        <div>
                            <h3 style="margin: 0; color: #fff !important; text-shadow: 0 1px 2px rgba(0,0,0,0.4);">Rapid-Fire Speed Drill (60-Second Blitz)</h3>
                            <div style="font-size: 0.8rem; opacity: 0.9; font-weight: normal;">Test your mental modular arithmetic, ROT13 conversions, and cipher rules under pressure!</div>
                        </div>
                    </div>
                    <div style="display: flex; align-items: center; gap: 1rem;">
                        <span class="badge" style="background: rgba(0,0,0,0.25); color: #fff; font-size: 0.85rem; padding: 0.35rem 0.75rem;">High Score: <strong id="speed-drill-highscore">0</strong></span>
                    </div>
                </div>
                <div class="card-body">
                    <div id="speed-drill-idle" style="text-align: center; padding: 1.5rem 0;">
                        <p style="font-size: 1.05rem; max-width: 600px; margin: 0 auto 1.5rem;">Can you solve quick crypto calculations under pressure? You have <strong>60 seconds</strong> to answer as many fast mental modulo, letter index, and Playfair rule flash cards as you can!</p>
                        <button id="btn-start-speed-drill" class="btn btn-warning btn-lg" style="font-weight: 800; font-size: 1.1rem; padding: 0.75rem 2.25rem;">⚡ Start 60s Speed Drill</button>
                    </div>

                    <div id="speed-drill-active" style="display: none;">
                        <div class="speed-drill-hud" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.25rem; flex-wrap: wrap; gap: 1rem;">
                            <div class="speed-drill-counters" style="display: flex; align-items: center; gap: 1.5rem;">
                                <div>
                                    <div class="text-xs text-muted" style="text-transform: uppercase; font-weight: 700;">Time Remaining</div>
                                    <div id="speed-drill-timer" style="font-size: 1.9rem; font-weight: 800; font-family: var(--font-mono); color: #f59e0b;">60s</div>
                                </div>
                                <div>
                                    <div class="text-xs text-muted" style="text-transform: uppercase; font-weight: 700;">Score</div>
                                    <div id="speed-drill-score" style="font-size: 1.9rem; font-weight: 800; font-family: var(--font-mono); color: var(--success);">0</div>
                                </div>
                                <div>
                                    <div class="text-xs text-muted" style="text-transform: uppercase; font-weight: 700;">Streak</div>
                                    <div id="speed-drill-streak" style="font-size: 1.9rem; font-weight: 800; font-family: var(--font-mono); color: #ec4899;">0 🔥</div>
                                </div>
                            </div>
                            <button id="btn-quit-speed-drill" class="btn btn-secondary btn-sm">Stop Drill</button>
                        </div>

                        <div class="exercise-box" style="margin: 0; padding: 1.75rem 1.5rem; text-align: center; background: var(--bg-surface-subtle); border: 2px solid var(--border-medium);">
                            <div id="speed-drill-category" class="exercise-badge easy" style="margin-bottom: 0.75rem;">Mental Arithmetic</div>
                            <div id="speed-drill-prompt" style="font-size: 1.4rem; font-weight: 700; margin-bottom: 1.25rem; min-height: 2.2rem; font-family: var(--font-mono);">
                                (18 + 7) mod 26 = ?
                            </div>

                            <div id="speed-drill-options" style="display: flex; justify-content: center; gap: 0.75rem; flex-wrap: wrap; margin-bottom: 1rem;">
                                <!-- Speed Drill Option Buttons -->
                            </div>
                            <div id="speed-drill-live-feedback" style="min-height: 1.5rem; font-weight: 700;"></div>
                        </div>
                    </div>

                    <div id="speed-drill-results" style="display: none; text-align: center; padding: 1.5rem 0;">
                        <h3 id="speed-drill-final-title" style="font-size: 1.6rem; margin-bottom: 0.5rem;">⏱️ Time's Up!</h3>
                        <p id="speed-drill-final-desc" style="font-size: 1.1rem; color: var(--text-secondary); margin-bottom: 1.5rem;"></p>
                        <div class="speed-drill-stats-row" style="display: flex; justify-content: center; gap: 1.5rem; margin-bottom: 1.75rem; flex-wrap: wrap;">
                            <div class="stat-card" style="min-width: 130px;">
                                <div class="stat-value" id="speed-drill-final-score">0</div>
                                <div class="stat-label">Final Score</div>
                            </div>
                            <div class="stat-card" style="min-width: 130px;">
                                <div class="stat-value" id="speed-drill-final-accuracy">100%</div>
                                <div class="stat-label">Accuracy</div>
                            </div>
                            <div class="stat-card" style="min-width: 130px;">
                                <div class="stat-value" id="speed-drill-best-streak">0</div>
                                <div class="stat-label">Best Streak</div>
                            </div>
                        </div>
                        <button id="btn-restart-speed-drill" class="btn btn-warning btn-lg" style="font-weight: 800; padding: 0.75rem 2rem;">⚡ Play Again</button>
                    </div>
                </div>
            </div>
        </div>`;

        container.innerHTML = html;

        // Challenge 1 Solver
        container.querySelector('#btn-check-chal1').addEventListener('click', function() {
            var k = parseInt(container.querySelector('#chal1-key-input').value, 10);
            var plain = utils.cleanText(container.querySelector('#chal1-plain-input').value);
            var expected = "THEEXPEDITIONHASSUCCEEDEDMEETATTHERIVER";
            var fb = container.querySelector('#chal1-feedback');
            fb.classList.add('show');

            if (k === 3 && plain === expected) {
                fb.className = 'exercise-feedback show correct-feedback';
                fb.innerHTML = '🎉 <strong>Brilliant!</strong> Key = 3.<br>Plaintext: <strong>THE EXPEDITION HAS SUCCEEDED MEET AT THE RIVER</strong>.';
                container.querySelector('#challenge-box-1').classList.add('correct');
            } else if (k === 3) {
                fb.className = 'exercise-feedback show incorrect-feedback';
                fb.innerHTML = 'Key 3 is correct! Check your plaintext translation carefully: "THE EXPEDITION HAS SUCCEEDED MEET AT THE RIVER".';
            } else {
                fb.className = 'exercise-feedback show incorrect-feedback';
                fb.innerHTML = '❌ Incorrect key or message. Remember that "WKH" corresponds to "THE" ($W \\to T$, $K \\to H$, $H \\to E$). Shift is 3.';
            }
        });

        // Challenge 2 Solver
        container.querySelector('#btn-check-chal2').addEventListener('click', function() {
            var plain = utils.cleanText(container.querySelector('#chal2-plain-input').value);
            var expectedClean = "ARBYBGRL";
            var fb = container.querySelector('#chal2-feedback');
            fb.classList.add('show');

            if (plain === expectedClean) {
                fb.className = 'exercise-feedback show correct-feedback';
                fb.innerHTML = '🎉 <strong>Spot on!</strong> Decrypted digraphs: <strong>AR BY BG RL</strong>.<br>All 4 rules executed with perfect coordinate precision!';
                container.querySelector('#challenge-box-2').classList.add('correct');
            } else {
                fb.className = 'exercise-feedback show incorrect-feedback';
                fb.innerHTML = `You entered: <span class="mono">${plain || '(empty)'}</span>.<br>Expected: <strong>AR BY BG RL</strong>.<br>RM $\\to$ AR (Row 0 left)<br>DB $\\to$ BY (Row 1 left)<br>YI $\\to$ BG (Rectangle swap)<br>MT $\\to$ RL (Rectangle swap).`;
            }
        });

        // Challenge 3 Solver (Full Playfair INSTRUMENTS)
        container.querySelector('#btn-check-chal3').addEventListener('click', function() {
            var plain = utils.cleanText(container.querySelector('#chal3-plain-input').value);
            var fb = container.querySelector('#chal3-feedback');
            fb.classList.add('show');

            if (plain === "INSTRUMENTS" || plain === "INSTRUMENTSX") {
                fb.className = 'exercise-feedback show correct-feedback';
                fb.innerHTML = '🎉 <strong>Masterful Cryptanalysis!</strong> Message recovered: <strong>INSTRUMENTS</strong>.<br>GA $\\to$ IN, TL $\\to$ ST, MZ $\\to$ RU, CL $\\to$ ME, RQ $\\to$ NT, XA $\\to$ SX.<br>All digraph coordinates and wrapping handled flawlessly!';
                container.querySelector('#challenge-box-3').classList.add('correct');
            } else {
                fb.className = 'exercise-feedback show incorrect-feedback';
                fb.innerHTML = `You entered: <span class="mono">${plain || '(empty)'}</span>.<br>Expected message: <strong>INSTRUMENTS</strong> (or INSTRUMENTSX).<br>Check pair-by-pair: GA (IN), TL (ST), MZ (RU), CL (ME), RQ (NT), XA (SX).`;
            }
        });

        // Challenge 4 Solver (Atbash THE SECRET IS SAFE)
        container.querySelector('#btn-check-chal4').addEventListener('click', function() {
            var plain = utils.cleanText(container.querySelector('#chal4-plain-input').value);
            var fb = container.querySelector('#chal4-feedback');
            fb.classList.add('show');

            if (plain === "THESECRETISSAFE") {
                fb.className = 'exercise-feedback show correct-feedback';
                fb.innerHTML = '🎉 <strong>Cipher Broken!</strong> Message decrypted: <strong>THE SECRET IS SAFE</strong>.<br>Atbash reverse mapping ($P = 25 - C$) identified and solved with complete precision!';
                container.querySelector('#challenge-box-4').classList.add('correct');
            } else {
                fb.className = 'exercise-feedback show incorrect-feedback';
                fb.innerHTML = `You entered: <span class="mono">${plain || '(empty)'}</span>.<br>Expected: <strong>THE SECRET IS SAFE</strong>.<br>Atbash mapping: G $\\to$ T, S $\\to$ H, V $\\to$ E, H $\\to$ S, X $\\to$ C, I $\\to$ R, R $\\to$ I, Z $\\to$ A, U $\\to$ F.`;
            }
        });

        // =====================================================================
        // SPEED DRILL CONTROLLER
        // =====================================================================
        var drillState = {
            active: false,
            timer: null,
            secondsLeft: 60,
            score: 0,
            streak: 0,
            bestStreak: 0,
            totalAnswered: 0,
            correctCount: 0,
            currentQuestion: null
        };

        var highScore = 0;
        try {
            highScore = parseInt(localStorage.getItem('cryptolab_speed_drill_highscore') || '0', 10);
            if (isNaN(highScore)) highScore = 0;
        } catch (e) {
            highScore = 0;
        }
        var highscoreEl = container.querySelector('#speed-drill-highscore');
        if (highscoreEl) highscoreEl.textContent = highScore;

        function generateSpeedDrillQuestion() {
            var types = ['add_mod', 'sub_mod', 'letter_idx', 'rot13', 'playfair_rule'];
            var t = types[Math.floor(Math.random() * types.length)];
            var q = {};

            if (t === 'add_mod') {
                var a = Math.floor(Math.random() * 26);
                var b = Math.floor(Math.random() * 25) + 1;
                var ans = (a + b) % 26;
                var distractors = [(ans + 1) % 26, (ans + 25) % 26, (ans + 13) % 26];
                q = {
                    category: 'Mental Modular Arithmetic',
                    prompt: `(${a} + ${b}) mod 26 = ?`,
                    correct: ans.toString(),
                    options: utils.shuffleArray([ans.toString(), distractors[0].toString(), distractors[1].toString(), distractors[2].toString()])
                };
            } else if (t === 'sub_mod') {
                var c = Math.floor(Math.random() * 26);
                var k = Math.floor(Math.random() * 20) + 1;
                var ans2 = utils.mod(c - k, 26);
                var d1 = utils.mod(ans2 + 1, 26);
                var d2 = utils.mod(ans2 - 1, 26);
                var d3 = utils.mod(c + k, 26);
                if (d3 === ans2) d3 = utils.mod(ans2 + 2, 26);
                q = {
                    category: 'Modular Subtraction',
                    prompt: `(${c} − ${k} + 26) mod 26 = ?`,
                    correct: ans2.toString(),
                    options: utils.shuffleArray([ans2.toString(), d1.toString(), d2.toString(), d3.toString()])
                };
            } else if (t === 'letter_idx') {
                var letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
                var idx = Math.floor(Math.random() * 26);
                var ch = letters[idx];
                var d_idx1 = utils.mod(idx + 1, 26);
                var d_idx2 = utils.mod(idx - 1, 26);
                var d_idx3 = utils.mod(idx + 5, 26);
                q = {
                    category: 'Letter Index (A=0)',
                    prompt: `Numerical index of letter '${ch}' (where A=0, Z=25)?`,
                    correct: idx.toString(),
                    options: utils.shuffleArray([idx.toString(), d_idx1.toString(), d_idx2.toString(), d_idx3.toString()])
                };
            } else if (t === 'rot13') {
                var lettersR = 'ABCDEFGHIKLMNOPQRSTUVWXYZ';
                var origIdx = Math.floor(Math.random() * lettersR.length);
                var origChar = lettersR[origIdx];
                var rotChar = utils.numToLetter(utils.letterToNum(origChar) + 13);
                var bad1 = utils.numToLetter(utils.letterToNum(origChar) + 12);
                var bad2 = utils.numToLetter(utils.letterToNum(origChar) + 14);
                var bad3 = utils.numToLetter(utils.letterToNum(origChar) + 7);
                q = {
                    category: 'Fast ROT13 Shift',
                    prompt: `ROT13 of '${origChar}' (+13 shift) = ?`,
                    correct: rotChar,
                    options: utils.shuffleArray([rotChar, bad1, bad2, bad3])
                };
            } else {
                var ruleQuestions = [
                    {
                        prompt: 'Playfair Decryption: Letters in the SAME ROW shift which way?',
                        correct: 'LEFT',
                        options: ['LEFT', 'RIGHT', 'UP', 'DOWN']
                    },
                    {
                        prompt: 'Playfair Decryption: Letters in the SAME COLUMN shift which way?',
                        correct: 'UP',
                        options: ['UP', 'DOWN', 'LEFT', 'RIGHT']
                    },
                    {
                        prompt: 'Playfair Encryption: Letters in the SAME ROW shift which way?',
                        correct: 'RIGHT',
                        options: ['RIGHT', 'LEFT', 'DOWN', 'UP']
                    },
                    {
                        prompt: 'Which letter is traditionally combined with I in a 5×5 Playfair grid?',
                        correct: 'J',
                        options: ['J', 'Q', 'X', 'Z']
                    }
                ];
                var rq = ruleQuestions[Math.floor(Math.random() * ruleQuestions.length)];
                q = {
                    category: 'Cipher Rules Flash',
                    prompt: rq.prompt,
                    correct: rq.correct,
                    options: rq.options
                };
            }

            return q;
        }

        function renderNextSpeedQuestion() {
            drillState.currentQuestion = generateSpeedDrillQuestion();
            var catEl = container.querySelector('#speed-drill-category');
            var promptEl = container.querySelector('#speed-drill-prompt');
            var optEl = container.querySelector('#speed-drill-options');
            var fbEl = container.querySelector('#speed-drill-live-feedback');

            if (catEl) catEl.textContent = drillState.currentQuestion.category;
            if (promptEl) promptEl.textContent = drillState.currentQuestion.prompt;
            if (fbEl) fbEl.textContent = '';

            if (optEl) {
                optEl.innerHTML = '';
                drillState.currentQuestion.options.forEach(function(opt) {
                    var btn = document.createElement('button');
                    btn.className = 'btn btn-secondary';
                    btn.style.minWidth = '80px';
                    btn.style.fontSize = '1.15rem';
                    btn.style.fontFamily = 'var(--font-mono)';
                    btn.style.fontWeight = '700';
                    btn.style.padding = '0.65rem 1.25rem';
                    btn.textContent = opt;

                    btn.addEventListener('click', function() {
                        handleSpeedAnswer(opt, btn);
                    });
                    optEl.appendChild(btn);
                });
            }
        }

        function handleSpeedAnswer(selectedOpt, btn) {
            if (!drillState.active) return;
            drillState.totalAnswered++;

            var isCorrect = (selectedOpt === drillState.currentQuestion.correct);
            var scoreEl = container.querySelector('#speed-drill-score');
            var streakEl = container.querySelector('#speed-drill-streak');
            var fbEl = container.querySelector('#speed-drill-live-feedback');

            if (isCorrect) {
                drillState.correctCount++;
                drillState.streak++;
                if (drillState.streak > drillState.bestStreak) {
                    drillState.bestStreak = drillState.streak;
                }

                // Points: 10 base + streak multiplier
                var multiplier = (drillState.streak >= 5) ? 2.0 : (drillState.streak >= 3) ? 1.5 : 1.0;
                var gained = Math.round(10 * multiplier);
                drillState.score += gained;

                if (fbEl) {
                    fbEl.style.color = 'var(--success)';
                    fbEl.textContent = `+${gained} Correct! 🔥`;
                }
                btn.style.background = 'var(--success)';
                btn.style.borderColor = 'var(--success)';
                btn.style.color = '#fff';
            } else {
                drillState.streak = 0;
                if (fbEl) {
                    fbEl.style.color = 'var(--danger)';
                    fbEl.textContent = `❌ Correct was: ${drillState.currentQuestion.correct}`;
                }
                btn.style.background = 'var(--danger)';
                btn.style.borderColor = 'var(--danger)';
                btn.style.color = '#fff';
            }

            if (scoreEl) scoreEl.textContent = drillState.score;
            if (streakEl) streakEl.textContent = drillState.streak + ' 🔥';

            // Next question after a tiny flash
            setTimeout(function() {
                if (drillState.active) {
                    renderNextSpeedQuestion();
                }
            }, 320);
        }

        function startSpeedDrill() {
            drillState.active = true;
            drillState.secondsLeft = 60;
            drillState.score = 0;
            drillState.streak = 0;
            drillState.bestStreak = 0;
            drillState.totalAnswered = 0;
            drillState.correctCount = 0;

            container.querySelector('#speed-drill-idle').style.display = 'none';
            container.querySelector('#speed-drill-results').style.display = 'none';
            container.querySelector('#speed-drill-active').style.display = 'block';

            var timerEl = container.querySelector('#speed-drill-timer');
            var scoreEl = container.querySelector('#speed-drill-score');
            var streakEl = container.querySelector('#speed-drill-streak');
            if (timerEl) {
                timerEl.textContent = '60s';
                timerEl.style.color = '#f59e0b';
            }
            if (scoreEl) scoreEl.textContent = '0';
            if (streakEl) streakEl.textContent = '0 🔥';

            renderNextSpeedQuestion();

            clearInterval(drillState.timer);
            drillState.timer = setInterval(function() {
                drillState.secondsLeft--;
                if (timerEl) {
                    timerEl.textContent = drillState.secondsLeft + 's';
                    if (drillState.secondsLeft <= 10) {
                        timerEl.style.color = 'var(--danger)';
                    }
                }

                if (drillState.secondsLeft <= 0) {
                    endSpeedDrill();
                }
            }, 1000);
        }

        function endSpeedDrill() {
            drillState.active = false;
            clearInterval(drillState.timer);

            container.querySelector('#speed-drill-active').style.display = 'none';
            var resEl = container.querySelector('#speed-drill-results');
            resEl.style.display = 'block';

            var accuracy = (drillState.totalAnswered > 0)
                ? Math.round((drillState.correctCount / drillState.totalAnswered) * 100)
                : 100;

            var titleEl = container.querySelector('#speed-drill-final-title');
            var descEl = container.querySelector('#speed-drill-final-desc');
            var finalScoreEl = container.querySelector('#speed-drill-final-score');
            var accEl = container.querySelector('#speed-drill-final-accuracy');
            var streakEl = container.querySelector('#speed-drill-best-streak');

            if (finalScoreEl) finalScoreEl.textContent = drillState.score;
            if (accEl) accEl.textContent = accuracy + '%';
            if (streakEl) streakEl.textContent = drillState.bestStreak;

            if (drillState.score > highScore) {
                highScore = drillState.score;
                try {
                    localStorage.setItem('cryptolab_speed_drill_highscore', highScore.toString());
                } catch (e) {}
                if (highscoreEl) highscoreEl.textContent = highScore;
                if (titleEl) titleEl.textContent = '🏆 NEW HIGH SCORE!';
                if (descEl) descEl.textContent = `Spectacular speed! You set a personal record of ${drillState.score} points!`;
            } else {
                if (titleEl) titleEl.textContent = '⏱️ Drill Completed!';
                if (descEl) descEl.textContent = `Great effort! You answered ${drillState.correctCount} out of ${drillState.totalAnswered} questions correctly.`;
            }
        }

        var btnStart = container.querySelector('#btn-start-speed-drill');
        if (btnStart) btnStart.addEventListener('click', startSpeedDrill);

        var btnRestart = container.querySelector('#btn-restart-speed-drill');
        if (btnRestart) btnRestart.addEventListener('click', startSpeedDrill);

        var btnQuit = container.querySelector('#btn-quit-speed-drill');
        if (btnQuit) btnQuit.addEventListener('click', endSpeedDrill);
    });

})(window.CipherApp);

