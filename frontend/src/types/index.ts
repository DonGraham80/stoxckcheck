export type StorageType = 'Chilled' | 'Frozen' | 'Ambient';

export interface Item {
  id: string;
  sku: string;
  name: string;
  category: string;
  storageType: StorageType;
  baseUom: string;
  packUom?: string;
  packSize?: number;
  caseUom?: string;
  caseSize?: number;
  standardCost: number;
}

export interface Site {
  id: string;
  name: string;
  address: string;
  locations: Location[];
}

export interface Location {
  id: string;
  name: string;
  storageType: StorageType;
}

export interface Supplier {
  id: string;
  name: string;
  accountCode?: string;
  contactEmail?: string;
}

export interface Recipe {
  id: string;
  name: string;
  yieldPortions: number;
}

export interface StockMovement {
  id: string;
  itemId: string;
  movementType: 'receipt' | 'production' | 'wastage' | 'transfer' | 'adjustment';
  qtyBase: number;
  referenceId?: string;
  referenceType?: string;
  reason?: string;
  createdAt: string;
}

export interface InventoryOnHand {
  itemId: string;
  itemName: string;
  locationId: string;
  locationName: string;
  qtyOnHand: number;
  unitCost: number;
  totalValue: number;
}

export interface CreateReceiptRequest {
  site_id: string;
  supplier_id: string;
  lines: {
    item_id: string;
    qty: number;
    uom: string;
    unit_cost: number;
    lot?: string;
    expiry?: string | null;
    location_id: string;
  }[];
}

export interface CreateProductionRunRequest {
  site_id: string;
  recipe_id: string;
  portions: number;
}

export interface CreateWastageRequest {
  site_id: string;
  item_id: string;
  lot_id: string;
  location_id: string;
  qty_base: number;
  reason: string;
}

export interface CreateTransferRequest {
  from_site_id: string;
  to_site_id: string;
  lines: {
    item_id: string;
    qty_base: number;
  }[];
}

export interface CreateCountRequest {
  site_id: string;
  lines: {
    item_id: string;
    lot_id: string;
    location_id: string;
    expected_qty?: number;
    actual_qty: number;
  }[];
}
