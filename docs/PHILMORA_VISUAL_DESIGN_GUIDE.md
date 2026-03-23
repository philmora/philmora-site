# PHILMORA.COM — Visual Design & Art Direction Guide
### Version 1.0 | March 2026

---

## 1. VISUAL DNA ANALYSIS

After reviewing 40+ assets across three folders and the live philmora.com, here's what defines Phil Mora's visual identity:

### Core Aesthetic Pillars
1. **Cosmic Scale** — Spaceships, planetary horizons, nebulae, infinite vistas. You gravitate toward images that suggest massive scope and frontier exploration.
2. **Saturated Color Maximalism** — Hot pinks, electric cyans, solar oranges, deep purples. Never muted, never safe. The palette screams "I refuse to be boring."
3. **Anime/Ghibli Warmth** — Robots in flower fields, watercolor creatures, wide-eyed wonder. Tech with soul. This humanizes the cosmic scale.
4. **Crystalline/Prismatic Surfaces** — Geometric fractals, light refraction, glass-like structures. Your visual metaphor for how you see technology: multifaceted, luminous, structured but beautiful.
5. **Dark Foundations** — Most backgrounds anchor in deep navy/black, letting the neon and vivid accents punch harder. Professional darkness, rebellious color.

### What the Current Framer Site Gets Wrong
The current rebuild uses generic Mixkit stock videos (dark particles, soft bokeh) that could belong to any SaaS landing page. It's competent but soulless. It lost everything that makes philmora.com memorable:
- No color saturation (everything is muted navy monotone)
- No personality (stock footage vs. custom AI art)
- No narrative (the original site tells a story through its visuals)
- No surprise (nothing makes you stop scrolling)

---

## 2. THE NEW VISUAL SYSTEM

### Color Palette

| Role | Color | Hex | Usage |
|------|-------|-----|-------|
| Deep Space | Near-black navy | `#0A0E1A` | Page backgrounds, text blocks |
| Cosmic Teal | Electric cyan | `#00E5CC` | Accent lines, hover states, links |
| Nebula Pink | Hot magenta | `#FF2D78` | Secondary accent, section transitions |
| Solar Flare | Vivid orange-gold | `#FF8A00` | CTAs, highlights, warmth moments |
| Prismatic Blue | Bright royal | `#3D5AFE` | Data viz, geometric elements |
| Aurora Green | Neon emerald | `#00FF88` | Success states, tech elements |
| Starlight | Warm white | `#F0EAFF` | Body text, headings |

### The Rule of Three Layers
Every section should feel like it has depth:
1. **Background Layer** — Dark base or animated video (always dark enough for text contrast)
2. **Midground Layer** — Gradient wash, prismatic refraction, or particle field
3. **Foreground Layer** — Content, with subtle glow/bloom effects on key elements

---

## 3. ASSET AUDIT & ASSIGNMENTS

### Tier 1: HERO-READY (use as-is for major sections)

| Asset | Current Location | Recommended Use |
|-------|-----------------|-----------------|
| Cosmic spaceship (purple/pink nebula) | `Philmora 2026/cosmic journey ref.png` | **HOME HERO** — This IS philmora.com. Animate via Kling/Grok for video. |
| Earth horizon figure (silhouette on planet edge) | `Philmora 2026/philmora_Horizon_of_Earth...png` | **ABOUT HERO** — The lone figure on the edge of everything. Perfect metaphor. |
| Rainbow crystal city in clouds | `Philmora 2026/11.png` | **NOW/VISION section** — Represents building impossible things. |
| Ocean sunrise (anime style) | `Philmora 2026/philmora_A_panoramic...png` | **BLOG PAGE HERO** — Endless horizon = endless ideas. |
| Empire of Worlds (cosmic energy beam) | `Philmora 2026/Empire of Worlds.png` | **SECTION DIVIDER** — Between major content blocks. |
| Robot in flower field | `Philmora 2026/cuteroboto - 00005.png` | **ABOUT PAGE** — Tech meets nature meets soul. The Ghibli touch. |
| Anime girl explosion of color | `Philmora 2026/floweranime - 00049.png` | **CONTACT or NEWSLETTER CTA** — Pure energy, invites engagement. |

### Tier 2: BACKGROUND TEXTURES (use as dark overlaid backgrounds)

| Asset | Location | Use |
|-------|----------|-----|
| Teal/pink data wave mesh | `philmoracom videos/...b368b463...3.png` | **PATTERN/WORK section** — The teal+pink network is on-brand AND has that edgy data viz feel. |
| Crystalline teal prisms | `phimoracom images/...2a0ed01f...3.png` | **STACK/SKILLS section** — Geometric, structured, beautiful. |
| Circuit board (cyan glow) | `phimoracom images/image 1.png` | **TECH SECTIONS** — Classic but vivid. Good as a subtle parallax BG. |
| Topographic contour lines | `phimoracom images/image 3.png` | **FOOTER or CONTACT** — Organic + technical hybrid. |
| Geometric grid network | `phimoracom images/...12b79012...1.png` | **PATTERN section** alt — More structured grid feel. |

### Tier 3: VIDEO SOURCES (Grok-generated, already in your folder)

You have **10 Grok videos** in `philmoracom videos/`. These are 5-10s clips generated from the still images above. They should be:
- Reviewed for quality (some Grok clips have artifacts)
- Best ones used as looping section backgrounds with 40-60% opacity dark overlay
- Paired with their source images as fallback for mobile (video = desktop, still = mobile)

### Tier 4: BUTCHSONIC CROSSOVER (use selectively)

The Rex Titan / Butchsonic images (muscular figure, Forge character) are part of your creative identity but should stay on the Butchsonic side. For philmora.com, use the **Ghibli robots** and **cosmic art** — they're edgy without being niche.

---

## 4. SECTION-BY-SECTION VIDEO/VISUAL PLAN

### HOME PAGE

| Section | Current | New Direction |
|---------|---------|---------------|
| **Hero** | Mixkit dark particle video | Cosmic spaceship scene (animated via Kling from `cosmic journey ref.png`). Full-bleed, slight parallax zoom, text overlay with glow. |
| **Now** | Static dark BG | Rainbow crystal city (`11.png`) as parallax image with prismatic gradient overlay |
| **Pattern** | Mixkit abstract video | Teal/pink data wave mesh (animated from the network visualization still) |
| **People** | Mixkit bokeh video | Ghibli robot in flowers (animated) — tech meets humanity |
| **Believe** | Static dark BG | Earth horizon silhouette figure — the "big picture" moment |
| **Blog grid** | Plain | Ocean sunrise as header banner |
| **Contact** | Mixkit video | Topographic contour lines (animated) with gradient overlay |

### ABOUT PAGE

| Section | Direction |
|---------|-----------|
| **Hero** | Earth horizon figure — full bleed, animated slow orbit |
| **Bio section** | Robot in flower field as side illustration |
| **Career timeline** | Circuit board texture as scrolling parallax BG |

---

## 5. MIDJOURNEY v7 PROMPTS — GENERATE MORE

Here are prompts to expand your visual library, all calibrated to match your existing aesthetic DNA:

### HERO / EPIC SCALE

```
/imagine Cinematic wide shot of a massive crystalline space station orbiting a
gas giant, prismatic light refracting through translucent hull panels, nebula
clouds in electric magenta and deep teal swirling behind, lens flare, volumetric
lighting, anime-influenced sci-fi aesthetic, 8k ultrawide --ar 21:9 --v 7
```

```
/imagine Panoramic view from the bridge of a starship approaching a luminous
planet made of stacked neon-lit cities, the atmosphere glowing in layers of
coral pink, electric cyan, and solar gold, cosmic dust particles catching light,
Makoto Shinkai meets Blade Runner, cinematic depth of field --ar 21:9 --v 7
```

```
/imagine An impossible floating archipelago of glass and light hovering above
an ocean of liquid prismatic color, waterfalls of cyan energy cascading between
islands, tiny silhouetted figures standing on observation platforms, epic scale,
warm golden hour light mixing with cool neon accents --ar 21:9 --v 7
```

### ABSTRACT BACKGROUNDS (for sections with text overlay)

```
/imagine Abstract data visualization landscape, flowing ribbons of light in
hot pink and electric teal weaving through a dark void, tiny geometric nodes
pulsing with warm amber light, subtle grid structure underneath, shallow depth
of field creating bokeh sparkles, dark background --ar 16:9 --v 7
```

```
/imagine Macro photography of crystalline fractal growth, deep navy background,
structures catching and refracting light into spectral rainbows, some facets
glowing neon cyan, others warm gold, extreme detail, studio lighting --ar 16:9 --v 7
```

```
/imagine Topographic contour map rendered in luminous neon lines on dark
background, layers transitioning from deep teal at valleys to hot magenta at
peaks, subtle particle dust floating above the terrain, minimal and elegant
--ar 16:9 --v 7
```

```
/imagine Neural network visualization rendered as a living organism, bioluminescent
connections in cyan and magenta pulsing through a deep space void, organic nodes
blooming like flowers where pathways intersect, dark atmospheric background
--ar 16:9 --v 7
```

### GHIBLI-TECH FUSION (for humanizing sections)

```
/imagine Studio Ghibli watercolor style, a weathered robot sitting on the edge
of a cliff overlooking a vast colorful sunset city, wildflowers growing from
its joints, birds perching on its shoulder, warm nostalgic light mixed with
soft neon highlights, painterly brushstrokes --ar 16:9 --v 7
```

```
/imagine A small retro-futuristic robot walking through a field of bioluminescent
flowers under a sky filled with aurora borealis in impossible colors, each
flower casting tiny prismatic light halos, Ghibli meets cyberpunk pastoral,
wide establishing shot --ar 16:9 --v 7
```

```
/imagine Watercolor painting of a cozy command center inside a treehouse,
holographic screens floating among leaves and vines, warm amber lantern light
mixing with cool cyan hologram glow, books and plants everywhere, lived-in
and magical --ar 16:9 --v 7
```

### PORTRAIT / ABOUT PAGE

```
/imagine Low angle portrait of a confident tech leader standing at the edge of
a rooftop at golden hour, city lights beginning to glow below, cosmic aurora
appearing in the sky behind them, lens flare, cinematic color grading with
teal shadows and warm highlights, editorial photography style --ar 3:4 --v 7
```

### SECTION DIVIDERS / TRANSITIONS

```
/imagine Seamless horizontal gradient band of pure prismatic light refraction,
dark edges fading through deep navy into an explosion of spectral color at
center, rainbow caustics and lens flares, abstract and clean, perfect for
overlay --ar 32:9 --v 7
```

```
/imagine Thin horizon line where dark ocean meets luminous sky, the boundary
itself glowing with impossibly vivid color transition from deep magenta through
gold to electric teal, minimal composition, vast negative space above and below
--ar 32:9 --v 7
```

---

## 6. VIDEO ANIMATION PIPELINE

For each key still, generate video via:

### Kling AI (best quality, 5-10s clips)
- Upload the source image
- Prompt: describe slow cinematic camera movement
- Use "Professional" quality mode
- Example prompt for spaceship hero: *"Slow cinematic dolly forward through nebula clouds, spaceship engines pulsing with light, particles drifting past camera, subtle parallax on cloud layers"*

### Grok Imagine (already proven in your pipeline)
- Good for 5s clips
- Use `aspect: auto` to match source
- Descriptive sequential action prompts work best
- Already have 10 clips generated — review and grade them

### Recommended Video Specs for Framer
- Format: MP4 (H.264)
- Resolution: 1920x1080 minimum (for hero: 2560x1440 ideal)
- Duration: 8-15 seconds (seamless loop preferred)
- File size: Under 10MB per clip (Framer performance)
- Compression: CRF 23-26 for web delivery

---

## 7. DESIGN PRINCIPLES (The Phil Mora Rules)

1. **Professional ≠ Boring.** Every tech exec has a dark minimal site. You're not every tech exec. The spaceship IS the resume.

2. **Color is confidence.** Saturated palettes signal someone who's not afraid to stand out. Let competitors be monochrome.

3. **AI art is the point.** You're an AI-native product builder. Your site SHOULD look like it was made with AI tools. That's not a weakness — it's a portfolio piece.

4. **Dark canvas, vivid strokes.** Always anchor in deep dark backgrounds so the color pops hit harder. Never go full bright — the contrast is what creates the "whoa."

5. **Ghibli warmth balances cosmic edge.** The robots-in-flowers moments prevent the site from feeling cold. Tech with a soul.

6. **Every section should have a "scroll-stop" moment.** If someone can scroll past without pausing, the visual failed.

7. **Motion > Static.** Wherever possible, subtle animation (parallax, video loops, hover effects) creates the feeling of a living world, not a brochure.

---

## 8. IMPLEMENTATION PRIORITY

### Phase 1: Quick Wins (Today)
- [ ] Swap Home hero video with cosmic spaceship image (parallax) or best Grok video
- [ ] Replace all Mixkit stock videos with your custom assets
- [ ] Add crystal city image to Now section
- [ ] Update color accents from generic blue to electric cyan/magenta

### Phase 2: Generate New Assets (This Week)
- [ ] Run 6-8 Midjourney prompts from Section 5
- [ ] Animate top 3 results via Kling for hero/section videos
- [ ] Create seamless loop versions of best clips

### Phase 3: Polish (Before Launch)
- [ ] Mobile fallback images for every video section
- [ ] Loading states with on-brand gradient shimmer
- [ ] Micro-interactions (hover glow, scroll-triggered reveals)
- [ ] Favicon using prismatic/cosmic element

---

## 9. FILES INVENTORY

### Ready to Use Now
| File | Folder | Type | Dimensions |
|------|--------|------|------------|
| cosmic journey ref.png | Philmora 2026 | Hero image | Wide |
| 11.png | Philmora 2026 | Section art | Wide |
| philmora_Horizon_of_Earth...png | Philmora 2026 | Hero image | Square |
| philmora_A_panoramic...png | Philmora 2026 | Banner | Ultra-wide |
| cuteroboto - 00005.png | Philmora 2026 | Section art | Wide |
| floweranime - 00049.png | Philmora 2026 | Accent art | Wide |
| Empire of Worlds.png | Philmora 2026 | Divider | Square |
| image 1.png (circuit board) | phimoracom images | BG texture | Wide |
| image 3.png (topographic) | phimoracom images | BG texture | Wide |
| teal/pink network mesh | philmoracom videos | BG texture | Wide |
| 10x Grok video clips | philmoracom videos | Video loops | Various |

### Need to Generate
- 3-4 more wide-format abstract backgrounds (using prompts above)
- 1-2 more Ghibli-tech fusion scenes
- 2-3 ultra-wide section divider strips
- Animated versions of top picks

---

*This document is the single source of truth for philmora.com visual direction.*
*Last updated: 2026-03-22*
