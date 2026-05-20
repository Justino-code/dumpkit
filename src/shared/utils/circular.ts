// src/shared/utils/circular.ts

export type CircularReference = {
  /** The original object that caused the circular reference */
  object: object;
  /** Path where the circular reference was detected */
  path: string;
  /** Reference ID (index of first occurrence) */
  refId: number;
};

/**
 * Detects and tracks circular references during object traversal
 * 
 * Usage:
 * ```ts
 * const detector = new CircularDetector();
 * 
 * function visit(obj: any, path: string) {
 *   if (detector.has(obj)) {
 *     return detector.get(obj, path); // returns circular marker
 *   }
 *   detector.add(obj, path);
 *   // ... continue traversal
 * }
 * ```
 */
export class CircularDetector {
  private objects = new WeakMap<object, { id: number; path: string }>();
  private nextId = 1;
  
  /**
   * Check if an object has been seen before
   */
  has(obj: object): boolean {
    return this.objects.has(obj);
  }
  
  /**
   * Register a new object
   * @returns The reference ID assigned to this object
   */
  add(obj: object, path: string): number {
    const id = this.nextId++;
    this.objects.set(obj, { id, path });
    return id;
  }
  
  /**
   * Get circular reference info for an object
   * @returns Circular marker string like "[Circular *1]" and the reference info
   */
  get(obj: object, currentPath: string): { marker: string; refId: number; originalPath: string } {
    const info = this.objects.get(obj);
    if (!info) {
      throw new Error('Object not tracked by CircularDetector');
    }
    
    return {
      marker: `[Circular *${info.id}]`,
      refId: info.id,
      originalPath: info.path,
    };
  }
  
  /**
   * Reset the detector for a new inspection
   */
  reset(): void {
    this.objects = new WeakMap();
    this.nextId = 1;
  }
  
  /**
   * Get the reference ID of an object (if tracked)
   */
  getRefId(obj: object): number | undefined {
    return this.objects.get(obj)?.id;
  }
}

/**
 * Helper function to create a one-off circular detection
 * @returns A function that can detect circular references
 */
export function createCircularDetector() {
  const seen = new WeakSet<object>();
  const refs = new WeakMap<object, number>();
  let nextRef = 1;
  
  return {
    check<T>(value: T, path?: string): { isCircular: boolean; refId?: number; marker?: string } {
      if (value && typeof value === 'object') {
        if (seen.has(value as object)) {
          const refId = refs.get(value as object);
          return {
            isCircular: true,
            refId,
            marker: refId ? `[Circular *${refId}]` : '[Circular]',
          };
        }
        
        seen.add(value as object);
        const refId = nextRef++;
        refs.set(value as object, refId);
      }
      
      return { isCircular: false };
    },
    
    reset(): void {
      seen.clear();
      refs.clear();
      nextRef = 1;
    },
  };
}