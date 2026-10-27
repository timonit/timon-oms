import { ModificationRepo } from '@/entities/modification';
import { OrderRepo } from '@/entities/order';
import { ProductRepo } from '@/entities/product/model/product.repo';
import { ShiftRepo } from '@/entities/shift';

export async function clearAllStores() {
  const modificationRepo = new ModificationRepo();
  const orderRepo = new OrderRepo();
  const productRepo = new ProductRepo();
  const shiftRepo = new ShiftRepo();

  modificationRepo.setModification([]);
  orderRepo.setOrders([]);
  productRepo.setProducts([]);
  shiftRepo.setShifts([]);
}
