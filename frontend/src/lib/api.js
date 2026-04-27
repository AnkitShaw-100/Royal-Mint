// API client for the Royal Mint Express backend.
// Reads VITE_API_URL at build time. Falls back to localhost:5000/api in dev.

// const RAW_API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:5000";
const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:5000/api";

export class ApiError extends Error {
  constructor(status, message, body) {
    super(message);
    this.status = status;
    this.body = body;
  }
}

async function request(path, options = {}) {
  const { method = "GET", body, clerkId } = options;
  const headers = {
    "Content-Type": "application/json",
  };
  if (clerkId) headers["x-clerk-id"] = clerkId;

  const res = await fetch(`${API_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  const contentType = res.headers.get("content-type") ?? "";
  const data = contentType.includes("application/json")
    ? await res.json()
    : await res.text();

  if (!res.ok) {
    const message =
      typeof data === "object" && data && "message" in data
        ? String(data.message)
        : `Request failed with status ${res.status}`;
    throw new ApiError(res.status, message, data);
  }

  return data;
}

function pick(data, key, fallback = null) {
  if (data && typeof data === "object" && key in data) return data[key];
  return fallback;
}

// ---------- API ----------
export const api = {
  users: {
    save: (clerkId, payload) =>
      request("/users/save", { method: "POST", body: payload, clerkId }).then(
        (data) => pick(data, "user", data),
      ),
    me: (clerkId) =>
      request(`/users/${clerkId}`, { clerkId }).then((data) =>
        pick(data, "user", data),
      ),
  },
  accounts: {
    list: (clerkId) =>
      request("/accounts/", { clerkId }).then((data) =>
        pick(data, "accounts", []),
      ),
    create: (clerkId, payload = {}) =>
      request("/accounts/create", {
        method: "POST",
        body: { currency: "INR", status: "ACTIVE", ...payload },
        clerkId,
      }).then((data) => pick(data, "account", data)),
    get: (clerkId, accountId) =>
      request(`/accounts/${accountId}`, { clerkId }).then((data) =>
        pick(data, "account", data),
      ),
    balance: (clerkId, accountId) =>
      request(`/accounts/${accountId}/balance`, { clerkId }).then((data) => {
        const raw = pick(data, "balance", data);
        if (raw && typeof raw === "object" && "balance" in raw) {
          return { ...raw, balance: Number(raw.balance || 0) };
        }
        return { balance: Number(raw || 0) };
      }),
    ledger: (clerkId, accountId) =>
      request(`/accounts/${accountId}/ledger`, { clerkId }).then((data) =>
        pick(data, "ledger", []),
      ),
    allLedger: (clerkId) =>
      request("/accounts/ledger/all", { clerkId }).then((data) =>
        pick(data, "ledger", []),
      ),
    setStatus: (clerkId, accountId, status) =>
      request(`/accounts/${accountId}/status`, {
        method: "PUT",
        body: { status },
        clerkId,
      }).then((data) => pick(data, "account", data)),
    remove: (clerkId, accountId) =>
      request(`/accounts/${accountId}`, {
        method: "DELETE",
        clerkId,
      }),
  },
  transactions: {
    list: (clerkId) =>
      request("/transactions/", { clerkId }).then((data) =>
        pick(data, "transactions", []),
      ),
    create: (clerkId, payload) =>
      request("/transactions/create", {
        method: "POST",
        body: payload,
        clerkId,
      }).then((data) => pick(data, "transaction", data)),
    get: (clerkId, id) =>
      request(`/transactions/${id}`, { clerkId }).then((data) =>
        pick(data, "transaction", data),
      ),
    setStatus: (clerkId, id, status) =>
      request(`/transactions/${id}/status`, {
        method: "PUT",
        body: { status },
        clerkId,
      }).then((data) => pick(data, "transaction", data)),
  },
};

export const formatCurrency = (amount, currency = "INR") =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  }).format(amount);
