export interface Item {
  id: string;
  sku: string;
  name: string;
  category: string;
  storage_type: 'chilled' | 'frozen' | 'ambient';
  base_uom: string;
  pack_uom?: string;
  pack_size?: number;
  case_uom?: string;
  case_size?: number;
  standard_cost: number;
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
  storage_type: 'chilled' | 'frozen' | 'ambient';
}

export interface Supplier {
  id: string;
  name: string;
  account_code?: string;
  contact_email?: string;
}

export interface Recipe {
  id: string;
  name: string;
  yield_portions: number;
}

export interface StockMovement {
  id: string;
  item_id: string;
  movement_type: 'receipt' | 'production' | 'wastage' | 'transfer' | 'adjustment';
  qty_base: number;
  reference_id?: string;
  reference_type?: string;
  reason?: string;
  created_at: string;
}

export interface InventoryOnHand {
  item_id: string;
  item_name: string;
  location_id: string;
  location_name: string;
  qty_on_hand: number;
  unit_cost: number;
  total_value: number;
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
