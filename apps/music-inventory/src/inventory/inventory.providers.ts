import { Routes } from '@lexamica/common';
import { InventoryRoutes } from './inventory.routes';
import { InventoryController } from './inventory.controller';

export const inventoryProviders = [
  {
    token: InventoryController,
    useClass: InventoryController,
  },
  {
    token: Routes,
    useToken: InventoryRoutes,
  },
];
