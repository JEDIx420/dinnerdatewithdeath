import Phaser from 'phaser';

/**
 * Generates procedural environment textures for Death's mansion.
 * Uses Phaser.GameObjects.Graphics to build sharp, rich gothic textures at runtime.
 */
export function generateMansionTextures(scene: Phaser.Scene): void {
  // -------------------------------------------------------------
  // 1. FLOORS & RUGS
  // -------------------------------------------------------------

  // A. Rich dark mahogany wood plank floor (32x32)
  const woodGfx = scene.make.graphics({ x: 0, y: 0 });
  woodGfx.fillStyle(0x1a1214, 1);
  woodGfx.fillRect(0, 0, 32, 32);
  woodGfx.fillStyle(0x241a1c, 1);
  woodGfx.fillRect(0, 0, 31, 2);
  woodGfx.fillRect(0, 16, 31, 2);
  woodGfx.fillStyle(0x100a0c, 1);
  woodGfx.fillRect(0, 14, 32, 2);
  woodGfx.fillRect(0, 30, 32, 2);
  woodGfx.fillStyle(0x2d1f22, 1);
  woodGfx.fillRect(8, 4, 16, 1);
  woodGfx.fillRect(12, 20, 16, 1);
  woodGfx.generateTexture('tile_wood_floor', 32, 32);
  woodGfx.generateTexture('tile_floor', 32, 32); // backwards compatibility
  woodGfx.destroy();

  // B. Dark slate stone floor for Dressing Area (32x32)
  const stoneGfx = scene.make.graphics({ x: 0, y: 0 });
  stoneGfx.fillStyle(0x14121a, 1);
  stoneGfx.fillRect(0, 0, 32, 32);
  stoneGfx.fillStyle(0x1e1a26, 1);
  stoneGfx.fillRect(2, 2, 28, 28);
  stoneGfx.fillStyle(0x282332, 1);
  stoneGfx.fillRect(3, 3, 26, 2); // bevel top
  stoneGfx.fillStyle(0x0a080e, 1);
  stoneGfx.fillRect(3, 27, 26, 2); // shadow bottom
  stoneGfx.generateTexture('tile_stone_dressing', 32, 32);
  stoneGfx.destroy();

  // C. Crimson velvet dining area rug (288x256)
  const diningRugGfx = scene.make.graphics({ x: 0, y: 0 });
  diningRugGfx.fillStyle(0x3a0c14, 1); // Deep velvet base
  diningRugGfx.fillRect(0, 0, 288, 256);
  // Gold filigree outer border
  diningRugGfx.lineStyle(2, 0x9a7a32, 0.85);
  diningRugGfx.strokeRect(6, 6, 276, 244);
  diningRugGfx.lineStyle(1, 0xbca046, 0.6);
  diningRugGfx.strokeRect(12, 12, 264, 232);
  // Center crimson field
  diningRugGfx.fillStyle(0x48101a, 1);
  diningRugGfx.fillRect(18, 18, 252, 220);
  diningRugGfx.generateTexture('rug_dining', 288, 256);
  diningRugGfx.destroy();

  // D. Deep violet dressing rug (176x144)
  const dressingRugGfx = scene.make.graphics({ x: 0, y: 0 });
  dressingRugGfx.fillStyle(0x22122c, 1);
  dressingRugGfx.fillRect(0, 0, 176, 144);
  dressingRugGfx.lineStyle(2, 0x6e5284, 0.7);
  dressingRugGfx.strokeRect(4, 4, 168, 136);
  dressingRugGfx.fillStyle(0x2c183a, 1);
  dressingRugGfx.fillRect(10, 10, 156, 124);
  dressingRugGfx.generateTexture('rug_dressing', 176, 144);
  dressingRugGfx.destroy();

  // E. Fireside lounge rug (240x208)
  const loungeRugGfx = scene.make.graphics({ x: 0, y: 0 });
  loungeRugGfx.fillStyle(0x280e18, 1);
  loungeRugGfx.fillRect(0, 0, 240, 208);
  loungeRugGfx.lineStyle(2, 0x8a5c36, 0.8);
  loungeRugGfx.strokeRect(6, 6, 228, 196);
  loungeRugGfx.fillStyle(0x341420, 1);
  loungeRugGfx.fillRect(14, 14, 212, 180);
  loungeRugGfx.generateTexture('rug_lounge', 240, 208);
  loungeRugGfx.destroy();

  // -------------------------------------------------------------
  // 2. ARCHITECTURAL WALLS & ARCHWAYS
  // -------------------------------------------------------------

  // A. North wall with vertical architectural depth (32x96)
  const northWallGfx = scene.make.graphics({ x: 0, y: 0 });
  // Top cornice molding (y: 0..16)
  northWallGfx.fillStyle(0x181420, 1);
  northWallGfx.fillRect(0, 0, 32, 16);
  northWallGfx.fillStyle(0x282034, 1);
  northWallGfx.fillRect(0, 0, 32, 4);
  northWallGfx.fillStyle(0x0e0a12, 1);
  northWallGfx.fillRect(0, 14, 32, 2);
  // Upper wallpaper/stone damask (y: 16..64)
  northWallGfx.fillStyle(0x221c2c, 1);
  northWallGfx.fillRect(0, 16, 32, 48);
  northWallGfx.fillStyle(0x2a2236, 1);
  northWallGfx.fillRect(8, 24, 16, 16); // subtle motif
  // Dado rail molding (y: 64..72)
  northWallGfx.fillStyle(0x2e243a, 1);
  northWallGfx.fillRect(0, 64, 32, 4);
  northWallGfx.fillStyle(0x140e1c, 1);
  northWallGfx.fillRect(0, 68, 32, 4);
  // Dark wood wainscot paneling (y: 72..90)
  northWallGfx.fillStyle(0x18121a, 1);
  northWallGfx.fillRect(0, 72, 32, 18);
  northWallGfx.fillStyle(0x221824, 1);
  northWallGfx.strokeRect(2, 74, 28, 14);
  // Lower dark baseboard (y: 90..96)
  northWallGfx.fillStyle(0x0c080e, 1);
  northWallGfx.fillRect(0, 90, 32, 6);
  northWallGfx.generateTexture('wall_architectural_north', 32, 96);
  northWallGfx.destroy();

  // B. South wall (32x48)
  const southWallGfx = scene.make.graphics({ x: 0, y: 0 });
  southWallGfx.fillStyle(0x16121c, 1);
  southWallGfx.fillRect(0, 0, 32, 48);
  southWallGfx.fillStyle(0x221a2a, 1);
  southWallGfx.fillRect(0, 0, 32, 6);
  southWallGfx.fillStyle(0x0c0810, 1);
  southWallGfx.fillRect(0, 42, 32, 6);
  southWallGfx.generateTexture('wall_architectural_south', 32, 48);
  southWallGfx.destroy();

  // C. Side perimeter wall (48x32)
  const sideWallGfx = scene.make.graphics({ x: 0, y: 0 });
  sideWallGfx.fillStyle(0x1c1624, 1);
  sideWallGfx.fillRect(0, 0, 48, 32);
  sideWallGfx.fillStyle(0x282034, 1);
  sideWallGfx.fillRect(0, 0, 8, 32); // inner bevel
  sideWallGfx.fillStyle(0x100c16, 1);
  sideWallGfx.fillRect(40, 0, 8, 32); // outer shadow
  sideWallGfx.generateTexture('wall_architectural_side', 48, 32);
  sideWallGfx.generateTexture('tile_wall', 32, 32); // backwards compatibility
  sideWallGfx.destroy();

  // D. Carved pilaster / column for archways (24x32)
  const pilasterGfx = scene.make.graphics({ x: 0, y: 0 });
  pilasterGfx.fillStyle(0x282034, 1);
  pilasterGfx.fillRect(0, 0, 24, 32);
  pilasterGfx.fillStyle(0x382e46, 1);
  pilasterGfx.fillRect(2, 0, 4, 32);
  pilasterGfx.fillStyle(0x140e1c, 1);
  pilasterGfx.fillRect(18, 0, 6, 32);
  pilasterGfx.generateTexture('wall_pilaster', 24, 32);
  pilasterGfx.destroy();

  // -------------------------------------------------------------
  // 3. WINDOWS & EXTERIOR AMBIENCE
  // -------------------------------------------------------------

  // A. Tall gothic arched window (64x88)
  const winGfx = scene.make.graphics({ x: 0, y: 0 });
  // Dark rainy night glass
  winGfx.fillStyle(0x0e1424, 1);
  winGfx.fillRect(6, 12, 52, 70);
  // Distant clouds
  winGfx.fillStyle(0x182038, 0.7);
  winGfx.fillCircle(24, 34, 18);
  winGfx.fillCircle(42, 40, 16);
  // Arched stone window frame
  winGfx.fillStyle(0x2a2436, 1);
  winGfx.fillRect(0, 82, 64, 6); // sill
  winGfx.fillRect(0, 0, 6, 88); // left jamb
  winGfx.fillRect(58, 0, 6, 88); // right jamb
  winGfx.fillRect(0, 0, 64, 12); // lintel
  // Stone mullions (crossbars)
  winGfx.fillRect(30, 12, 4, 70); // vertical
  winGfx.fillRect(6, 44, 52, 4); // horizontal
  winGfx.generateTexture('window_gothic', 64, 88);
  winGfx.destroy();

  // B. Velvet drapery curtains
  const curLGfx = scene.make.graphics({ x: 0, y: 0 });
  curLGfx.fillStyle(0x4a0e1c, 1);
  curLGfx.fillRect(0, 0, 16, 64);
  curLGfx.fillStyle(0x621426, 1);
  curLGfx.fillRect(2, 0, 4, 64);
  curLGfx.fillStyle(0x28060e, 1);
  curLGfx.fillRect(12, 0, 4, 64);
  curLGfx.generateTexture('decor_curtain_left', 16, 64);
  curLGfx.destroy();

  const curRGfx = scene.make.graphics({ x: 0, y: 0 });
  curRGfx.fillStyle(0x4a0e1c, 1);
  curRGfx.fillRect(0, 0, 16, 64);
  curRGfx.fillStyle(0x28060e, 1);
  curRGfx.fillRect(0, 0, 4, 64);
  curRGfx.fillStyle(0x621426, 1);
  curRGfx.fillRect(10, 0, 4, 64);
  curRGfx.generateTexture('decor_curtain_right', 16, 64);
  curRGfx.destroy();

  // -------------------------------------------------------------
  // 4. FURNITURE: HERO DINING TABLE & CHAIRS
  // -------------------------------------------------------------

  // A. Long dark mahogany dining table (160x64) set for two
  const tableGfx = scene.make.graphics({ x: 0, y: 0 });
  // Table wooden top with beveled edges
  tableGfx.fillStyle(0x241416, 1);
  tableGfx.fillRect(0, 0, 160, 64);
  tableGfx.fillStyle(0x341e22, 1);
  tableGfx.fillRect(2, 2, 156, 4); // top light edge
  tableGfx.fillStyle(0x12080a, 1);
  tableGfx.fillRect(0, 58, 160, 6); // bottom apron shadow
  // Crimson velvet table runner
  tableGfx.fillStyle(0x5a101e, 1);
  tableGfx.fillRect(18, 10, 124, 44);
  tableGfx.fillStyle(0x781628, 1);
  tableGfx.fillRect(20, 12, 120, 2); // runner gold/light hem
  tableGfx.fillRect(20, 50, 120, 2);
  // Centerpiece: dark vintage wine bottle with ivory label
  tableGfx.fillStyle(0x0e1a12, 1);
  tableGfx.fillRect(77, 24, 6, 16);
  tableGfx.fillStyle(0xd6c8b2, 1);
  tableGfx.fillRect(78, 28, 4, 8); // label
  // Silver candelabra holders
  tableGfx.fillStyle(0xa0a8b4, 1);
  tableGfx.fillRect(48, 28, 8, 8);
  tableGfx.fillRect(104, 28, 8, 8);
  // Two place settings (porcelain plate + silver fork/knife + wine goblet)
  // Left place setting (Love's side)
  tableGfx.fillStyle(0xdedbe4, 1);
  tableGfx.fillCircle(34, 32, 8); // plate
  tableGfx.fillStyle(0x5a101e, 1);
  tableGfx.fillCircle(34, 32, 5); // inner plate depression
  tableGfx.fillStyle(0x9ca4b0, 1);
  tableGfx.fillRect(22, 26, 2, 12); // fork
  tableGfx.fillRect(44, 26, 2, 12); // knife
  tableGfx.fillStyle(0x9a2034, 0.8);
  tableGfx.fillCircle(42, 20, 3); // crystal wine glass with red wine
  // Right place setting (Death's side)
  tableGfx.fillStyle(0xdedbe4, 1);
  tableGfx.fillCircle(126, 32, 8); // plate
  tableGfx.fillStyle(0x5a101e, 1);
  tableGfx.fillCircle(126, 32, 5);
  tableGfx.fillStyle(0x9ca4b0, 1);
  tableGfx.fillRect(114, 26, 2, 12); // fork
  tableGfx.fillRect(136, 26, 2, 12); // knife
  tableGfx.fillStyle(0x9a2034, 0.8);
  tableGfx.fillCircle(134, 20, 3); // wine glass
  tableGfx.generateTexture('furniture_dining_table', 160, 64);
  tableGfx.generateTexture('obstacle_table', 96, 48); // backwards compatibility
  tableGfx.destroy();

  // B. Gothic high-backed chair (facing down / towards player) (32x48)
  const chairDownGfx = scene.make.graphics({ x: 0, y: 0 });
  chairDownGfx.fillStyle(0x1c1012, 1);
  chairDownGfx.fillRect(4, 0, 24, 48);
  chairDownGfx.fillStyle(0x4a101e, 1); // crimson velvet backrest
  chairDownGfx.fillRect(6, 4, 20, 24);
  chairDownGfx.fillStyle(0x5a1424, 1); // cushion
  chairDownGfx.fillRect(4, 30, 24, 14);
  chairDownGfx.generateTexture('furniture_chair_down', 32, 48);
  chairDownGfx.destroy();

  // C. Gothic high-backed chair (facing up / away from player) (32x48)
  const chairUpGfx = scene.make.graphics({ x: 0, y: 0 });
  chairUpGfx.fillStyle(0x1c1012, 1);
  chairUpGfx.fillRect(4, 0, 24, 48);
  chairUpGfx.fillStyle(0x28161a, 1); // carved wood back panels
  chairUpGfx.fillRect(6, 4, 9, 36);
  chairUpGfx.fillRect(17, 4, 9, 36);
  chairUpGfx.generateTexture('furniture_chair_up', 32, 48);
  chairUpGfx.destroy();

  // D. Wine sideboard / credenza (48x56)
  const sideboardGfx = scene.make.graphics({ x: 0, y: 0 });
  sideboardGfx.fillStyle(0x201416, 1);
  sideboardGfx.fillRect(0, 0, 48, 56);
  sideboardGfx.fillStyle(0x321e22, 1);
  sideboardGfx.fillRect(2, 2, 44, 4);
  sideboardGfx.fillStyle(0x10080a, 1);
  sideboardGfx.fillRect(2, 10, 20, 42); // left cupboard door
  sideboardGfx.fillRect(26, 10, 20, 42); // right cupboard door
  sideboardGfx.fillStyle(0x8a6828, 1);
  sideboardGfx.fillRect(18, 30, 3, 3); // brass knob
  sideboardGfx.fillRect(27, 30, 3, 3);
  sideboardGfx.generateTexture('furniture_sideboard', 48, 56);
  sideboardGfx.destroy();

  // -------------------------------------------------------------
  // 5. FURNITURE: MIRROR & DRESSING AREA
  // -------------------------------------------------------------

  // A. Grand Ornate Gothic Mirror (48x96)
  const mirrorGfx = scene.make.graphics({ x: 0, y: 0 });
  // Carved gold/silver frame with arch
  mirrorGfx.fillStyle(0x2e2838, 1);
  mirrorGfx.fillRect(0, 0, 48, 96);
  mirrorGfx.fillStyle(0x8a7242, 1);
  mirrorGfx.strokeRect(2, 2, 44, 92);
  // Reflective gothic glass with eerie blue-silver gradient
  mirrorGfx.fillStyle(0x202a3a, 1);
  mirrorGfx.fillRect(6, 10, 36, 76);
  // Reflection sheen streak
  mirrorGfx.fillStyle(0x5a6a84, 0.5);
  mirrorGfx.fillTriangle(10, 12, 22, 12, 10, 48);
  mirrorGfx.fillTriangle(14, 48, 26, 12, 30, 48);
  mirrorGfx.generateTexture('furniture_mirror_ornate', 48, 96);
  mirrorGfx.generateTexture('obstacle_mirror', 32, 64); // backwards compatibility
  mirrorGfx.destroy();

  // B. Carved Vanity Console (64x48)
  const vanityGfx = scene.make.graphics({ x: 0, y: 0 });
  vanityGfx.fillStyle(0x221418, 1);
  vanityGfx.fillRect(0, 0, 64, 48);
  vanityGfx.fillStyle(0x362024, 1);
  vanityGfx.fillRect(2, 2, 60, 4);
  vanityGfx.fillStyle(0x12080a, 1);
  vanityGfx.fillRect(4, 12, 26, 32); // drawer left
  vanityGfx.fillRect(34, 12, 26, 32); // drawer right
  vanityGfx.fillStyle(0x9a7a32, 1);
  vanityGfx.fillRect(15, 24, 4, 4); // brass pull
  vanityGfx.fillRect(45, 24, 4, 4);
  vanityGfx.generateTexture('furniture_vanity', 64, 48);
  vanityGfx.destroy();

  // C. Antique Wardrobe (56x88)
  const wardrobeGfx = scene.make.graphics({ x: 0, y: 0 });
  wardrobeGfx.fillStyle(0x1c1012, 1);
  wardrobeGfx.fillRect(0, 0, 56, 88);
  wardrobeGfx.fillStyle(0x2e1a1e, 1);
  wardrobeGfx.fillRect(2, 2, 52, 6); // crown molding
  wardrobeGfx.fillStyle(0x12080a, 1);
  wardrobeGfx.fillRect(4, 12, 22, 70); // left door
  wardrobeGfx.fillRect(30, 12, 22, 70); // right door
  wardrobeGfx.fillStyle(0x241418, 1);
  wardrobeGfx.strokeRect(6, 16, 18, 30);
  wardrobeGfx.strokeRect(6, 48, 18, 30);
  wardrobeGfx.strokeRect(32, 16, 18, 30);
  wardrobeGfx.strokeRect(32, 48, 18, 30);
  wardrobeGfx.fillStyle(0x7a5a22, 1);
  wardrobeGfx.fillRect(22, 48, 3, 6); // handle
  wardrobeGfx.fillRect(31, 48, 3, 6);
  wardrobeGfx.generateTexture('furniture_wardrobe', 56, 88);
  wardrobeGfx.destroy();

  // -------------------------------------------------------------
  // 6. FURNITURE: LOUNGE & HEARTH
  // -------------------------------------------------------------

  // A. Gothic Fireplace Hearth (96x80)
  const fireplaceGfx = scene.make.graphics({ x: 0, y: 0 });
  // Carved stone outer mantle and pilasters
  fireplaceGfx.fillStyle(0x2a2430, 1);
  fireplaceGfx.fillRect(0, 0, 96, 80);
  fireplaceGfx.fillStyle(0x3a3242, 1);
  fireplaceGfx.fillRect(0, 0, 96, 12); // top mantle shelf
  fireplaceGfx.fillStyle(0x16121c, 1);
  fireplaceGfx.fillRect(0, 12, 96, 4); // shadow under mantle
  // Inner dark firebox (brick lined)
  fireplaceGfx.fillStyle(0x0e0a12, 1);
  fireplaceGfx.fillRect(18, 20, 60, 56);
  // Hearth floor & iron grate
  fireplaceGfx.fillStyle(0x1c1420, 1);
  fireplaceGfx.fillRect(14, 72, 68, 8);
  // Charred glowing logs
  fireplaceGfx.fillStyle(0x38180c, 1);
  fireplaceGfx.fillRect(26, 62, 44, 8);
  fireplaceGfx.fillStyle(0x240e06, 1);
  fireplaceGfx.fillRect(30, 56, 36, 6);
  fireplaceGfx.generateTexture('furniture_fireplace', 96, 80);
  fireplaceGfx.destroy();

  // B. Burgundy Velvet Sofa (96x48)
  const sofaGfx = scene.make.graphics({ x: 0, y: 0 });
  sofaGfx.fillStyle(0x3c0c16, 1); // backrest
  sofaGfx.fillRect(0, 0, 96, 24);
  sofaGfx.fillStyle(0x521220, 1); // tufted cushion
  sofaGfx.fillRect(4, 16, 88, 26);
  sofaGfx.fillStyle(0x28060e, 1); // side armrests
  sofaGfx.fillRect(0, 8, 8, 36);
  sofaGfx.fillRect(88, 8, 8, 36);
  sofaGfx.fillStyle(0x1c0e12, 1); // feet
  sofaGfx.fillRect(4, 44, 6, 4);
  sofaGfx.fillRect(86, 44, 6, 4);
  sofaGfx.generateTexture('furniture_sofa', 96, 48);
  sofaGfx.destroy();

  // C. Plush Velvet Armchair (48x48)
  const armchairGfx = scene.make.graphics({ x: 0, y: 0 });
  armchairGfx.fillStyle(0x3c0c16, 1);
  armchairGfx.fillRect(4, 0, 40, 22);
  armchairGfx.fillStyle(0x521220, 1);
  armchairGfx.fillRect(6, 14, 36, 26);
  armchairGfx.fillStyle(0x28060e, 1);
  armchairGfx.fillRect(2, 6, 8, 36);
  armchairGfx.fillRect(38, 6, 8, 36);
  armchairGfx.generateTexture('furniture_armchair', 48, 48);
  armchairGfx.destroy();

  // D. Low Coffee Table (64x36)
  const coffeeTableGfx = scene.make.graphics({ x: 0, y: 0 });
  coffeeTableGfx.fillStyle(0x26161a, 1);
  coffeeTableGfx.fillRect(0, 0, 64, 36);
  coffeeTableGfx.fillStyle(0x3a2228, 1);
  coffeeTableGfx.fillRect(2, 2, 60, 4);
  // Leather-bound book
  coffeeTableGfx.fillStyle(0x142c1e, 1);
  coffeeTableGfx.fillRect(16, 12, 14, 12);
  coffeeTableGfx.fillStyle(0xd4c2a4, 1);
  coffeeTableGfx.fillRect(17, 13, 12, 2);
  // Crystal ashtray
  coffeeTableGfx.fillStyle(0x9aa4b4, 0.75);
  coffeeTableGfx.fillRect(40, 14, 8, 8);
  coffeeTableGfx.generateTexture('furniture_coffee_table', 64, 36);
  coffeeTableGfx.destroy();

  // E. Ancient Bookshelf (64x88)
  const bookshelfGfx = scene.make.graphics({ x: 0, y: 0 });
  bookshelfGfx.fillStyle(0x201416, 1);
  bookshelfGfx.fillRect(0, 0, 64, 88);
  // Shelves
  const bookColors = [0x781a28, 0x18422e, 0x243468, 0x826426, 0x58244a, 0x161616];
  for (let s = 0; s < 4; s++) {
    const shelfY = 16 + s * 18;
    bookshelfGfx.fillStyle(0x321e22, 1);
    bookshelfGfx.fillRect(2, shelfY + 14, 60, 3); // shelf board
    // Randomly colored book spines
    let bx = 6;
    while (bx < 56) {
      const bW = 3 + Math.floor(Math.sin(s * 7 + bx) * 2 + 3);
      const bColor = bookColors[(s + bx) % bookColors.length]!;
      bookshelfGfx.fillStyle(bColor, 1);
      bookshelfGfx.fillRect(bx, shelfY + 2, Math.min(bW, 58 - bx), 12);
      bx += bW + 1;
    }
  }
  bookshelfGfx.generateTexture('furniture_bookshelf', 64, 88);
  bookshelfGfx.destroy();

  // F. Vintage TV console (48x48)
  const tvGfx = scene.make.graphics({ x: 0, y: 0 });
  tvGfx.fillStyle(0x281c16, 1);
  tvGfx.fillRect(0, 0, 48, 44);
  // Dark convex CRT glass screen
  tvGfx.fillStyle(0x121820, 1);
  tvGfx.fillRect(6, 6, 28, 24);
  tvGfx.fillStyle(0x283848, 0.4);
  tvGfx.fillCircle(12, 12, 4); // glass reflection
  // Channel knob dials
  tvGfx.fillStyle(0x8a7042, 1);
  tvGfx.fillCircle(40, 12, 3);
  tvGfx.fillCircle(40, 22, 3);
  // Wooden legs
  tvGfx.fillStyle(0x1c120c, 1);
  tvGfx.fillRect(4, 44, 4, 4);
  tvGfx.fillRect(40, 44, 4, 4);
  tvGfx.generateTexture('furniture_tv_console', 48, 48);
  tvGfx.destroy();

  // -------------------------------------------------------------
  // 7. DECORATIVE ELEMENTS: CANDLES, PAINTINGS, BAT
  // -------------------------------------------------------------

  // A. Single Candlestick (8x18)
  const candleGfx = scene.make.graphics({ x: 0, y: 0 });
  candleGfx.fillStyle(0x9a7a32, 1); // brass base
  candleGfx.fillRect(1, 14, 6, 4);
  candleGfx.fillStyle(0xe2dac8, 1); // ivory candle wax
  candleGfx.fillRect(2, 6, 4, 9);
  candleGfx.fillStyle(0x222222, 1); // wick
  candleGfx.fillRect(3, 4, 2, 2);
  candleGfx.fillStyle(0xff8c20, 1); // flame outer
  candleGfx.fillRect(2, 1, 4, 4);
  candleGfx.fillStyle(0xffea48, 1); // flame inner core
  candleGfx.fillRect(3, 2, 2, 2);
  candleGfx.generateTexture('decor_candle_single', 8, 18);
  candleGfx.generateTexture('obstacle_pillar', 32, 64); // backwards compatibility
  candleGfx.destroy();

  // B. Framed oil portrait (40x48)
  const portraitGfx = scene.make.graphics({ x: 0, y: 0 });
  portraitGfx.fillStyle(0x8a6e2e, 1); // ornate gold frame
  portraitGfx.fillRect(0, 0, 40, 48);
  portraitGfx.fillStyle(0x161018, 1); // dark canvas
  portraitGfx.fillRect(4, 4, 32, 40);
  portraitGfx.fillStyle(0x382c3c, 1); // bust silhouette
  portraitGfx.fillCircle(20, 18, 7); // head
  portraitGfx.fillTriangle(10, 38, 30, 38, 20, 24); // shoulders
  portraitGfx.generateTexture('decor_painting_portrait', 40, 48);
  portraitGfx.destroy();

  // C. Framed dark landscape (56x36)
  const landscapeGfx = scene.make.graphics({ x: 0, y: 0 });
  landscapeGfx.fillStyle(0x241828, 1); // dark carved wood frame
  landscapeGfx.fillRect(0, 0, 56, 36);
  landscapeGfx.fillStyle(0x0c1424, 1); // nocturnal canvas
  landscapeGfx.fillRect(4, 4, 48, 28);
  landscapeGfx.fillStyle(0xd2dcf0, 0.85);
  landscapeGfx.fillCircle(40, 12, 4); // full moon
  landscapeGfx.fillStyle(0x060a12, 1);
  landscapeGfx.fillTriangle(4, 32, 28, 32, 16, 18); // mountain silhouette
  landscapeGfx.fillTriangle(20, 32, 48, 32, 34, 22);
  landscapeGfx.generateTexture('decor_painting_landscape', 56, 36);
  landscapeGfx.destroy();

  // D. Nocturnal Bat Silhouette (16x10)
  const batGfx = scene.make.graphics({ x: 0, y: 0 });
  batGfx.fillStyle(0x06060c, 1);
  batGfx.fillTriangle(0, 2, 8, 8, 4, 0); // left wing
  batGfx.fillTriangle(16, 2, 8, 8, 12, 0); // right wing
  batGfx.fillCircle(8, 6, 2); // body
  batGfx.generateTexture('silhouette_bat', 16, 10);
  batGfx.destroy();

  // -------------------------------------------------------------
  // 8. CONTACT SHADOWS
  // -------------------------------------------------------------

  // Actor foot shadow (36x14)
  const actorShadowGfx = scene.make.graphics({ x: 0, y: 0 });
  actorShadowGfx.fillStyle(0x000000, 0.55);
  actorShadowGfx.fillEllipse(18, 7, 36, 14);
  actorShadowGfx.generateTexture('shadow_actor', 36, 14);
  actorShadowGfx.destroy();

  // Small furniture shadow (44x18)
  const sSmallGfx = scene.make.graphics({ x: 0, y: 0 });
  sSmallGfx.fillStyle(0x000000, 0.5);
  sSmallGfx.fillEllipse(22, 9, 44, 18);
  sSmallGfx.generateTexture('shadow_furniture_small', 44, 18);
  sSmallGfx.destroy();

  // Medium furniture shadow (72x22)
  const sMedGfx = scene.make.graphics({ x: 0, y: 0 });
  sMedGfx.fillStyle(0x000000, 0.5);
  sMedGfx.fillEllipse(36, 11, 72, 22);
  sMedGfx.generateTexture('shadow_furniture_med', 72, 22);
  sMedGfx.destroy();

  // Large furniture shadow (120x28)
  const sLargeGfx = scene.make.graphics({ x: 0, y: 0 });
  sLargeGfx.fillStyle(0x000000, 0.5);
  sLargeGfx.fillEllipse(60, 14, 120, 28);
  sLargeGfx.generateTexture('shadow_furniture_large', 120, 28);
  sLargeGfx.destroy();

  // -------------------------------------------------------------
  // 9. RADIAL LIGHT GLOW TEXTURES
  // -------------------------------------------------------------

  // Warm amber light glow (128x128)
  const warmGlowGfx = scene.make.graphics({ x: 0, y: 0 });
  const steps = 16;
  for (let i = steps; i >= 1; i--) {
    const alpha = (1 - i / steps) * 0.28;
    warmGlowGfx.fillStyle(0xffb038, alpha);
    warmGlowGfx.fillCircle(64, 64, (64 / steps) * i);
  }
  warmGlowGfx.generateTexture('light_glow_warm', 128, 128);
  warmGlowGfx.destroy();

  // Cool blue moonlight glow (128x128)
  const coolGlowGfx = scene.make.graphics({ x: 0, y: 0 });
  for (let i = steps; i >= 1; i--) {
    const alpha = (1 - i / steps) * 0.22;
    coolGlowGfx.fillStyle(0x6a86b4, alpha);
    coolGlowGfx.fillCircle(64, 64, (64 / steps) * i);
  }
  coolGlowGfx.generateTexture('light_glow_cool', 128, 128);
  coolGlowGfx.destroy();
}
