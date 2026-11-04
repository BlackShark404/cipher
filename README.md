# 🔐 Classical Cryptography — Interactive Learning Lab

[![Deploy to GitHub Pages](https://github.com/BlackShark404/cipher/actions/workflows/deploy.yml/badge.svg)](https://github.com/BlackShark404/cipher/actions/workflows/deploy.yml)
[![Live Demo](https://img.shields.io/badge/Live%20Demo-GitHub%20Pages-blue?style=flat&logo=github)](https://blackshark404.github.io/cipher/)

A modern, fully interactive, and mobile-responsive educational web application designed for mastering classical substitution ciphers in preparation for cryptography practical examinations:

1. **🔄 Caesar Cipher** (Shift substitution, modular arithmetic, rotatable SVG cipher wheel, brute-force cracker)
2. **🔤 Monoalphabetic Substitution Cipher** (Permuted alphabets, dual-row mapping, frequency analysis laboratory, bigram detection)
3. **🔲 Playfair Cipher** (5×5 keyword matrix generation, digraph preparation with filler $X$, three encryption/decryption rules with visual matrix highlights)
4. **📊 Comparative Study Guide** (Key space scales, vulnerability comparison, Shannon confusion/diffusion)
5. **📝 Practical Exam Simulation** (Timed mock exam with 11 randomized problem types, automatic grading, and diagnosis)
6. **📋 Final Review & Reference** (Formula cards, common exam traps, and "Can You Solve This?" mystery challenges)

---

## 🌐 Live Access Anywhere (Desktop & Mobile)

The app is deployed on GitHub Pages and can be accessed directly from any computer, tablet, or smartphone:

👉 **[https://blackshark404.github.io/cipher/](https://blackshark404.github.io/cipher/)**

### 📱 Installing on Mobile (PWA / Home Screen)
- **iOS (Safari)**: Open the link, tap the **Share** button (`⎋`), and select **"Add to Home Screen"**.
- **Android (Chrome)**: Open the link, tap the **three dots** menu (`⋮`), and select **"Add to Home screen"** or **"Install App"**.

---

## 🚀 Key Modules & Features

### 1. Caesar Cipher
- **Modular Arithmetic Breakdown**: $C = (P + k) \bmod 26$ and $P = (C - k + 26) \bmod 26$.
- **Interactive Concentric Cipher Wheel**: $320 \times 320\text{ px}$ SVG with outer and inner rings that rotate synchronously with key input or manual drag.
- **Brute-Force Engine**: Simultaneously displays all 26 shifts with an English language heuristic ranking likely plaintext.
- **5 Progressive Exercises**: Basic encryption, modular wrap-around, key deduction, and cipher cracking.

### 2. Monoalphabetic Cipher & Frequency Analysis
- **Key Space Dimension**: Visualization of the $26! \approx 4.03 \times 10^{26}$ keys.
- **Interactive Alphabet Permuter**: Dual-row letter mapping with collision prevention (duplicate letters flagged in red).
- **Frequency Analysis Laboratory**:
  - Side-by-side comparative chart (Ciphertext frequencies vs. Standard English frequencies).
  - Bigram scanner ($\text{TH, HE, IN, ER, AN, RE, ON, AT, EN, ND}$).
  - Live interactive solver workspace updating partially decrypted plaintext in real-time.
- **5 Practice Exercises**: Reverse mapping, substitution key reconstruction, and frequency analysis.

### 3. Playfair Cipher
- **5×5 Matrix Generator**: Deduplicates keyword letters, merges $I/J$, and numbers matrix coordinates $(r, c)$.
- **Plaintext Preparation**: Converts to uppercase, swaps $J \to I$, splits into digraphs, and injects filler $X$ for repeated letters and odd lengths.
- **Visual Three-Rule Demonstration**:
  - *Same Row Rule*: Shift right (encrypt) / shift left (decrypt) with cyclic wrap-around.
  - *Same Column Rule*: Shift down (encrypt) / shift up (decrypt) with cyclic wrap-around.
  - *Rectangle Rule*: Swap column coordinates.
- **5 Practice Exercises**: Matrix construction, digraph preparation, and full message decryption.

### 4. Practical Exam Simulator
- **Configurable Exams**: Filter by cipher (Caesar, Mono, Playfair, or All), difficulty (Easy, Medium, Hard), and timer (10m, 15m, 20m, or Untimed).
- **11 Question Types**: Covering manual encryption, modular calculations, key discovery, matrix construction, and vulnerability theory.
- **Auto-Grading & Remediation**: Instant grading with letter scores ($A$–$F$), solution explanations, and a **"Retry Missed Questions"** button.

---

## 💻 Running Locally (Offline)

This application has **zero external dependencies** and requires no backend:

```bash
# Clone the repository
git clone https://github.com/BlackShark404/cipher.git

# Navigate into the project directory
cd cipher

# Open in browser
open index.html   # On macOS
# or start a lightweight server:
python3 -m http.server 8000
```

---

## 🛠️ Tech Stack
- **HTML5**: Semantic markup, responsive viewport, and mobile status bar support.
- **CSS3**: Custom design system, CSS Grid/Flexbox, KaTeX-style math layouts, and transitions.
- **JavaScript (ES6+)**: Modular client-side architecture with `localStorage` persistent state tracking.
- **GitHub Actions**: Automated CI/CD pipeline deploying directly to GitHub Pages.
