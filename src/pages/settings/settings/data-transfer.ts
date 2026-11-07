import { useModificationStore } from '@/entities/modification';
import { useOrderStore } from '@/entities/order';
import { useProductStore } from '@/entities/product';
import { ShiftRepo } from '@/entities/shift';
import { useShiftStore } from '@/entities/shift';
import type { Modification } from '@/shared/model/modification';
import { ORDER_STATUS, type Order, type OrderPosition } from '@/shared/model/order';
import type { Product } from '@/shared/model/product';
import { PAY_METHOD, type Payment } from '@/shared/model/payment';
import type { Shift } from '@/shared/model/shift';

const BACKUP_FORMAT = 'timon-oms-backup';
const BACKUP_VERSION = 1;

type ApplicationData = {
  products: Product[];
  modifications: Modification[];
  orders: Order[];
  shifts: Shift[];
};

type ApplicationBackup = {
  format: typeof BACKUP_FORMAT;
  version: typeof BACKUP_VERSION;
  exportedAt: string;
  data: ApplicationData;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isString(value: unknown): value is string {
  return typeof value === 'string';
}

function isNumber(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value);
}

function readArray(value: unknown, name: string): unknown[] {
  if (!Array.isArray(value)) throw new Error(`В файле отсутствует список «${name}»`);
  return value;
}

function readDate(value: unknown, name: string): Date {
  if (!isString(value) && !(value instanceof Date)) throw new Error(`Некорректная дата «${name}»`);
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) throw new Error(`Некорректная дата «${name}»`);
  return date;
}

function readStringArray(value: unknown, name: string): string[] {
  if (!Array.isArray(value) || !value.every(isString)) {
    throw new Error(`Некорректный список «${name}»`);
  }
  return value;
}

function parseProducts(input: unknown): Product[] {
  const rawProducts = isRecord(input) ? input.products : input;
  return readArray(rawProducts, 'products').map((item) => {
    if (!isRecord(item) || !isString(item.id) || !isString(item.name) ||
      !isString(item.type) || !isNumber(item.price)) {
      throw new Error('В файле найден некорректный продукт');
    }

    if (item.stock !== undefined && !isNumber(item.stock)) {
      throw new Error(`Некорректный остаток продукта «${item.name}»`);
    }
    if (item.ean !== undefined && !isString(item.ean)) {
      throw new Error(`Некорректный штрихкод продукта «${item.name}»`);
    }

    return {
      id: item.id,
      name: item.name,
      type: item.type,
      price: item.price,
      stock: item.stock,
      ean: item.ean,
      availableModifications: item.availableModifications === undefined
        ? []
        : readStringArray(item.availableModifications, 'availableModifications'),
    };
  });
}

function parseModifications(input: unknown): Modification[] {
  return readArray(input, 'modifications').map((item) => {
    if (!isRecord(item) || !isString(item.id) || !isString(item.name) || !isNumber(item.price)) {
      throw new Error('В файле найден некорректный модификатор');
    }
    if (item.description !== undefined && !isString(item.description)) {
      throw new Error(`Некорректное описание модификатора «${item.name}»`);
    }
    return {
      id: item.id,
      name: item.name,
      price: item.price,
      description: item.description,
    };
  });
}

function parsePosition(item: unknown, index: number): OrderPosition {
  if (!isRecord(item) || !isString(item.name) || !isString(item.type) ||
    !isString(item.positionType) || !isNumber(item.quantity) ||
    !isNumber(item.price) || !isNumber(item.totalPrice)) {
    throw new Error('В файле найден некорректный товар в заказе');
  }
  if (item.description !== undefined && !isString(item.description)) {
    throw new Error(`Некорректный комментарий к позиции «${item.name}»`);
  }

  return {
    index: isNumber(item.index) ? item.index : index,
    name: item.name,
    type: item.type,
    positionType: item.positionType,
    quantity: item.quantity,
    description: item.description,
    tags: item.tags === undefined ? [] : readStringArray(item.tags, 'tags'),
    modifications: item.modifications === undefined
      ? []
      : readStringArray(item.modifications, 'modifications'),
    price: item.price,
    totalPrice: item.totalPrice,
  };
}

function parsePayment(value: unknown): Order['payment'] {
  if (value === undefined) return undefined;
  if (!isRecord(value) || !isString(value.id) || !isString(value.orderID) ||
    !isString(value.positions) || !Array.isArray(value.payments)) {
    throw new Error('В файле найден некорректный платёж');
  }

  const payments: Payment[] = value.payments.map((payment) => {
    if (!isRecord(payment) ||
      (payment.paymentMethod !== PAY_METHOD.cash && payment.paymentMethod !== PAY_METHOD.card) ||
      (payment.cardOfBank !== null && !isString(payment.cardOfBank)) ||
      !isNumber(payment.amount) || !isString(payment.currency)) {
      throw new Error('В файле найдена некорректная запись платежа');
    }
    return {
      paymentMethod: payment.paymentMethod,
      cardOfBank: payment.cardOfBank,
      amount: payment.amount,
      currency: payment.currency,
    };
  });

  if (value.change !== undefined && !isNumber(value.change)) {
    throw new Error('Некорректная сумма сдачи');
  }

  return {
    id: value.id,
    orderID: value.orderID,
    positions: value.positions,
    payments,
    change: value.change,
  };
}

function parseOrders(input: unknown): Order[] {
  return readArray(input, 'orders').map((item) => {
    if (!isRecord(item) || !isString(item.id) || !isNumber(item.index) ||
      !Array.isArray(item.positions) ||
      (item.status !== ORDER_STATUS.opened && item.status !== ORDER_STATUS.closed &&
        item.status !== ORDER_STATUS.canceled)) {
      throw new Error('В файле найден некорректный заказ');
    }

    const rawTotals = item.totals;
    let totals = {
      subTotal: 0,
      deliveryFee: 0,
      discountAmount: 0,
      finalTotal: 0,
    };
    if (rawTotals !== undefined) {
      if (!isRecord(rawTotals) || !isNumber(rawTotals.subTotal) ||
        !isNumber(rawTotals.deliveryFee) || !isNumber(rawTotals.discountAmount) ||
        !isNumber(rawTotals.finalTotal)) {
        throw new Error(`Некорректная сумма заказа #${item.index}`);
      }
      totals = {
        subTotal: rawTotals.subTotal,
        deliveryFee: rawTotals.deliveryFee,
        discountAmount: rawTotals.discountAmount,
        finalTotal: rawTotals.finalTotal,
      };
    }

    return {
      id: item.id,
      index: item.index,
      createdAt: readDate(item.createdAt, 'createdAt'),
      closedAt: item.closedAt === undefined ? undefined : readDate(item.closedAt, 'closedAt'),
      positions: item.positions.map(parsePosition),
      status: item.status,
      totals,
      payment: parsePayment(item.payment),
    };
  });
}

function parseShifts(input: unknown): Shift[] {
  return readArray(input, 'shifts').map((item) => {
    if (!isRecord(item) || !isString(item.id) || !isString(item.personID) ||
      (item.status !== 'opened' && item.status !== 'closed') ||
      !isRecord(item.report) || !isNumber(item.report.totalProfit)) {
      throw new Error('В файле найдена некорректная смена');
    }

    return {
      id: item.id,
      personID: item.personID,
      openedAt: readDate(item.openedAt, 'openedAt'),
      closedAt: item.closedAt === undefined ? undefined : readDate(item.closedAt, 'closedAt'),
      status: item.status,
      report: {
        totalProfit: item.report.totalProfit,
        orders: readStringArray(item.report.orders, 'orders'),
      },
    };
  });
}

export function parseProductsFile(contents: string): Product[] {
  return parseProducts(JSON.parse(contents) as unknown);
}

export function parseBackupFile(contents: string): ApplicationData {
  const input: unknown = JSON.parse(contents);
  if (!isRecord(input) || input.format !== BACKUP_FORMAT || input.version !== BACKUP_VERSION ||
    !isRecord(input.data)) {
    throw new Error('Файл не является резервной копией Timon OMS поддерживаемого формата');
  }

  const shifts = parseShifts(input.data.shifts);
  if (shifts.filter((shift) => shift.status === 'opened').length > 1) {
    throw new Error('В резервной копии найдено более одной открытой смены');
  }

  return {
    products: parseProducts(input.data.products),
    modifications: parseModifications(input.data.modifications),
    orders: parseOrders(input.data.orders),
    shifts,
  };
}

export function exportProductsFile(): string {
  return JSON.stringify(useProductStore().products, null, 2);
}

export async function exportBackupFile(): Promise<string> {
  const data: ApplicationData = {
    products: useProductStore().products,
    modifications: useModificationStore().modifications,
    orders: useOrderStore().orders,
    shifts: await new ShiftRepo().getShifts(),
  };
  const backup: ApplicationBackup = {
    format: BACKUP_FORMAT,
    version: BACKUP_VERSION,
    exportedAt: new Date().toISOString(),
    data,
  };

  return JSON.stringify(backup, null, 2);
}

export async function importProducts(products: Product[]): Promise<void> {
  await useProductStore().setProducts(products);
}

export async function importBackup(data: ApplicationData): Promise<void> {
  await useProductStore().setProducts(data.products);
  await useModificationStore().setModifications(data.modifications);
  await useOrderStore().setOrders(data.orders);
  await useShiftStore().setShifts(data.shifts);
}
