const test = require('node:test');
const assert = require('node:assert/strict');
const inventory = require('../lib/inventory');
const orders = require('../lib/orders');

function productWithStock(stock, reserved) {
  return {
    id: 1,
    sku: 'RICE-001',
    name: 'Rice',
    hsn: '1006',
    price: 120,
    stock,
    reserved,
  };
}

function orderLine({ id, sku, name, hsn, price }, qty) {
  return { id, sku, name, hsn, price, qty };
}

test('REGRESSION: sellable 1 accepts qty 1', () => {
  const product = productWithStock(1, 0);

  assert.equal(inventory.check([product], [orderLine(product, 1)]).ok, true);
});

test('CURRENT BEHAVIOUR: sellable 1 rejects qty 2', () => {
  const product = productWithStock(1, 0);

  assert.equal(inventory.check([product], [orderLine(product, 2)]).ok, false);
});

test('CURRENT BEHAVIOUR: sellable 1 accepts qty 0', () => {
  const product = productWithStock(1, 0);

  assert.equal(inventory.check([product], [orderLine(product, 0)]).ok, true);
});

test('REGRESSION: stock 4 and reserved 3 leave one sellable unit and qty 1 is accepted', () => {
  const product = productWithStock(4, 3);

  assert.equal(inventory.getSellableStock(product), 1);
  assert.equal(inventory.check([product], [orderLine(product, 1)]).ok, true);
});

test('REGRESSION: cancelling a pending order restores deducted stock', () => {
  const product = productWithStock(4, 1);
  const items = [orderLine(product, 2)];
  const order = { id: 1001, status: 'pending', paymentMode: 'cash', items };
  const db = { products: [product], orders: [] };
  const snapshot = () => ({ stock: product.stock, reserved: product.reserved });
  const beforeOrder = snapshot();

  inventory.reserve(db.products, items);
  const afterReserve = snapshot();
  db.orders.push(order);

  const result = orders.cancel(db, order.id, 'Cancelled at checkout');
  const afterCancel = snapshot();

  assert.equal(result.ok, true);
  assert.equal(result.order.status, 'cancelled');
  assert.deepEqual({ beforeOrder, afterReserve, afterCancel }, {
    beforeOrder: { stock: 4, reserved: 1 },
    afterReserve: { stock: 2, reserved: 1 },
    afterCancel: { stock: 4, reserved: 1 },
  });
});

test('an exact-stock order can be placed and cancelled once without changing holds', () => {
  const product = productWithStock(4, 2);
  const line = orderLine(product, 1);
  const items = [line, { ...line }];
  const order = { id: 1002, status: 'completed', paymentMode: 'cash', items };
  const db = { products: [product], orders: [order] };

  const exactQuantity = inventory.check(db.products, [orderLine(product, 2)]).ok;
  const splitExactQuantity = inventory.check(db.products, items).ok;
  const splitOversell = inventory.check(db.products, [...items, { ...line }]).ok;
  inventory.reserve(db.products, items);
  const afterReserve = { stock: product.stock, reserved: product.reserved };
  const firstCancel = orders.cancel(db, order.id).ok;
  const afterCancel = { stock: product.stock, reserved: product.reserved };
  const secondCancel = orders.cancel(db, order.id).ok;
  const afterSecondCancel = { stock: product.stock, reserved: product.reserved };

  assert.deepEqual({ exactQuantity, splitExactQuantity, splitOversell, afterReserve,
    firstCancel, afterCancel, secondCancel, afterSecondCancel }, {
    exactQuantity: true,
    splitExactQuantity: true,
    splitOversell: false,
    afterReserve: { stock: 2, reserved: 2 },
    firstCancel: true,
    afterCancel: { stock: 4, reserved: 2 },
    secondCancel: false,
    afterSecondCancel: { stock: 4, reserved: 2 },
  });
});
