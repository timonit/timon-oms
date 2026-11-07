import { describe, expect, it } from 'vitest';
import { parseBackupFile, parseProductsFile } from './data-transfer';

const product = {
  id: 'product-1',
  name: 'Tea',
  type: 'Drinks',
  price: 250,
  stock: 5,
  availableModifications: ['Lemon'],
};

const backup = {
  format: 'timon-oms-backup',
  version: 1,
  exportedAt: '2026-01-01T00:00:00.000Z',
  data: {
    products: [product],
    modifications: [{ id: 'mod-1', name: 'Lemon', price: 50 }],
    orders: [{
      id: 'order-1',
      index: 1,
      createdAt: '2026-01-01T00:00:00.000Z',
      status: 'opened',
      positions: [{
        index: 0,
        name: 'Deleted product',
        type: 'Drinks',
        positionType: 'product',
        quantity: 2,
        tags: [],
        modifications: ['Lemon'],
        price: 100,
        totalPrice: 200,
      }],
      totals: {
        subTotal: 200,
        deliveryFee: 0,
        discountAmount: 0,
        finalTotal: 200,
      },
    }],
    shifts: [{
      id: 'shift-1',
      personID: 'person-1',
      openedAt: '2026-01-01T00:00:00.000Z',
      status: 'closed',
      report: { totalProfit: 200, orders: ['order-1'] },
    }],
  },
};

describe('data transfer', () => {
  it('parses products and preserves optional stock', () => {
    expect(parseProductsFile(JSON.stringify([product]))).toEqual([product]);
  });

  it('parses a full backup and revives dates', () => {
    const data = parseBackupFile(JSON.stringify(backup));

    expect(data.products[0]?.stock).toBe(5);
    expect(data.orders[0]?.positions[0]?.name).toBe('Deleted product');
    expect(data.orders[0]?.createdAt).toBeInstanceOf(Date);
    expect(data.shifts[0]?.openedAt).toBeInstanceOf(Date);
  });

  it('rejects malformed products', () => {
    expect(() => parseProductsFile(JSON.stringify([{ id: 'bad' }]))).toThrow('некорректный продукт');
  });

  it('rejects backups with multiple open shifts', () => {
    const invalidBackup = structuredClone(backup);
    invalidBackup.data.shifts[0]!.status = 'opened';
    invalidBackup.data.shifts.push({
      id: 'shift-2',
      personID: 'person-2',
      openedAt: '2026-01-02T00:00:00.000Z',
      status: 'opened',
      report: { totalProfit: 0, orders: [] },
    });

    expect(() => parseBackupFile(JSON.stringify(invalidBackup))).toThrow('более одной открытой смены');
  });
});
