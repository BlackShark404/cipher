const { describe, it, beforeEach } = require('node:test');
const assert = require('node:assert/strict');

// Setup Node test environment
global.window = global;
global.document = {
    createElement: () => ({ classList: { add() {}, remove() {} }, style: {} }),
    querySelectorAll: () => [],
    querySelector: () => null
};

// In-memory mock localStorage
const store = new Map();
global.localStorage = {
    getItem: (key) => (store.has(key) ? store.get(key) : null),
    setItem: (key, val) => store.set(key, String(val)),
    removeItem: (key) => store.delete(key),
    clear: () => store.clear(),
    get length() {
        return store.size;
    },
    key: (i) => Array.from(store.keys())[i]
};

// Initialize CipherApp registry
global.CipherApp = {
    modules: {},
    registerModule: function(name, fn) {
        this.modules[name] = fn;
        // Invoke immediately with dummy container
        fn({
            innerHTML: '',
            querySelector: () => ({
                addEventListener: () => {},
                classList: { add() {}, remove() {}, toggle() {}, contains: () => false },
                style: {},
                dataset: {}
            }),
            querySelectorAll: () => []
        });
    }
};

require('../js/utils.js');
require('../js/caesar.js');
require('../js/monoalphabetic.js');
require('../js/playfair.js');
require('../js/exam.js');

const { utils, storage, progress, caesar, monoalphabetic, playfair } = global.CipherApp;

describe('1. Utility & Math Functions', () => {
    it('mod handles standard positive numbers', () => {
        assert.equal(utils.mod(7, 26), 7);
        assert.equal(utils.mod(26, 26), 0);
        assert.equal(utils.mod(29, 26), 3);
    });

    it('mod correctly computes non-negative results for negative numbers', () => {
        assert.equal(utils.mod(-1, 26), 25);
        assert.equal(utils.mod(-3, 26), 23);
        assert.equal(utils.mod(-26, 26), 0);
        assert.equal(utils.mod(-27, 26), 25);
    });

    it('letterToNum and numToLetter map A-Z to 0-25', () => {
        assert.equal(utils.letterToNum('A'), 0);
        assert.equal(utils.letterToNum('Z'), 25);
        assert.equal(utils.numToLetter(0), 'A');
        assert.equal(utils.numToLetter(25), 'Z');
        assert.equal(utils.letterToNum('M'), 12);
        assert.equal(utils.numToLetter(12), 'M');
    });

    it('cleanText uppercases and strips whitespace/punctuation', () => {
        assert.equal(utils.cleanText('Hello, World! 123'), 'HELLOWORLD');
        assert.equal(utils.cleanText(''), '');
    });
});

describe('2. Unified Storage Manager', () => {
    beforeEach(() => {
        store.clear();
    });

    it('sets and retrieves JSON data safely', () => {
        storage.set('test_key', { score: 95, items: ['A', 'B'] });
        const val = storage.get('test_key');
        assert.deepEqual(val, { score: 95, items: ['A', 'B'] });
    });

    it('returns fallback value if key does not exist', () => {
        assert.equal(storage.get('non_existent', 42), 42);
        assert.deepEqual(storage.get('non_existent', { empty: true }), { empty: true });
    });

    it('removes specific keys', () => {
        storage.set('to_remove', 'data');
        assert.equal(storage.get('to_remove'), 'data');
        storage.remove('to_remove');
        assert.equal(storage.get('to_remove', null), null);
    });

    it('clearAll removes all and only cryptolab_ prefixed keys', () => {
        storage.set('draft_caesar_key', 7);
        storage.set('exam_history', [{ score: 10 }]);
        global.localStorage.setItem('unrelated_app_key', 'keep_me');

        storage.clearAll();

        assert.equal(storage.get('draft_caesar_key', null), null);
        assert.equal(storage.get('exam_history', null), null);
        assert.equal(global.localStorage.getItem('unrelated_app_key'), 'keep_me');
    });
});

describe('3. Caesar Cipher Engine', () => {
    it('encrypts letters correctly with shift key 3', () => {
        assert.equal(caesar.encryptLetter('A', 3), 'D');
        assert.equal(caesar.encryptLetter('X', 3), 'A');
        assert.equal(caesar.encryptLetter('Z', 1), 'A');
    });

    it('decrypts letters correctly with shift key 3', () => {
        assert.equal(caesar.decryptLetter('D', 3), 'A');
        assert.equal(caesar.decryptLetter('A', 3), 'X');
    });

    it('encrypts full message HELLO to KHOOR with key 3', () => {
        assert.equal(caesar.encrypt('HELLO', 3), 'KHOOR');
    });

    it('decrypts full message KHOOR to HELLO with key 3', () => {
        assert.equal(caesar.decrypt('KHOOR', 3), 'HELLO');
    });

    it('preserves spaces and punctuation intact', () => {
        assert.equal(caesar.encrypt('ATTACK AT DAWN!', 3), 'DWWDFN DW GDZQ!');
        assert.equal(caesar.decrypt('DWWDFN DW GDZQ!', 3), 'ATTACK AT DAWN!');
    });

    it('roundtrips accurately for every key 0 through 25', () => {
        const text = 'THE QUICK BROWN FOX JUMPS OVER THE LAZY DOG';
        for (let k = 0; k < 26; k++) {
            const enc = caesar.encrypt(text, k);
            const dec = caesar.decrypt(enc, k);
            assert.equal(dec, text, `Failed on Caesar key ${k}`);
        }
    });
});

describe('4. Monoalphabetic Substitution Engine', () => {
    const QWERTY_KEY = 'QWERTYUIOPASDFGHJKLZXCVBNM';

    it('encrypts with permuted key accurately', () => {
        // H(7)->I, E(4)->T, L(11)->S, L(11)->S, O(14)->G
        assert.equal(monoalphabetic.encrypt('HELLO', QWERTY_KEY), 'ITSSG');
    });

    it('decrypts with permuted key accurately', () => {
        assert.equal(monoalphabetic.decrypt('ITSSG', QWERTY_KEY), 'HELLO');
    });

    it('preserves spaces when requested', () => {
        assert.equal(monoalphabetic.encryptPreserveSpaces('HELLO WORLD', QWERTY_KEY), 'ITSSG VGKSR');
    });

    it('full roundtrip with custom 26-letter alphabet', () => {
        const customKey = 'ZYXWVUTSRQPONMLKJIHGFEDCBA'; // Atbash
        const msg = 'SECRET MESSAGE';
        const cleaned = utils.cleanText(msg);
        const enc = monoalphabetic.encrypt(cleaned, customKey);
        const dec = monoalphabetic.decrypt(enc, customKey);
        assert.equal(dec, cleaned);
    });
});

describe('5. Playfair Cipher Engine', () => {
    it('constructs 5x5 matrix merging J into I and deduplicating keyword', () => {
        const { matrix, letters } = playfair.buildMatrix('MONARCHY');
        assert.equal(matrix.length, 5);
        matrix.forEach((row) => assert.equal(row.length, 5));
        assert.equal(letters.length, 25);
        assert.ok(!letters.includes('J'), 'Matrix must not contain letter J');
        assert.equal(new Set(letters).size, 25, 'Matrix must have 25 unique letters');
        // First row of MONARCHY should be M O N A R
        assert.deepEqual(matrix[0], ['M', 'O', 'N', 'A', 'R']);
    });

    it('prepares digraphs by splitting double letters with X', () => {
        const prep = playfair.prepareText('BALLOON');
        assert.deepEqual(prep.digraphs, ['BA', 'LX', 'LO', 'ON']);
    });

    it('prepares digraphs by padding odd length messages with X', () => {
        const prep = playfair.prepareText('HELLO');
        assert.deepEqual(prep.digraphs, ['HE', 'LX', 'LO']);
    });

    it('applies Same Row rule with circular right/left wrap', () => {
        const matrixData = playfair.buildMatrix('MONARCHY');
        // In first row [M, O, N, A, R], AR -> RM
        const enc = playfair.encryptDigraph(matrixData.matrix, 'AR');
        assert.equal(enc.rule, 'row');
        assert.equal(enc.output, 'RM');

        const dec = playfair.decryptDigraph(matrixData.matrix, 'RM');
        assert.equal(dec.output, 'AR');
    });

    it('applies Rectangle rule by swapping columns', () => {
        const matrixData = playfair.buildMatrix('MONARCHY');
        // H at (1, 1), S at (3, 3) -> swap cols
        const enc = playfair.encryptDigraph(matrixData.matrix, 'HS');
        assert.equal(enc.rule, 'rect');
        assert.equal(enc.output, 'BP');

        const dec = playfair.decryptDigraph(matrixData.matrix, 'BP');
        assert.equal(dec.output, 'HS');
    });

    it('full message encryption of INSTRUMENTS produces expected ciphertext', () => {
        const cipher = playfair.encrypt('INSTRUMENTS', 'MONARCHY');
        assert.equal(cipher, 'GATLMZCLRQXA');
        const plain = playfair.decrypt(cipher, 'MONARCHY');
        assert.equal(plain, 'INSTRUMENTSX'); // padded with X
    });
});

describe('6. Student Progress & Mastery Tracking', () => {
    beforeEach(() => {
        progress.reset();
    });

    it('records completed exercises accurately', () => {
        assert.equal(progress.isComplete('caesar', 'caesar-exercise-1'), false);
        progress.complete('caesar', 'caesar-exercise-1');
        assert.equal(progress.isComplete('caesar', 'caesar-exercise-1'), true);
    });

    it('calculates section progress percentages', () => {
        assert.equal(progress.getProgress('caesar'), 0);
        progress.complete('caesar', 'caesar-fundamentals');
        const pct1 = progress.getProgress('caesar');
        assert.ok(pct1 > 0 && pct1 < 100);

        // Complete all tasks in caesar
        ['caesar-wheel', 'caesar-encrypt-decrypt', 'caesar-brute-force',
         'caesar-exercise-1', 'caesar-exercise-2', 'caesar-exercise-3',
         'caesar-exercise-4', 'caesar-exercise-5'].forEach(t => progress.complete('caesar', t));

        assert.equal(progress.getProgress('caesar'), 100);
    });

    it('calculates dynamic progress bar color thresholds', () => {
        assert.equal(utils.getProgressColor(15), 'var(--warning)');
        assert.equal(utils.getProgressColor(45), 'var(--primary)');
        assert.equal(utils.getProgressColor(75), 'var(--info)');
        assert.equal(utils.getProgressColor(100), 'var(--success)');
    });
});

describe('7. Practical Exam Question Generator', () => {
    const exam = global.CipherApp.exam;

    it('generates the exact requested number of questions', () => {
        const q5 = exam.generateExamQuestions('all', 'medium', 5);
        assert.equal(q5.length, 5);

        const q10 = exam.generateExamQuestions('all', 'medium', 10);
        assert.equal(q10.length, 10);
    });

    it('filters questions strictly by cipher when specified', () => {
        const caesarQuestions = exam.generateExamQuestions('caesar', 'all', 5);
        caesarQuestions.forEach(q => assert.equal(q.cipher, 'caesar'));

        const playfairQuestions = exam.generateExamQuestions('playfair', 'all', 5);
        playfairQuestions.forEach(q => assert.equal(q.cipher, 'playfair'));

        const monoQuestions = exam.generateExamQuestions('monoalphabetic', 'all', 4);
        monoQuestions.forEach(q => assert.equal(q.cipher, 'monoalphabetic'));
    });

    it('every generated question has valid structure and answer keys', () => {
        const questions = exam.generateExamQuestions('all', 'hard', 10);
        questions.forEach((q, idx) => {
            assert.ok(q.title, `Question ${idx} missing title`);
            assert.ok(q.question, `Question ${idx} missing question prompt`);
            assert.ok(q.correctAnswer !== undefined && q.correctAnswer !== '', `Question ${idx} missing correctAnswer`);
            assert.ok(q.explanation, `Question ${idx} missing solution explanation`);
        });
    });
});
