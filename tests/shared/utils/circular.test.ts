// tests/shared/utils/circular.test.ts

import { describe, it, expect, beforeEach } from 'vitest';
import { CircularDetector } from '../../../src/shared/utils/circular';

describe('CircularDetector', () => {
  let detector: CircularDetector;

  beforeEach(() => {
    detector = new CircularDetector();
  });

  describe('enter - new objects', () => {
    it('should mark new object as not circular and not shared', () => {
      const obj = {};
      const result = detector.enter(obj, 'root');
      
      expect(result.isCircular).toBe(false);
      expect(result.isShared).toBe(false);
      expect(result.id).toBe(1);
    });

    it('should assign incrementing IDs to new objects', () => {
      const obj1 = {};
      const obj2 = {};
      
      const result1 = detector.enter(obj1, 'root1');
      const result2 = detector.enter(obj2, 'root2');
      
      expect(result1.id).toBe(1);
      expect(result2.id).toBe(2);
    });
  });

  describe('enter - circular references', () => {
    it('should detect circular reference when object is in current stack', () => {
      const obj = {};
      detector.enter(obj, 'root');
      const result = detector.enter(obj, 'root.self');
      
      expect(result.isCircular).toBe(true);
      expect(result.isShared).toBe(false);
      expect(result.id).toBe(1);
      expect(result.originalPath).toBe('root');
    });

    it('should detect circular in nested objects', () => {
      const parent = { name: 'parent' };
      const child = { name: 'child' };
      
      detector.enter(parent, 'parent');
      detector.enter(child, 'parent.child');
      
      // Child is in stack, so entering it again is circular
      const result = detector.enter(child, 'parent.child.self');
      
      expect(result.isCircular).toBe(true);
      expect(result.id).toBe(2);
    });
  });

  describe('enter - shared references', () => {
    it('should detect shared reference when object was visited but not in stack', () => {
      const obj = {};
      detector.enter(obj, 'first');
      detector.leave(obj);
      
      const result = detector.enter(obj, 'second');
      
      expect(result.isCircular).toBe(false);
      expect(result.isShared).toBe(true);
      expect(result.id).toBe(1);
      expect(result.originalPath).toBe('first');
    });

    it('should detect multiple shared references to same object', () => {
      const shared = { value: 42 };
      
      detector.enter(shared, 'first');
      detector.leave(shared);
      
      const second = detector.enter(shared, 'second');
      const third = detector.enter(shared, 'third');
      
      expect(second.isShared).toBe(true);
      expect(second.id).toBe(1);
      expect(third.isShared).toBe(true);
      expect(third.id).toBe(1);
    });

    it('should not treat first reference as shared', () => {
      const obj = {};
      const result = detector.enter(obj, 'path');
      
      expect(result.isShared).toBe(false);
      expect(result.isCircular).toBe(false);
    });
  });

  describe('enter - mixed circular and shared', () => {
    it('should prioritize circular over shared', () => {
      const obj = {};
      detector.enter(obj, 'first');
      detector.enter(obj, 'second'); // circular (still in stack)
      
      expect(detector.has(obj)).toBe(true);
      
      detector.leave(obj);
      const after = detector.enter(obj, 'third');
      
      // After leave, it becomes shared
      expect(after.isCircular).toBe(false);
      expect(after.isShared).toBe(true);
    });
  });

  describe('leave', () => {
    it('should remove object from stack', () => {
      const obj = {};
      detector.enter(obj, 'root');
      
      // Before leave, entering again should be circular
      const before = detector.enter(obj, 'root.self');
      expect(before.isCircular).toBe(true);
      
      detector.leave(obj);
      
      // After leave, entering again should be shared (not circular)
      const after = detector.enter(obj, 'root.again');
      expect(after.isCircular).toBe(false);
      expect(after.isShared).toBe(true);
    });
  });

  describe('reset', () => {
    it('should clear all tracked objects and stack', () => {
      const obj = {};
      detector.enter(obj, 'root');
      expect(detector.has(obj)).toBe(true);
      
      detector.reset();
      expect(detector.has(obj)).toBe(false);
      
      const result = detector.enter(obj, 'new');
      expect(result.isCircular).toBe(false);
      expect(result.isShared).toBe(false);
      expect(result.id).toBe(1);
    });
  });

  describe('has', () => {
    it('should return true for visited objects', () => {
      const obj = {};
      detector.enter(obj, 'root');
      expect(detector.has(obj)).toBe(true);
    });

    it('should return false for new objects', () => {
      const obj = {};
      expect(detector.has(obj)).toBe(false);
    });
  });

  describe('getRefId', () => {
    it('should return ID of visited object', () => {
      const obj = {};
      detector.enter(obj, 'root');
      expect(detector.getRefId(obj)).toBe(1);
    });

    it('should throw for untracked objects', () => {
      const obj = {};
      expect(() => detector.getRefId(obj)).toThrow('Object not tracked');
    });
  });

  describe('getOriginalPath', () => {
    it('should return original path of visited object', () => {
      const obj = {};
      detector.enter(obj, 'user.profile');
      expect(detector.getOriginalPath(obj)).toBe('user.profile');
    });

    it('should throw for untracked objects', () => {
      const obj = {};
      expect(() => detector.getOriginalPath(obj)).toThrow('Object not tracked');
    });
  });

  describe('complex scenarios', () => {
    it('should handle nested objects with circular and shared', () => {
      const shared = { value: 42 };
      const parent = { name: 'parent', ref: shared };
      const child = { name: 'child', ref: shared };
      
      detector.enter(shared, 'shared');
      detector.leave(shared);
      
      detector.enter(parent, 'parent');
      
      // shared referenced from parent
      const sharedFromParent = detector.enter(shared, 'parent.ref');
      expect(sharedFromParent.isShared).toBe(true);
      expect(sharedFromParent.id).toBe(1);
      
      detector.enter(child, 'parent.child');
      
      // shared referenced from child (also shared)
      const sharedFromChild = detector.enter(shared, 'parent.child.ref');
      expect(sharedFromChild.isShared).toBe(true);
      expect(sharedFromChild.id).toBe(1);
      
      // circular: child referencing parent
      const circularRef = detector.enter(parent, 'parent.child.parent');
      expect(circularRef.isCircular).toBe(true);
    });
  });
});