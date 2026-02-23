// =====================================================
// ADMIN LOCAL STORAGE API
// =====================================================
// Admin operations using localStorage
// =====================================================

import {
  localBooksApi,
  localSubjectsApi,
  localSectionsApi,
  localBookRequestsApi,
  localStorageApi,
  localDatabaseApi,
} from './local-storage';

// =====================================================
// ADMIN BOOKS API
// =====================================================

export const adminBooksApi = localBooksApi;

// =====================================================
// ADMIN SUBJECTS API
// =====================================================

export const adminSubjectsApi = localSubjectsApi;

// =====================================================
// ADMIN SECTIONS API
// =====================================================

export const adminSectionsApi = localSectionsApi;

// =====================================================
// ADMIN BOOK REQUESTS API
// =====================================================

export const adminBookRequestsApi = localBookRequestsApi;

// =====================================================
// ADMIN DATABASE OPERATIONS
// =====================================================

export const adminDatabaseApi = localDatabaseApi;

// =====================================================
// ADMIN STORAGE API
// =====================================================

export const adminStorageApi = localStorageApi;
