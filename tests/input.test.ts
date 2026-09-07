import { describe, it, expect, beforeEach } from 'vitest';
import { InputManager } from '../src/game/systems/InputManager';

describe('InputManager', () => {
  let input: InputManager;

  beforeEach(() => {
    input = new InputManager();
  });

  it('maps ArrowLeft and KeyA to LEFT action', () => {
    expect(input.isDown('LEFT')).toBe(false);

    input.handleKeyDown('ArrowLeft');
    expect(input.isDown('LEFT')).toBe(true);

    input.handleKeyUp('ArrowLeft');
    expect(input.isDown('LEFT')).toBe(false);

    input.handleKeyDown('KeyA');
    expect(input.isDown('LEFT')).toBe(true);
  });

  it('maps Space, Enter, and KeyZ to CONFIRM action', () => {
    input.handleKeyDown('Space');
    expect(input.isDown('CONFIRM')).toBe(true);

    input.handleKeyUp('Space');
    expect(input.isDown('CONFIRM')).toBe(false);

    input.handleKeyDown('Enter');
    expect(input.isDown('CONFIRM')).toBe(true);

    input.handleKeyUp('Enter');
    input.handleKeyDown('KeyZ');
    expect(input.isDown('CONFIRM')).toBe(true);
  });

  it('correctly tracks isJustDown state across frame updates', () => {
    input.handleKeyDown('Space');
    expect(input.isJustDown('CONFIRM')).toBe(true);

    // After an update tick, isDown is still true, but isJustDown is false
    input.update();
    expect(input.isDown('CONFIRM')).toBe(true);
    expect(input.isJustDown('CONFIRM')).toBe(false);

    // After key release and update tick
    input.handleKeyUp('Space');
    expect(input.isDown('CONFIRM')).toBe(false);
    expect(input.isJustDown('CONFIRM')).toBe(false);
  });

  it('supports synthetic actions for future touch / virtual D-pad inputs', () => {
    expect(input.isDown('UP')).toBe(false);

    input.setSyntheticAction('UP', true);
    expect(input.isDown('UP')).toBe(true);

    input.setSyntheticAction('UP', false);
    expect(input.isDown('UP')).toBe(false);
  });

  it('resets all active inputs cleanly', () => {
    input.handleKeyDown('KeyW');
    input.setSyntheticAction('CONFIRM', true);
    expect(input.isDown('UP')).toBe(true);
    expect(input.isDown('CONFIRM')).toBe(true);

    input.reset();
    expect(input.isDown('UP')).toBe(false);
    expect(input.isDown('CONFIRM')).toBe(false);
  });
});
