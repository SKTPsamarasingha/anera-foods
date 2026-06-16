import { db as firestoreDb } from "@/lib/firebase";
import { DEFAULT_ROLES } from "@/lib/rbac";

const DEFAULT_USERS = [
  {
    uuid: "usr_superadmin_001",
    name: "Anera Owner",
    email: "superadmin@anera.foods",
    phone: "+94771234567",
    roleId: "superadmin",
    passwordHash:
      "12e9e4d2b4194bd441cf4691b928c18f77f9559a7baec4dc30849c3a53a6bbb7",
    passwordSalt: "a1b2c3d4e5f6a7b8a1b2c3d4e5f6a7b8",
    createdAt: "2024-01-01T00:00:00.000Z",
  },
  {
    uuid: "usr_admin_001",
    name: "Staff Member",
    email: "staff@anera.foods",
    phone: "+94777654321",
    roleId: "admin",
    passwordHash:
      "c0d66c43bdfe3e16fa17ecd16012eda1ec5265bf4ee3be15185b50818fa268f1",
    passwordSalt: "b2c3d4e5f6a7b8a9b2c3d4e5f6a7b8a9",
    createdAt: "2024-01-01T00:00:00.000Z",
  },
  {
    uuid: "usr_customer_001",
    name: "Test Customer",
    email: "customer@anera.foods",
    phone: "+94779876543",
    roleId: "customer",
    passwordHash:
      "3875ed701d4d870bdc5d5e854ab16a1cb9f9c64c200d2699bb393923d55c3207",
    passwordSalt: "c3d4e5f6a7b8a9b0c3d4e5f6a7b8a9b0",
    createdAt: "2024-01-01T00:00:00.000Z",
  },
];

const DEFAULT_PRODUCTS = [
  {
    id: "prod_001",
    name: "Spiced Deviled Cashews",
    sku: "ANR-CAS-DEV-250",
    category: "snacks",
    price: 1850,
    description:
      "Premium Sri Lankan cashews slow-roasted and tossed with crushed red chili, pepper, sea salt, and aromatic curry leaves.",
    weight: "250g",
    stockQuantity: 45,
    availabilityStatus: "in-stock",
    images: [
      "https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?auto=format&fit=crop&w=600&q=80",
    ],
  },
  {
    id: "prod_002",
    name: "Traditional Pol Roti Mix",
    sku: "ANR-ROT-POL-500",
    category: "ready-to-eat",
    price: 850,
    description:
      "Authentic pre-measured mix of high-grade wheat flour, fresh dehydrated grated coconut, green chilies, and onion flakes.",
    weight: "500g",
    stockQuantity: 8,
    availabilityStatus: "low-stock",
    images: [
      "https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=600&q=80",
    ],
  },
  {
    id: "prod_003",
    name: "Katta Sambol Paste",
    sku: "ANR-SAM-KAT-300",
    category: "specialty",
    price: 950,
    description:
      "Traditional hot chili condiment ground with Maldive fish, red onions, lime, and salt.",
    weight: "300g",
    stockQuantity: 18,
    availabilityStatus: "in-stock",
    images: [
      "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=600&q=80",
    ],
  },
  {
    id: "prod_004",
    name: "Maldive Fish Sambol",
    sku: "ANR-SAM-MAL-200",
    category: "specialty",
    price: 1100,
    description:
      "Crispy and caramelized spicy onion sambol infused with premium cured Maldive fish chips.",
    weight: "200g",
    stockQuantity: 30,
    availabilityStatus: "in-stock",
    images: [
      "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80",
    ],
  },
  {
    id: "prod_005",
    name: "Spiced Banana Blossom Cutlets",
    sku: "ANR-CUT-BAN-10",
    category: "ready-to-eat",
    price: 1200,
    description:
      "Pre-crumbed, spiced vegetarian croquettes made from banana blossom. Box of 10.",
    weight: "400g",
    stockQuantity: 0,
    availabilityStatus: "out-of-stock",
    images: [
      "https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=600&q=80",
    ],
  },
  {
    id: "prod_006",
    name: "Sweet Amber Jaggery Halwa",
    sku: "ANR-SWE-JAG-400",
    category: "snacks",
    price: 1400,
    description:
      "Rich, dense traditional dessert sweetened with 100% pure kithul jaggery and coconut milk.",
    weight: "400g",
    stockQuantity: 22,
    availabilityStatus: "in-stock",
    images: [
      "https://images.unsplash.com/photo-1587314168485-3236d6710814?auto=format&fit=crop&w=600&q=80",
    ],
  },
  {
    id: "prod_007",
    name: "Pure Kithul Treacle Syrup",
    sku: "ANR-SYR-KIT-750",
    category: "specialty",
    price: 2450,
    description:
      "Pure, thick, golden syrup tapped from the inflorescence of the Kithul palm.",
    weight: "750ml",
    stockQuantity: 15,
    availabilityStatus: "in-stock",
    images: [
      "https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?auto=format&fit=crop&w=600&q=80",
    ],
  },
  {
    id: "prod_008",
    name: "Crispy Fried Bittergourd Chips",
    sku: "ANR-CHP-BIT-150",
    category: "snacks",
    price: 650,
    description:
      "Thin slices of bittergourd spiced with turmeric, salt, and chili, deep-fried to absolute crispiness.",
    weight: "150g",
    stockQuantity: 40,
    availabilityStatus: "in-stock",
    images: [
      "https://images.unsplash.com/photo-1618040996337-56904b7850b9?auto=format&fit=crop&w=600&q=80",
    ],
  },
];

let seedPromise = null;

async function ensureSeeded() {
  if (seedPromise) return seedPromise;

  seedPromise = (async () => {
    const metaRef = firestoreDb.collection("meta").doc("seed");
    const meta = await metaRef.get();
    if (meta.exists) return;

    const batch = firestoreDb.batch();

    for (const [id, role] of Object.entries(DEFAULT_ROLES)) {
      batch.set(firestoreDb.collection("roles").doc(id), role);
    }

    for (const user of DEFAULT_USERS) {
      batch.set(firestoreDb.collection("users").doc(user.uuid), user);
    }

    for (const product of DEFAULT_PRODUCTS) {
      batch.set(firestoreDb.collection("products").doc(product.id), product);
    }

    batch.set(metaRef, { seededAt: new Date().toISOString(), version: 1 });
    await batch.commit();
  })();

  return seedPromise;
}

function stockStatus(qty) {
  if (qty === 0) return "out-of-stock";
  if (qty < 10) return "low-stock";
  return "in-stock";
}

export const dbServer = {
  // ─── Roles (RBAC) ───────────────────────────────────────────
  getRoles: async () => {
    await ensureSeeded();
    const snap = await firestoreDb.collection("roles").get();
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  },

  getRoleById: async (roleId) => {
    await ensureSeeded();
    const doc = await firestoreDb.collection("roles").doc(roleId).get();
    return doc.exists ? { id: doc.id, ...doc.data() } : null;
  },

  seedDatabase: async () => {
    await ensureSeeded();
    return true;
  },

  createRole: async ({ id, name, permissions }) => {
    const roleId = id.trim().toLowerCase().replace(/\s+/g, "_");
    const existing = await dbServer.getRoleById(roleId);
    if (existing) return null;

    const role = {
      id: roleId,
      name,
      permissions,
      isSystem: false,
      createdAt: new Date().toISOString(),
    };
    await firestoreDb.collection("roles").doc(roleId).set(role);
    return role;
  },

  updateRole: async (roleId, updates) => {
    const role = await dbServer.getRoleById(roleId);
    if (!role) return null;
    if (role.isSystem && roleId === "superadmin") {
      return null;
    }

    const payload = { updatedAt: new Date().toISOString() };
    if (updates.name !== undefined) payload.name = updates.name;
    if (updates.permissions !== undefined)
      payload.permissions = updates.permissions;

    await firestoreDb.collection("roles").doc(roleId).update(payload);
    return { ...role, ...payload };
  },

  deleteRole: async (roleId) => {
    const role = await dbServer.getRoleById(roleId);
    if (!role || role.isSystem) return false;

    const usersSnap = await firestoreDb
      .collection("users")
      .where("roleId", "==", roleId)
      .limit(1)
      .get();
    if (!usersSnap.empty) return false;

    await firestoreDb.collection("roles").doc(roleId).delete();
    return true;
  },

  updateUserRole: async (uuid, roleId) => {
    const role = await dbServer.getRoleById(roleId);
    if (!role) return null;

    const userRef = firestoreDb.collection("users").doc(uuid);
    const userDoc = await userRef.get();
    if (!userDoc.exists) return null;

    await userRef.update({ roleId, updatedAt: new Date().toISOString() });
    const data = userDoc.data();
    const { passwordHash, passwordSalt, ...safe } = data;
    return { ...safe, roleId, role: roleId };
  },

  // ─── Users ────────────────────────────────────────────────────
  getUserByEmail: async (email) => {
    await ensureSeeded();
    const snap = await firestoreDb
      .collection("users")
      .where("email", "==", email.toLowerCase())
      .limit(1)
      .get();
    if (snap.empty) return null;
    const doc = snap.docs[0];
    return { uuid: doc.id, ...doc.data() };
  },

  getUserByUuid: async (uuid) => {
    await ensureSeeded();
    const doc = await firestoreDb.collection("users").doc(uuid).get();
    return doc.exists ? { uuid: doc.id, ...doc.data() } : null;
  },

  createUser: async (userData) => {
    await ensureSeeded();
    const existing = await dbServer.getUserByEmail(userData.email);
    if (existing) return null;

    const newUser = {
      uuid: "usr_" + Date.now() + "_" + Math.random().toString(36).substr(2, 6),
      roleId: userData.roleId || "customer",
      createdAt: new Date().toISOString(),
      ...userData,
      email: userData.email.toLowerCase().trim(),
    };

    await firestoreDb.collection("users").doc(newUser.uuid).set(newUser);
    return newUser;
  },

  getAllUsers: async () => {
    await ensureSeeded();
    const snap = await firestoreDb.collection("users").get();
    return snap.docs.map((doc) => {
      const { passwordHash, passwordSalt, ...rest } = doc.data();
      return { uuid: doc.id, ...rest, role: rest.roleId };
    });
  },

  // ─── Products ─────────────────────────────────────────────────
  getProducts: async () => {
    await ensureSeeded();
    const snap = await firestoreDb.collection("products").get();
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  },

  getProductById: async (id) => {
    await ensureSeeded();
    const doc = await firestoreDb.collection("products").doc(id).get();
    return doc.exists ? { id: doc.id, ...doc.data() } : null;
  },

  saveProduct: async (product) => {
    await ensureSeeded();
    const db = firestoreDb;
    const id = product.id || "prod_" + Date.now();
    const existing = product.id
      ? await dbServer.getProductById(product.id)
      : null;

    const updatedProduct = {
      ...product,
      id,
      availabilityStatus: stockStatus(product.stockQuantity),
      updatedAt: new Date().toISOString(),
    };

    if (!existing) {
      updatedProduct.createdAt = new Date().toISOString();
      await dbServer._logInventoryChange(id, {
        type: "stock-in",
        quantityChange: updatedProduct.stockQuantity,
        previousQuantity: 0,
        newQuantity: updatedProduct.stockQuantity,
        reason: "Product created",
      });
    } else if (existing.stockQuantity !== product.stockQuantity) {
      await dbServer._logInventoryChange(id, {
        type:
          product.stockQuantity > existing.stockQuantity
            ? "stock-in"
            : "adjustment",
        quantityChange: Math.abs(
          product.stockQuantity - existing.stockQuantity,
        ),
        previousQuantity: existing.stockQuantity,
        newQuantity: product.stockQuantity,
        reason: "Admin inventory edit (Manual update)",
      });
    }

    await db
      .collection("products")
      .doc(id)
      .set(updatedProduct, { merge: true });
    return updatedProduct;
  },

  archiveProduct: async (id) => {
    await firestoreDb.collection("products").doc(id).delete();
    return true;
  },

  // ─── Orders ───────────────────────────────────────────────────
  getOrders: async () => {
    await ensureSeeded();
    const snap = await firestoreDb
      .collection("orders")
      .orderBy("createdAt", "desc")
      .get();
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  },

  getOrderById: async (id) => {
    const doc = await firestoreDb.collection("orders").doc(id).get();
    return doc.exists ? { id: doc.id, ...doc.data() } : null;
  },

  trackOrder: async (orderNumber, phone) => {
    await ensureSeeded();

    const cleanPhone = (ph) => ph.replace(/[^0-9]/g, "");
    const orderNumberQuery = orderNumber?.trim().toLowerCase() || "";
    const phoneQuery = phone?.trim() ? cleanPhone(phone) : "";

    if (!orderNumberQuery && !phoneQuery) {
      return null;
    }

    if (orderNumberQuery) {
      const snap = await firestoreDb
        .collection("orders")
        .where("orderNumberLower", "==", orderNumberQuery)
        .limit(10)
        .get();

      const results = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      if (phoneQuery) {
        return (
          results.find(
            (o) => cleanPhone(o.customer?.phone || "") === phoneQuery,
          ) || null
        );
      }
      return results[0] || null;
    }

    const snap = await firestoreDb.collection("orders").get();
    return (
      snap.docs
        .map((d) => ({ id: d.id, ...d.data() }))
        .find((o) => cleanPhone(o.customer?.phone || "") === phoneQuery) || null
    );
  },

  getOrdersByCustomer: async (customerUuid) => {
    await ensureSeeded();
    const snap = await firestoreDb
      .collection("orders")
      .where("customer.uuid", "==", customerUuid)
      .get();

    return snap.docs
      .map((d) => ({ id: d.id, ...d.data() }))
      .sort((a, b) => {
        const aTime = new Date(a.createdAt).getTime();
        const bTime = new Date(b.createdAt).getTime();
        return bTime - aTime;
      });
  },

  createOrder: async (orderData) => {
    await ensureSeeded();
    const db = firestoreDb;
    const countSnap = await db.collection("orders").get();

    const count = countSnap.size + 1001;
    const year = new Date().getFullYear();
    const orderNumber = `ANR-${year}-${count}`;
    const id = "ord_" + Date.now();

    const newOrder = {
      id,
      orderNumber,
      orderNumberLower: orderNumber.toLowerCase(),
      status: "Pending",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...orderData,
    };

    for (const item of newOrder.items) {
      const prod = await dbServer.getProductById(item.productId);
      if (prod) {
        const oldStock = prod.stockQuantity;
        const newStock = Math.max(0, oldStock - item.quantity);
        await db
          .collection("products")
          .doc(prod.id)
          .update({
            stockQuantity: newStock,
            availabilityStatus: stockStatus(newStock),
            updatedAt: new Date().toISOString(),
          });
        await dbServer._logInventoryChange(prod.id, {
          type: "sale",
          quantityChange: item.quantity,
          previousQuantity: oldStock,
          newQuantity: newStock,
          reason: `Customer Purchase order ${orderNumber}`,
        });
      }
    }

    await db.collection("orders").doc(id).set(newOrder);
    await dbServer.logPixelEvent("Purchase", {
      orderNumber: newOrder.orderNumber,
      value: newOrder.totalAmount,
      currency: "LKR",
      itemCount: newOrder.items.length,
    });

    return newOrder;
  },

  updateOrderStatus: async (id, status) => {
    const db = firestoreDb;
    const doc = await db.collection("orders").doc(id).get();
    if (!doc.exists) return null;

    const order = { id: doc.id, ...doc.data() };
    const prevStatus = order.status;

    if (status === "Cancelled" && prevStatus !== "Cancelled") {
      for (const item of order.items) {
        const prod = await dbServer.getProductById(item.productId);
        if (prod) {
          const oldStock = prod.stockQuantity;
          const newStock = oldStock + item.quantity;
          await db
            .collection("products")
            .doc(prod.id)
            .update({
              stockQuantity: newStock,
              availabilityStatus: stockStatus(newStock),
              updatedAt: new Date().toISOString(),
            });
          await dbServer._logInventoryChange(prod.id, {
            type: "adjustment",
            quantityChange: item.quantity,
            previousQuantity: oldStock,
            newQuantity: newStock,
            reason: `Restored from Cancelled order ${order.orderNumber}`,
          });
        }
      }
    }

    await db.collection("orders").doc(id).update({
      status,
      updatedAt: new Date().toISOString(),
    });

    return { ...order, status, updatedAt: new Date().toISOString() };
  },

  // ─── Inventory logs ───────────────────────────────────────────
  getInventoryLogs: async () => {
    await ensureSeeded();
    const snap = await firestoreDb
      .collection("inventory_logs")
      .orderBy("timestamp", "desc")
      .get();
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  },

  _logInventoryChange: async (productId, logDetails) => {
    const product = await dbServer.getProductById(productId);
    const id = "log_" + Date.now() + Math.random().toString(36).substr(2, 5);
    const newLog = {
      id,
      productId,
      productName: product?.name || "Unknown Product",
      sku: product?.sku || "",
      timestamp: new Date().toISOString(),
      ...logDetails,
    };
    await firestoreDb.collection("inventory_logs").doc(id).set(newLog);
    return newLog;
  },

  // ─── Pixel logs ───────────────────────────────────────────────
  getPixelLogs: async () => {
    await ensureSeeded();
    const snap = await firestoreDb
      .collection("pixel_logs")
      .orderBy("timestamp", "desc")
      .get();
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  },

  logPixelEvent: async (eventName, data = {}) => {
    const id = "px_" + Date.now() + Math.random().toString(36).substr(2, 5);
    const newPixelLog = {
      id,
      eventName,
      timestamp: new Date().toISOString(),
      data,
    };
    await firestoreDb.collection("pixel_logs").doc(id).set(newPixelLog);
    return newPixelLog;
  },
};

// Backward-compatible alias for auth routes
// export const db = dbServer;
