// tests/shared/utils/circular.test.ts

import { describe, it, expect, beforeEach } from 'vitest';
import { CircularDetector, createCircularDetector } from '../../../src/shared/utils/circular';

describe('CircularDetector', () => {
  let detector: CircularDetector;

  beforeEach(() => {
    detector = new CircularDetector();
  });

  describe('has', () => {
    it('should return false for new objects', () => {
      const obj = {};
      expect(detector.has(obj)).toBe(false);
    });

    it('should return true after object is added', () => {
      const obj = {};
      detector.add(obj, 'root');
      expect(detector.has(obj)).toBe(true);
    });
  });

  describe('add', () => {
    it('should assign incrementing IDs', () => {
      const obj1 = {};
      const obj2 = {};
      
      const id1 = detector.add(obj1, 'root');
      const id2 = detector.add(obj2, 'root');
      
      expect(id1).toBe(1);
      expect(id2).toBe(2);
    });
  });

  describe('get', () => {
    it('should return circular marker and info', () => {
      const obj = {};
      detector.add(obj, 'root');
      
      const result = detector.get(obj, 'current.path');
      
      expect(result.marker).toBe('[Circular *1]');
      expect(result.refId).toBe(1);
      expect(result.originalPath).toBe('root');
    });

    it('should throw for untracked objects', () => {
      const obj = {};
      expect(() => detector.get(obj, 'path')).toThrow();
    });
  });

  describe('reset', () => {
    it('should clear all tracked objects', () => {
      const obj = {};
      detector.add(obj, 'root');
      expect(detector.has(obj)).toBe(true);
      
      detector.reset();
      expect(detector.has(obj)).toBe(false);
    });
  });
});

describe('createCircularDetector', () => {
  it('should detect circular references', () => {
    const detector = createCircularDetector();
    const obj: any = {};
    obj.self = obj;
    
    const result = detector.check(obj);
    expect(result.isCircular).toBe(false); // First time
    
    const result2 = detector.check(obj.self);
    expect(result2.isCircular).toBe(true);
    expect(result2.refId).toBe(1);
  });

  it('should reset correctly', () => {
    const detector = createCircularDetector();
    const obj = {};
    
    detector.check(obj);
    const result = detector.check(obj);
    expect(result.isCircular).toBe(true);
    
    detector.reset();
    const result2 = detector.check(obj);
    expect(result2.isCircular).toBe(false);
  });
});