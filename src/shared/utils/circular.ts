// src/shared/utils/circular.ts

/**
 * State of an object during traversal.
 */
type ObjectState = {
  id: number;
  path: string;      // path where it was first encountered
};

/**
 * Detects circular and shared references during object traversal.
 *
 * - Circular: the same object appears again in the current traversal stack.
 * - Shared: the same object is referenced from two different paths (non-circular).
 */
export class CircularDetector {
  // All objects ever visited (to detect sharing and assign unique IDs)
  private visited = new WeakMap<object, ObjectState>();
  // Stack of objects currently being processed (to detect cycles)
  private stack: object[] = [];
  private nextId = 1;

  /**
   * Called when entering an object during traversal.
   * @param obj The object to process
   * @param path Current path (e.g., 'root', 'user.address')
   * @returns Information about the object's state
   */
  enter(obj: object, path: string): {
    id: number;
    isCircular: boolean;
    isShared: boolean;
    originalPath?: string;
  } {
    // 1. Check for circular (already in stack)
    const stackIdx = this.stack.indexOf(obj);
    if (stackIdx !== -1) {
      const existing = this.visited.get(obj)!;
      return {
        id: existing.id,
        isCircular: true,
        isShared: false,
        originalPath: existing.path,
      };
    }

    // 2. Check for shared (already visited but not in stack)
    const existing = this.visited.get(obj);
    if (existing) {
      return {
        id: existing.id,
        isCircular: false,
        isShared: true,
        originalPath: existing.path,
      };
    }

    // 3. New object: assign ID and store
    const id = this.nextId++;
    const state: ObjectState = { id, path };
    this.visited.set(obj, state);
    this.stack.push(obj);
    return {
      id,
      isCircular: false,
      isShared: false,
    };
  }

  /**
   * Called when leaving an object after processing its children.
   * @param obj The object to remove from the stack
   */
  leave(obj: object): void {
    const idx = this.stack.lastIndexOf(obj);
    if (idx !== -1) this.stack.splice(idx, 1);
  }

  /**
   * Resets the detector for a new traversal.
   */
  reset(): void {
    this.visited = new WeakMap();
    this.stack = [];
    this.nextId = 1;
  }

  /**
   * Checks if an object has ever been visited (useful for testing).
   */
  has(obj: object): boolean {
    return this.visited.has(obj);
  }

  /**
   * Returns the unique ID of a previously visited object.
   * @throws If object has not been visited
   */
  getRefId(obj: object): number {
    const state = this.visited.get(obj);
    if (!state) throw new Error('Object not tracked');
    return state.id;
  }

  /**
   * Returns the original path where the object was first encountered.
   * @throws If object has not been visited
   */
  getOriginalPath(obj: object): string {
    const state = this.visited.get(obj);
    if (!state) throw new Error('Object not tracked');
    return state.path;
  }
}