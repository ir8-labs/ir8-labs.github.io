# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

IR8 holding page - a brutalist, cybersecurity-themed landing page for an Australian red team consultancy. The design follows an "Adversarial Interface" concept: monochrome palette, HUD-style navigation, glitch effects, and terminal aesthetics.

## Commands

```bash
npm run dev      # Start Vite dev server
npm run build    # TypeScript check + Vite production build
npm run lint     # ESLint
npm run preview  # Preview production build
```

## Architecture

**Stack:** React 18 + TypeScript + Vite + Tailwind CSS + Framer Motion

**Key Design Decisions:**
- Fixed-frame experience (no scrolling) - pages change "state" like terminal tabs
- Four-corner HUD navigation (top-left: logo, top-right: /PROTOCOL, bottom-left: /OPERATIONS, bottom-right: /INITIALIZE)
- Strict monochrome: `ir8-black` (#000), `ir8-white` (#FFF), `ir8-gray` variants
- Zero border-radius enforced globally via CSS

**Source Structure:**
- `src/App.tsx` - BrowserRouter with routes wrapped in HUDLayout
- `src/components/HUDLayout.tsx` - Fixed corner navigation, scanlines, noise overlay
- `src/pages/Hero.tsx` - Main landing with headline animation
- `src/components/GlitchText.tsx` - RGB channel split glitch effect
- `src/components/DecodeText.tsx` - Matrix-style text decode animation
- `src/components/WireframeBackground.tsx` - Canvas-based animated node mesh
- `src/index.css` - Design system: CSS variables, HUD positioning, effects

**Typography (from tailwind.config.js):**
- `font-mono`: JetBrains Mono (body/terminal text)
- `font-headline`: Oswald (massive headlines)
- `font-display`: Inter (display text)

## Design Reference

See `IDEAS.md` for the full design brief including:
- Colour palette and typography rationale
- Page states (/PROTOCOL, /OPERATIONS, /INITIALIZE)
- Visual elements (redacted mission logs, PGP key blocks, terminal prompts)
