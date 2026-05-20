// src/shared/utils/circular.ts

/**
 * Detects and tracks circular references in objects
 */
export class CircularDetector {
  private objects = new WeakMap<object, { id: number; path: string }>();
  private nextId = 1;
  
  /**
   * Checks if an object has been seen before
   */
  has(obj: object): boolean {
    return this.objects.has(obj);
  }
  
  /**
   * Registers a new object and returns its reference ID
   */
  add(obj: object, path: string): number {
    const id = this.nextId++;
    this.objects.set(obj, { id, path });
    return id;
  }
  
  /**
   * Gets circular reference information for an object
   */
  get(obj: object, currentPath: string): { marker: string; refId: number; originalPath: string; currentPath: string } {
    const info = this.objects.get(obj);
    if (!info) {
      throw new Error('Object not tracked by CircularDetector');
    }
    
    return {
      marker: `[Circular *${info.id}]`,
      refId: info.id,
      originalPath: info.path,
      currentPath: currentPath,
    };
  }
  
  /**
   * Resets the detector for a new inspection
   */
  reset(): void {
    this.objects = new WeakMap();
    this.nextId = 1;
  }
  
  /**
   * Gets the reference ID of an object if tracked
   */
  getRefId(obj: object): number | undefined {
    return this.objects.get(obj)?.id;
  }
}

/**
 * Creates a simple circular reference detector function
 */
export function createCircularDetector() {
  let refs = new WeakMap<object, { id: number; path: string }>();
  let nextRef = 1;
  
  return {
    /**
     * Checks if a value has been seen before
     */
    check<T>(value: T, currentPath: string): { isCircular: boolean; refId?: number; marker?: string; originalPath?: string } {
      if (value && typeof value === 'object') {
        const existing = refs.get(value as object);
        if (existing) {
          return {
            isCircular: true,
            refId: existing.id,
            originalPath: existing.path,
            marker: `[Circular *${existing.id}]`,
          };
        }
        
        refs.set(value as object, { id: nextRef, path: currentPath });
        nextRef++;
      }
      
      return { isCircular: false };
    },
    
    /**
     * Resets the detector
     */
    reset(): void {
      refs = new WeakMap<object, { id: number; path: string }>();
      nextRef = 1;
    },
  };
}