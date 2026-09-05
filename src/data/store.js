<<<<<<< HEAD
/* ============================================================
MARVEL GLOBAL FISH TRADING
CENTRAL DATA STORE
==================

File:
src/data/store.js

Storage:
Browser localStorage

Single source of truth for:

* Products
* Customers
* Orders
* Invoices
* Payments
* Shipments
* Company settings

Business flow:

Customer
↓
Order
↓
Product Stock
↓
Invoice
↓
Payment
↓
Shipment

============================================================ */

/* ============================================================
STORAGE KEYS
============================================================ */

const STORAGE_KEYS = {
products: "marvel_products",
customers: "marvel_customers",
orders: "marvel_orders",
invoices: "marvel_invoices",
payments: "marvel_payments",
shipments: "marvel_shipments",
settings: "marvel_company_settings",
};

/* ============================================================
DEFAULT PRODUCTS
============================================================ */

const DEFAULT_PRODUCTS = [
{
id: "PRD-001",
name: "Fresh Nile Perch",
category: "Fresh Fish",
origin: "Kenya",
unit: "Kg",
price: 650,
stock: 250,
status: "In Stock",
createdAt: new Date().toISOString(),
updatedAt: new Date().toISOString(),
},

{
id: "PRD-002",
name: "Fresh Tilapia",
category: "Fresh Fish",
origin: "Kenya",
unit: "Kg",
price: 550,
stock: 180,
status: "In Stock",
createdAt: new Date().toISOString(),
updatedAt: new Date().toISOString(),
},

{
id: "PRD-003",
name: "Frozen Nile Perch Fillets",
category: "Fish Fillets",
origin: "Kenya",
unit: "Kg",
price: 950,
stock: 75,
status: "Low Stock",
createdAt: new Date().toISOString(),
updatedAt: new Date().toISOString(),
},
];

/* ============================================================
DEFAULT COMPANY SETTINGS
============================================================ */

const DEFAULT_SETTINGS = {
companyName: "MARVEL GLOBAL FISH TRADING",
email: "[marvelglobal2020@gmail.com](mailto:marvelglobal2020@gmail.com)",
phone: "+254 793 609252",
notifications: true,
};

/* ============================================================
EVENT SYSTEM
============================================================ */

const listeners = new Set();

function notifyListeners(type = "") {
listeners.forEach((listener) => {
try {
listener(type);
} catch (error) {
console.error(
"MARVEL DATA STORE LISTENER ERROR:",
error
);
}
});
}

/* ============================================================
SUBSCRIBE TO STORE CHANGES
============================================================ */

export function subscribeToDataChanges(listener) {
if (typeof listener !== "function") {
return () => {};
}

listeners.add(listener);

return () => {
listeners.delete(listener);
};
}

/* ============================================================
LOCAL STORAGE
============================================================ */

function hasLocalStorage() {
try {
return (
typeof window !== "undefined" &&
window.localStorage !== undefined
);
} catch {
return false;
}
}

/* ============================================================
READ DATA
============================================================ */

function readData(key, fallback) {
if (!hasLocalStorage()) {
return fallback;
}

try {
const raw = window.localStorage.getItem(key);

if (raw === null) {
  return fallback;
}

const parsed = JSON.parse(raw);

return parsed;


} catch (error) {
console.error(
`MARVEL STORE READ ERROR [${key}]:`,
error
);


return fallback;


}
}

/* ============================================================
WRITE DATA
============================================================ */

function writeData(key, value) {
if (!hasLocalStorage()) {
console.error(
`MARVEL STORE WRITE ERROR: localStorage unavailable [${key}]`
);


return false;


}

try {
const serialized = JSON.stringify(value);


window.localStorage.setItem(
  key,
  serialized
);

const verification =
  window.localStorage.getItem(key);

if (verification !== serialized) {
  console.error(
    `MARVEL STORE WRITE VERIFICATION FAILED [${key}]`
  );

  return false;
}

notifyListeners(key);

return true;


} catch (error) {
console.error(
`MARVEL STORE WRITE ERROR [${key}]:`,
error
);


return false;


}
}

/* ============================================================
REMOVE DATA
============================================================ */

function removeData(key) {
if (!hasLocalStorage()) {
return false;
}

try {
window.localStorage.removeItem(key);


notifyListeners(key);

return true;


} catch (error) {
console.error(
`MARVEL STORE REMOVE ERROR [${key}]:`,
error
);


return false;


}
}

/* ============================================================
GENERIC HELPERS
============================================================ */

function normalizeNumber(value, fallback = 0) {
const number = Number(value);

return Number.isFinite(number)
? number
: fallback;
}

function positiveNumber(value) {
return Math.max(
0,
normalizeNumber(value, 0)
);
}

function cleanString(value, fallback = "") {
const result = String(
value ?? ""
).trim();

return result || fallback;
}

/* ============================================================
GENERIC ID GENERATOR
============================================================ */

export function nextId(
prefix,
items = []
) {
const safePrefix = String(
prefix || "ID"
)
.trim()
.toUpperCase()
.replace(/[^A-Z0-9_-]/g, "");

const safeItems = Array.isArray(items)
? items
: [];

let highestNumber = 0;

safeItems.forEach((item) => {
const id = String(
item?.id || ""
)
.trim()
.toUpperCase();


const match = id.match(
  new RegExp(
    `^${safePrefix}-(\\d+)$`
  )
);

if (match) {
  const number = Number(
    match[1]
  );

  if (
    Number.isFinite(number) &&
    number > highestNumber
  ) {
    highestNumber = number;
  }
}


});

return `${safePrefix}-${String(
    highestNumber + 1
  ).padStart(3, "0")}`;
}

/* ============================================================
PRODUCTS
============================================================ */

function getProductStatus(stock) {
const quantity = positiveNumber(stock);

if (quantity <= 0) {
return "Out of Stock";
}

if (quantity <= 50) {
return "Low Stock";
}

return "In Stock";
}

export function getProducts() {
const products = readData(
STORAGE_KEYS.products,
null
);

if (Array.isArray(products)) {
return products;
}

return DEFAULT_PRODUCTS.map(
(product) => ({
...product,
})
);
}

export function getProductById(
productId
) {
return (
getProducts().find(
(product) =>
product.id === productId
) || null
);
}

export function saveProducts(
products
) {
if (!Array.isArray(products)) {
console.error(
"saveProducts expected an array."
);


return false;


}

return writeData(
STORAGE_KEYS.products,
products
);
}

export function addProduct(
product = {}
) {
try {
const products = getProducts();


const name = cleanString(
  product.name
);

if (!name) {
  console.error(
    "MARVEL ADD PRODUCT: product name is required."
  );

  return null;
}

const stock = positiveNumber(
  product.stock
);

const newProduct = {
  id:
    cleanString(product.id) ||
    nextId(
      "PRD",
      products
    ),

  name,

  category: cleanString(
    product.category,
    "Fresh Fish"
  ),

  origin: cleanString(
    product.origin,
    "Kenya"
  ),

  unit: cleanString(
    product.unit,
    "Kg"
  ),

  price: positiveNumber(
    product.price
  ),

  stock,

  status:
    product.status ||
    getProductStatus(stock),

  createdAt:
    product.createdAt ||
    new Date().toISOString(),

  updatedAt:
    new Date().toISOString(),
};

const updatedProducts = [
  ...products,
  newProduct,
];

if (
  !saveProducts(
    updatedProducts
  )
) {
  return null;
}

return newProduct;


} catch (error) {
console.error(
"MARVEL ADD PRODUCT ERROR:",
error
);


return null;


}
}

export function updateProduct(
productId,
updates = {}
) {
try {
const products = getProducts();


const index = products.findIndex(
  (product) =>
    product.id === productId
);

if (index === -1) {
  console.error(
    "MARVEL UPDATE PRODUCT: product not found:",
    productId
  );

  return null;
}

const existingProduct =
  products[index];

const newStock =
  updates.stock !== undefined
    ? positiveNumber(
        updates.stock
      )
    : positiveNumber(
        existingProduct.stock
      );

const updatedProduct = {
  ...existingProduct,
  ...updates,

  id: existingProduct.id,

  name:
    updates.name !== undefined
      ? cleanString(
          updates.name
        )
      : existingProduct.name,

  category:
    updates.category !==
    undefined
      ? cleanString(
          updates.category
        )
      : existingProduct.category,

  origin:
    updates.origin !== undefined
      ? cleanString(
          updates.origin
        )
      : existingProduct.origin,

  unit:
    updates.unit !== undefined
      ? cleanString(
          updates.unit
        )
      : existingProduct.unit,

  price:
    updates.price !== undefined
      ? positiveNumber(
          updates.price
        )
      : positiveNumber(
          existingProduct.price
        ),

  stock: newStock,

  status:
    updates.status ||
    getProductStatus(
      newStock
    ),

  createdAt:
    existingProduct.createdAt ||
    new Date().toISOString(),

  updatedAt:
    new Date().toISOString(),
};

const updatedProducts = [
  ...products,
];

updatedProducts[index] =
  updatedProduct;

if (
  !saveProducts(
    updatedProducts
  )
) {
  return null;
}

return updatedProduct;


} catch (error) {
console.error(
"MARVEL UPDATE PRODUCT ERROR:",
error
);


return null;


}
}

export function deleteProduct(
productId
) {
try {
const products = getProducts();


const exists = products.some(
  (product) =>
    product.id === productId
);

if (!exists) {
  return null;
}

const updatedProducts =
  products.filter(
    (product) =>
      product.id !== productId
  );

return saveProducts(
  updatedProducts
)
  ? updatedProducts
  : null;


} catch (error) {
console.error(
"MARVEL DELETE PRODUCT ERROR:",
error
);


return null;


}
}

export function clearProducts() {
return saveProducts([]);
}

/* ============================================================
CUSTOMERS
============================================================ */

export function getCustomers() {
const customers = readData(
STORAGE_KEYS.customers,
[]
);

return Array.isArray(customers)
? customers
: [];
}

export function getCustomerById(
customerId
) {
return (
getCustomers().find(
(customer) =>
customer.id === customerId
) || null
);
}

export function saveCustomers(
customers
) {
if (!Array.isArray(customers)) {
console.error(
"saveCustomers expected an array."
);


return false;


}

return writeData(
STORAGE_KEYS.customers,
customers
);
}

export function addCustomer(
customer = {}
) {
try {
const customers =
getCustomers();


const name = cleanString(
  customer.name
);

const company = cleanString(
  customer.company
);

const email = cleanString(
  customer.email
);

if (!name && !company) {
  console.error(
    "MARVEL ADD CUSTOMER: name or company is required."
  );

  return null;
}

const duplicateEmail =
  email &&
  customers.some(
    (existingCustomer) =>
      String(
        existingCustomer.email ||
          ""
      )
        .trim()
        .toLowerCase() ===
      email.toLowerCase()
  );

if (duplicateEmail) {
  console.error(
    "MARVEL ADD CUSTOMER: email already exists."
  );

  return null;
}

const newCustomer = {
  id:
    cleanString(customer.id) ||
    nextId(
      "CUS",
      customers
    ),

  name,

  company,

  email,

  phone: cleanString(
    customer.phone
  ),

  country: cleanString(
    customer.country,
    "Kenya"
  ),

  status: cleanString(
    customer.status,
    "Active"
  ),

  orders: positiveNumber(
    customer.orders
  ),

  balance: positiveNumber(
    customer.balance
  ),

  createdAt:
    customer.createdAt ||
    new Date().toISOString(),

  updatedAt:
    new Date().toISOString(),
};

const updatedCustomers = [
  ...customers,
  newCustomer,
];

if (
  !saveCustomers(
    updatedCustomers
  )
) {
  return null;
}

return newCustomer;


} catch (error) {
console.error(
"MARVEL ADD CUSTOMER ERROR:",
error
);

return null;


}
}

export function updateCustomer(
customerId,
updates = {}
) {
try {
const customers =
getCustomers();


const index =
  customers.findIndex(
    (customer) =>
      customer.id ===
      customerId
  );

if (index === -1) {
  return null;
}

const existingCustomer =
  customers[index];

const updatedCustomer = {
  ...existingCustomer,
  ...updates,

  id: existingCustomer.id,

  name:
    updates.name !== undefined
      ? cleanString(
          updates.name
        )
      : existingCustomer.name,

  company:
    updates.company !== undefined
      ? cleanString(
          updates.company
        )
      : existingCustomer.company,

  email:
    updates.email !== undefined
      ? cleanString(
          updates.email
        )
      : existingCustomer.email,

  phone:
    updates.phone !== undefined
      ? cleanString(
          updates.phone
        )
      : existingCustomer.phone,

  country:
    updates.country !== undefined
      ? cleanString(
          updates.country
        )
      : existingCustomer.country,

  status:
    updates.status !== undefined
      ? cleanString(
          updates.status
        )
      : existingCustomer.status,

  orders:
    updates.orders !== undefined
      ? positiveNumber(
          updates.orders
        )
      : positiveNumber(
          existingCustomer.orders
        ),

  balance:
    updates.balance !== undefined
      ? positiveNumber(
          updates.balance
        )
      : positiveNumber(
          existingCustomer.balance
        ),

  createdAt:
    existingCustomer.createdAt ||
    new Date().toISOString(),

  updatedAt:
    new Date().toISOString(),
};

const updatedCustomers = [
  ...customers,
];

updatedCustomers[index] =
  updatedCustomer;

if (
  !saveCustomers(
    updatedCustomers
  )
) {
  return null;
}

return updatedCustomer;


} catch (error) {
console.error(
"MARVEL UPDATE CUSTOMER ERROR:",
error
);

return null;


}
}

export function deleteCustomer(
customerId
) {
try {
const customers =
getCustomers();


const exists =
  customers.some(
    (customer) =>
      customer.id ===
      customerId
  );

if (!exists) {
  return null;
}

const updatedCustomers =
  customers.filter(
    (customer) =>
      customer.id !==
      customerId
  );

return saveCustomers(
  updatedCustomers
)
  ? updatedCustomers
  : null;


} catch (error) {
console.error(
"MARVEL DELETE CUSTOMER ERROR:",
error
);


return null;

}
}

export function clearCustomers() {
return saveCustomers([]);
}

/* ============================================================
ORDERS
============================================================ */

export function getOrders() {
const orders = readData(
STORAGE_KEYS.orders,
[]
);

return Array.isArray(orders)
? orders
: [];
}

export function getOrderById(
orderId
) {
return (
getOrders().find(
(order) =>
order.id === orderId
) || null
);
}

export function saveOrders(
orders
) {
if (!Array.isArray(orders)) {
console.error(
"saveOrders expected an array."
);


return false;


}

return writeData(
STORAGE_KEYS.orders,
orders
);
}

export function calculateOrderTotals(
items = []
) {
if (!Array.isArray(items)) {
return {
subtotal: 0,
total: 0,
};
}

const subtotal = items.reduce(
(sum, item) => {
const quantity =
positiveNumber(
item.quantity
);


  const price =
    positiveNumber(
      item.price
    );

  return (
    sum +
    quantity * price
  );
},
0


);

return {
subtotal,
total: subtotal,
};
}

function normalizeOrderItems(
items
) {
if (!Array.isArray(items)) {
return [];
}

return items.map(
(item) => {
const quantity =
positiveNumber(
item.quantity
);


  const price =
    positiveNumber(
      item.price
    );

  return {
    productId:
      cleanString(
        item.productId
      ),

    productName:
      cleanString(
        item.productName ||
          item.name
      ),

    quantity,

    unit: cleanString(
      item.unit,
      "Kg"
    ),

    price,

    total:
      quantity * price,
  };
}


);
}

function aggregateOrderItems(
items = []
) {
const map = new Map();

items.forEach((item) => {
if (!item.productId) {
return;
}


const existing =
  map.get(item.productId);

if (existing) {
  existing.quantity +=
    item.quantity;

  existing.total =
    existing.quantity *
    existing.price;
} else {
  map.set(
    item.productId,
    {
      ...item,
    }
  );
}


});

return Array.from(
map.values()
);
}

/* ------------------------------------------------------------
STOCK VALIDATION
------------------------------------------------------------ */

function validateOrderStock(
items,
products,
previousItems = []
) {
const previousQuantities =
new Map();

previousItems.forEach(
(item) => {
const current =
previousQuantities.get(
item.productId
) || 0;


  previousQuantities.set(
    item.productId,
    current +
      positiveNumber(
        item.quantity
      )
  );
}


);

const requestedQuantities =
new Map();

items.forEach(
(item) => {
const current =
requestedQuantities.get(
item.productId
) || 0;


  requestedQuantities.set(
    item.productId,
    current +
      positiveNumber(
        item.quantity
      )
  );
}


);

for (
const [
productId,
requestedQuantity,
] of requestedQuantities
) {
const product =
products.find(
(item) =>
item.id === productId
);


if (!product) {
  return {
    valid: false,
    message: `Product ${productId} was not found.`,
  };
}

const oldQuantity =
  previousQuantities.get(
    productId
  ) || 0;

const stockAvailable =
  positiveNumber(
    product.stock
  );

const additionalRequired =
  Math.max(
    0,
    requestedQuantity -
      oldQuantity
  );

if (
  additionalRequired >
  stockAvailable
) {
  return {
    valid: false,
    message:
      `Insufficient stock for ${product.name}. ` +
      `Available: ${stockAvailable}, ` +
      `additional required: ${additionalRequired}.`,
  };
}


}

return {
valid: true,
};
}

/* ------------------------------------------------------------
ADD ORDER
------------------------------------------------------------ */

export function addOrder(
order = {}
) {
try {
const orders =
getOrders();


const customers =
  getCustomers();

const products =
  getProducts();

const customerId =
  cleanString(
    order.customerId
  );

if (!customerId) {
  console.error(
    "MARVEL ADD ORDER: customerId is required."
  );

  return null;
}

const customer =
  customers.find(
    (item) =>
      item.id === customerId
  );

if (!customer) {
  console.error(
    "MARVEL ADD ORDER: customer not found:",
    customerId
  );

  return null;
}

let items =
  normalizeOrderItems(
    order.items
  );

items =
  aggregateOrderItems(
    items
  );

if (items.length === 0) {
  console.error(
    "MARVEL ADD ORDER: at least one product is required."
  );

  return null;
}

const invalidItem =
  items.some(
    (item) =>
      !item.productId ||
      !item.productName ||
      item.quantity <= 0
  );

if (invalidItem) {
  console.error(
    "MARVEL ADD ORDER: invalid product line item."
  );

  return null;
}

const stockValidation =
  validateOrderStock(
    items,
    products
  );

if (!stockValidation.valid) {
  console.error(
    "MARVEL ADD ORDER:",
    stockValidation.message
  );

  return null;
}

const totals =
  calculateOrderTotals(
    items
  );

const timestamp =
  new Date().toISOString();

const newOrder = {
  id:
    cleanString(order.id) ||
    nextId(
      "ORD",
      orders
    ),

  customerId,

  customerName:
    cleanString(
      order.customerName
    ) ||
    customer.name ||
    customer.company ||
    "",

  items,

  subtotal:
    totals.subtotal,

  total:
    order.total !== undefined
      ? positiveNumber(
          order.total
        )
      : totals.total,

  currency:
    cleanString(
      order.currency,
      "KES"
    ),

  status:
    cleanString(
      order.status,
      "Pending"
    ),

  paymentStatus:
    cleanString(
      order.paymentStatus,
      "Pending"
    ),

  shippingStatus:
    cleanString(
      order.shippingStatus,
      "Pending"
    ),

  notes:
    cleanString(
      order.notes
    ),

  createdAt:
    order.createdAt ||
    timestamp,

  updatedAt:
    timestamp,
};

/* --------------------------------------------------------
   REDUCE STOCK
   -------------------------------------------------------- */

const updatedProducts =
  products.map(
    (product) => {
      const orderedItem =
        items.find(
          (item) =>
            item.productId ===
            product.id
        );

      if (!orderedItem) {
        return product;
      }

      const newStock =
        Math.max(
          0,
          positiveNumber(
            product.stock
          ) -
            orderedItem.quantity
        );

      return {
        ...product,

        stock: newStock,

        status:
          getProductStatus(
            newStock
          ),

        updatedAt:
          timestamp,
      };
    }
  );

/* --------------------------------------------------------
   UPDATE CUSTOMER ORDER COUNT
   -------------------------------------------------------- */

const updatedCustomers =
  customers.map(
    (existingCustomer) =>
      existingCustomer.id ===
      customerId
        ? {
            ...existingCustomer,

            orders:
              positiveNumber(
                existingCustomer.orders
              ) + 1,

            updatedAt:
              timestamp,
          }
        : existingCustomer
  );

/* --------------------------------------------------------
   SAVE
   -------------------------------------------------------- */

const productsSaved =
  saveProducts(
    updatedProducts
  );

if (!productsSaved) {
  return null;
}

const customersSaved =
  saveCustomers(
    updatedCustomers
  );

if (!customersSaved) {
  /* Roll product stock back */
  saveProducts(products);

  return null;
}

const ordersSaved =
  saveOrders([
    ...orders,
    newOrder,
  ]);

if (!ordersSaved) {
  /* Roll back previous writes */
  saveProducts(products);
  saveCustomers(customers);

  return null;
}

console.log(
  "MARVEL ORDER CREATED:",
  newOrder
);

return newOrder;


} catch (error) {
console.error(
"MARVEL ADD ORDER ERROR:",
error
);


return null;


}
}

/* ------------------------------------------------------------
UPDATE ORDER
------------

Important:
Editing an order automatically adjusts inventory.

Example:

Old order:
100 Kg

New order:
150 Kg

Stock decreases by:
50 Kg

If changed from:
150 Kg → 80 Kg

Stock increases by:
70 Kg
------------------------------------------------------------ */

export function updateOrder(
orderId,
updates = {}
) {
try {
const orders =
getOrders();


const products =
  getProducts();

const customers =
  getCustomers();

const index =
  orders.findIndex(
    (order) =>
      order.id === orderId
  );

if (index === -1) {
  console.error(
    "MARVEL UPDATE ORDER: order not found:",
    orderId
  );

  return null;
}

const existingOrder =
  orders[index];

const timestamp =
  new Date().toISOString();

let updatedItems =
  existingOrder.items || [];

if (
  updates.items !== undefined
) {
  updatedItems =
    aggregateOrderItems(
      normalizeOrderItems(
        updates.items
      )
    );

  if (
    updatedItems.length === 0
  ) {
    console.error(
      "MARVEL UPDATE ORDER: order must contain products."
    );

    return null;
  }

  const stockValidation =
    validateOrderStock(
      updatedItems,
      products,
      existingOrder.items ||
        []
    );

  if (!stockValidation.valid) {
    console.error(
      "MARVEL UPDATE ORDER:",
      stockValidation.message
    );

    return null;
  }
}

let customerId =
  updates.customerId !==
  undefined
    ? cleanString(
        updates.customerId
      )
    : existingOrder.customerId;

const customer =
  customers.find(
    (item) =>
      item.id === customerId
  );

if (!customer) {
  console.error(
    "MARVEL UPDATE ORDER: customer not found:",
    customerId
  );

  return null;
}

const totals =
  calculateOrderTotals(
    updatedItems
  );

const updatedOrder = {
  ...existingOrder,
  ...updates,

  id: existingOrder.id,

  customerId,

  customerName:
    cleanString(
      updates.customerName
    ) ||
    customer.name ||
    customer.company ||
    existingOrder.customerName,

  items: updatedItems,

  subtotal:
    updates.items !== undefined
      ? totals.subtotal
      : positiveNumber(
          updates.subtotal !==
            undefined
            ? updates.subtotal
            : existingOrder.subtotal
        ),

  total:
    updates.items !== undefined &&
    updates.total === undefined
      ? totals.total
      : positiveNumber(
          updates.total !==
            undefined
            ? updates.total
            : existingOrder.total
        ),

  currency:
    updates.currency !== undefined
      ? cleanString(
          updates.currency,
          "KES"
        )
      : existingOrder.currency ||
        "KES",

  status:
    updates.status !== undefined
      ? cleanString(
          updates.status,
          "Pending"
        )
      : existingOrder.status ||
        "Pending",

  paymentStatus:
    updates.paymentStatus !==
    undefined
      ? cleanString(
          updates.paymentStatus,
          "Pending"
        )
      : existingOrder.paymentStatus ||
        "Pending",

  shippingStatus:
    updates.shippingStatus !==
    undefined
      ? cleanString(
          updates.shippingStatus,
          "Pending"
        )
      : existingOrder.shippingStatus ||
        "Pending",

  notes:
    updates.notes !== undefined
      ? cleanString(
          updates.notes
        )
      : existingOrder.notes || "",

  createdAt:
    existingOrder.createdAt ||
    timestamp,

  updatedAt:
    timestamp,
};

/* --------------------------------------------------------
   UPDATE STOCK ONLY WHEN ITEMS CHANGE
   -------------------------------------------------------- */

let updatedProducts =
  products;

if (
  updates.items !== undefined
) {
  const oldItems =
    aggregateOrderItems(
      normalizeOrderItems(
        existingOrder.items
      )
    );

  const oldQuantities =
    new Map();

  const newQuantities =
    new Map();

  oldItems.forEach(
    (item) => {
      oldQuantities.set(
        item.productId,
        (
          oldQuantities.get(
            item.productId
          ) || 0
        ) +
          item.quantity
      );
    }
  );

  updatedItems.forEach(
    (item) => {
      newQuantities.set(
        item.productId,
        (
          newQuantities.get(
            item.productId
          ) || 0
        ) +
          item.quantity
      );
    }
  );

  const productIds =
    new Set([
      ...oldQuantities.keys(),
      ...newQuantities.keys(),
    ]);

  updatedProducts =
    products.map(
      (product) => {
        const oldQuantity =
          oldQuantities.get(
            product.id
          ) || 0;

        const newQuantity =
          newQuantities.get(
            product.id
          ) || 0;

        const difference =
          newQuantity -
          oldQuantity;

        if (
          difference === 0
        ) {
          return product;
        }

        const newStock =
          Math.max(
            0,
            positiveNumber(
              product.stock
            ) -
              difference
          );

        return {
          ...product,

          stock: newStock,

          status:
            getProductStatus(
              newStock
            ),

          updatedAt:
            timestamp,
        };
      }
    );
}

/* --------------------------------------------------------
   CUSTOMER ORDER COUNT
   -------------------------------------------------------- */

let updatedCustomers =
  customers;

if (
  existingOrder.customerId !==
  customerId
) {
  updatedCustomers =
    customers.map(
      (item) => {
        if (
          item.id ===
          existingOrder.customerId
        ) {
          return {
            ...item,

            orders:
              Math.max(
                0,
                positiveNumber(
                  item.orders
                ) - 1
              ),

            updatedAt:
              timestamp,
          };
        }

        if (
          item.id ===
          customerId
        ) {
          return {
            ...item,

            orders:
              positiveNumber(
                item.orders
              ) + 1,

            updatedAt:
              timestamp,
          };
        }

        return item;
      }
    );
}

const newOrders = [
  ...orders,
];

newOrders[index] =
  updatedOrder;

/* --------------------------------------------------------
   SAVE WITH ROLLBACK
   -------------------------------------------------------- */

const productsSaved =
  saveProducts(
    updatedProducts
  );

if (!productsSaved) {
  return null;
}

const customersSaved =
  saveCustomers(
    updatedCustomers
  );

if (!customersSaved) {
  saveProducts(products);

  return null;
}

const ordersSaved =
  saveOrders(
    newOrders
  );

if (!ordersSaved) {
  saveProducts(products);
  saveCustomers(customers);

  return null;
}

return updatedOrder;


} catch (error) {
console.error(
"MARVEL UPDATE ORDER ERROR:",
error
);


return null;


}
}

/* ============================================================
ORDER STATUS HELPERS
============================================================ */

export function updateOrderStatus(
orderId,
status
) {
return updateOrder(
orderId,
{
status,
}
);
}

export function updateOrderPaymentStatus(
orderId,
paymentStatus
) {
return updateOrder(
orderId,
{
paymentStatus,
}
);
}

export function updateOrderShippingStatus(
orderId,
shippingStatus
) {
return updateOrder(
orderId,
{
shippingStatus,
}
);
}

/* ============================================================
DELETE ORDER
============

Deleting an order restores its product stock.

============================================================ */

export function deleteOrder(
orderId
) {
try {
const orders =
getOrders();


const products =
  getProducts();

const customers =
  getCustomers();

const existingOrder =
  orders.find(
    (order) =>
      order.id === orderId
  );

if (!existingOrder) {
  console.error(
    "MARVEL DELETE ORDER: order not found:",
    orderId
  );

  return null;
}

const timestamp =
  new Date().toISOString();

/* --------------------------------------------------------
   RESTORE STOCK
   -------------------------------------------------------- */

const items =
  aggregateOrderItems(
    normalizeOrderItems(
      existingOrder.items
    )
  );

const updatedProducts =
  products.map(
    (product) => {
      const item =
        items.find(
          (orderItem) =>
            orderItem.productId ===
            product.id
        );

      if (!item) {
        return product;
      }

      const restoredStock =
        positiveNumber(
          product.stock
        ) +
        item.quantity;

      return {
        ...product,

        stock:
          restoredStock,

        status:
          getProductStatus(
            restoredStock
          ),

        updatedAt:
          timestamp,
      };
    }
  );

/* --------------------------------------------------------
   DECREASE CUSTOMER ORDER COUNT
   -------------------------------------------------------- */

const updatedCustomers =
  customers.map(
    (customer) =>
      customer.id ===
      existingOrder.customerId
        ? {
            ...customer,

            orders:
              Math.max(
                0,
                positiveNumber(
                  customer.orders
                ) - 1
              ),

            updatedAt:
              timestamp,
          }
        : customer
  );

const updatedOrders =
  orders.filter(
    (order) =>
      order.id !== orderId
  );

/* --------------------------------------------------------
   SAVE WITH ROLLBACK
   -------------------------------------------------------- */

const productsSaved =
  saveProducts(
    updatedProducts
  );

if (!productsSaved) {
  return null;
}

const customersSaved =
  saveCustomers(
    updatedCustomers
  );

if (!customersSaved) {
  saveProducts(products);

  return null;
}

const ordersSaved =
  saveOrders(
    updatedOrders
  );

if (!ordersSaved) {
  saveProducts(products);
  saveCustomers(customers);

  return null;
}

console.log(
  "MARVEL ORDER DELETED:",
  orderId
);

return updatedOrders;


} catch (error) {
console.error(
"MARVEL DELETE ORDER ERROR:",
error
);


return null;


}
}

export function clearOrders() {
return saveOrders([]);
}

/* ============================================================
INVOICES
============================================================ */

export function getInvoices() {
const invoices = readData(
STORAGE_KEYS.invoices,
[]
);

return Array.isArray(invoices)
? invoices
: [];
}

export function getInvoiceById(
invoiceId
) {
return (
getInvoices().find(
(invoice) =>
invoice.id === invoiceId
) || null
);
}

export function saveInvoices(
invoices
) {
if (!Array.isArray(invoices)) {
return false;
}

return writeData(
STORAGE_KEYS.invoices,
invoices
);
}

export function addInvoice(
invoice = {}
) {
try {
const invoices =
getInvoices();


const generatedId =
  nextId(
    "INV",
    invoices
  );

const items =
  Array.isArray(
    invoice.items
  )
    ? invoice.items
    : [];

const subtotal =
  positiveNumber(
    invoice.subtotal
  );

const tax =
  positiveNumber(
    invoice.tax
  );

const calculatedTotal =
  subtotal + tax;

const newInvoice = {
  id:
    cleanString(
      invoice.id
    ) || generatedId,

  invoiceNumber:
    cleanString(
      invoice.invoiceNumber
    ) || generatedId,

  customerId:
    cleanString(
      invoice.customerId
    ),

  customerName:
    cleanString(
      invoice.customerName
    ),

  orderId:
    cleanString(
      invoice.orderId
    ),

  items,

  subtotal,

  tax,

  total:
    invoice.total !== undefined
      ? positiveNumber(
          invoice.total
        )
      : calculatedTotal,

  currency:
    cleanString(
      invoice.currency,
      "KES"
    ),

  status:
    cleanString(
      invoice.status,
      "Pending"
    ),

  dueDate:
    cleanString(
      invoice.dueDate
    ),

  notes:
    cleanString(
      invoice.notes
    ),

  createdAt:
    invoice.createdAt ||
    new Date().toISOString(),

  updatedAt:
    new Date().toISOString(),
};

return saveInvoices([
  ...invoices,
  newInvoice,
])
  ? newInvoice
  : null;


} catch (error) {
console.error(
"MARVEL ADD INVOICE ERROR:",
error
);


return null;


}
}

export function updateInvoice(
invoiceId,
updates = {}
) {
const invoices =
getInvoices();

const updatedInvoices =
invoices.map(
(invoice) =>
invoice.id === invoiceId
? {
...invoice,
...updates,
id: invoice.id,
updatedAt:
new Date().toISOString(),
}
: invoice
);

return saveInvoices(
updatedInvoices
)
? updatedInvoices.find(
(invoice) =>
invoice.id ===
invoiceId
) || null
: null;
}

export function deleteInvoice(
invoiceId
) {
const invoices =
getInvoices();

const exists =
invoices.some(
(invoice) =>
invoice.id === invoiceId
);

if (!exists) {
return null;
}

const updatedInvoices =
invoices.filter(
(invoice) =>
invoice.id !== invoiceId
);

return saveInvoices(
updatedInvoices
)
? updatedInvoices
: null;
}

export function clearInvoices() {
return saveInvoices([]);
}

/* ============================================================
PAYMENTS
============================================================ */

export function getPayments() {
const payments = readData(
STORAGE_KEYS.payments,
[]
);

return Array.isArray(payments)
? payments
: [];
}

export function getPaymentById(
paymentId
) {
return (
getPayments().find(
(payment) =>
payment.id === paymentId
) || null
);
}

export function savePayments(
payments
) {
if (!Array.isArray(payments)) {
return false;
}

return writeData(
STORAGE_KEYS.payments,
payments
);
}

export function addPayment(
payment = {}
) {
try {
const payments =
getPayments();


const newPayment = {
  id:
    cleanString(
      payment.id
    ) ||
    nextId(
      "PAY",
      payments
    ),

  orderId:
    cleanString(
      payment.orderId
    ),

  invoiceId:
    cleanString(
      payment.invoiceId
    ),

  customerId:
    cleanString(
      payment.customerId
    ),

  customerName:
    cleanString(
      payment.customerName
    ),

  amount:
    positiveNumber(
      payment.amount
    ),

  currency:
    cleanString(
      payment.currency,
      "KES"
    ),

  method:
    cleanString(
      payment.method,
      "M-Pesa"
    ),

  reference:
    cleanString(
      payment.reference
    ),

  status:
    cleanString(
      payment.status,
      "Pending"
    ),

  createdAt:
    payment.createdAt ||
    new Date().toISOString(),

  updatedAt:
    new Date().toISOString(),
};

return savePayments([
  ...payments,
  newPayment,
])
  ? newPayment
  : null;


} catch (error) {
console.error(
"MARVEL ADD PAYMENT ERROR:",
error
);


return null;


}
}

export function updatePayment(
paymentId,
updates = {}
) {
const payments =
getPayments();

const updatedPayments =
payments.map(
(payment) =>
payment.id === paymentId
? {
...payment,
...updates,
id: payment.id,
updatedAt:
new Date().toISOString(),
}
: payment
);

return savePayments(
updatedPayments
)
? updatedPayments.find(
(payment) =>
payment.id ===
paymentId
) || null
: null;
}

export function deletePayment(
paymentId
) {
const payments =
getPayments();

const exists =
payments.some(
(payment) =>
payment.id === paymentId
);

if (!exists) {
return null;
}

const updatedPayments =
payments.filter(
(payment) =>
payment.id !== paymentId
);

return savePayments(
updatedPayments
)
? updatedPayments
: null;
}

export function clearPayments() {
return savePayments([]);
}

/* ============================================================
SHIPMENTS
============================================================ */

export function getShipments() {
const shipments = readData(
STORAGE_KEYS.shipments,
[]
);

return Array.isArray(shipments)
? shipments
: [];
}

export function getShipmentById(
shipmentId
) {
return (
getShipments().find(
(shipment) =>
shipment.id === shipmentId
) || null
);
}

export function saveShipments(
shipments
) {
if (!Array.isArray(shipments)) {
return false;
}

return writeData(
STORAGE_KEYS.shipments,
shipments
);
}

export function addShipment(
shipment = {}
) {
try {
const shipments =
getShipments();


const newShipment = {
  id:
    cleanString(
      shipment.id
    ) ||
    nextId(
      "SHP",
      shipments
    ),

  orderId:
    cleanString(
      shipment.orderId
    ),

  customerId:
    cleanString(
      shipment.customerId
    ),

  customerName:
    cleanString(
      shipment.customerName
    ),

  destination:
    cleanString(
      shipment.destination
    ),

  carrier:
    cleanString(
      shipment.carrier
    ),

  trackingNumber:
    cleanString(
      shipment.trackingNumber
    ),

  status:
    cleanString(
      shipment.status,
      "Pending"
    ),

  estimatedDelivery:
    cleanString(
      shipment.estimatedDelivery
    ),

  createdAt:
    shipment.createdAt ||
    new Date().toISOString(),

  updatedAt:
    new Date().toISOString(),
};

return saveShipments([
  ...shipments,
  newShipment,
])
  ? newShipment
  : null;


} catch (error) {
console.error(
"MARVEL ADD SHIPMENT ERROR:",
error
);


return null;


}
}

export function updateShipment(
shipmentId,
updates = {}
) {
const shipments =
getShipments();

const updatedShipments =
shipments.map(
(shipment) =>
shipment.id === shipmentId
? {
...shipment,
...updates,
id: shipment.id,
updatedAt:
new Date().toISOString(),
}
: shipment
);

return saveShipments(
updatedShipments
)
? updatedShipments.find(
(shipment) =>
shipment.id ===
shipmentId
) || null
: null;
}

export function deleteShipment(
shipmentId
) {
const shipments =
getShipments();

const exists =
shipments.some(
(shipment) =>
shipment.id === shipmentId
);

if (!exists) {
return null;
}

const updatedShipments =
shipments.filter(
(shipment) =>
shipment.id !==
shipmentId
);

return saveShipments(
updatedShipments
)
? updatedShipments
: null;
}

export function clearShipments() {
return saveShipments([]);
}

/* ============================================================
COMPANY SETTINGS
============================================================ */

export function getSettings() {
const settings = readData(
STORAGE_KEYS.settings,
null
);

if (
settings &&
typeof settings === "object" &&
!Array.isArray(settings)
) {
return {
...DEFAULT_SETTINGS,
...settings,
};
}

return {
...DEFAULT_SETTINGS,
};
}

export function saveSettings(
settings = {}
) {
const newSettings = {
...DEFAULT_SETTINGS,
...settings,
};

return writeData(
STORAGE_KEYS.settings,
newSettings
);
}

/* ============================================================
DASHBOARD STATISTICS
============================================================ */

export function getDashboardStats() {
const products =
getProducts();

const customers =
getCustomers();

const orders =
getOrders();

const invoices =
getInvoices();

const payments =
getPayments();

const shipments =
getShipments();

/* ----------------------------------------------------------
REVENUE
---------------------------------------------------------- */

const totalRevenue =
payments.reduce(
(total, payment) => {
const status =
String(
payment.status || ""
).toLowerCase();


    if (
      status === "paid" ||
      status === "completed" ||
      status === "successful"
    ) {
      return (
        total +
        positiveNumber(
          payment.amount
        )
      );
    }

    return total;
  },
  0
);


/* ----------------------------------------------------------
LOW STOCK
---------------------------------------------------------- */

const lowStockProducts =
products.filter(
(product) => {
const stock =
positiveNumber(
product.stock
);


    return (
      stock > 0 &&
      stock <= 50
    );
  }
).length;


/* ----------------------------------------------------------
OUT OF STOCK
---------------------------------------------------------- */

const outOfStockProducts =
products.filter(
(product) =>
positiveNumber(
product.stock
) <= 0
).length;

/* ----------------------------------------------------------
PENDING ORDERS
---------------------------------------------------------- */

const pendingOrders =
orders.filter(
(order) =>
String(
order.status || ""
).toLowerCase() ===
"pending"
).length;

/* ----------------------------------------------------------
PROCESSING ORDERS
---------------------------------------------------------- */

const processingOrders =
orders.filter(
(order) =>
String(
order.status || ""
).toLowerCase() ===
"processing"
).length;

/* ----------------------------------------------------------
COMPLETED ORDERS
---------------------------------------------------------- */

const completedOrders =
orders.filter(
(order) =>
String(
order.status || ""
).toLowerCase() ===
"completed"
).length;

/* ----------------------------------------------------------
PENDING INVOICES
---------------------------------------------------------- */

const pendingInvoices =
invoices.filter(
(invoice) =>
String(
invoice.status || ""
).toLowerCase() ===
"pending"
).length;

/* ----------------------------------------------------------
PAID INVOICES
---------------------------------------------------------- */

const paidInvoices =
invoices.filter(
(invoice) =>
String(
invoice.status || ""
).toLowerCase() ===
"paid"
).length;

/* ----------------------------------------------------------
PENDING SHIPMENTS
---------------------------------------------------------- */

const pendingShipments =
shipments.filter(
(shipment) => {
const status =
String(
shipment.status || ""
).toLowerCase();


    return (
      status !== "delivered" &&
      status !== "cancelled"
    );
  }
).length;


/* ----------------------------------------------------------
DELIVERED SHIPMENTS
---------------------------------------------------------- */

const deliveredShipments =
shipments.filter(
(shipment) =>
String(
shipment.status || ""
).toLowerCase() ===
"delivered"
).length;

/* ----------------------------------------------------------
OUTSTANDING CUSTOMER BALANCE
---------------------------------------------------------- */

const outstandingBalance =
customers.reduce(
(total, customer) =>
total +
positiveNumber(
customer.balance
),
0
);

/* ----------------------------------------------------------
ORDER VALUE
---------------------------------------------------------- */

const totalOrderValue =
orders.reduce(
(total, order) =>
total +
positiveNumber(
order.total
),
0
);

return {
totalProducts:
products.length,


totalCustomers:
  customers.length,

totalOrders:
  orders.length,

totalInvoices:
  invoices.length,

totalPayments:
  payments.length,

totalShipments:
  shipments.length,

totalRevenue,

totalOrderValue,

outstandingBalance,

pendingOrders,

processingOrders,

completedOrders,

pendingInvoices,

paidInvoices,

pendingShipments,

deliveredShipments,

lowStockProducts,

outOfStockProducts,


};
}

/* ============================================================
RESET ENTIRE STORE
============================================================ */

export function resetStore() {
try {
Object.values(
STORAGE_KEYS
).forEach((key) => {
removeData(key);
});


notifyListeners("RESET");

return true;


} catch (error) {
console.error(
"MARVEL RESET STORE ERROR:",
error
);


return false;


}
}

/* ============================================================
SEED DEFAULT DATA
============================================================ */

export function seedDefaultData() {
if (!hasLocalStorage()) {
return false;
}

try {
/* --------------------------------------------------------
PRODUCTS
-------------------------------------------------------- */


if (
  window.localStorage.getItem(
    STORAGE_KEYS.products
  ) === null
) {
  writeData(
    STORAGE_KEYS.products,
    DEFAULT_PRODUCTS.map(
      (product) => ({
        ...product,
      })
    )
  );
}


/* --------------------------------------------------------
   CUSTOMERS
   -------------------------------------------------------- */

if (
  window.localStorage.getItem(
    STORAGE_KEYS.customers
  ) === null
) {
  writeData(
    STORAGE_KEYS.customers,
    []
  );
}


/* --------------------------------------------------------
   ORDERS
   -------------------------------------------------------- */

if (
  window.localStorage.getItem(
    STORAGE_KEYS.orders
  ) === null
) {
  writeData(
    STORAGE_KEYS.orders,
    []
  );
}


/* --------------------------------------------------------
   INVOICES
   -------------------------------------------------------- */

if (
  window.localStorage.getItem(
    STORAGE_KEYS.invoices
  ) === null
) {
  writeData(
    STORAGE_KEYS.invoices,
    []
  );
}


/* --------------------------------------------------------
   PAYMENTS
   -------------------------------------------------------- */

if (
  window.localStorage.getItem(
    STORAGE_KEYS.payments
  ) === null
) {
  writeData(
    STORAGE_KEYS.payments,
    []
  );
}


/* --------------------------------------------------------
   SHIPMENTS
   -------------------------------------------------------- */

if (
  window.localStorage.getItem(
    STORAGE_KEYS.shipments
  ) === null
) {
  writeData(
    STORAGE_KEYS.shipments,
    []
  );
}


/* --------------------------------------------------------
   SETTINGS
   -------------------------------------------------------- */

if (
  window.localStorage.getItem(
    STORAGE_KEYS.settings
  ) === null
) {
  writeData(
    STORAGE_KEYS.settings,
    {
      ...DEFAULT_SETTINGS,
    }
  );
}

return true;

} catch (error) {
console.error(
"MARVEL STORE INITIALIZATION ERROR:",
error
);


return false;


}
}

/* ============================================================
CROSS-TAB SYNCHRONIZATION
============================================================ */

if (
typeof window !== "undefined"
) {
window.addEventListener(
"storage",
(event) => {
if (
Object.values(
STORAGE_KEYS
).includes(event.key)
) {
notifyListeners(
event.key
);
}
}
);
}

/* ============================================================
INITIALIZE STORE
============================================================ */

if (
typeof window !== "undefined"
) {
seedDefaultData();
}

/* ============================================================
EXPORT STORAGE KEYS
============================================================ */

export {
STORAGE_KEYS,
};

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
>>>>>>> ceffe9c7c6d47d15c954a08fb7eaaf41b529a13a
