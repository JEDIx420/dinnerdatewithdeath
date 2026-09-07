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
    ruleGfx.lineStyle(1, 0x6e1b27, 0.7);
    ruleGfx.lineBetween(centerX - 90, 75, centerX + 90, 75);

    // Title
    this.add
      .text(centerX, 54, 'A DINNER DATE WITH DEATH', {
        fontFamily: 'Georgia, serif',
        fontSize: '14px',
        color: '#e0d8e8',
        align: 'center',
      })
      .setOrigin(0.5)
      .setShadow(1, 1, '#2c0c14', 2);

    // Subtitle
    this.add
      .text(centerX, 90, '— An Interactive Gothic Tale —', {
        fontFamily: 'Georgia, serif',
        fontSize: '8px',
        color: '#8b8094',
        align: 'center',
      })
      .setOrigin(0.5);

    // New Game Prompt
    this.startPromptText = this.add
      .text(centerX, 150, '▶  NEW GAME', {
        fontFamily: 'monospace',
        fontSize: '10px',
        color: '#c4b5d0',
        align: 'center',
      })
      .setOrigin(0.5);

    // Sub-instruction
    this.add
      .text(centerX, 172, 'Press ENTER or SPACE to Begin', {
        fontFamily: 'monospace',
        fontSize: '7px',
        color: '#5e5669',
        align: 'center',
      })
      .setOrigin(0.5);

    // Mouse / touch click to start
    this.input.on('pointerdown', () => {
      this.startGame();
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
