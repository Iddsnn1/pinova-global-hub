/**
 * Module 11 — Enterprise Developer Platform, Integration & Extensibility Engine
 * Main Facade & Module Exports
 */

import { EnterpriseDeveloperPlatformEngine } from './engine';
export * from './types';
export { EnterpriseDeveloperPlatformEngine };

export function getDeveloperPlatformEngine(): EnterpriseDeveloperPlatformEngine {
  return EnterpriseDeveloperPlatformEngine.getInstance();
}
