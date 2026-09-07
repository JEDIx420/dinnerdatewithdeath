export type InputAction =
  | 'UP'
  | 'DOWN'
  | 'LEFT'
  | 'RIGHT'
  | 'CONFIRM'
  | 'CANCEL'
  | 'PAUSE';

export interface ActionState {
  isDown: boolean;
  justDown: boolean;
}

/**
 * InputManager decouples gameplay code from raw keyboard/touch hardware events.
 * Both keyboard and future touch or gamepad inputs map onto abstract InputAction states.
 */
export class InputManager {
  private keyMap: Map<string, InputAction[]> = new Map();
  private rawActiveKeys: Set<string> = new Set();
  private currentActions: Map<InputAction, boolean> = new Map();
  private previousActions: Map<InputAction, boolean> = new Map();

  // Synthetic action overrides (e.g., from virtual D-pad / touch buttons)
  private syntheticActions: Map<InputAction, boolean> = new Map();

  constructor() {
    this.setupDefaultKeyMap();
  }

  private setupDefaultKeyMap(): void {
    const defaultBindings: Record<string, InputAction[]> = {
      ArrowUp: ['UP'],
      KeyW: ['UP'],
      ArrowDown: ['DOWN'],
      KeyS: ['DOWN'],
      ArrowLeft: ['LEFT'],
      KeyA: ['LEFT'],
      ArrowRight: ['RIGHT'],
      KeyD: ['RIGHT'],
      Enter: ['CONFIRM'],
      Space: ['CONFIRM'],
      KeyZ: ['CONFIRM'],
      Escape: ['CANCEL', 'PAUSE'],
      KeyX: ['CANCEL'],
    };

    for (const [key, actions] of Object.entries(defaultBindings)) {
      this.keyMap.set(key, actions);
    }
  }

  public bindKeyboardEvents(): void {
    if (typeof window === 'undefined') return;

    window.addEventListener('keydown', (e) => {
      // Prevent browser scrolling on arrow keys and space
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space'].includes(e.code)) {
        e.preventDefault();
      }
      this.handleKeyDown(e.code);
    });

    window.addEventListener('keyup', (e) => {
      this.handleKeyUp(e.code);
    });

    window.addEventListener('blur', () => {
      this.reset();
    });
  }

  public handleKeyDown(code: string): void {
    this.rawActiveKeys.add(code);
    this.computeActions();
  }

  public handleKeyUp(code: string): void {
    this.rawActiveKeys.delete(code);
    this.computeActions();
  }

  public setSyntheticAction(action: InputAction, active: boolean): void {
    if (active) {
      this.syntheticActions.set(action, true);
    } else {
      this.syntheticActions.delete(action);
    }
    this.computeActions();
  }

  private computeActions(): void {
    const active = new Map<InputAction, boolean>();

    for (const code of this.rawActiveKeys) {
      const actions = this.keyMap.get(code);
      if (actions) {
        for (const act of actions) {
          active.set(act, true);
        }
      }
    }

    for (const [action, isDown] of this.syntheticActions) {
      if (isDown) {
        active.set(action, true);
      }
    }

    this.currentActions = active;
  }

  public update(): void {
    // Clone current into previous after frame checks
    this.previousActions = new Map(this.currentActions);
  }

  public isDown(action: InputAction): boolean {
    return this.currentActions.get(action) === true;
  }

  public isJustDown(action: InputAction): boolean {
    const now = this.currentActions.get(action) === true;
    const prev = this.previousActions.get(action) === true;
    return now && !prev;
  }

  public reset(): void {
    this.rawActiveKeys.clear();
    this.syntheticActions.clear();
    this.currentActions.clear();
    this.previousActions.clear();
  }
}
