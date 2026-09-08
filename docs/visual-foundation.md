# Visual Foundation & Rendering Quality Audit

This document records the visual foundation audit, root causes of image softness in the initial build, and architectural decisions implemented in Milestone `v0.0.5`.

---

## 1. Audit: Why the Initial Build Looked Soft

1. **Extreme Downsampling of High-Detail Source Artwork**:
   - The canonical Death walking source sheet (`art/source/characters/death/walk-source.png`) is a 1254×1254 illustration where Death's character height is ~280 source pixels.
   - In the `384 × 216` configuration, Death was scaled down to **46px visual height** (a ~84% reduction in linear dimensions and ~97% loss of pixel area).
   - Intricate details such as hair strands, collar, tie, lapels, eyes, and suit creases were compressed into single pixels or lost entirely.

2. **Aggressive Browser Canvas Upscaling**:
   - A `384 × 216` canvas displayed on a standard 1080p monitor (`1920 × 1080`) is enlarged by **5×**. On 1440p and 4K displays, upscaling reaches 6.6× to 10×.
   - When scaled at non-integer multipliers or viewed on high-DPI displays, even nearest-neighbor pixel rendering produces chunky, blocky artifacts that obscure the gothic tone of the artwork.

3. **High-DPI / Device Pixel Ratio (Retina) Misalignment**:
   - Modern laptops and mobile screens commonly have a `devicePixelRatio` of `2.0` or `3.0`.
   - Without setting `resolution` in Phaser's GameConfig, the canvas backing buffer remained at 384×216 physical pixels. The browser then stretched that buffer across 2× physical screen pixels, causing blurry CSS interpolation.

4. **Typography Rasterization at Micro-Sizes**:
   - UI text was rasterized at 6px to 14px inside Phaser, then enlarged by the browser, producing blurry, low-contrast text.

---

## 2. Rendering Decisions for Milestone v0.0.5

### A. Logical Presentation: `768 × 432` (16:9)
- Doubles the horizontal and vertical logical resolution while preserving the 16:9 composition.
- On a 1080p screen, upscaling is reduced from 5.0× to **2.5×**.
- World tile reference unit moves from `16px` to **`32px`**.

### B. Character Scale Contract: `128 × 128` Cell / `512 × 512` Sheet
- Overworld character cells move from `64 × 64` to **`128 × 128`**.
- The full 4×4 walk sheet is now **`512 × 512`**.
- Death's visual height is normalized to **`92px`** (~33% of the 280px source height, retaining 4× the pixel detail of the previous 46px sprite).
- Foot baseline anchor moves to **`Y = 112`** in the cell (leaving 16px ground clearance).
- Foot-level collision box is standardized to **`32 × 20`** with offset `(48, 96)`.

### C. High-DPI Canvas Backing Resolution
- Configure Phaser with:
  ```typescript
  resolution: typeof window !== 'undefined' ? Math.min(window.devicePixelRatio || 1, 2) : 1
  ```
- Backing resolution doubles on Retina screens (e.g. 1536×864 backing buffer), rendering razor-sharp lines while logical coordinates remain stable at 768×432.

### D. Hybrid Filtering Strategy
- **Pixel-Art Elements & Overworld Sprites**:
  Render with `NEAREST` filtering (`Phaser.Textures.FilterMode.NEAREST`) to preserve pixel art contours without blur.
- **High-Detail Illustrations & Typography**:
  Text and future dialogue portraits render with smooth sampling (`LINEAR`) so high-resolution artwork and fonts scale cleanly without jagged nearest-neighbor step-artifacts.
- Global setting: `roundPixels: true` prevents subpixel shimmering during camera follow.

### E. Gameplay Scale Preservation
- Player movement speed scales proportionally from 75 to **150 px/sec**, preserving identical traversal time across environments.
- Room layout remains 24 columns × 13.5 rows at 32px tiles.
