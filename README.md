# E-Waste EPR Target & Registration Fee Calculator

A compliance portal and calculator application implementing India's **E-Waste (Management) Rules, 2022** and **Central Pollution Control Board (CPCB)** EPR statutory guidelines.

## Features
- **EPR Target Schedule Calculation**: Automatic calculation under Rule 4 & Schedule III (60% for FY 2023–25, 70% for FY 2025–27, 80% from FY 2027–28).
- **CPCB Registration Fee Lookup**: 5-tier fee slab calculation based on annual target MT (from ₹2,500 to ₹15,00,000).
- **Compliance Status & Audit Bar**: Live evaluation of deficit/surplus with visual progress tracking.
- **Universal Hybrid Architecture**: Operates 100% standalone on static hosts (Vercel, Netlify, GitHub Pages) with offline local storage fallback, as well as with a Node.js/Express backend on cloud hosts (Render, Heroku, Railway).

---

## Quick Start (Local Development)

```bash
# 1. Install dependencies
npm install

# 2. Run both backend server & frontend (Vite)
npm run dev:all

# OR run frontend-only
npm run dev
```

---

## Deployment Options

### Option 1: Static Hosting (Vercel, Netlify, GitHub Pages, Cloudflare)
1. Build command: `npm run build`
2. Output directory: `dist`
3. The application will automatically run using its client-side calculation and storage engine with zero configuration needed.

### Option 2: Fullstack Node.js Hosting (Render, Railway, Heroku, Docker)
1. Build command: `npm run build`
2. Start command: `npm start` (runs `node server/index.js` which serves both the API endpoints and the `dist` frontend on a single port).
