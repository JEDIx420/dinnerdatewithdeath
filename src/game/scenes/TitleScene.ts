import Phaser from 'phaser';
import { GAME_CONFIG } from '../config';
import { InputManager } from '../systems/InputManager';

export class TitleScene extends Phaser.Scene {
  private inputManager!: InputManager;
  private startPromptText!: Phaser.GameObjects.Text;
  private promptBlinkTimer: number = 0;

  constructor() {
    super({ key: 'TitleScene' });
  }

  public init(data: { inputManager?: InputManager }): void {
    if (data.inputManager) {
      this.inputManager = data.inputManager;
    } else {
      this.inputManager = new InputManager();
      this.inputManager.bindKeyboardEvents();
    }
  }

  public create(): void {
    const centerX = GAME_CONFIG.WIDTH / 2;

    // Dark gothic vignette background
    const bgGfx = this.add.graphics();
    bgGfx.fillGradientStyle(0x120e17, 0x120e17, 0x050407, 0x050407, 1);
    bgGfx.fillRect(0, 0, GAME_CONFIG.WIDTH, GAME_CONFIG.HEIGHT);

    // Decorative thin gothic rule
    const ruleGfx = this.add.graphics();
    ruleGfx.lineStyle(2, 0x6e1b27, 0.75);
    ruleGfx.lineBetween(centerX - 180, 150, centerX + 180, 150);

    // Title (clean 28px serif with deep crimson shadow)
    this.add
      .text(centerX, 108, 'A DINNER DATE WITH DEATH', {
        fontFamily: 'Georgia, serif',
        fontSize: '28px',
        color: '#e4dce8',
        align: 'center',
      })
      .setOrigin(0.5)
      .setShadow(2, 2, '#2c0c14', 3);

    // Subtitle (15px serif)
    this.add
      .text(centerX, 180, '— An Interactive Gothic Tale —', {
        fontFamily: 'Georgia, serif',
        fontSize: '15px',
        color: '#8f8498',
        align: 'center',
      })
      .setOrigin(0.5);

    // New Game Prompt (18px monospace)
    this.startPromptText = this.add
      .text(centerX, 300, '▶  NEW GAME', {
        fontFamily: 'monospace',
        fontSize: '18px',
        color: '#c8bad4',
        align: 'center',
      })
      .setOrigin(0.5);

    // Sub-instruction (12px monospace)
    this.add
      .text(centerX, 344, 'Press ENTER or SPACE to Begin', {
        fontFamily: 'monospace',
        fontSize: '12px',
        color: '#655d70',
        align: 'center',
      })
      .setOrigin(0.5);

    // Mouse / touch click to start
    this.input.on('pointerdown', () => {
      this.startGame();
    });

    // Developer shortcut: press 'L' to launch Asset Lab (hidden from player-facing UI)
    this.input.keyboard?.on('keydown-L', () => {
      this.scene.start('AssetLabScene');
    });
  }

  public update(_time: number, delta: number): void {
    // Subtle blinking prompt
    this.promptBlinkTimer += delta;
    if (this.promptBlinkTimer > 600) {
      this.startPromptText.visible = !this.startPromptText.visible;
      this.promptBlinkTimer = 0;
    }

    if (this.inputManager.isJustDown('CONFIRM')) {
      this.startGame();
    }

    this.inputManager.update();
  }

  private startGame(): void {
    this.scene.start('PrototypeScene', { inputManager: this.inputManager });
  }
}
