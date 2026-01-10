// This file exists to break the circular dependency between
// index.ts and configs/flat/base.ts

// Export a proxy that will be filled in by index.ts
// eslint-disable-next-line @typescript-eslint/no-explicit-any -- proxy object
export const plugin: any = {};
