# PiNova Global Marketplace — Deployment Guide

> **Permanent Transparency & Operational Notices:**
> - **Transparency Notice:** PiNova Global Marketplace is built on a non-custodial marketplace architecture. Payment processing relies on the Official Pi SDK v2 and Pi Platform API. PiNova never stores or manages Pi wallet private keys, recovery phrases, passphrases, blockchain infrastructure, or official Pi Network services.
> - **Operational Notice:** Certain marketplace capabilities rely on external service providers and official Pi Platform services. Feature availability, response times, and service outcomes may vary depending on provider availability, network connectivity, and Official Pi Platform service status.

## Overview
PiNova is packaged as a Node.js + Express + Vite application optimized for containerized Cloud Run and Pi Browser deployment.

---

## 1. Prerequisites
- Node.js 20+
- npm 9+
- Pi Network Developer Account & `PI_API_KEY`
- Gemini API Key (`GEMINI_API_KEY`)

---

## 2. Environment Variables (.env.example)
```env
PORT=3000
NODE_ENV=production
PI_API_KEY=your_pi_platform_api_key_here
GEMINI_API_KEY=your_gemini_api_key_here
OPENAI_API_KEY=optional_openai_key_here
```

---

## 3. Build & Run Commands

### Development Mode
```bash
npm run dev
```

### Production Build & Launch
```bash
npm run build
npm start
```

The server binds to `http://0.0.0.0:3000` behind the reverse proxy.
