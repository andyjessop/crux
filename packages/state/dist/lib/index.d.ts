/**
 * Create a store.
 */
export declare function createStore<T extends object>(initialState: T): {
    get: () => T;
    observe: <U extends object>(target: U, callback: (name: string, value: U) => void) => [U, Function];
    pause: () => void;
    resume: () => void;
    update: (callback: Function) => void;
};
