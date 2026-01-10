// This file exists to break the circular dependency between
// index.ts and configs/flat/base.ts

// Export a proxy that will be filled in by index.ts
export const plugin: any = {};
