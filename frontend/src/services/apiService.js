// Backend API Service
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

/**
 * Get authentication header
 */
const getAuthHeader = (clerkId) => ({
  'Content-Type': 'application/json',
  'x-clerk-id': clerkId,
});

/**
 * Handle API response
 */
const handleResponse = async (response) => {
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.message || 'API Error');
  }
  
  return data;
};

// ============================================================
// USER APIS
// ============================================================

export const userAPI = {
  /**
   * Create or update user (sync from Clerk)
   */
  saveOrUpdateUser: async (userData) => {
    const response = await fetch(`${API_BASE_URL}/users/save`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });
    return handleResponse(response);
  },

  /**
   * Get all users
   */
  getAllUsers: async (clerkId) => {
    const response = await fetch(`${API_BASE_URL}/users/`, {
      method: 'GET',
      headers: getAuthHeader(clerkId),
    });
    return handleResponse(response);
  },

  /**
   * Get user by clerk ID
   */
  getUserByClerkId: async (clerkId, authClerkId) => {
    const response = await fetch(`${API_BASE_URL}/users/${clerkId}`, {
      method: 'GET',
      headers: getAuthHeader(authClerkId),
    });
    return handleResponse(response);
  },
};

// ============================================================
// ACCOUNT APIS
// ============================================================

export const accountAPI = {
  /**
   * Create new account
   */
  createAccount: async (accountData, clerkId) => {
    const response = await fetch(`${API_BASE_URL}/accounts/create`, {
      method: 'POST',
      headers: getAuthHeader(clerkId),
      body: JSON.stringify(accountData),
    });
    return handleResponse(response);
  },

  /**
   * Get all user's accounts
   */
  getUserAccounts: async (clerkId) => {
    const response = await fetch(`${API_BASE_URL}/accounts/`, {
      method: 'GET',
      headers: getAuthHeader(clerkId),
    });
    return handleResponse(response);
  },

  /**
   * Get account by ID
   */
  getAccountById: async (accountId, clerkId) => {
    const response = await fetch(`${API_BASE_URL}/accounts/${accountId}`, {
      method: 'GET',
      headers: getAuthHeader(clerkId),
    });
    return handleResponse(response);
  },

  /**
   * Get account balance
   */
  getAccountBalance: async (accountId, clerkId) => {
    const response = await fetch(`${API_BASE_URL}/accounts/${accountId}/balance`, {
      method: 'GET',
      headers: getAuthHeader(clerkId),
    });
    return handleResponse(response);
  },

  /**
   * Update account status
   */
  updateAccountStatus: async (accountId, status, clerkId) => {
    const response = await fetch(`${API_BASE_URL}/accounts/${accountId}/status`, {
      method: 'PUT',
      headers: getAuthHeader(clerkId),
      body: JSON.stringify({ status }),
    });
    return handleResponse(response);
  },

  /**
   * Delete account (soft delete)
   */
  deleteAccount: async (accountId, clerkId) => {
    const response = await fetch(`${API_BASE_URL}/accounts/${accountId}`, {
      method: 'DELETE',
      headers: getAuthHeader(clerkId),
    });
    return handleResponse(response);
  },

  /**
   * Get account ledger entries
   */
  getAccountLedger: async (accountId, clerkId) => {
    const response = await fetch(`${API_BASE_URL}/accounts/${accountId}/ledger`, {
      method: 'GET',
      headers: getAuthHeader(clerkId),
    });
    return handleResponse(response);
  },

  /**
   * Get all ledger entries for user (across all accounts)
   */
  getUserLedger: async (clerkId) => {
    const response = await fetch(`${API_BASE_URL}/accounts/ledger/all`, {
      method: 'GET',
      headers: getAuthHeader(clerkId),
    });
    return handleResponse(response);
  },
};

// ============================================================
// TRANSACTION APIS
// ============================================================

export const transactionAPI = {
  /**
   * Create transaction (transfer money)
   */
  createTransaction: async (transactionData, clerkId) => {
    const response = await fetch(`${API_BASE_URL}/transactions/create`, {
      method: 'POST',
      headers: getAuthHeader(clerkId),
      body: JSON.stringify(transactionData),
    });
    return handleResponse(response);
  },

  /**
   * Get all user's transactions
   */
  getUserTransactions: async (clerkId, status = null) => {
    let url = `${API_BASE_URL}/transactions/`;
    if (status) {
      url += `?status=${status}`;
    }
    const response = await fetch(url, {
      method: 'GET',
      headers: getAuthHeader(clerkId),
    });
    return handleResponse(response);
  },

  /**
   * Get transaction by ID
   */
  getTransactionById: async (transactionId, clerkId) => {
    const response = await fetch(`${API_BASE_URL}/transactions/${transactionId}`, {
      method: 'GET',
      headers: getAuthHeader(clerkId),
    });
    return handleResponse(response);
  },

  /**
   * Update transaction status
   */
  updateTransactionStatus: async (transactionId, status, clerkId) => {
    const response = await fetch(`${API_BASE_URL}/transactions/${transactionId}/status`, {
      method: 'PUT',
      headers: getAuthHeader(clerkId),
      body: JSON.stringify({ status }),
    });
    return handleResponse(response);
  },
};

// ============================================================
// HELPER FUNCTIONS
// ============================================================

/**
 * Generate unique idempotency key
 */
export const generateIdempotencyKey = () => {
  return `txn-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Format amount as currency
 */
export const formatCurrency = (amount, currency = 'INR') => {
  const formatter = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return formatter.format(amount);
};

/**
 * Format date
 */
export const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

/**
 * Format time
 */
export const formatTime = (dateString) => {
  return new Date(dateString).toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
  });
};
