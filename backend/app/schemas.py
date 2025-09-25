from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime
from enum import Enum

class StorageType(str, Enum):
    AMBIENT = "ambient"
    CHILLED = "chilled"
    FROZEN = "frozen"

class MovementType(str, Enum):
    RECEIPT = "receipt"
    PRODUCTION = "production"
    TRANSFER_OUT = "transfer_out"
    TRANSFER_IN = "transfer_in"
    ADJUSTMENT = "adjustment"
    WASTAGE = "wastage"

class TransferStatus(str, Enum):
    PENDING = "pending"
    PICKED = "picked"
    RECEIVED = "received"
    CANCELLED = "cancelled"

class ReceiptLine(BaseModel):
    item_id: str = Field(..., description="Item UUID")
    qty: float = Field(..., description="Quantity received")
    uom: str = Field(..., description="Unit of measure")
    lot: Optional[str] = Field(None, description="Lot code")
    expiry: Optional[datetime] = Field(None, description="Expiry date")
    unit_cost: Optional[float] = Field(None, description="Unit cost")
    location_id: str = Field(..., description="Location UUID")

class CreateReceiptRequest(BaseModel):
    supplier_id: str = Field(..., description="Supplier UUID")
    site_id: str = Field(..., description="Site UUID")
    delivery_ref: Optional[str] = Field(None, description="Delivery reference")
    lines: List[ReceiptLine] = Field(..., description="Receipt lines")

class CreateProductionRunRequest(BaseModel):
    site_id: str = Field(..., description="Site UUID")
    recipe_id: str = Field(..., description="Recipe UUID")
    portions: int = Field(..., description="Number of portions to produce")
    lot_strategy: str = Field("FEFO", description="Lot allocation strategy")

class CreateWastageRequest(BaseModel):
    site_id: str = Field(..., description="Site UUID")
    item_id: str = Field(..., description="Item UUID")
    qty_base: float = Field(..., description="Quantity wasted")
    reason: str = Field(..., description="Wastage reason")
    lot_id: str = Field(..., description="Lot UUID")
    location_id: str = Field(..., description="Location UUID")

class TransferLineRequest(BaseModel):
    item_id: str = Field(..., description="Item UUID")
    qty_base: float = Field(..., description="Quantity to transfer")

class CreateTransferRequest(BaseModel):
    from_site_id: str = Field(..., description="Source site UUID")
    to_site_id: str = Field(..., description="Destination site UUID")
    lines: List[TransferLineRequest] = Field(..., description="Transfer lines")

class CountLine(BaseModel):
    item_id: str = Field(..., description="Item UUID")
    location_id: str = Field(..., description="Location UUID")
    lot_id: str = Field(..., description="Lot UUID")
    expected_qty: Optional[float] = Field(None, description="Expected quantity")
    actual_qty: float = Field(..., description="Actual counted quantity")

class CreateCountRequest(BaseModel):
    site_id: str = Field(..., description="Site UUID")
    lines: List[CountLine] = Field(..., description="Count lines")

class ItemResponse(BaseModel):
    id: str
    sku: str
    name: str
    category: Optional[str]
    storage_type: StorageType
    base_uom: str
    standard_cost: Optional[float]

class LocationResponse(BaseModel):
    id: str
    name: str
    storage_type: StorageType

class SiteResponse(BaseModel):
    id: str
    name: str
    address: Optional[str]
    locations: List[LocationResponse] = []

class SupplierResponse(BaseModel):
    id: str
    name: str
    account_code: Optional[str]
    contact_email: Optional[str]

class RecipeResponse(BaseModel):
    id: str
    name: str
    yield_portions: int

class InventoryOnHandResponse(BaseModel):
    item_id: str
    item_name: str
    item_sku: str
    location_id: str
    location_name: str
    lot_id: str
    lot_code: str
    expiry_date: Optional[datetime]
    qty_on_hand: float
    unit_cost: Optional[float]

class StockMovementResponse(BaseModel):
    id: str
    movement_type: MovementType
    item_name: str
    qty_base: float
    location_name: str
    lot_code: str
    reason: Optional[str]
    created_at: datetime

class TransferResponse(BaseModel):
    id: str
    from_site_name: str
    to_site_name: str
    status: TransferStatus
    created_at: datetime
    lines: List[dict] = []
