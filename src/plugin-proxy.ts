// This file exists to break the circular dependency between
// index.ts and configs/flat/base.ts

// Export a proxy object that will be filled in by index.ts
// This ensures flat configs and the main export use the same object
// eslint-disable-next-line @typescript-eslint/no-explicit-any -- proxy object
export const plugin: any = {};
