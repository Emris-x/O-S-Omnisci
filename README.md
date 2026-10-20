# O-S — Omnisci

**A mobile-first, offline-ready scientific calculator.**

O-S (Omnisci) is an installable web application with a local calculation engine. The current starter release establishes the visual system, basic/scientific keypads, expression evaluation, session history, and PWA caching.

## Run locally

No package manager, build step, API key, or backend is required.

1. Serve this directory from a local static web server (service workers do not run from `file://`).
2. Open `index.html` in a modern browser through that server.
3. For deployment, publish the repository root as a static site on Vercel.

The app can calculate locally after its shell has been cached by the service worker. The optional Google Fonts import is decorative; the system font fallback remains available offline.

## Current implementation

- Responsive dark interface using the Omnisci near-black and electric-green palette.
- BASIC, SCI, and SYMBOLS keypads.
- Local parser and evaluator (no JavaScript `eval` or remote calculation API).
- Arithmetic, parentheses, powers, constants, factorial, percentage suffix, and common trigonometric/logarithmic functions.
- DEG/RAD angle toggle and `Ans` value.
- Recent calculations held in the current page session.
- Installable PWA manifest and service-worker shell cache.
- Keyboard input support on desktop.

## Current limitations — do not mistake the starter for the finished scientific platform

- This is the first foundation, not the complete specification.
- Matrix algebra, calculus, numerical integration, graphing, physics/chemistry solvers, dimensional analysis, unit conversion, persistent history, and cloud sync are not implemented yet.
- SYMBOLS mode currently offers a compact set of symbolic-entry keys; relational symbols are not a symbolic algebra engine.
- There is no automated test suite yet. Test expressions manually and add tests before expanding the evaluator.
- Trigonometric and logarithmic edge cases should be covered by automated tests before calling this production-grade.
- No authentication or database is required for the offline calculator. Add Supabase only if a clearly defined cloud feature needs it.

## Design tokens

- Background: `#07090B`
- Secondary background: `#0D1114`
- Elevated surface: `#12181B`
- Accent: `#63F59A`
- Primary text: `#F2F5F3`
- Secondary text: `#9AA7A0`

## Project principles

1. Calculation is local-first; do not transmit expressions by default.
2. Never present an unsupported result as if it were computed.
3. Keep the UI usable on a phone screen.
4. Prefer explicit tests and understandable algorithms over opaque shortcuts.
5. Preserve the existing project scope; implement one milestone at a time.

## Roadmap

1. **Foundation:** calculator UI, safe parser, responsive layout, PWA shell.
2. **Reliability:** automated evaluator tests, parser edge cases, accessibility, persistent local history.
3. **Scientific math:** inverse/hyperbolic functions, scientific notation controls, complex-number policy, constants and precision.
4. **Advanced tools:** matrices, vectors, equation solving, calculus and numerical methods.
5. **Visualization:** 2D graphing and interactive function inspection.
6. **Science modules:** dimensional units, physics formulas and chemistry utilities with clearly stated assumptions.
7. **Release hardening:** browser/device testing, performance, offline verification, deployment documentation.

## Deploy to Vercel

Import this GitHub repository in Vercel and use the repository root as the project root. This version is static: no build command and no output directory are required. After deployment, verify that the site is served over HTTPS so the service worker can install.

## License

No license has been added yet. Decide the project's licensing terms before accepting outside contributions or distributing the source broadly.

## Implemented toolkit pages (current release)

- `tools.html`: quadratic equations (including complex roots), selected introductory physics formulas, common unit conversions including temperature, approximate molar masses for common elements, numerical derivative and Simpson-rule integral of a cubic polynomial.
- `graph.html`: local 2D plotting for cubic-or-lower polynomials with adjustable x/y bounds.
- `linear.html`: 2×2 matrix determinant/inverse/transpose and 3D vector dot/cross products, magnitudes and angle.
- All of these pages are linked from the calculator and included in the service-worker cache.

## Still outstanding before calling the full specification complete

The current release is a useful prototype, not yet a validated engineering-grade scientific package. It does not yet include symbolic calculus, general equation systems, arbitrary matrix dimensions, complex-number arithmetic in the main expression engine, 3D/implicit graphing, broad physics/chemistry databases, chemical reaction balancing, dimensional analysis, persistent history, or automated browser/unit-test coverage. The numerical tools must be independently tested before being relied on for academic assessment or real-world engineering.
