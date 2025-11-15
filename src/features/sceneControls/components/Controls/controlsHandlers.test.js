import { jest } from '@jest/globals';
import {
  createMetalnessHandler,
  createScaleHandler,
  createEmissiveIntensityHandler,
  createBaseColorHandler,
  createWireframeIntensityHandler,
  createWireframeToggleHandler,
  createHyperframeColorHandler,
  createHyperframeLineColorHandler,
  createEnvironmentHueHandler,
  createObjectCountHandler,
  createAnimationStyleHandler,
  createObjectTypeHandler,
} from './controlsHandlers';

describe('Control Handlers', () => {
  describe('createMetalnessHandler', () => {
    it('should parse float from event and call callback', () => {
      const mockCallback = jest.fn();
      const handler = createMetalnessHandler(mockCallback);

      const mockEvent = {
        target: { value: '0.75' },
      };

      handler(mockEvent);

      expect(mockCallback).toHaveBeenCalledWith(0.75);
      expect(mockCallback).toHaveBeenCalledTimes(1);
    });

    it('should handle edge case values (0 and 1)', () => {
      const mockCallback = jest.fn();
      const handler = createMetalnessHandler(mockCallback);

      handler({ target: { value: '0' } });
      expect(mockCallback).toHaveBeenCalledWith(0);

      handler({ target: { value: '1' } });
      expect(mockCallback).toHaveBeenCalledWith(1);
    });
  });

  describe('createScaleHandler', () => {
    it('should parse float from event and call callback', () => {
      const mockCallback = jest.fn();
      const handler = createScaleHandler(mockCallback);

      handler({ target: { value: '2.5' } });

      expect(mockCallback).toHaveBeenCalledWith(2.5);
    });
  });

  describe('createEmissiveIntensityHandler', () => {
    it('should parse float from event and call callback', () => {
      const mockCallback = jest.fn();
      const handler = createEmissiveIntensityHandler(mockCallback);

      handler({ target: { value: '1.2' } });

      expect(mockCallback).toHaveBeenCalledWith(1.2);
    });
  });

  describe('createBaseColorHandler', () => {
    it('should add alpha channel to 7-character hex colors', () => {
      const mockCallback = jest.fn();
      const handler = createBaseColorHandler(mockCallback);

      handler({ target: { value: '#ff00cc' } });

      expect(mockCallback).toHaveBeenCalledWith('#ff00ccff');
    });

    it('should preserve alpha channel if already present', () => {
      const mockCallback = jest.fn();
      const handler = createBaseColorHandler(mockCallback);

      handler({ target: { value: '#ff00cc88' } });

      expect(mockCallback).toHaveBeenCalledWith('#ff00cc88');
    });
  });

  describe('createWireframeIntensityHandler', () => {
    it('should parse float from event and call callback', () => {
      const mockCallback = jest.fn();
      const handler = createWireframeIntensityHandler(mockCallback);

      handler({ target: { value: '50' } });

      expect(mockCallback).toHaveBeenCalledWith(50);
    });
  });

  describe('createWireframeToggleHandler', () => {
    it('should set intensity to 100 when checked', () => {
      const mockCallback = jest.fn();
      const handler = createWireframeToggleHandler(mockCallback);

      handler({ target: { checked: true } });

      expect(mockCallback).toHaveBeenCalledWith(100);
    });

    it('should set intensity to 0 when unchecked', () => {
      const mockCallback = jest.fn();
      const handler = createWireframeToggleHandler(mockCallback);

      handler({ target: { checked: false } });

      expect(mockCallback).toHaveBeenCalledWith(0);
    });
  });

  describe('createHyperframeColorHandler', () => {
    it('should extract hex color from event', () => {
      const mockCallback = jest.fn();
      const handler = createHyperframeColorHandler(mockCallback);

      handler({ target: { value: '#00ffff' } });

      expect(mockCallback).toHaveBeenCalledWith('#00ffff');
    });
  });

  describe('createHyperframeLineColorHandler', () => {
    it('should extract hex color from event', () => {
      const mockCallback = jest.fn();
      const handler = createHyperframeLineColorHandler(mockCallback);

      handler({ target: { value: '#ff00cc' } });

      expect(mockCallback).toHaveBeenCalledWith('#ff00cc');
    });
  });

  describe('createEnvironmentHueHandler', () => {
    it('should parse integer from event', () => {
      const mockCallback = jest.fn();
      const handler = createEnvironmentHueHandler(mockCallback);

      handler({ target: { value: '180' } });

      expect(mockCallback).toHaveBeenCalledWith(180);
    });

    it('should handle hue range boundaries (0 and 360)', () => {
      const mockCallback = jest.fn();
      const handler = createEnvironmentHueHandler(mockCallback);

      handler({ target: { value: '0' } });
      expect(mockCallback).toHaveBeenCalledWith(0);

      handler({ target: { value: '360' } });
      expect(mockCallback).toHaveBeenCalledWith(360);
    });
  });

  describe('createObjectCountHandler', () => {
    it('should parse integer from event', () => {
      const mockCallback = jest.fn();
      const handler = createObjectCountHandler(mockCallback);

      handler({ target: { value: '5' } });

      expect(mockCallback).toHaveBeenCalledWith(5);
    });
  });

  describe('createAnimationStyleHandler', () => {
    it('should pass value directly to callback (no event wrapping)', () => {
      const mockCallback = jest.fn();
      const handler = createAnimationStyleHandler(mockCallback);

      handler('rotate');

      expect(mockCallback).toHaveBeenCalledWith('rotate');
    });
  });

  describe('createObjectTypeHandler', () => {
    it('should pass value directly to callback (no event wrapping)', () => {
      const mockCallback = jest.fn();
      const handler = createObjectTypeHandler(mockCallback);

      handler('sphere');

      expect(mockCallback).toHaveBeenCalledWith('sphere');
    });
  });
});
