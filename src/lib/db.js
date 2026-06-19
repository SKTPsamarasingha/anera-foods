// Client-side database proxy — all reads/writes go through /api/db (Firebase on server)

async function callDb(action, args = []) {
  const res = await fetch("/api/db", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action, args }),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || "Database request failed");
  }
  return data.result;
}

export const db = {
  getProducts: () => callDb("getProducts"),
  getProductById: (id) => callDb("getProductById", [id]),
  saveProduct: (product) => callDb("saveProduct", [product]),
  archiveProduct: (id) => callDb("archiveProduct", [id]),

  getOrders: () => callDb("getOrders"),
  getOrderById: (id) => callDb("getOrderById", [id]),
  trackOrder: (orderNumber, phone) =>
    callDb("trackOrder", [orderNumber, phone]),
  getOrdersByCustomer: () => callDb("getOrdersByCustomer"),
  createOrder: (orderData) => callDb("createOrder", [orderData]),
  updateOrderStatus: (id, status) => callDb("updateOrderStatus", [id, status]),

  getInventoryLogs: () => callDb("getInventoryLogs"),
  getPixelLogs: () => callDb("getPixelLogs"),
  logPixelEvent: (eventName, data) =>
    callDb("logPixelEvent", [eventName, data]),

  getAllUsers: () => callDb("getAllUsers"),
  updateUserRole: (uuid, roleId) => callDb("updateUserRole", [uuid, roleId]),

  getRoles: () => callDb("getRoles"),
  getRoleById: (roleId) => callDb("getRoleById", [roleId]),
  createRole: (roleData) => callDb("createRole", [roleData]),
  updateRole: (roleId, updates) => callDb("updateRole", [roleId, updates]),
  deleteRole: (roleId) => callDb("deleteRole", [roleId]),
  getSettings: () => callDb("getSettings"),
  updateSettings: (updates) => callDb("updateSettings", [updates]),
};
