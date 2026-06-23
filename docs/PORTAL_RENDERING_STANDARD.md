# jdwhite.world — Portal Rendering Standard
**Status: Active | Version: 1.0 | Established: 2026-05-28**

---

## Philosophy

The portals are not buttons. They are not icons. They are not decorative graphics.

Each portal is a **narrative world** — a dimensional object that communicates:
- The identity of the world behind it
- The emotional tone of that world
- The material language of that world
- The type of experience the visitor is entering

The landing page is a cinematic galaxy portal system. Every planet must feel like it belongs to the same universe — mysterious, dimensional, premium, emotionally intentional.

The viewer should feel: *"What is that world?"*
Not: *"That is a cool website button."*

---

## Approved Baseline: JD Productions Planet

The JD Productions portal is the first approved official portal world. All future portals follow this as the technical and visual baseline.

**Locked as approved — do not redesign without explicit instruction:**
- WebGL / Three.js r165 ES module rendering
- Dimensional 3D sphere (SphereGeometry, 128×128 segments)
- Dark mineral / black diamond surface language
- Gold fracture vein identity (FBM noise + geological mask)
- Cinematic ACES filmic tone mapping
- Restrained atmosphere (hemisphere-gated, hugs sphere edge)
- Subtle orbital debris ring (close orbit, 22° tilt, depthTest:true)
- Environmental galaxy integration
- Portal-scale composition (sz:118 at x:74, y:20 in galaxy)
- Hover/interactivity behavior (scale 1.048 on hover)

### Technical Configuration (JD Productions)
```
sz: 118px sphere div
canvas: Math.round(sz * 1.66) = 196px (overflow:visible for ring extension)
camera: PerspectiveCamera(44°, z=4.8)
ring radii: 1.12–1.38 world units (tight orbit)
ring tilt: 22° (rotation.x)
ring depthTest: true (correct depth occlusion by planet)
```

---

## Global Visual Rules

### DO
- Use real WebGL / Three.js dimensional rendering
- Maintain cinematic restraint in all effects
- Preserve physically believable lighting (directional, no magic glow)
- Integrate with the galaxy environment (dark background, spatial presence)
- Keep motion subtle and premium
- Make each planet emotionally distinct while belonging to the same universe
- Use material language that communicates the world's identity

### DO NOT
- Create CSS-only fake orbs
- Create flat icons pretending to be planets
- Create neon plasma, Tron energy, or Marvel glow effects
- Overuse VFX or particle density
- Make planets feel like isolated render demos
- Build multiple planets simultaneously without individual approval
- Layer new WebGL over old legacy CSS/canvas renderers

---

## Ring / Orbital Rules

Rings are **optional**. Do not force every planet to have one.

A ring is only justified if it supports the world's identity.

**A ring must feel like:** celestial debris, mineral dust, orbiting particulate matter, atmospheric material, physically believable orbital behavior.

**A ring must not feel like:** plasma, lava, Tron, neon VFX, decorative UI effect.

If a ring is used, `depthTest:true` must be set so the planet sphere correctly occludes the rear arc. This creates proper orbital depth without manual front/back splitting.

---

## Technical Integration Rules

For each WebGL portal:

1. Replace the legacy renderer completely — do not layer over old CSS/canvas
2. Verify only one active renderer exists per portal at runtime
3. Verify no old ring divs, glow overlays, or CSS planet layers remain active
4. Use ES module import: `import * as THREE from 'https://unpkg.com/three@0.165.0/build/three.module.min.js'`
5. Use `<script type="module">` — never `window.THREE` assumption
6. Each planet has its own named init function: `initJDProductionsPlanet()`, `initLilDevPlanet()`, etc.
7. WebGL shell built by the portal builder (data-webgl="pending" on sphere div); module script fills it
8. Canvas positioned with negative offset to allow ring extension beyond sphere div boundary
9. `overflow:visible` on `.planet-sphere[data-webgl]` is required for ring visibility
10. `Page Visibility API` pause on hidden tab

### Shell Pattern (portal builder side)
```javascript
// Portal builder creates only the shell — no CSS planet, no legacy layers
const wrap  = document.createElement('div'); wrap.className = 'planet-wrap';
const atmo  = document.createElement('div'); atmo.className = 'planet-atmosphere'; atmo.dataset.material = 'world-id';
const sphere = document.createElement('div'); sphere.className = 'planet-sphere'; sphere.dataset.material = 'world-id';
sphere.dataset.sz  = p.sz;
sphere.dataset.webgl = 'pending'; // module script picks this up
```

### Module Script Pattern
```javascript
// <script type="module"> at end of body — runs after IIFE builds DOM
import * as THREE from 'https://unpkg.com/three@0.165.0/build/three.module.min.js';

const sphere = document.querySelector('.planet-sphere[data-webgl="pending"]');
// ... validate shell exists, set dataset.webgl = 'active', build scene
```

---

## Composition Rules

Each portal has `x` (left%), `y` (top%), and `sz` (sphere diameter px) in the PORTALS data array.

The visual canvas footprint = `sz × 1.66px` (due to ring extension canvas). This must be accounted for when spacing portals.

**Minimum clearance:** 40px between canvas edge and nearest neighboring portal sphere edge, across 1280px–1440px viewports.

**Size hierarchy (sz):**

| Portal | sz | Meaning |
|--------|----|---------|
| Work With Me | 136 | Flagship action |
| JD Productions | 118 | Primary world |
| The System | 128 | Primary world |
| Content | 122 | Secondary |
| Projects | 120 | Secondary |
| Lil Dev | 114 | Brand world |
| Merch | 110 | Commerce |
| Access | 106 | Private |
| Music | 100 | Platform |
| Instagram | 96 | Social |
| TikTok | 92 | Social |

Do not make new portals larger than their place in this hierarchy suggests.

---

## Approval Workflow

**One planet at a time. No exceptions.**

1. Create isolated prototype for the planet
2. Review visually — silhouette test at actual landing page scale
3. Refine until approved
4. Integrate into main `index.html`, replacing legacy renderer
5. Verify legacy renderer is fully removed
6. Verify composition clearance from neighbors
7. Only then move to the next planet

---

## Quality Control Checklist

Before presenting any planet for review:

- [ ] Reads as a real world, not a button, at landing page scale
- [ ] Belongs inside the jdwhite.world galaxy visually
- [ ] Communicates the correct emotional identity for that world
- [ ] Lighting is cinematic and restrained
- [ ] Motion is premium, not gimmicky
- [ ] Effects are physically believable
- [ ] Integrated into landing page environment (no isolated demo feel)
- [ ] Legacy renderer fully removed for this portal
- [ ] No old ring divs, glow overlays, or CSS fallbacks active
- [ ] Three.js loads correctly as ES module
- [ ] Hover/click behavior functional
- [ ] Planet scales correctly within its portal bounds
- [ ] Canvas clearance from neighboring portals verified

---

## Next World Directions (Pending Approval One at a Time)

### Lil Dev
- **Identity:** alive, imaginative, joyful, energetic, creative, childlike wonder, universe-in-progress
- **Material:** iridescent crystal, luminous inner core, colorful soft energy — playful but premium

### The Collection
- **Identity:** luxury, fashion, curated, editorial, rare, refined
- **Material:** sapphire, chrome, polished surface, elegant reflections, restrained glow

### JD System
- **Identity:** intelligent, architectural, precise, automated, structured, OS energy
- **Material:** graphite crystal, electric blue circuitry, geometric orbital systems, structured data motion

### Screening Room / Content
- **Identity:** cinematic, theatrical, mysterious, story-driven, immersive
- **Material:** dark cinema body, golden projection haze, subtle film-grain particles, eclipse-like atmosphere

---

## Mistakes to Avoid

These mistakes were made during JD Productions development — do not repeat:

1. **Loading Three.js as UMD via `<script>` tag** — `three.min.js` in r165 is ESM, not UMD. Always use `<script type="module">` with ESM import.
2. **Layering new WebGL over legacy CSS** — always fully replace the legacy renderer, never add on top.
3. **`overflow:hidden` on the sphere div** — clips the ring entirely. Must be `overflow:visible` on `[data-webgl]` elements.
4. **Canvas positioned before `renderer.setSize()`** — Three.js writes inline width/height styles during setSize; position styles must be set AFTER.
5. **Ring `depthTest:false`** — creates ambiguous artifacts where the ring renders through the planet. Use `depthTest:true` for correct orbital occlusion.
6. **Ring orbit too large** — radii above 1.4 world units feel detached and Saturn-like at portal scale. Keep tight (1.12–1.38).
7. **Atmosphere scale too large** — above 1.04 creates a detached halo that blurs the silhouette. Keep ≤1.025.
8. **Fresnel rim too high** — above 0.3 creates a glass-orb appearance. Keep ≤0.20.
9. **Canvas footprint not accounted for in portal spacing** — the visual footprint is `sz × 1.66px`, not `sz`. Always verify clearance at 1280px and 1440px viewports.
10. **Building multiple planets at once** — always build and approve one at a time.
