import { Event, CustomEvent } from '../src/events';

let event;

describe('Event', () => {

  it('should be a function', () => {
    expect(typeof Event).toBe('function');
  });

  it('should construct', () => {
    const event = new Event('foo');
    expect(event).toBeInstanceOf(Event);
  });

  it('should throw if no type is provided', () => {
    expect(() => new Event).toThrowError(
      `Failed to construct 'Event': 1 argument required, but only 0 present.`
    )
  });

  describe('event.type', () => {
    
    beforeEach(() => {
      event = new Event('click');
    });

    it('should exist', () => {
      expect(event.type).toBe('click');
    });

    it('should be non-enumerable', () => {
      expect(Object.keys(event).indexOf('type')).toBe(-1);
    });
  });

});

describe('CustomEvent', () => {
  it('should be a function', () => {
    expect(typeof CustomEvent).toBe('function');
  });

  it('should construct', () => {
    const event = new CustomEvent('foo');
    expect(event).toBeInstanceOf(CustomEvent);
  });

  it('should throw if no type is provided', () => {
    expect(() => new CustomEvent).toThrowError(
      `Failed to construct 'CustomEvent': 1 argument required, but only 0 present.`
    )
  });
})