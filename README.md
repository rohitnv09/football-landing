# Kinetic Orb Football Landing

An immersive football landing page with a little swagger: 3D depth, scroll-tuned motion, and a layout that feels more pitchside poster than brochure.

It pairs a locally served 3D football model with scroll-driven camera motion and a high-polish editorial layout, giving the page a cinematic feel without adding unnecessary runtime complexity.
The vibe is clean, tactile, and a little electric.

> Fast to load. Fun to scroll. Slightly hypnotic if you let it sit for a second.

## ↗ Live Demo

[kinetic-football.vercel.app](https://kinetic-football.vercel.app)

## ◌ What's Inside

- A premium hero experience built around a 3D football model
- Scroll-linked camera motion that keeps the page feeling alive
- GSAP-driven motion polish for timing, rhythm, and a bit of drama
- A fast Vite-based build pipeline
- A local asset setup that keeps the experience reliable in production and during development
- A design that stays sharp instead of drifting into generic landing-page territory

## ⟡ Tech Stack

- Vite
- React
- React Compiler
- GSAP
- React Three Fiber
- Three.js

## ⌘ Scripts

- `npm run dev` starts the local Vite dev server.
- `npm run build` type-checks and builds the production bundle.
- `npm run lint` runs ESLint.
- `npm run preview` serves the production build locally.

## ◉ Asset Notes

The football model is served from `public/models/football.glb`. Keeping the model local avoids extra network dependency and preserves the intended scroll-driven 3D camera behavior.
That choice also keeps the whole thing feeling tight and self-contained, which matters for a page that leans on motion.

## ⚡ Why This Setup Works

- Vite keeps iteration fast.
- React Compiler helps keep the component model lean.
- GSAP gives the motion a proper sense of rhythm.
- React Three Fiber keeps the 3D experience integrated with the rest of the React tree.
- The local model keeps the experience dependable and avoids unnecessary external dependencies.

## ☍ Development

1. Install dependencies with `npm install`.
2. Start the dev server with `npm run dev`.
3. Open the local URL printed in the terminal.
4. Scroll a little slower than you normally would.

## ⌁ Build

For a production check, run:

```bash
npm run build
```

Then preview the output locally:

```bash
npm run preview
```

## ✦ Small Details

- The site is intentionally built to feel motion-first.
- The football model stays local so the 3D experience remains stable.
- The design aims for a glossy, slightly offbeat energy rather than a default SaaS look.
