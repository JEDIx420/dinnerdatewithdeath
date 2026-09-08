import Phaser from 'phaser';

/**
 * Generates procedural environment textures for Death's grand mansion.
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

  // C. Polished Grand Hall dark marble / slate floor (32x32)
  const hallStoneGfx = scene.make.graphics({ x: 0, y: 0 });
  hallStoneGfx.fillStyle(0x121018, 1);
  hallStoneGfx.fillRect(0, 0, 32, 32);
  hallStoneGfx.fillStyle(0x1c1824, 1);
  hallStoneGfx.fillRect(1, 1, 30, 30);
  hallStoneGfx.fillStyle(0x252030, 0.4);
  hallStoneGfx.lineBetween(4, 28, 28, 4); // subtle diagonal veining
  hallStoneGfx.fillStyle(0x0c0a10, 1);
  hallStoneGfx.strokeRect(0, 0, 32, 32);
  hallStoneGfx.generateTexture('tile_stone_hall', 32, 32);
  hallStoneGfx.destroy();

  // D. Crimson velvet dining area rug (288x256)
  const diningRugGfx = scene.make.graphics({ x: 0, y: 0 });
  diningRugGfx.fillStyle(0x380b13, 1); // Deep velvet base
  diningRugGfx.fillRect(0, 0, 288, 256);
  // Gold filigree outer border
  diningRugGfx.lineStyle(2, 0x8b6a2e, 0.85);
  diningRugGfx.strokeRect(6, 6, 276, 244);
  diningRugGfx.lineStyle(1, 0xb08a48, 0.6);
  diningRugGfx.strokeRect(12, 12, 264, 232);
  // Center crimson field
  diningRugGfx.fillStyle(0x4a0e1a, 1);
  diningRugGfx.fillRect(18, 18, 252, 220);
  diningRugGfx.generateTexture('rug_dining', 288, 256);
  diningRugGfx.destroy();

  // E. Deep violet dressing rug (176x144)
  const dressingRugGfx = scene.make.graphics({ x: 0, y: 0 });
  dressingRugGfx.fillStyle(0x22122c, 1);
  dressingRugGfx.fillRect(0, 0, 176, 144);
  dressingRugGfx.lineStyle(2, 0x6e5284, 0.7);
  dressingRugGfx.strokeRect(4, 4, 168, 136);
  dressingRugGfx.fillStyle(0x2c183a, 1);
  dressingRugGfx.fillRect(10, 10, 156, 124);
  dressingRugGfx.generateTexture('rug_dressing', 176, 144);
  dressingRugGfx.destroy();

  // F. Fireside lounge rug (240x208)
  const loungeRugGfx = scene.make.graphics({ x: 0, y: 0 });
  loungeRugGfx.fillStyle(0x280e18, 1);
  loungeRugGfx.fillRect(0, 0, 240, 208);
  loungeRugGfx.lineStyle(2, 0x8a5c36, 0.8);
  loungeRugGfx.strokeRect(6, 6, 228, 196);
  loungeRugGfx.fillStyle(0x341420, 1);
  loungeRugGfx.fillRect(14, 14, 212, 180);
  loungeRugGfx.generateTexture('rug_lounge', 240, 208);
  loungeRugGfx.destroy();

  // G. Upper Landing ceremonial runner (384x56)
  const landingRugGfx = scene.make.graphics({ x: 0, y: 0 });
  landingRugGfx.fillStyle(0x3a0c16, 1);
  landingRugGfx.fillRect(0, 0, 384, 56);
  landingRugGfx.lineStyle(2, 0x8a6c30, 0.85);
  landingRugGfx.strokeRect(3, 3, 378, 50);
  landingRugGfx.fillStyle(0x4c101e, 1);
  landingRugGfx.fillRect(8, 8, 368, 40);
  landingRugGfx.generateTexture('rug_landing', 384, 56);
  landingRugGfx.destroy();

  // H. Great Hall center floor compass/medallion (128x128)
  const medallionGfx = scene.make.graphics({ x: 0, y: 0 });
  medallionGfx.fillStyle(0x181422, 1);
  medallionGfx.fillCircle(64, 64, 62);
  medallionGfx.lineStyle(2, 0x826428, 0.8);
  medallionGfx.strokeCircle(64, 64, 58);
  medallionGfx.strokeCircle(64, 64, 42);
  medallionGfx.fillStyle(0x3a0c16, 0.7);
  // Compass 8-point star
  medallionGfx.fillTriangle(64, 8, 56, 64, 72, 64);
  medallionGfx.fillTriangle(64, 120, 56, 64, 72, 64);
  medallionGfx.fillTriangle(8, 64, 64, 56, 64, 72);
  medallionGfx.fillTriangle(120, 64, 64, 56, 64, 72);
  medallionGfx.fillStyle(0x826428, 0.9);
  medallionGfx.fillCircle(64, 64, 6);
  medallionGfx.generateTexture('floor_medallion', 128, 128);
  medallionGfx.destroy();

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

  // E. Upper Landing Overlook Balustrade Railing (32x28)
  const railGfx = scene.make.graphics({ x: 0, y: 0 });
  // Dark wood top handrail
  railGfx.fillStyle(0x2a1618, 1);
  railGfx.fillRect(0, 0, 32, 6);
  railGfx.fillStyle(0x3e2226, 1);
  railGfx.fillRect(0, 0, 32, 2); // highlight
  // Carved turned baluster spindles
  railGfx.fillStyle(0x1e1214, 1);
  railGfx.fillRect(4, 6, 4, 18);
  railGfx.fillRect(12, 6, 4, 18);
  railGfx.fillRect(20, 6, 4, 18);
  railGfx.fillRect(28, 6, 4, 18);
  // Gold brass accents on spindles
  railGfx.fillStyle(0x8a6e2e, 0.8);
  railGfx.fillRect(4, 12, 4, 3);
  railGfx.fillRect(12, 12, 4, 3);
  railGfx.fillRect(20, 12, 4, 3);
  railGfx.fillRect(28, 12, 4, 3);
  // Bottom stringer / baseboard
  railGfx.fillStyle(0x140a0c, 1);
  railGfx.fillRect(0, 24, 32, 4);
  railGfx.generateTexture('balustrade_rail', 32, 28);
  railGfx.destroy();

  // -------------------------------------------------------------
  // 3. HERO GRAND CENTRAL STAIRCASE
  // -------------------------------------------------------------

  // A. Staircase step segment with burgundy runner and brass rods (160x32)
  const stairStepGfx = scene.make.graphics({ x: 0, y: 0 });
  // Polished dark mahogany outer steps (x: 0..24 and x: 136..160)
  stairStepGfx.fillStyle(0x221216, 1);
  stairStepGfx.fillRect(0, 0, 160, 32);
  stairStepGfx.fillStyle(0x301a20, 1);
  stairStepGfx.fillRect(0, 0, 160, 3); // top tread lip highlight
  stairStepGfx.fillStyle(0x10080a, 1);
  stairStepGfx.fillRect(0, 28, 160, 4); // bottom riser shadow
  // Deep burgundy velvet runner (width 112px, x: 24..136)
  stairStepGfx.fillStyle(0x4e0e1a, 1);
  stairStepGfx.fillRect(24, 0, 112, 32);
  // Runner gold filigree edge border
  stairStepGfx.fillStyle(0x8a6e2e, 0.9);
  stairStepGfx.fillRect(26, 0, 2, 32);
  stairStepGfx.fillRect(132, 0, 2, 32);
  // Center rich crimson field
  stairStepGfx.fillStyle(0x5c1220, 1);
  stairStepGfx.fillRect(30, 0, 100, 32);
  // Brass stair rod at step bend (tread tuck)
  stairStepGfx.fillStyle(0xbca048, 1);
  stairStepGfx.fillRect(22, 29, 116, 2);
  stairStepGfx.fillStyle(0x8a6e28, 1);
  stairStepGfx.fillCircle(22, 30, 2); // left bracket
  stairStepGfx.fillCircle(138, 30, 2); // right bracket
  stairStepGfx.generateTexture('staircase_step', 160, 32);
  stairStepGfx.destroy();

  // B. Left Staircase Balustrade (16x32)
  const balLGfx = scene.make.graphics({ x: 0, y: 0 });
  balLGfx.fillStyle(0x2a1418, 1);
  balLGfx.fillRect(0, 0, 8, 32); // rail
  balLGfx.fillStyle(0x3c1e24, 1);
  balLGfx.fillRect(1, 0, 3, 32);
  balLGfx.fillStyle(0x14080a, 1);
  balLGfx.fillRect(6, 0, 4, 32);
  balLGfx.fillStyle(0x8a6c30, 0.8);
  balLGfx.fillRect(2, 10, 4, 4); // brass ring
  balLGfx.generateTexture('staircase_balustrade_left', 16, 32);
  balLGfx.destroy();

  // C. Right Staircase Balustrade (16x32)
  const balRGfx = scene.make.graphics({ x: 0, y: 0 });
  balRGfx.fillStyle(0x2a1418, 1);
  balRGfx.fillRect(8, 0, 8, 32);
  balRGfx.fillStyle(0x3c1e24, 1);
  balRGfx.fillRect(9, 0, 3, 32);
  balRGfx.fillStyle(0x14080a, 1);
  balRGfx.fillRect(6, 0, 4, 32);
  balRGfx.fillStyle(0x8a6c30, 0.8);
  balRGfx.fillRect(10, 10, 4, 4);
  balRGfx.generateTexture('staircase_balustrade_right', 16, 32);
  balRGfx.destroy();

  // D. Carved Newel Post at Staircase Ends (20x48)
  const newelGfx = scene.make.graphics({ x: 0, y: 0 });
  newelGfx.fillStyle(0x201014, 1);
  newelGfx.fillRect(2, 12, 16, 36);
  newelGfx.fillStyle(0x321a20, 1);
  newelGfx.fillRect(3, 12, 4, 36);
  // Ornate turned post cap
  newelGfx.fillStyle(0x2a1418, 1);
  newelGfx.fillRect(0, 10, 20, 4);
  // Polished brass acorn finial on top
  newelGfx.fillStyle(0xa88434, 1);
  newelGfx.fillCircle(10, 5, 5);
  newelGfx.fillStyle(0xd4ac48, 1);
  newelGfx.fillCircle(8, 4, 2);
  newelGfx.generateTexture('staircase_newel', 20, 48);
  newelGfx.destroy();

  // -------------------------------------------------------------
  // 4. WINDOWS & EXTERIOR AMBIENCE
  // -------------------------------------------------------------

  // A. Tall gothic arched window (64x88)
  const winGfx = scene.make.graphics({ x: 0, y: 0 });
  // Dark rainy night glass
  winGfx.fillStyle(0x0e1424, 1);
  winGfx.fillRect(6, 12, 52, 70);
  // Distant storm clouds
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
  // 5. HERO DINING TABLE & GOTHIC CHAIRS
  // -------------------------------------------------------------

  // A. Hero Dining Banquet Table set for Love & Death (176x68)
  const tableGfx = scene.make.graphics({ x: 0, y: 0 });
  // Table solid dark mahogany surface with beveled edge
  tableGfx.fillStyle(0x1e1012, 1);
  tableGfx.fillRect(0, 0, 176, 68);
  tableGfx.fillStyle(0x321c20, 1);
  tableGfx.fillRect(2, 2, 172, 4); // upper rim highlight
  tableGfx.fillStyle(0x0e0608, 1);
  tableGfx.fillRect(0, 62, 176, 6); // deep bottom apron shadow
  // Rich crimson velvet runner with gold filigree hem (width 140px, height 48px)
  tableGfx.fillStyle(0x560f1c, 1);
  tableGfx.fillRect(18, 10, 140, 48);
  tableGfx.fillStyle(0x8a6c2c, 0.9);
  tableGfx.fillRect(20, 12, 136, 2); // top gold trim
  tableGfx.fillRect(20, 54, 136, 2); // bottom gold trim
  tableGfx.fillStyle(0x6c1424, 1);
  tableGfx.fillRect(24, 16, 128, 36);

  // Centerpiece: Vintage wine bottle & crystal decanter
  tableGfx.fillStyle(0x0a160e, 1);
  tableGfx.fillRect(84, 22, 6, 18); // dark green wine bottle
  tableGfx.fillStyle(0xded4be, 1);
  tableGfx.fillRect(85, 27, 4, 8); // ivory vintage label
  tableGfx.fillStyle(0x9a2034, 0.85);
  tableGfx.fillRect(94, 26, 8, 14); // crystal decanter with crimson wine
  tableGfx.fillStyle(0xcad4e0, 0.5);
  tableGfx.fillRect(94, 26, 2, 14); // glass reflection streak

  // Two silver 3-branch candelabras
  tableGfx.fillStyle(0xa2aab8, 1);
  tableGfx.fillRect(52, 28, 10, 8); // left candelabra
  tableGfx.fillRect(114, 28, 10, 8); // right candelabra

  // Place Setting 1: Love's side (Left)
  tableGfx.fillStyle(0xe2dedc, 1);
  tableGfx.fillCircle(38, 34, 9); // fine bone china plate
  tableGfx.fillStyle(0x8a6c2c, 1);
  tableGfx.strokeCircle(38, 34, 9); // gold rim
  tableGfx.fillStyle(0x560f1c, 1);
  tableGfx.fillCircle(38, 34, 6); // deep crimson inner well
  // Silverware
  tableGfx.fillStyle(0x9aa2b0, 1);
  tableGfx.fillRect(25, 27, 2, 14); // silver fork
  tableGfx.fillRect(49, 27, 2, 14); // silver knife
  // Crystal wine glass with deep crimson wine
  tableGfx.fillStyle(0x961a2c, 0.9);
  tableGfx.fillCircle(47, 20, 4);
  tableGfx.fillStyle(0xdde4f0, 0.6);
  tableGfx.fillRect(46, 23, 2, 5); // glass stem
  // Neatly folded ivory linen napkin
  tableGfx.fillStyle(0xded6c6, 1);
  tableGfx.fillRect(36, 45, 6, 4);

  // Place Setting 2: Death's side (Right)
  tableGfx.fillStyle(0xe2dedc, 1);
  tableGfx.fillCircle(138, 34, 9); // fine bone china plate
  tableGfx.fillStyle(0x8a6c2c, 1);
  tableGfx.strokeCircle(138, 34, 9);
  tableGfx.fillStyle(0x560f1c, 1);
  tableGfx.fillCircle(138, 34, 6);
  // Silverware
  tableGfx.fillStyle(0x9aa2b0, 1);
  tableGfx.fillRect(125, 27, 2, 14); // fork
  tableGfx.fillRect(149, 27, 2, 14); // knife
  // Crystal wine glass
  tableGfx.fillStyle(0x961a2c, 0.9);
  tableGfx.fillCircle(147, 20, 4);
  tableGfx.fillStyle(0xdde4f0, 0.6);
  tableGfx.fillRect(146, 23, 2, 5);
  // Folded napkin
  tableGfx.fillStyle(0xded6c6, 1);
  tableGfx.fillRect(136, 45, 6, 4);

  tableGfx.generateTexture('furniture_dining_table', 176, 68);
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

  // D. Love's Empty Waiting Chair (facing room/right) (36x48)
  const loveChairGfx = scene.make.graphics({ x: 0, y: 0 });
  loveChairGfx.fillStyle(0x201216, 1);
  loveChairGfx.fillRect(4, 0, 28, 48);
  loveChairGfx.fillStyle(0x561220, 1); // deep rose-crimson velvet back
  loveChairGfx.fillRect(6, 4, 24, 24);
  loveChairGfx.fillStyle(0x8a6c30, 0.8);
  loveChairGfx.fillRect(6, 4, 24, 2); // gold filigree crest
  loveChairGfx.fillStyle(0x6c1628, 1); // velvet cushion
  loveChairGfx.fillRect(4, 28, 28, 16);
  loveChairGfx.generateTexture('furniture_chair_love', 36, 48);
  loveChairGfx.destroy();

  // E. Death's Imposing Chair (36x52)
  const deathChairGfx = scene.make.graphics({ x: 0, y: 0 });
  deathChairGfx.fillStyle(0x140a0e, 1);
  deathChairGfx.fillRect(4, 0, 28, 52);
  deathChairGfx.fillStyle(0x2e101a, 1); // dark wine velvet back
  deathChairGfx.fillRect(6, 6, 24, 26);
  deathChairGfx.fillStyle(0x1a1218, 1);
  deathChairGfx.fillRect(8, 8, 20, 22);
  deathChairGfx.fillStyle(0x3e121e, 1);
  deathChairGfx.fillRect(4, 32, 28, 16);
  deathChairGfx.generateTexture('furniture_chair_death', 36, 52);
  deathChairGfx.destroy();

  // F. Wine sideboard / credenza (48x56)
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
  // 6. DRESSING AREA & MIRROR
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

  // D. Bedside nightstand table (32x36)
  const bedsideGfx = scene.make.graphics({ x: 0, y: 0 });
  bedsideGfx.fillStyle(0x201216, 1);
  bedsideGfx.fillRect(0, 0, 32, 36);
  bedsideGfx.fillStyle(0x301a20, 1);
  bedsideGfx.fillRect(2, 2, 28, 3);
  bedsideGfx.fillStyle(0x12080a, 1);
  bedsideGfx.fillRect(4, 8, 24, 12);
  bedsideGfx.fillRect(4, 22, 24, 10);
  bedsideGfx.fillStyle(0x8a6c2e, 1);
  bedsideGfx.fillRect(14, 13, 4, 2); // brass pull
  bedsideGfx.generateTexture('furniture_bedside', 32, 36);
  bedsideGfx.destroy();

  // -------------------------------------------------------------
  // 7. LOUNGE & HEARTH
  // -------------------------------------------------------------

  // A. Gothic Fireplace Hearth (96x80)
  const fireplaceGfx = scene.make.graphics({ x: 0, y: 0 });
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
  // 8. ORIGINAL GREAT HALL ARTWORK & DECOR
  // -------------------------------------------------------------

  // A. Celestial Chart (56x44)
  const celestialGfx = scene.make.graphics({ x: 0, y: 0 });
  celestialGfx.fillStyle(0x7a602a, 1); // aged brass frame
  celestialGfx.fillRect(0, 0, 56, 44);
  celestialGfx.fillStyle(0x0e1422, 1); // midnight indigo parchment
  celestialGfx.fillRect(3, 3, 50, 38);
  celestialGfx.lineStyle(1, 0x9a8040, 0.85);
  celestialGfx.strokeCircle(28, 22, 14); // orbital ring
  celestialGfx.strokeCircle(28, 22, 8);
  celestialGfx.lineBetween(14, 22, 42, 22); // celestial equator
  // Constellation stars
  celestialGfx.fillStyle(0xded8c4, 1);
  celestialGfx.fillCircle(20, 16, 1);
  celestialGfx.fillCircle(25, 12, 1.5);
  celestialGfx.fillCircle(36, 18, 1);
  celestialGfx.fillCircle(30, 28, 1.5);
  celestialGfx.fillCircle(22, 27, 1);
  celestialGfx.generateTexture('decor_art_celestial', 56, 44);
  celestialGfx.destroy();

  // B. Aristocratic Silhouette Portrait (40x48)
  const portraitGfx = scene.make.graphics({ x: 0, y: 0 });
  portraitGfx.fillStyle(0x8a6e2e, 1); // ornate gold frame
  portraitGfx.fillRect(0, 0, 40, 48);
  portraitGfx.fillStyle(0x1a121c, 1); // dark canvas
  portraitGfx.fillRect(3, 3, 34, 42);
  portraitGfx.fillStyle(0x2e1e2c, 1); // muted burgundy background
  portraitGfx.fillRect(5, 5, 30, 38);
  portraitGfx.fillStyle(0x0c0a10, 1); // aristocratic silhouette
  portraitGfx.fillCircle(20, 16, 6); // head
  portraitGfx.fillTriangle(10, 38, 30, 38, 20, 22); // shoulders/doublet
  portraitGfx.fillStyle(0xd4caa8, 1);
  portraitGfx.fillRect(18, 22, 4, 3); // ivory lace cravat
  portraitGfx.generateTexture('decor_art_portrait', 40, 48);
  portraitGfx.generateTexture('decor_painting_portrait', 40, 48); // backwards compatibility
  portraitGfx.destroy();

  // C. Battlefield Study (56x40) - Subtle General foreshadowing
  const battleGfx = scene.make.graphics({ x: 0, y: 0 });
  battleGfx.fillStyle(0x181014, 1); // dark ebony frame with bronze corner mounts
  battleGfx.fillRect(0, 0, 56, 40);
  battleGfx.fillStyle(0x8a622a, 1);
  battleGfx.fillRect(0, 0, 4, 4);
  battleGfx.fillRect(52, 0, 4, 4);
  battleGfx.fillRect(0, 36, 4, 4);
  battleGfx.fillRect(52, 36, 4, 4);
  // Smoky apocalyptic battlefield canvas
  battleGfx.fillStyle(0x1e1214, 1);
  battleGfx.fillRect(3, 3, 50, 34);
  battleGfx.fillStyle(0x3a181c, 0.9); // smoky red sky
  battleGfx.fillRect(3, 3, 50, 18);
  // Dark silhouetted army banners and spear tips
  battleGfx.fillStyle(0x0c0608, 1);
  battleGfx.fillTriangle(10, 36, 18, 36, 14, 22);
  battleGfx.fillTriangle(22, 36, 32, 36, 27, 20);
  battleGfx.fillTriangle(38, 36, 48, 36, 43, 24);
  battleGfx.fillRect(18, 16, 1, 16); // spear
  battleGfx.fillRect(34, 14, 1, 18);
  battleGfx.fillStyle(0xff6a28, 0.7);
  battleGfx.fillCircle(44, 24, 1.5); // ember flare
  battleGfx.generateTexture('decor_art_battlefield', 56, 40);
  battleGfx.destroy();

  // D. Memento Mori Composition (40x48)
  const mementoGfx = scene.make.graphics({ x: 0, y: 0 });
  mementoGfx.fillStyle(0x281c16, 1); // carved walnut frame
  mementoGfx.fillRect(0, 0, 40, 48);
  mementoGfx.fillStyle(0x100e16, 1);
  mementoGfx.fillRect(3, 3, 34, 42);
  // Hourglass
  mementoGfx.fillStyle(0x9a8240, 1);
  mementoGfx.fillRect(14, 12, 12, 2); // top plate
  mementoGfx.fillRect(14, 28, 12, 2); // bottom plate
  mementoGfx.fillStyle(0x344660, 0.7);
  mementoGfx.fillTriangle(15, 14, 25, 14, 20, 20); // upper bulb
  mementoGfx.fillTriangle(15, 28, 25, 28, 20, 22); // lower bulb
  mementoGfx.fillStyle(0xbca048, 1);
  mementoGfx.fillRect(19, 25, 2, 3); // golden sand
  // Wilted rose stem
  mementoGfx.fillStyle(0x1b3c22, 1);
  mementoGfx.lineBetween(26, 38, 30, 24);
  mementoGfx.fillStyle(0x8a1828, 1);
  mementoGfx.fillCircle(30, 23, 3); // rose bud
  mementoGfx.generateTexture('decor_art_memento_mori', 40, 48);
  mementoGfx.destroy();

  // E. Antique Maritime Map (56x40)
  const mapGfx = scene.make.graphics({ x: 0, y: 0 });
  mapGfx.fillStyle(0x221814, 1); // dark oak frame
  mapGfx.fillRect(0, 0, 56, 40);
  mapGfx.fillStyle(0x2c2620, 1); // aged sepia parchment
  mapGfx.fillRect(3, 3, 50, 34);
  mapGfx.fillStyle(0x383024, 1);
  // Continent coastlines
  mapGfx.fillCircle(18, 18, 9);
  mapGfx.fillCircle(24, 22, 7);
  mapGfx.fillCircle(38, 16, 8);
  // Compass rose
  mapGfx.fillStyle(0x7a6234, 1);
  mapGfx.fillCircle(44, 28, 4);
  mapGfx.lineStyle(1, 0x5a4822, 0.8);
  mapGfx.lineBetween(8, 24, 48, 24); // rhumb line
  mapGfx.generateTexture('decor_art_map', 56, 40);
  mapGfx.generateTexture('decor_painting_landscape', 56, 36); // backwards compatibility
  mapGfx.destroy();

  // F. Grand Hanging Candelabra / Chandelier (96x72)
  const chandGfx = scene.make.graphics({ x: 0, y: 0 });
  // Iron support chain extending upward
  chandGfx.fillStyle(0x1a181e, 1);
  chandGfx.fillRect(47, 0, 2, 28);
  // Main wrought iron circular body
  chandGfx.lineStyle(3, 0x22202a, 1);
  chandGfx.strokeEllipse(48, 38, 76, 18);
  // Scrolled wrought iron braces
  chandGfx.lineBetween(48, 28, 16, 38);
  chandGfx.lineBetween(48, 28, 48, 46);
  chandGfx.lineBetween(48, 28, 80, 38);
  // Brass candle sockets and ivory candles
  const candleXs = [16, 30, 48, 66, 80];
  for (const cx of candleXs) {
    chandGfx.fillStyle(0x8a6e2e, 1);
    chandGfx.fillRect(cx - 3, 34, 6, 4); // socket
    chandGfx.fillStyle(0xded6c4, 1);
    chandGfx.fillRect(cx - 1.5, 26, 3, 8); // candle wax
    chandGfx.fillStyle(0xff8c20, 1);
    chandGfx.fillRect(cx - 1.5, 21, 3, 5); // flame
    chandGfx.fillStyle(0xffea48, 1);
    chandGfx.fillRect(cx - 1, 23, 2, 3);
  }
  chandGfx.generateTexture('decor_chandelier', 96, 72);
  chandGfx.destroy();

  // -------------------------------------------------------------
  // 9. CANDLESTANDS & TEARDROP FLAME
  // -------------------------------------------------------------

  // A. Single Candlestick (8x18)
  const candleGfx = scene.make.graphics({ x: 0, y: 0 });
  candleGfx.fillStyle(0x8a6c2e, 1); // brass base
  candleGfx.fillRect(1, 14, 6, 4);
  candleGfx.fillStyle(0xe2dac8, 1); // ivory candle wax
  candleGfx.fillRect(2, 6, 4, 9);
  candleGfx.fillStyle(0x222222, 1); // wick
  candleGfx.fillRect(3, 4, 2, 2);
  candleGfx.generateTexture('decor_candle_single', 8, 18);
  candleGfx.generateTexture('obstacle_pillar', 32, 64); // backwards compatibility
  candleGfx.destroy();

  // B. Tapered Teardrop Candle Flame (8x14)
  const flameGfx = scene.make.graphics({ x: 0, y: 0 });
  // Outer warm amber teardrop body tapering to sharp apex
  flameGfx.fillStyle(0xff5a14, 0.85);
  flameGfx.fillTriangle(4, 0, 1, 9, 7, 9);
  flameGfx.fillCircle(4, 9, 3);
  // Mid vibrant gold flame
  flameGfx.fillStyle(0xffa820, 0.95);
  flameGfx.fillTriangle(4, 2, 2, 9, 6, 9);
  flameGfx.fillCircle(4, 9, 2);
  // Inner bright yellow core
  flameGfx.fillStyle(0xffeb56, 1);
  flameGfx.fillTriangle(4, 4, 2.5, 9, 5.5, 9);
  flameGfx.fillCircle(4, 9, 1.5);
  // Needle-thin white-hot apex
  flameGfx.fillStyle(0xffffff, 0.95);
  flameGfx.fillRect(3.5, 4, 1, 4);
  flameGfx.generateTexture('decor_flame_teardrop', 8, 14);
  flameGfx.destroy();

  // C. Nocturnal Bat Silhouette (16x10)
  const batGfx = scene.make.graphics({ x: 0, y: 0 });
  batGfx.fillStyle(0x06060c, 1);
  batGfx.fillTriangle(0, 2, 8, 8, 4, 0); // left wing
  batGfx.fillTriangle(16, 2, 8, 8, 12, 0); // right wing
  batGfx.fillCircle(8, 6, 2); // body
  batGfx.generateTexture('silhouette_bat', 16, 10);
  batGfx.destroy();

  // -------------------------------------------------------------
  // 10. CONTACT SHADOWS
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

  // Hero banquet table shadow (180x32)
  const sTableHero = scene.make.graphics({ x: 0, y: 0 });
  sTableHero.fillStyle(0x000000, 0.6);
  sTableHero.fillEllipse(90, 16, 180, 32);
  sTableHero.generateTexture('shadow_table_hero', 180, 32);
  sTableHero.destroy();

  // -------------------------------------------------------------
  // 11. RESTRAINED RADIAL LIGHT GLOW TEXTURES
  // -------------------------------------------------------------

  // Warm candle glow (64x64) - restrained, soft exponential falloff
  const warmGlowGfx = scene.make.graphics({ x: 0, y: 0 });
  const steps = 12;
  for (let i = steps; i >= 1; i--) {
    const norm = i / steps;
    const alpha = (1 - norm) * (1 - norm) * 0.26;
    warmGlowGfx.fillStyle(0xffa834, alpha);
    warmGlowGfx.fillCircle(32, 32, (32 / steps) * i);
  }
  warmGlowGfx.generateTexture('light_glow_warm', 64, 64);
  warmGlowGfx.destroy();

  // Cool blue moonlight glow (64x64)
  const coolGlowGfx = scene.make.graphics({ x: 0, y: 0 });
  for (let i = steps; i >= 1; i--) {
    const norm = i / steps;
    const alpha = (1 - norm) * (1 - norm) * 0.2;
    coolGlowGfx.fillStyle(0x6a84b0, alpha);
    coolGlowGfx.fillCircle(32, 32, (32 / steps) * i);
  }
  coolGlowGfx.generateTexture('light_glow_cool', 64, 64);
  coolGlowGfx.destroy();

  // Hearth fire warm glow (96x96)
  const fireGlowGfx = scene.make.graphics({ x: 0, y: 0 });
  for (let i = steps; i >= 1; i--) {
    const norm = i / steps;
    const alpha = (1 - norm) * (1 - norm) * 0.32;
    fireGlowGfx.fillStyle(0xff6e1e, alpha);
    fireGlowGfx.fillCircle(48, 48, (48 / steps) * i);
  }
  fireGlowGfx.generateTexture('light_glow_fire', 96, 96);
  fireGlowGfx.destroy();
}

