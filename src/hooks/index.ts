/**
 * Hooks Index
 * Centralized exports for all custom hooks
 */

export { useAuth } from './useAuth';
export { useMedicines } from './useMedicines';
export { useContacts } from './useContacts';

// Re-export for backward compatibility during migration
export { useAppStore } from '../store/store';

export default {};
