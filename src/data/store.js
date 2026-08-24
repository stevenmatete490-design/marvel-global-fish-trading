import { products as catalogProducts } from "./products";

export const DATA_CHANGE_EVENT = "marvel-data-change";
const KEYS = {
  products: "marvel_products_v1",
  customers: "marvel_customers_v1",
  orders: "marvel_orders_v1",
};

const productSeeds = catalogProducts.map((product, index) => ({
  ...product,
  id: `PRD-${String(index + 1).padStart(3, "0")}`,
  price: ["$8.50 / KG", "$5.80 / KG", "$4.90 / KG", "$12.40 / KG", "$7.80 / KG", "$9.50 / KG"][index] || "$0.00 / KG",
  status: index === 3 ? "LOW STOCK" : "AVAILABLE",
}));

const customerSeeds = [
  { id: "CUS-001", name: "John Smith Trading", email: "john@johnsmithtrading.com", phone: "+1 555 014 2201", country: "United States", status: "ACTIVE", orders: 1, balance: "$0" },
  { id: "CUS-002", name: "Gulf Seafood LLC", email: "accounts@gulfseafood.com", phone: "+971 50 442 1188", country: "United Arab Emirates", status: "ACTIVE", orders: 1, balance: "$7,200" },
  { id: "CUS-003", name: "Ocean Foods Ltd", email: "sales@oceanfoods.com", phone: "+44 20 7946 0192", country: "United Kingdom", status: "ACTIVE", orders: 1, balance: "$0" },
  { id: "CUS-004", name: "Blue Coast Trading", email: "info@bluecoast.com", phone: "+254 712 456 789", country: "Kenya", status: "PENDING", orders: 1, balance: "$6,150" },
];

const orderSeeds = [
  { id: "ORD-MAR-001", customerId: "CUS-001", customer: "John Smith Trading", productId: "PRD-003", product: "Frozen Mackerel", quantity: "2,000 KG", destination: "Dubai, UAE", origin: "Mombasa, Kenya", date: "24 Aug 2026", status: "IN TRANSIT", payment: "PAID", delivery: "02 Sep 2026", invoice: "MAR-001" },
  { id: "ORD-MAR-002", customerId: "CUS-002", customer: "Gulf Seafood LLC", productId: "PRD-004", product: "Premium Shrimp", quantity: "1,500 KG", destination: "Doha, Qatar", origin: "Mombasa, Kenya", date: "23 Aug 2026", status: "PROCESSING", payment: "PENDING", delivery: "08 Sep 2026", invoice: "MAR-002" },
  { id: "ORD-MAR-003", customerId: "CUS-003", customer: "Ocean Foods Ltd", productId: "PRD-001", product: "Fresh Tilapia", quantity: "1,000 KG", destination: "Nairobi, Kenya", origin: "Dar es Salaam, Tanzania", date: "22 Aug 2026", status: "DELIVERED", payment: "PAID", delivery: "18 Aug 2026", invoice: "MAR-003" },
  { id: "ORD-MAR-004", customerId: "CUS-004", customer: "Blue Coast Trading", productId: "PRD-002", product: "Frozen Tilapia", quantity: "3,000 KG", destination: "Mombasa, Kenya", origin: "Mombasa, Kenya", date: "21 Aug 2026", status: "PENDING", payment: "PENDING", delivery: "12 Sep 2026", invoice: "MAR-004" },
];

function read(key, fallback) {
  if (typeof window === "undefined") return fallback;
  try {
    const value = window.localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
}

function commit(key, value) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(key, JSON.stringify(value));
  window.dispatchEvent(new CustomEvent(DATA_CHANGE_EVENT, { detail: { key } }));
}

export function getProducts() { return read(KEYS.products, productSeeds); }
export function saveProducts(products) { commit(KEYS.products, products); }
export function getCustomers() { return read(KEYS.customers, customerSeeds); }
export function saveCustomers(customers) { commit(KEYS.customers, customers); }
export function getOrders() { return read(KEYS.orders, orderSeeds); }

export function saveOrders(orders) {
  commit(KEYS.orders, orders);
  const counts = orders.reduce((result, order) => {
    if (order.customerId) result[order.customerId] = (result[order.customerId] || 0) + 1;
    return result;
  }, {});
  const customers = getCustomers().map((customer) => ({
    ...customer,
    orders: counts[customer.id] || 0,
  }));
  commit(KEYS.customers, customers);
}

export function nextId(prefix, records) {
  const highest = records.reduce((max, record) => {
    const match = String(record.id).match(/(\d+)$/);
    return Math.max(max, match ? Number(match[1]) : 0);
  }, 0);
  return `${prefix}-${String(highest + 1).padStart(3, "0")}`;
}

export function subscribeToDataChanges(callback) {
  if (typeof window === "undefined") return () => {};
  const handler = () => callback();
  window.addEventListener(DATA_CHANGE_EVENT, handler);
  window.addEventListener("storage", handler);
  return () => {
    window.removeEventListener(DATA_CHANGE_EVENT, handler);
    window.removeEventListener("storage", handler);
  };
}
