import type { IDataAccess } from './dataAccess';
import { LocalStorageDataAccess } from './localStorageDataAccess';
import { features } from '../config/features';

/**
 * Factory function to get the appropriate data access implementation
 * Currently returns localStorage implementation, but can be extended to return
 * cloud storage implementation based on feature flags
 */
export function getDataAccess(): IDataAccess {
    // In the future, this will check features.useCloudStorage
    // and return CloudDataAccess when enabled
    if (features.useCloudStorage) {
        // TODO: Implement CloudDataAccess
        console.warn('Cloud storage not yet implemented, falling back to localStorage');
    }

    return new LocalStorageDataAccess();
}

// Export singleton instance
export const dataAccess = getDataAccess();
