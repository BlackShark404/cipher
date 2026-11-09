/* ===== Monoalphabetic Substitution Cipher Module ===== */
(function(app) {
    'use strict';

    var utils = app.utils;
    var SECTION = 'monoalphabetic';
    var ALPHA = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    var EXAMPLE_KEY = 'QWERTYUIOPASDFGHJKLZXCVBNM';

    // ---- Pre-loaded frequency analysis example ----
    var FA_PLAIN = 'THE QUICK BROWN FOX JUMPS OVER THE LAZY DOG AND THE BRAVE KNIGHT DEFENDS THE ANCIENT CASTLE FROM THE SHADOW';
    var FA_KEY = 'XYMHTBZWCSADEJOGFVNRUPQKLI'; // a fixed valid permutation (all 26 letters once)

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

    // Canonical repeated-letter pattern of a word: first distinct letter -> A,
    // next new letter -> B, etc. HELLO -> ABCCD, THE -> ABC, ALL -> ABB.
    function wordPattern(word) {
        var map = {};
        var next = 0;
        var out = '';
        for (var i = 0; i < word.length; i++) {
            var ch = word[i];
            if (map[ch] === undefined) map[ch] = next++;
            out += String.fromCharCode(65 + map[ch]);
        }
        return out;
    }

    var FA_CIPHER = monoEncryptPreserveSpaces(FA_PLAIN, FA_KEY);

    app.monoalphabetic = {
        encrypt: monoEncrypt,
        decrypt: monoDecrypt,
        encryptPreserveSpaces: monoEncryptPreserveSpaces,
        EXAMPLE_KEY: EXAMPLE_KEY
    };

    // ---- Exercise 5: longer ciphertext for frequency analysis ----
    var EX5_PLAIN = 'SECRETS HIDDEN IN THE SHADOWS ARE OFTEN THE MOST DANGEROUS ONES TO REVEAL';
    var EX5_KEY = FA_KEY; // reuse the same key
    var EX5_CIPHER = monoEncrypt(EX5_PLAIN, EX5_KEY);

    // ---- Frequency analysis: English word list for pattern matching ----
    // Used to suggest candidate plaintext words that share a cipher word's
    // length and repeated-letter pattern. This is a learning aid, not a solver.
    var FA_WORD_LIST = (
        'THE AND YOU ARE FOR NOT BUT HAD HAS WAS ALL CAN HER HIS ONE OUR OUT ' +
        'DAY GET HIM HOW ITS MAY NEW NOW OLD SEE TWO WAY WHO DID LET SAY SHE TOO USE ' +
        'MAN MEN BOY GIRL SON MOM DAD SIR MADAM KING QUEEN LORD LADY GOD ' +
        'TIME YEAR PEOPLE WAY DAY NIGHT LIFE WORLD HOUSE HOME ROOM DOOR WALL ' +
        'HAND HEAD FACE EYE EAR NOSE MOUTH FOOT FEET ARM LEG BODY HEART MIND ' +
        'WATER FOOD BREAD MEAT MILK TEA WINE BEAN CORN RICE FRUIT APPLE ' +
        'TREE WOOD FOREST RIVER LAKE SEA OCEAN HILL MOUNTAIN VALLEY FIELD ' +
        'ROAD STREET PATH BRIDGE TOWER CASTLE GARDEN CITY TOWN VILLAGE ' +
        'SUN MOON STAR SKY CLOUD RAIN SNOW WIND STORM FIRE FLAME LIGHT DARK ' +
        'MORNING EVENING NOON MIDNIGHT TODAY TOMORROW YESTERDAY WEEK MONTH ' +
        'GOOD BAD GREAT SMALL LARGE BIG LITTLE LONG SHORT HIGH LOW DEEP WIDE ' +
        'NEW OLD YOUNG EARLY LATE FAST SLOW HARD SOFT EASY DIFFICULT SIMPLE ' +
        'HOT COLD WARM COOL WET DRY CLEAN DIRTY FULL EMPTY OPEN CLOSED ' +
        'HAPPY SAD ANGRY AFRAID BRAVE PROUD CALM QUIET LOUD KIND CRUEL ' +
        'TRUE FALSE REAL RIGHT WRONG SAME OTHER DIFFERENT NEXT LAST FIRST ' +
        'MAKE MADE TAKE TOOK GIVE GAVE GET GOT GO WENT COME CAME SEE SAW ' +
        'KNOW KNOWN THINK THOUGHT SAY SAID TELL TOLD FIND FOUND KEEP KEPT ' +
        'LEAVE LEFT FEEL FELT SEEM SEEMED BECOME BECAME BEGIN BEGAN RUN RAN ' +
        'WALK WALKED MOVE MOVED LIVE LIVED LOVE LOVED LIKE LIKED WANT WANTED ' +
        'NEEDED NEED HELP HELPED WORK WORKED PLAY PLAYED READ WRITE SPOKE ' +
        'HEAR HEARD LISTEN WATCH LOOK LOOKED SHOW SHOWED TRY TRIED CALL CALLED ' +
        'ASK ASKED ANSWER REPLY TURN TURNED START STARTED STOP STOPPED ' +
        'ATTACK DEFEND SECRET MESSAGE CIPHER DECODE CRYPTO ENCRYPT DECRYPT ' +
        'HIDDEN TREASURE MYSTERY PUZZLE ANSWER SECURITY SHADOW AGENT SPIES ' +
        'SOLDIER BATTLE VICTORY DANGER ESCAPE RESCUE KNIGHT DRAGON SHIELD ' +
        'GOLDEN SILVER DIAMOND THUNDER CASTLE KINGDOM BRAVE ANCIENT ' +
        'QUICK BROWN FOX JUMPS OVER LAZY DOG SECRETS SHADOWS OFTEN MOST ' +
        'DANGEROUS ONES REVEAL DEFENDS FROM INTO WITH WITHOUT WITHIN ' +
        'ABOUT ABOVE ACROSS AFTER AGAIN AGAINST ALONG AMONG AROUND BEFORE ' +
        'BEHIND BELOW BENEATH BESIDE BETWEEN BEYOND DURING THROUGH UNDER ' +
        'UNTIL UPON WITHIN OUTSIDE INSIDE NEAR FAR HERE THERE WHERE WHEN ' +
        'WHILE WHY WHAT WHICH WHOLE WHOSE WHOM THIS THAT THESE THOSE SUCH ' +
        'EACH EVERY BOTH FEW MANY MUCH MORE LESS MOST SEVERAL SOME ANY NONE ' +
        'VERY JUST ONLY ALSO EVEN STILL ALREADY ALWAYS NEVER SOMETIMES OFTEN ' +
        'REALLY ALMOST ENOUGH QUITE RATHER TOO SOON AGAIN AWAY BACK FORTH ' +
        'WELL ILL YES NO PLEASE THANKS SORRY HELLO GOODBYE WELCOME ' +
        'KNOWLEDGE POWER ENTHUSIASM REASON ROMANCE SCIENCE DISCIPLINE ' +
        'PREDICT FUTURE CREATE IMAGINE BELIEVE ACHIEVE SUCCESS FAILURE ' +
        'EFFORT COURAGE WISDOM TRUTH HONOR JUSTICE FREEDOM PEACE WAR ' +
        'NATION COUNTRY GOVERNMENT LAW ORDER RULE LEADER FOLLOWER ' +
        'FRIEND ENEMY FAMILY FATHER MOTHER BROTHER SISTER CHILD CHILDREN ' +
        'PERSON WOMAN MAN PEOPLE HUMAN BEING SOUL SPIRIT GHOST ' +
        'BOOK PAGE WORD LETTER STORY POEM SONG MUSIC ART PAINT DRAW ' +
        'SCHOOL STUDENT TEACHER CLASS LESSON LEARN STUDY TEACH TEST EXAM ' +
        'QUESTION PROBLEM SOLUTION IDEA THOUGHT PLAN GOAL DREAM HOPE WISH ' +
        'MONEY PRICE COST VALUE TRADE BUY SELL PAY SPEND SAVE EARN ' +
        'SHIP BOAT CAR TRAIN PLANE HORSE RIDER DRIVER PILOT CAPTAIN ' +
        'NORTH SOUTH EAST WEST LEFT RIGHT CENTER MIDDLE EDGE SIDE TOP BOTTOM ' +
        'POINT LINE PART PIECE BIT BLOCK STONE METAL IRON STEEL GLASS PAPER ' +
        'COLOR RED BLUE GREEN YELLOW BLACK WHITE GRAY PURPLE ORANGE PINK ' +
        'NUMBER COUNT ADD SUBTRACT MULTIPLY DIVIDE EQUAL HALF DOUBLE ' +
        'SOUND VOICE NOISE SILENCE ECHO WHISPER SHOUT CRY LAUGH SMILE ' +
        'NAME SIGN MARK SYMBOL SIGNAL FLAG BANNER CROWN SWORD SPEAR ARROW ' +
        'BOW BLADE ARMOR HELMET WALL GATE KEY LOCK CODE MAP CHART ' +
        'SEND SENT RECEIVE RECEIVED DELIVER CARRY CARRIED BRING BROUGHT ' +
        'HOLD HELD CATCH CAUGHT THROW THREW DROP DROPPED FALL FELL RISE ROSE ' +
        'STAND STOOD SIT SAT LIE LAY SLEEP SLEPT WAKE WOKE EAT ATE DRINK DRANK ' +
        'MEET MET WAIT WAITED STAY STAYED REMAIN REMAINED RETURN RETURNED ' +
        'ENTER ENTERED EXIT PASS PASSED CROSS CROSSED REACH REACHED ' +
        'HIDE HID HIDDEN SEEK SOUGHT SEARCH FOUND DISCOVER REVEAL CONCEAL ' +
        'PROTECT PROTECTED GUARD GUARDED SAVE SAVED SAFE SAFETY SECURE ' +
        'TRUST BELIEVE DOUBT FEAR HOPE EXPECT SUPPOSE GUESS WONDER ' +
        'IMPORTANT NECESSARY POSSIBLE IMPOSSIBLE CERTAIN SURE CLEAR OBVIOUS ' +
        'STRANGE WEIRD NORMAL NATURAL COMMON RARE USUAL SPECIAL ORDINARY ' +
        'BEAUTIFUL PRETTY UGLY HANDSOME LOVELY NICE WONDERFUL TERRIBLE ' +
        'STRONG WEAK HEAVY LIGHT THICK THIN NARROW BROAD SHARP DULL ' +
        'ALIVE DEAD DEADLY LIVING YOUTHFUL AGED MODERN ANCIENT RECENT ' +
        'COMPLETE ENTIRE TOTAL WHOLE FULL PARTIAL BROKEN FIXED REPAIRED ' +
        'BUILD BUILT DESTROY DESTROYED RUIN RUINED CREATE CREATED FORM ' +
        'CHANGE CHANGED TURN GROW GREW DEVELOP IMPROVE INCREASE DECREASE ' +
        'CONTINUE CONTINUED REMAIN FOLLOW FOLLOWED LEAD LED GUIDE GUIDED ' +
        'ALLOW ALLOWED PERMIT LET FORCE FORCED COMPEL OBLIGE REQUIRE ' +
        'ABLE UNABLE WILLING READY PREPARED WILL SHALL MUST SHOULD COULD ' +
        'WOULD MIGHT MAYBE PERHAPS PROBABLY POSSIBLY CERTAINLY DEFINITELY ' +
        'ACTUALLY BASICALLY GENERALLY USUALLY NORMALLY TYPICALLY FINALLY ' +
        'SUDDENLY IMMEDIATELY QUICKLY SLOWLY CAREFULLY CLEARLY DIRECTLY ' +
        'EXACTLY NEARLY SIMPLY MERELY TRULY REALLY INDEED ABSOLUTELY ' +
        'EVERYTHING SOMETHING NOTHING ANYTHING EVERYONE SOMEONE ANYONE ' +
        'NOBODY EVERYBODY SOMEWHERE ANYWHERE NOWHERE EVERYWHERE ' +
        'HIMSELF HERSELF ITSELF THEMSELVES OURSELVES YOURSELF MYSELF ' +
        'BEEN BEING DONE DOES DOING DONE HAVING HAVE HAVING SAID SAYS ' +
        'ACROSS ALMOST ALONG ALREADY ALTHOUGH AMONG ANOTHER ANYBODY ' +
        'ANYTHING AROUND BECAUSE BECOME BEFORE BEHIND BELIEVE BESIDE ' +
        'BETWEEN BEYOND BROUGHT CALLED CANNOT CAREFUL CERTAIN CHANCE ' +
        'CHANGE CHILDREN CLOSE COMING COMMON COMPLETE CONCERN CONDITION ' +
        'CONSIDER CONTINUE CONTROL CORRECT COURSE COVER CURRENT DEAL ' +
        'DECIDE DECLARE DEEP DEGREE DELIVER DEMAND DEPEND DESCRIBE ' +
        'DESIRE DESTROY DETAIL DETERMINE DEVELOP DIFFERENCE DIFFERENT ' +
        'DIFFICULT DIRECT DISCOVER DISCUSS DISEASE DISTANCE DIVIDE ' +
        'DOCTOR DOES DONE DOUBT DRAW DREAM DRESS DRIVE DROP DURING ' +
        'EACH EARLY EARTH EASILY EAST EFFECT EFFORT EITHER ELSE END ' +
        'ENOUGH ENTER ENTIRE EQUAL ESCAPE ESPECIAL EVEN EVENT EVER EVERY ' +
        'EXACT EXAMPLE EXCEPT EXCUSE EXERCISE EXPECT EXPERIENCE EXPLAIN ' +
        'EXPRESS EXTREME FACE FACT FAIL FAIR FALL FAMILY FAMOUS FAR ' +
        'FARM FAST FATHER FAVOR FEAR FEEL FEET FELL FELT FEW FIELD ' +
        'FIGHT FIGURE FILL FINAL FIND FINE FINISH FIRE FIRST FISH FIVE ' +
        'FLOOR FLOW FLOWER FLY FOLLOW FOOD FOOT FOR FORCE FORM FORTH ' +
        'FORWARD FOUND FOUR FREE FRESH FRIEND FROM FRONT FULL FUN ' +
        'FUTURE GAME GARDEN GAVE GENERAL GET GIRL GIVE GLAD GO GOD ' +
        'GOING GOLD GONE GOOD GOT GOVERN GRASS GREAT GREEN GREW GROUND ' +
        'GROUP GROW GUESS GUN HAD HAIR HALF HAND HAPPEN HARD HAS ' +
        'HATE HAVE HEAD HEAR HEARD HEART HEAT HEAVY HELD HELP HER ' +
        'HERE HIGH HIM HIMSELF HIS HOLD HOME HOPE HORSE HOT HOUR ' +
        'HOUSE HOW HOWEVER HUGE HUMAN HUNDRED HUNT HURRY HUSBAND ' +
        'IDEA IF IMPORTANT IN INCREASE INDEED INSIDE INSTEAD INTEREST ' +
        'INTO IRON IS IT ITS ITSELF JOB JOIN JOKE JOURNEY JOY JUDGE ' +
        'JUMP JUST KEEP KEPT KEY KILL KIND KING KNEW KNOW KNOWN ' +
        'LADY LAID LAKE LAND LANGUAGE LARGE LAST LATE LATER LAUGH ' +
        'LAW LAY LEAD LEARN LEAST LEAVE LED LEFT LEG LENGTH LESS ' +
        'LET LETTER LEVEL LIE LIFE LIFT LIGHT LIKE LINE LIST LISTEN ' +
        'LITTLE LIVE LIVING LOAD LONG LOOK LORD LOSE LOSS LOST LOT ' +
        'LOUD LOVE LOW MACHINE MADE MAIN MAKE MAN MANNER MANY MAP ' +
        'MARK MARKET MASTER MATTER MAY MAYBE ME MEAN MEANT MEASURE ' +
        'MEET MEMBER MEMORY MEN MENTION METHOD MIDDLE MIGHT MILE ' +
        'MILK MILL MIND MINE MINUTE MISS MISTAKE MIX MOMENT MONEY ' +
        'MONTH MOON MORE MORNING MOST MOTHER MOUNTAIN MOUTH MOVE ' +
        'MUCH MUSIC MUST MY MYSELF NAME NARROW NATION NATURAL NATURE ' +
        'NEAR NEARLY NECESSARY NECK NEED NEITHER NEVER NEW NEWS NEXT ' +
        'NICE NIGHT NINE NO NOBODY NONE NOR NORTH NOSE NOT NOTE ' +
        'NOTHING NOTICE NOW NUMBER OBJECT OCEAN OF OFF OFFER OFFICE ' +
        'OFTEN OIL OLD ON ONCE ONE ONLY OPEN OR ORDER OTHER OUGHT ' +
        'OUR OUT OUTSIDE OVER OWN PAGE PAIN PAINT PAIR PAPER PART ' +
        'PARTY PASS PAST PAY PEACE PEOPLE PER PERFECT PERHAPS PERSON ' +
        'PICK PIECE PLACE PLAN PLANT PLAY PLEASE POINT POOR POSITION ' +
        'POSSIBLE POWER PRACTICE PREPARE PRESENT PRESS PRETTY PRICE ' +
        'PRINT PRISON PRODUCE PROPER PROVE PROVIDE PUBLIC PULL PURPOSE ' +
        'PUSH PUT QUALITY QUARTER QUEEN QUESTION QUICK QUIET QUITE ' +
        'RACE RADIO RAIN RAISE RAN RANGE RATE RATHER REACH READ ' +
        'READY REAL REASON RECEIVE RECORD RED REFUSE REGARD REMAIN ' +
        'REMEMBER REPEAT REPLY REPORT REST RESULT RETURN RICH RIDE ' +
        'RIGHT RING RISE RIVER ROAD ROCK ROLL ROOM ROUND ROW RULE ' +
        'RUN SAFE SAID SAIL SAME SAT SAVE SAW SAY SCHOOL SCIENCE ' +
        'SEA SEASON SEAT SECOND SECRET SEE SEEM SEEN SELF SELL SEND ' +
        'SENSE SENT SEPARATE SERVE SET SETTLE SEVEN SEVERAL SHALL ' +
        'SHAPE SHARE SHARP SHE SHIP SHOE SHOOT SHOP SHORT SHOULD ' +
        'SHOUT SHOW SHUT SIDE SIGHT SIGN SILENCE SIMPLE SINCE SING ' +
        'SINGLE SIR SISTER SIT SIX SIZE SKIN SKY SLEEP SLOW SMALL ' +
        'SMELL SMILE SMOKE SNOW SO SOCIAL SOFT SOIL SOLDIER SOME ' +
        'SOMETHING SOMETIMES SON SONG SOON SORT SOUND SOUTH SPACE ' +
        'SPEAK SPECIAL SPEED SPEND SPOKE SPOT SPREAD SPRING SQUARE ' +
        'STAND STAR START STATE STAY STEAL STEP STICK STILL STONE ' +
        'STOP STORE STORY STRAIGHT STRANGE STREET STRONG STUDY ' +
        'SUBJECT SUCH SUDDEN SUGAR SUIT SUMMER SUN SUPPOSE SURE ' +
        'SURPRISE SWEET SWIM SYSTEM TABLE TAKE TALK TALL TASTE TEACH ' +
        'TEAR TELL TEMPLE TEN TERM TERRIBLE TEST THAN THANK THAT ' +
        'THE THEIR THEM THEN THERE THESE THEY THICK THIN THING ' +
        'THINK THIRD THIS THOSE THOUGH THOUGHT THOUSAND THREE THROUGH ' +
        'THROW THUS TIE TILL TIME TINY TO TODAY TOGETHER TOLD ' +
        'TOMORROW TONIGHT TOO TOOK TOP TOTAL TOUCH TOWARD TOWN ' +
        'TRADE TRAIN TRAVEL TREE TRIP TROUBLE TRUE TRUST TRUTH ' +
        'TRY TURN TWELVE TWENTY TWO TYPE UNDER UNDERSTAND UNION ' +
        'UNIT UNTIL UP UPON US USE USED USUAL VALUE VARIOUS VERY ' +
        'VIEW VILLAGE VISIT VOICE WAIT WALK WALL WANT WAR WARM ' +
        'WAS WASH WATCH WATER WAVE WAY WE WEAR WEATHER WEEK ' +
        'WEIGHT WELCOME WELL WENT WERE WEST WHAT WHEEL WHEN WHERE ' +
        'WHETHER WHICH WHILE WHITE WHO WHOLE WHOM WHOSE WHY WIDE ' +
        'WIFE WILD WILL WIN WIND WINDOW WINE WING WINTER WIRE ' +
        'WISE WISH WITH WITHIN WITHOUT WOMAN WONDER WOOD WORD ' +
        'WORK WORLD WORRY WORTH WOULD WRITE WRONG YEAR YELLOW ' +
        'YES YESTERDAY YET YOU YOUNG YOUR YOURSELF YOUTH'
    ).split(/\s+/);
    // De-duplicate the word list
    FA_WORD_LIST = FA_WORD_LIST.filter(function(w, i, a) {
        return w.length > 0 && a.indexOf(w) === i;
    });

    // Index words by "length:pattern" for fast candidate lookup
    var FA_WORD_INDEX = {};
    for (var wi = 0; wi < FA_WORD_LIST.length; wi++) {
        var ww = FA_WORD_LIST[wi];
        var wkey = ww.length + ':' + wordPattern(ww);
        if (!FA_WORD_INDEX[wkey]) FA_WORD_INDEX[wkey] = [];
        FA_WORD_INDEX[wkey].push(ww);
    }

    // ---- Practice challenge plaintext pool (known answers for self-checking) ----
    var FA_PRACTICE_PLAINS = [
        FA_PLAIN,
        EX5_PLAIN,
        'THE QUICK BROWN FOX JUMPS OVER THE LAZY DOG',
        'NEVER TRUST A MESSAGE THAT YOU CANNOT VERIFY WITH YOUR OWN EYES',
        'KNOWLEDGE IS POWER BUT ENTHUSIASM PULLS THE SWITCH',
        'THE BEST WAY TO PREDICT THE FUTURE IS TO CREATE IT',
        'ATTACK AT DAWN AND DEFEND THE CASTLE UNTIL THE REINFORCEMENTS ARRIVE',
        'A JOURNEY OF A THOUSAND MILES BEGINS WITH A SINGLE STEP',
        'THE ONLY THING WE HAVE TO FEAR IS FEAR ITSELF',
        'TO BE OR NOT TO BE THAT IS THE QUESTION',
        'ALL THAT GLITTERS IS NOT GOLD AND OFTEN THE SHADOWS HIDE THE TRUTH',
        'PRACTICE MAKES PERFECT AND PATIENCE REVEALS EVERY SECRET'
    ];

    app.registerModule('monoalphabetic', function(container) {
        var progress = app.progress;

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
    html += '<div id="mono-workbench">';
    html += '<div class="mono-dir-toggle btn-group" role="tablist" aria-label="Cipher direction">';
    html += '<button class="btn btn-primary btn-sm mono-dir-btn active" data-dir="enc">🔒 Encrypt</button>';
    html += '<button class="btn btn-secondary btn-sm mono-dir-btn" data-dir="dec">🔓 Decrypt</button>';
    html += '</div>';
    html += '<div class="grid-2col mono-dir-grid show-enc" style="margin-top:1.5rem">';

    // Encrypt
    html += '<div class="card" id="mono-enc-card"><div class="card-header" style="background:var(--plain-color)"><h3>🔒 Encrypt</h3></div>';
    html += '<div class="card-body">';
    html += '<div class="input-group"><label>Plaintext</label><textarea id="mono-enc-input" placeholder="Enter plaintext to encrypt...">HELLO WORLD</textarea></div>';
    html += '<button class="btn btn-primary" id="mono-enc-btn">Encrypt →</button>';
    html += '<div id="mono-enc-result" class="result-box info" style="display:none"></div>';
    html += '<div id="mono-enc-steps" style="display:none"></div>';
    html += '</div></div>';

    // Decrypt
    html += '<div class="card" id="mono-dec-card"><div class="card-header" style="background:var(--cipher-color)"><h3>🔓 Decrypt</h3></div>';
    html += '<div class="card-body">';
    html += '<div class="input-group"><label>Ciphertext</label><textarea id="mono-dec-input" placeholder="Enter ciphertext to decrypt..."></textarea></div>';
    html += '<button class="btn btn-danger" id="mono-dec-btn">← Decrypt</button>';
    html += '<div id="mono-dec-result" class="result-box info" style="display:none"></div>';
    html += '<div id="mono-dec-steps" style="display:none"></div>';
    html += '</div></div>';

    html += '</div>'; // end grid
    html += '</div>'; // end mono-workbench

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
    html += '<button class="btn btn-warning btn-sm" id="mono-freq-load-example">📋 Practice Example</button>';
    html += '<button class="btn btn-primary btn-sm" id="mono-freq-random-challenge">🎲 Random Challenge</button>';
    html += '</div>';

    // Active practice challenge banner
    html += '<div id="mono-freq-challenge-banner" class="alert alert-info" style="display:none;margin-top:1rem"></div>';

    // Analysis results (initially hidden)
    html += '<div id="mono-freq-results" style="display:none;margin-top:1.5rem">';

    // Frequency chart
    html += '<div class="subsection"><div class="subsection-title">Letter Frequency Chart</div>';
    html += '<p class="text-sm text-muted">Colored bars = ciphertext frequencies | Gray bars = standard English frequencies</p>';
    html += '<div class="chart-scroll-wrap">';
    html += '<div class="chart-container" id="mono-freq-chart"></div>';
    html += '<div class="chart-labels" id="mono-freq-labels"></div>';
    html += '</div>';
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

    // Word patterns & suggestions
    html += '<div class="subsection" style="border-left-color:var(--info)"><div class="subsection-title">🔍 Word Patterns &amp; Suggestions</div>';
    html += '<p class="text-sm text-muted">Each cipher word is shown with its <strong>repeated-letter pattern</strong> (e.g. <code>ABCCD</code> = HELLO). Candidate English words match the pattern and your current mappings. Click a candidate to apply it — these are <em>guesses to verify</em>, not answers.</p>';
    html += '<div id="mono-freq-words" class="fa-word-panel"></div>';
    html += '</div>';

    // Interactive Mapping Workspace
    html += '<div class="subsection" style="border-left-color:var(--danger)"><div class="subsection-title">🧩 Interactive Mapping Workspace</div>';
    html += '<p>Assign plaintext guesses to ciphertext letters. Partially decrypted text updates live below.</p>';

    html += '<div class="btn-group" style="margin-bottom:1rem">';
    html += '<button class="btn btn-warning btn-sm" id="mono-freq-auto-suggest">💡 Frequency Hint (top 3)</button>';
    html += '<button class="btn btn-secondary btn-sm" id="mono-freq-toggle-placeholder">🙈 Hide Unsolved Letters</button>';
    html += '<button class="btn btn-secondary btn-sm" id="mono-freq-clear-mappings">🗑️ Clear All Mappings</button>';
    html += '</div>';

    // Mapping inputs
    html += '<div id="mono-freq-mapping-grid" style="display:grid;grid-template-columns:repeat(auto-fill,minmax(60px,1fr));gap:6px;margin:1rem 0"></div>';

    // Mapping validation/conflict
    html += '<div id="mono-freq-mapping-status" class="alert alert-info" style="display:none"></div>';

    // Partially decrypted text
    html += '<div class="subsection-title" style="margin-top:1rem">Partially Decrypted Text</div>';
    html += '<p class="text-sm text-muted">Solved letters appear as <strong style="color:var(--success)">lowercase green</strong>. Unsolved letters are <strong style="color:var(--cipher-color)">highlighted</strong> (or hidden as <code>_</code>). Click any letter to jump to its mapping box. Word spaces are preserved so you can spot real words.</p>';
    html += '<div id="mono-freq-partial" class="result-box fa-partial" style="font-size:1.15rem;letter-spacing:1px;line-height:2.1;min-height:60px"></div>';

    // Practice mode panel (shown when a known challenge is active)
    html += '<div id="mono-freq-practice-panel" class="fa-practice-panel" style="display:none">';
    html += '<div class="subsection-title" style="margin-top:0.5rem">🎓 Practice Mode — Solve It Yourself</div>';
    html += '<p class="text-sm text-muted">Reconstruct the original sentence using frequency analysis and word patterns. Nothing is auto-decrypted for you. Use hints only if you get stuck.</p>';
    html += '<div class="btn-group">';
    html += '<button class="btn btn-primary btn-sm" id="mono-freq-hint-btn">💡 Progressive Hint (<span id="mono-freq-hint-count">0</span> used)</button>';
    html += '<button class="btn btn-success btn-sm" id="mono-freq-check-answer">✅ Check My Answer</button>';
    html += '<button class="btn btn-secondary btn-sm" id="mono-freq-reveal">🏳️ Reveal Solution</button>';
    html += '</div>';
    html += '<div id="mono-freq-hint-text" class="exercise-hint"></div>';
    html += '<div id="mono-freq-answer-feedback" class="exercise-feedback"></div>';
    html += '</div>';

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
        'Using the same cipher alphabet <span class="highlight-key">QWERTYUIOPASDFGHJKLZXCVBNM</span>, decrypt the ciphertext <span class="highlight-cipher">JXOM</span>.',
        'Type the plaintext',
        'Find each ciphertext letter in the cipher alphabet and note its position (1-indexed). J is at position 17 → plain Q. X is at position 21 → plain U. O is at position 9 → plain I. M is at position 26 → plain Z.',
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

    // ---- Mobile Encrypt/Decrypt direction toggle ----
    container.querySelectorAll('.mono-dir-btn').forEach(function(btn) {
        btn.addEventListener('click', function() {
            var dir = this.dataset.dir;
            container.querySelectorAll('.mono-dir-btn').forEach(function(b) {
                var isActive = (b === btn);
                b.classList.toggle('active', isActive);
                b.classList.toggle('btn-primary', isActive);
                b.classList.toggle('btn-secondary', !isActive);
            });
            var grid = container.querySelector('.mono-dir-grid');
            if (grid) {
                grid.classList.toggle('show-enc', dir === 'enc');
                grid.classList.toggle('show-dec', dir === 'dec');
            }
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
    var savedAlphaKey = (utils.storage && utils.storage.get) ? utils.storage.get('draft_mono_key', null) : null;
    var cipherAlpha = (savedAlphaKey && savedAlphaKey.length === 26) ? savedAlphaKey.split('') : ALPHA.split('');

    function getCurrentKey() {
        return cipherAlpha.join('');
    }

    function saveAlphabetDraft() {
        if (utils.storage && utils.storage.set) {
            utils.storage.set('draft_mono_key', getCurrentKey());
        }
    }

    function updateAlphabetDisplay() {
        for (var i = 0; i < 26; i++) {
            var cell = container.querySelector('#mono-c-' + i);
            if (cell) {
                cell.textContent = cipherAlpha[i];
                cell.classList.remove('error');
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
                cell.classList.remove('error');
                if (duplicates[i]) {
                    cell.classList.add('error');
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

        saveAlphabetDraft();
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
        stepsDiv.innerHTML =
            '<div class="collapsible' + utils.workingOpenClass() + '">' +
            '<div class="collapsible-header">🔍 Show letter-by-letter working</div>' +
            '<div class="collapsible-body">' + stepHtml + '</div></div>';
        utils.revealOnMobile(resDiv);

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
        stepsDiv.innerHTML =
            '<div class="collapsible' + utils.workingOpenClass() + '">' +
            '<div class="collapsible-header">🔍 Show letter-by-letter working</div>' +
            '<div class="collapsible-body">' + stepHtml + '</div></div>';
        utils.revealOnMobile(resDiv);

        progress.complete(SECTION, 'mono-encrypt-decrypt');
        utils.animateElement(resDiv, 'fade-in');
    });

    // ---- FREQUENCY ANALYSIS ----
    var freqMappings = {}; // cipher letter → plaintext guess
    var faOriginalText = ''; // raw ciphertext incl. spaces/punctuation
    var faCleanText = '';    // letters-only ciphertext
    var faCounts = {};       // cipher letter counts
    var placeholderMode = false; // false = show cipher letters, true = show blanks
    var currentChallenge = null; // { name, plain, key, cipher, hintsUsed, solved }

    // Load a known practice challenge (answer-checkable)
    function loadChallenge(name, plain, key) {
        var cipher = monoEncryptPreserveSpaces(plain, key);
        currentChallenge = {
            name: name,
            plain: plain,
            key: key,
            cipher: cipher,
            hintsUsed: 0,
            solved: false
        };
        freqMappings = {};
        if (utils.storage && utils.storage.remove) utils.storage.remove('draft_mono_freq');
        container.querySelector('#mono-freq-input').value = cipher;
        if (utils.storage && utils.storage.set) utils.storage.set('draft_mono_ciphertext', cipher);
        runAnalysis(cipher);
        utils.showToast('Practice challenge loaded. Solve it with frequency analysis!', 'info');
    }

    container.querySelector('#mono-freq-load-example').addEventListener('click', function() {
        loadChallenge('Practice Example — Pangram', FA_PLAIN, FA_KEY);
    });

    container.querySelector('#mono-freq-random-challenge').addEventListener('click', function() {
        var plain = utils.randPick(FA_PRACTICE_PLAINS);
        var key = utils.shuffleArray(ALPHA.split('')).join('');
        loadChallenge('Random Challenge', plain, key);
    });

    // Analyze whatever is in the textarea; keep challenge only if text matches it
    container.querySelector('#mono-freq-analyze-btn').addEventListener('click', function() {
        var text = container.querySelector('#mono-freq-input').value;
        var cleaned = utils.cleanText(text);
        if (cleaned.length < 2) {
            utils.showToast('Please enter some ciphertext to analyze (at least 2 letters).', 'danger');
            return;
        }
        if (currentChallenge && utils.cleanText(currentChallenge.cipher) !== cleaned) {
            currentChallenge = null; // user switched to custom ciphertext
        }
        if (utils.storage && utils.storage.set) {
            utils.storage.set('draft_mono_ciphertext', text);
        }
        runAnalysis(text);
    });

    // Shared analysis entry point: validates, shows results, renders everything
    function runAnalysis(text) {
        var cleaned = utils.cleanText(text);
        if (cleaned.length < 2) {
            utils.showToast('Please enter some ciphertext to analyze (at least 2 letters).', 'danger');
            return;
        }
        performFrequencyAnalysis(text);
        container.querySelector('#mono-freq-results').style.display = 'block';
        updateChallengeUI();
        utils.animateElement(container.querySelector('#mono-freq-results'), 'fade-in');
    }

    function performFrequencyAnalysis(rawText) {
        faOriginalText = rawText;
        var text = utils.cleanText(rawText);
        faCleanText = text;

        // Count frequencies
        var counts = {};
        var total = text.length;
        for (var i = 0; i < 26; i++) counts[ALPHA[i]] = 0;
        for (var i = 0; i < text.length; i++) {
            if (counts[text[i]] !== undefined) counts[text[i]]++;
        }
        faCounts = counts;

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
        var engOrderRef = 'ETAOINSHRDLCUMWFGYPBVKJXQZ';
        var tableHtml = '<table class="styled-table"><thead><tr><th>Rank</th><th>Letter</th><th>Count</th><th>Frequency</th><th>English Expected</th><th>Likely Match*</th></tr></thead><tbody>';
        for (var i = 0; i < 26; i++) {
            var l = sorted[i];
            var dim = counts[l] === 0 ? ' style="opacity:0.45"' : (i < 5 ? ' style="font-weight:700"' : '');
            tableHtml += '<tr' + dim + '>';
            tableHtml += '<td>' + (i + 1) + '</td>';
            tableHtml += '<td class="mono" style="color:var(--cipher-color)">' + l + '</td>';
            tableHtml += '<td>' + counts[l] + '</td>';
            tableHtml += '<td>' + freqs[l].toFixed(1) + '%</td>';
            tableHtml += '<td>' + utils.englishFrequencies[l].toFixed(1) + '%</td>';
            tableHtml += '<td class="mono" style="color:var(--plain-color)">' + (counts[l] > 0 ? engOrderRef[i] + '?' : '—') + '</td>';
            tableHtml += '</tr>';
        }
        tableHtml += '</tbody></table>';
        tableHtml += '<p class="text-sm text-muted" style="margin-top:0.5rem">*Likely Match pairs the ciphertext rank with the English frequency rank (E, T, A, O…). It is only a <strong>starting hypothesis</strong> — short texts often deviate, so confirm with word patterns below.</p>';
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

        // Word patterns & suggestions (uses original text with spaces)
        renderWordPatterns();
    }

    function buildMappingGrid(text, freqs, counts) {
        var grid = container.querySelector('#mono-freq-mapping-grid');
        var gridHtml = '';

        // Show all 26 letters; dim ones that never appear in the ciphertext
        for (var i = 0; i < 26; i++) {
            var letter = ALPHA[i];
            var present = counts && counts[letter] > 0;
            gridHtml += '<div class="fa-map-cell' + (present ? '' : ' absent') + '" style="text-align:center">';
            gridHtml += '<div style="font-family:var(--font-mono);font-weight:700;color:var(--cipher-color);font-size:0.9rem">' + letter + '</div>';
            gridHtml += '<div style="font-size:0.6rem;color:var(--gray-500)">' + (counts ? counts[letter] : 0) + '×</div>';
            gridHtml += '<input type="text" maxlength="1" class="mono-freq-map-input" data-cipher="' + letter + '" value="' + (freqMappings[letter] || '') + '" placeholder="?" aria-label="Plaintext guess for cipher letter ' + letter + '" style="width:32px;height:32px;text-align:center;font-family:var(--font-mono);font-weight:700;border:2px solid var(--plain-color);border-radius:4px;font-size:0.85rem;text-transform:uppercase;color:var(--plain-color);margin-top:2px">';
            gridHtml += '</div>';
        }
        grid.innerHTML = gridHtml;
        grid._ciphertext = text;

        // Attach mapping input listeners (centralized one-to-one enforcement)
        grid.querySelectorAll('.mono-freq-map-input').forEach(function(inp) {
            inp.addEventListener('input', function() {
                handleMappingInput(this);
            });
            inp.addEventListener('focus', function() {
                this.select();
            });
        });

        updatePartialDecrypt();
    }

    // Handle a single mapping input change, enforcing one-to-one mapping.
    function handleMappingInput(inp) {
        var cipherLetter = inp.dataset.cipher;
        var val = inp.value.toUpperCase().replace(/[^A-Z]/g, '');
        inp.value = val;
        setMapping(cipherLetter, val, true);
    }

    // Central mapping setter. If plainLetter is already used by another cipher
    // letter, it is reassigned (moved) here to preserve the one-to-one rule.
    function setMapping(cipherLetter, plainLetter, notify) {
        if (plainLetter) {
            // Find any other cipher letter currently mapped to this plaintext letter
            var previousOwner = null;
            for (var c in freqMappings) {
                if (c !== cipherLetter && freqMappings[c] === plainLetter) {
                    previousOwner = c;
                    break;
                }
            }
            if (previousOwner) {
                delete freqMappings[previousOwner];
                var prevInput = container.querySelector('.mono-freq-map-input[data-cipher="' + previousOwner + '"]');
                if (prevInput) prevInput.value = '';
                if (notify) {
                    utils.showToast('"' + plainLetter + '" moved from ' + previousOwner + ' → ' + cipherLetter + ' (each plaintext letter is used once).', 'info');
                }
            }
            freqMappings[cipherLetter] = plainLetter;
        } else {
            delete freqMappings[cipherLetter];
        }

        // Sync the input box for this cipher letter
        var inp = container.querySelector('.mono-freq-map-input[data-cipher="' + cipherLetter + '"]');
        if (inp) inp.value = freqMappings[cipherLetter] || '';

        if (utils.storage && utils.storage.set) {
            utils.storage.set('draft_mono_freq', freqMappings);
        }

        validateFreqMappings();
        updatePartialDecrypt();
        renderWordPatterns();
        checkFreqProgress();
    }

    // Apply a whole-word guess (cipherWord → plainWord), enforcing one-to-one.
    function applyWordGuess(cipherWord, plainWord) {
        if (cipherWord.length !== plainWord.length) return;
        for (var i = 0; i < cipherWord.length; i++) {
            setMapping(cipherWord[i], plainWord[i], false);
        }
        utils.showToast('Applied guess: ' + cipherWord + ' → ' + plainWord + '. Verify it fits the sentence!', 'success');
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
        var partialDiv = container.querySelector('#mono-freq-partial');
        if (!partialDiv) return;
        var text = faOriginalText || container.querySelector('#mono-freq-input').value;

        var html = '';
        var wordBuf = '';
        function flushWord() {
            if (wordBuf) {
                html += '<span class="fa-word">' + wordBuf + '</span>';
                wordBuf = '';
            }
        }

        for (var i = 0; i < text.length; i++) {
            var ch = text[i].toUpperCase();
            if (ch >= 'A' && ch <= 'Z') {
                if (freqMappings[ch]) {
                    wordBuf += '<span class="fa-letter solved">' + freqMappings[ch].toLowerCase() + '</span>';
                } else if (placeholderMode) {
                    wordBuf += '<span class="fa-letter blank" data-cipher="' + ch + '" title="Cipher letter ' + ch + ' — click to assign">_</span>';
                } else {
                    wordBuf += '<span class="fa-letter unsolved" data-cipher="' + ch + '" title="Click to assign a plaintext letter">' + ch + '</span>';
                }
            } else {
                flushWord();
                if (ch === ' ' || ch === '\n' || ch === '\t' || ch === '\r') {
                    html += ' ';
                } else {
                    html += utils.escapeHtml(text[i]);
                }
            }
        }
        flushWord();
        partialDiv.innerHTML = html || '<span class="text-muted">No ciphertext analyzed yet.</span>';
    }

    function checkFreqProgress() {
        var count = Object.keys(freqMappings).length;
        if (count >= 5) {
            progress.complete(SECTION, 'mono-frequency');
        }
    }

    // Frequency Hint: suggest only the top 3 letters as a starting hypothesis.
    // This is a learning scaffold, NOT an automatic solver — the student must
    // verify these guesses against word patterns and context.
    container.querySelector('#mono-freq-auto-suggest').addEventListener('click', function() {
        var text = faCleanText || utils.cleanText(container.querySelector('#mono-freq-input').value);
        if (text.length < 2) {
            utils.showToast('Please analyze some ciphertext first.', 'danger');
            return;
        }

        var counts = {};
        for (var i = 0; i < 26; i++) counts[ALPHA[i]] = 0;
        for (var i = 0; i < text.length; i++) {
            if (counts[text[i]] !== undefined) counts[text[i]]++;
        }
        var cipherSorted = ALPHA.split('').filter(function(l) { return counts[l] > 0; })
            .sort(function(a, b) { return counts[b] - counts[a]; });
        var engOrder = 'ETAOINSHRDLCUMWFGYPBVKJXQZ';

        var suggested = [];
        for (var i = 0; i < Math.min(3, cipherSorted.length); i++) {
            setMapping(cipherSorted[i], engOrder[i], false);
            suggested.push(cipherSorted[i] + '→' + engOrder[i]);
        }
        utils.showToast('Hypothesis: ' + suggested.join(', ') + '. These are guesses — confirm them with word patterns!', 'info');
    });

    // Toggle placeholder mode (hide unsolved letters as blanks)
    container.querySelector('#mono-freq-toggle-placeholder').addEventListener('click', function() {
        placeholderMode = !placeholderMode;
        this.textContent = placeholderMode ? '👁️ Show Unsolved Letters' : '🙈 Hide Unsolved Letters';
        updatePartialDecrypt();
    });

    // Clear mappings
    container.querySelector('#mono-freq-clear-mappings').addEventListener('click', function() {
        freqMappings = {};
        if (utils.storage && utils.storage.remove) {
            utils.storage.remove('draft_mono_freq');
        }
        container.querySelectorAll('.mono-freq-map-input').forEach(function(inp) {
            inp.value = '';
            inp.style.borderColor = 'var(--plain-color)';
            inp.style.background = 'var(--bg-input)';
        });
        container.querySelector('#mono-freq-mapping-status').style.display = 'none';
        updatePartialDecrypt();
        renderWordPatterns();
    });

    // Click an unsolved letter in the partial text → focus its mapping box
    container.querySelector('#mono-freq-partial').addEventListener('click', function(e) {
        var letterEl = e.target.closest('.fa-letter[data-cipher]');
        if (!letterEl) return;
        var cipher = letterEl.dataset.cipher;
        var inp = container.querySelector('.mono-freq-map-input[data-cipher="' + cipher + '"]');
        if (inp) {
            inp.focus();
            inp.select();
            inp.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    });

    // Click a word suggestion → apply that whole-word guess
    container.querySelector('#mono-freq-words').addEventListener('click', function(e) {
        var chip = e.target.closest('.fa-suggestion[data-plain]');
        if (!chip) return;
        applyWordGuess(chip.dataset.cipher, chip.dataset.plain);
    });

    // ============================
    // WORD PATTERN RECOGNITION
    // ============================

    function hasRepeat(word) {
        var seen = {};
        for (var i = 0; i < word.length; i++) {
            if (seen[word[i]]) return true;
            seen[word[i]] = true;
        }
        return false;
    }

    // Candidate English words matching a cipher word's length + pattern and
    // consistent with the current one-to-one mappings (both directions).
    function suggestionsFor(cipherWord) {
        var key = cipherWord.length + ':' + wordPattern(cipherWord);
        var candidates = FA_WORD_INDEX[key] || [];
        var rev = {};
        for (var c in freqMappings) rev[freqMappings[c]] = c;

        var results = [];
        for (var w = 0; w < candidates.length; w++) {
            var word = candidates[w];
            var ok = true;
            for (var i = 0; i < cipherWord.length; i++) {
                var cc = cipherWord[i], pp = word[i];
                if (freqMappings[cc] && freqMappings[cc] !== pp) { ok = false; break; }
                if (rev[pp] && rev[pp] !== cc) { ok = false; break; }
            }
            if (ok) results.push(word);
        }
        return results;
    }

    // Render the word-pattern panel from the original (spaced) ciphertext.
    function renderWordPatterns() {
        var panel = container.querySelector('#mono-freq-words');
        if (!panel) return;
        var text = (faOriginalText || '').toUpperCase();
        if (!text) { panel.innerHTML = ''; return; }

        // Extract unique cipher words (letters only) with their counts
        var rawWords = text.split(/[^A-Z]+/).filter(function(w) { return w.length > 0; });
        var wordCounts = {};
        rawWords.forEach(function(w) { wordCounts[w] = (wordCounts[w] || 0) + 1; });
        var unique = Object.keys(wordCounts).sort(function(a, b) {
            return a.length - b.length || (a < b ? -1 : 1);
        });

        if (unique.length === 0) { panel.innerHTML = ''; return; }

        var html = '';
        var MAX_CHIPS = 8;
        for (var u = 0; u < unique.length; u++) {
            var cw = unique[u];
            var pat = wordPattern(cw);
            var suggestions = suggestionsFor(cw);

            // Partial decryption of this word using current mappings
            var partial = '';
            for (var i = 0; i < cw.length; i++) {
                partial += freqMappings[cw[i]] ? freqMappings[cw[i]].toLowerCase() : '·';
            }

            var isShort = cw.length <= 3;
            html += '<div class="fa-word-row' + (isShort ? ' short' : '') + '">';
            html += '<div class="fa-word-cipher">' + cw + '<span class="fa-word-count">×' + wordCounts[cw] + '</span></div>';
            html += '<div class="fa-word-meta">';
            html += '<span class="fa-pattern-badge" title="Repeated-letter pattern">' + pat + '</span>';
            html += '<span class="fa-word-len">' + cw.length + ' letters</span>';
            if (hasRepeat(cw)) html += '<span class="fa-repeat-badge" title="Has repeated letters">↻ repeat</span>';
            if (isShort) html += '<span class="fa-short-badge" title="Short words are often THE, AND, ARE…">short word</span>';
            html += '</div>';
            html += '<div class="fa-word-partial">' + partial + '</div>';
            html += '<div class="fa-suggestions">';
            if (suggestions.length === 0) {
                html += '<span class="fa-no-match">No dictionary match — try more mappings</span>';
            } else {
                var shown = suggestions.slice(0, MAX_CHIPS);
                for (var s = 0; s < shown.length; s++) {
                    html += '<button type="button" class="fa-suggestion" data-cipher="' + cw + '" data-plain="' + shown[s] + '" title="Apply ' + cw + ' → ' + shown[s] + '">' + shown[s].toLowerCase() + '</button>';
                }
                if (suggestions.length > MAX_CHIPS) {
                    html += '<span class="fa-more-match">+' + (suggestions.length - MAX_CHIPS) + ' more</span>';
                }
            }
            html += '</div>';
            html += '</div>';
        }
        panel.innerHTML = html;
    }

    // ============================
    // PRACTICE MODE / HINTS / CHECK
    // ============================

    function updateChallengeUI() {
        var banner = container.querySelector('#mono-freq-challenge-banner');
        var panel = container.querySelector('#mono-freq-practice-panel');
        if (currentChallenge) {
            banner.style.display = 'block';
            banner.className = 'alert alert-info';
            banner.innerHTML = '🎓 <strong>Practice Mode:</strong> ' + utils.escapeHtml(currentChallenge.name) +
                ' — reconstruct the hidden sentence. The answer is not shown; use frequency analysis, word patterns, and hints.';
            panel.style.display = 'block';
            container.querySelector('#mono-freq-hint-count').textContent = currentChallenge.hintsUsed;
        } else {
            banner.style.display = 'block';
            banner.className = 'alert alert-warning';
            banner.innerHTML = '✍️ <strong>Custom ciphertext:</strong> frequency analysis and word suggestions are available, but answer-checking needs a known practice challenge. Load one above to test yourself.';
            panel.style.display = 'none';
        }
    }

    // Decrypt the full clean ciphertext using current mappings (for checking).
    function currentDecryption() {
        var out = '';
        for (var i = 0; i < faCleanText.length; i++) {
            var ch = faCleanText[i];
            out += freqMappings[ch] || '?';
        }
        return out;
    }

    // Build progressive hints for the active challenge without revealing it all.
    function buildHints() {
        var ch = currentChallenge;
        var hints = [];
        var plainClean = utils.cleanText(ch.plain);

        // Hint 1: most frequent cipher letter -> E hypothesis
        var counts = {};
        for (var i = 0; i < 26; i++) counts[ALPHA[i]] = 0;
        for (var i = 0; i < faCleanText.length; i++) counts[faCleanText[i]]++;
        var sorted = ALPHA.split('').filter(function(l) { return counts[l] > 0; })
            .sort(function(a, b) { return counts[b] - counts[a]; });
        if (sorted.length) {
            hints.push('Start with frequency: the most common ciphertext letter is <strong>' + sorted[0] +
                '</strong> (' + counts[sorted[0]] + '×). In English the most common letter is <strong>E</strong> — try mapping ' +
                sorted[0] + ' → E as a hypothesis, then check whether real words appear.');
        }

        // Hint 2: point at short words
        var words = (faOriginalText || '').toUpperCase().split(/[^A-Z]+/).filter(function(w) { return w.length > 0; });
        var shortWords = words.filter(function(w) { return w.length <= 3; });
        if (shortWords.length) {
            var uniqueShort = shortWords.filter(function(w, i, a) { return a.indexOf(w) === i; }).slice(0, 4);
            hints.push('Look at the short words: <strong>' + uniqueShort.join(', ') +
                '</strong>. Three-letter words are very often <strong>THE, AND, ARE, FOR, YOU, NOT</strong>. ' +
                'A repeated 3-letter word appearing many times is almost certainly <strong>THE</strong>.');
        }

        // Hint 3: reveal one correct mapping not yet set (the first plain letter)
        var revealed = 0;
        for (var i = 0; i < plainClean.length && revealed < 3; i++) {
            var plainLetter = plainClean[i];
            var cipherLetter = ch.key[utils.letterToNum(plainLetter)];
            if (freqMappings[cipherLetter] !== plainLetter) {
                hints.push('Here is one correct mapping to anchor your work: <strong>' + cipherLetter +
                    ' → ' + plainLetter + '</strong>. Enter it, then use the word patterns to spread out from there.');
                revealed++;
            }
        }

        // Hint 4: common bigram guidance
        hints.push('If you are stuck, find the most common two-letter pair (bigram) in the ciphertext. ' +
            'It usually stands for <strong>TH, HE, IN, ER</strong> or <strong>AN</strong>. Combined with a known letter, that often unlocks a whole word.');

        return hints;
    }

    container.querySelector('#mono-freq-hint-btn').addEventListener('click', function() {
        if (!currentChallenge) return;
        var hints = buildHints();
        var idx = Math.min(currentChallenge.hintsUsed, hints.length - 1);
        var hintDiv = container.querySelector('#mono-freq-hint-text');
        // Accumulate hints so earlier ones stay visible
        var shownHtml = '';
        for (var i = 0; i <= idx; i++) {
            shownHtml += '<div style="margin-bottom:0.5rem"><strong>Hint ' + (i + 1) + ':</strong> ' + hints[i] + '</div>';
        }
        hintDiv.innerHTML = shownHtml;
        hintDiv.classList.add('show');
        currentChallenge.hintsUsed = Math.min(currentChallenge.hintsUsed + 1, hints.length);
        container.querySelector('#mono-freq-hint-count').textContent = currentChallenge.hintsUsed;
        if (currentChallenge.hintsUsed >= hints.length) {
            utils.showToast('All hints revealed. Try to finish the reconstruction yourself!', 'info');
        }
    });

    container.querySelector('#mono-freq-check-answer').addEventListener('click', function() {
        if (!currentChallenge) return;
        var feedback = container.querySelector('#mono-freq-answer-feedback');
        var target = utils.cleanText(currentChallenge.plain);
        var attempt = currentDecryption();

        var correct = 0;
        var mappedCount = Object.keys(freqMappings).length;
        for (var i = 0; i < target.length; i++) {
            if (attempt[i] === target[i]) correct++;
        }
        var pct = Math.round(correct / target.length * 100);
        feedback.classList.add('show');

        if (attempt === target) {
            feedback.className = 'exercise-feedback show correct-feedback';
            feedback.innerHTML = '🎉 <strong>Perfect!</strong> You reconstructed the entire message correctly:<br>' +
                '<span class="highlight-plain">' + utils.escapeHtml(currentChallenge.plain) + '</span><br>' +
                'Hints used: ' + currentChallenge.hintsUsed + '. Outstanding cryptanalysis!';
            currentChallenge.solved = true;
            progress.complete(SECTION, 'mono-frequency');
            utils.showToast('Challenge solved! 🎉', 'success');
        } else {
            feedback.className = 'exercise-feedback show incorrect-feedback';
            var msg = 'You have <strong>' + correct + ' / ' + target.length + '</strong> letters correct (' + pct + '%). ';
            if (mappedCount === 0) {
                msg += 'Start by assigning a few mappings — try the Frequency Hint or a short-word guess.';
            } else if (pct >= 60) {
                msg += 'You are close! Look at the partially decrypted sentence for words that are almost right and fix one letter at a time.';
            } else {
                msg += 'Keep going — use the word pattern suggestions and check for mapping conflicts.';
            }
            feedback.innerHTML = msg;
        }
        utils.animateElement(feedback, 'fade-in');
    });

    container.querySelector('#mono-freq-reveal').addEventListener('click', function() {
        if (!currentChallenge) return;
        if (!confirm('Reveal the full solution? This fills in every mapping and ends the challenge. Try a hint first if you want to keep solving!')) {
            return;
        }
        var ch = currentChallenge;
        // Fill all mappings from the key (cipher letter -> plain letter)
        freqMappings = {};
        var plainClean = utils.cleanText(ch.plain);
        for (var i = 0; i < plainClean.length; i++) {
            var p = plainClean[i];
            var c = ch.key[utils.letterToNum(p)];
            freqMappings[c] = p;
        }
        container.querySelectorAll('.mono-freq-map-input').forEach(function(inp) {
            inp.value = freqMappings[inp.dataset.cipher] || '';
        });
        if (utils.storage && utils.storage.set) utils.storage.set('draft_mono_freq', freqMappings);
        validateFreqMappings();
        updatePartialDecrypt();
        renderWordPatterns();
        var feedback = container.querySelector('#mono-freq-answer-feedback');
        feedback.className = 'exercise-feedback show correct-feedback';
        feedback.innerHTML = '🏳️ Solution revealed:<br><span class="highlight-plain">' + utils.escapeHtml(ch.plain) +
            '</span><br>Load a new random challenge to practice again from scratch.';
        utils.showToast('Solution revealed. Load a new challenge to keep practicing!', 'info');
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

    // Exercise 2: Decrypt JXOM with QWERTYUIOPASDFGHJKLZXCVBNM
    var ex2Answer = monoDecrypt('JXOM', EXAMPLE_KEY);
    setupExercise(2, ex2Answer, function() {
        return 'Correct! 🎉 Reverse lookup: ' +
            'Find each ciphertext letter in the key and note its position:<br>' +
            '<strong>J</strong> is at index 16 → plain <strong>' + ALPHA[EXAMPLE_KEY.indexOf('J')] + '</strong>, ' +
            '<strong>X</strong> is at index 20 → plain <strong>' + ALPHA[EXAMPLE_KEY.indexOf('X')] + '</strong>, ' +
            '<strong>O</strong> is at index 8 → plain <strong>' + ALPHA[EXAMPLE_KEY.indexOf('O')] + '</strong>, ' +
            '<strong>M</strong> is at index 25 → plain <strong>' + ALPHA[EXAMPLE_KEY.indexOf('M')] + '</strong>. ' +
            'JXOM → <span class="highlight-plain">' + ex2Answer + '</span>';
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

        // Restore exercise completion state
        if (progress.isComplete(SECTION, 'mono-exercise-' + num)) {
            if (inputEl) inputEl.value = answer;
            box.classList.add('correct');
            feedbackDiv.className = 'exercise-feedback show correct-feedback';
            feedbackDiv.innerHTML = successMsg();
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

    // Restore Exercise 5 completion state
    if (progress.isComplete(SECTION, 'mono-exercise-5')) {
        var sampleEx5Pairs = [
            { c: 'T', p: 'E' },
            { c: 'W', p: 'H' },
            { c: 'M', p: 'C' },
            { c: 'R', p: 'S' },
            { c: 'X', p: 'A' }
        ];
        for (var si = 0; si < sampleEx5Pairs.length; si++) {
            var sc = container.querySelector('#mono-ex5-c' + si);
            var sp = container.querySelector('#mono-ex5-p' + si);
            if (sc) sc.value = sampleEx5Pairs[si].c;
            if (sp) sp.value = sampleEx5Pairs[si].p;
        }
        var ex5Box = container.querySelector('#mono-ex5-box');
        var ex5Fb = container.querySelector('#mono-ex5-feedback');
        if (ex5Box) ex5Box.classList.add('correct');
        if (ex5Fb) {
            ex5Fb.className = 'exercise-feedback show correct-feedback';
            ex5Fb.innerHTML = '🎉 Solved previously! All 5 frequency analysis mappings verified.';
        }
    }

    // Restore saved frequency draft
    var savedFreq = (utils.storage && utils.storage.get) ? utils.storage.get('draft_mono_freq', null) : null;
    if (savedFreq && typeof savedFreq === 'object') {
        freqMappings = savedFreq;
    }
    var savedCiphertext = (utils.storage && utils.storage.get) ? utils.storage.get('draft_mono_ciphertext', null) : null;
    if (savedCiphertext) {
        var freqInput = container.querySelector('#mono-freq-input');
        if (freqInput) freqInput.value = savedCiphertext;
        var cleanedSaved = utils.cleanText(savedCiphertext);
        if (cleanedSaved.length >= 2) {
            performFrequencyAnalysis(savedCiphertext);
            container.querySelector('#mono-freq-results').style.display = 'block';
            updateChallengeUI();
        }
    }

    // Initial validation and display
    updateAlphabetDisplay();
    });
})(window.CipherApp);
