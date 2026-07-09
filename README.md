# 🚀 APEX Stock Scanner & AI Hedge Fund Committee Simulator

A premium, state-of-the-art web application simulating an advanced Wall Street investment committee using a multi-agent AI architecture. Built with **React**, **TypeScript**, and **Tailwind CSS v4**, this application features a sleek dark mode, rich glassmorphic overlays, and interactive 3D physics.

The scanning pipeline is modeled after the multi-agent decision engine from [virattt/ai-hedge-fund](https://github.com/virattt/ai-hedge-fund).

---

## ✨ Features

- **Multi-Agent Pipeline Analysis**: Watch live timed simulations as five dedicated AI agents analyze your chosen stock ticker:
  - **Valuation Agent**: Estimates intrinsic DCF value and industry relative pricing.
  - **Technicals Agent**: Evaluates momentum indicators like RSI and MACD crossovers.
  - **Fundamentals Agent**: Audits financial health, debt-to-equity, and capital efficiency.
  - **Sentiment Agent**: Scrapes and parses social volume index (Reddit/X) and media headlines.
  - **Risk Manager**: Calculates systematic beta risk, Value-at-Risk (VaR), and caps position exposure.
- **Dynamic Consensus Engine**: Recalculates final BUY, HOLD, or SELL decisions and target portfolio exposures.
- **Weight Customizer**: Tweak individual agent influence values in real-time or load presets based on legendary investment styles (e.g. *Warren Buffett*, *Cathie Wood*).
- **Interactive 30-Day Backtest Chart**: Custom responsive SVG line chart comparing the consensus portfolio against the S&P 500 benchmark.
- **3D Card Rotation Physics**: Cards dynamically tilt towards your mouse cursor on hover.

---

## 🛠️ Installation & Setup

Ensure you have **Node.js** (v18 or higher) installed on your system.

### 1. Install Dependencies
Navigate to the project root and run:
```bash
npm install
```

### 2. Run the Development Server
Launch the hot-reloading local server:
```bash
npm run dev
```
Open your browser to [http://localhost:5173](http://localhost:5173).

### 3. Build for Production
To bundle optimized, production-ready static assets:
```bash
npm run build
```

---

## 📤 Git Commit & Push Guide

To push your local changes to your remote GitHub repository:

### 1. Stage Your Changes
Select the files you want to include in the commit. To stage all modified and new files:
```bash
git add .
```

### 2. Create a Commit
Write a descriptive commit message explaining your changes:
```bash
git commit -m "feat: add interactive tooltips and update docs"
```

### 3. Push to Remote GitHub Repository
Send your commits to the main repository:
```bash
git push origin master
```
*(If your default branch is named `main` instead of `master`, run `git push origin main`.)*
