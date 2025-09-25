from sqlalchemy import Column, String, Integer, Float, DateTime, Boolean, Text, ForeignKey, Enum
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from .database import Base
import uuid
import enum

class StorageType(str, enum.Enum):
    AMBIENT = "ambient"
    CHILLED = "chilled"
    FROZEN = "frozen"

class MovementType(str, enum.Enum):
    RECEIPT = "receipt"
    PRODUCTION = "production"
    TRANSFER_OUT = "transfer_out"
    TRANSFER_IN = "transfer_in"
    ADJUSTMENT = "adjustment"
    WASTAGE = "wastage"

class TransferStatus(str, enum.Enum):
    PENDING = "pending"
    PICKED = "picked"
    RECEIVED = "received"
    CANCELLED = "cancelled"

class Tenant(Base):
    __tablename__ = "tenants"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String, nullable=False)
    created_at = Column(DateTime, server_default=func.now())
    
    users = relationship("User", back_populates="tenant")
    sites = relationship("Site", back_populates="tenant")
    suppliers = relationship("Supplier", back_populates="tenant")
    items = relationship("Item", back_populates="tenant")
    recipes = relationship("Recipe", back_populates="tenant")

class User(Base):
    __tablename__ = "users"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    tenant_id = Column(String, ForeignKey("tenants.id"), nullable=False)
    email = Column(String, unique=True, nullable=False)
    name = Column(String, nullable=False)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, server_default=func.now())
    
    tenant = relationship("Tenant", back_populates="users")

class Site(Base):
    __tablename__ = "sites"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    tenant_id = Column(String, ForeignKey("tenants.id"), nullable=False)
    name = Column(String, nullable=False)
    address = Column(Text)
    created_at = Column(DateTime, server_default=func.now())
    
    tenant = relationship("Tenant", back_populates="sites")
    locations = relationship("Location", back_populates="site")

class Location(Base):
    __tablename__ = "locations"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    site_id = Column(String, ForeignKey("sites.id"), nullable=False)
    name = Column(String, nullable=False)
    storage_type = Column(Enum(StorageType), nullable=False)
    created_at = Column(DateTime, server_default=func.now())
    
    site = relationship("Site", back_populates="locations")

class Supplier(Base):
    __tablename__ = "suppliers"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    tenant_id = Column(String, ForeignKey("tenants.id"), nullable=False)
    name = Column(String, nullable=False)
    account_code = Column(String)
    contact_email = Column(String)
    created_at = Column(DateTime, server_default=func.now())
    
    tenant = relationship("Tenant", back_populates="suppliers")

class Item(Base):
    __tablename__ = "items"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    tenant_id = Column(String, ForeignKey("tenants.id"), nullable=False)
    sku = Column(String, nullable=False, unique=True)
    name = Column(String, nullable=False)
    category = Column(String)
    storage_type = Column(Enum(StorageType), nullable=False)
    base_uom = Column(String, nullable=False)
    pack_uom = Column(String)
    pack_size = Column(Float)
    case_uom = Column(String)
    case_size = Column(Float)
    standard_cost = Column(Float)
    created_at = Column(DateTime, server_default=func.now())
    
    tenant = relationship("Tenant", back_populates="items")
    barcodes = relationship("ItemBarcode", back_populates="item")
    lots = relationship("InventoryLot", back_populates="item")

class ItemBarcode(Base):
    __tablename__ = "item_barcodes"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    item_id = Column(String, ForeignKey("items.id"), nullable=False)
    barcode = Column(String, nullable=False, unique=True)
    is_primary = Column(Boolean, default=False)
    created_at = Column(DateTime, server_default=func.now())
    
    item = relationship("Item", back_populates="barcodes")

class Recipe(Base):
    __tablename__ = "recipes"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    tenant_id = Column(String, ForeignKey("tenants.id"), nullable=False)
    name = Column(String, nullable=False)
    yield_portions = Column(Integer, nullable=False)
    created_at = Column(DateTime, server_default=func.now())
    
    tenant = relationship("Tenant", back_populates="recipes")
    ingredients = relationship("RecipeIngredient", back_populates="recipe")

class RecipeIngredient(Base):
    __tablename__ = "recipe_ingredients"
    
    recipe_id = Column(String, ForeignKey("recipes.id"), primary_key=True)
    item_id = Column(String, ForeignKey("items.id"), primary_key=True)
    qty_base = Column(Float, nullable=False)
    uom = Column(String, nullable=False)
    
    recipe = relationship("Recipe", back_populates="ingredients")
    item = relationship("Item")

class InventoryLot(Base):
    __tablename__ = "inventory_lots"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    item_id = Column(String, ForeignKey("items.id"), nullable=False)
    lot_code = Column(String, nullable=False)
    expiry_date = Column(DateTime)
    unit_cost = Column(Float)
    created_at = Column(DateTime, server_default=func.now())
    
    item = relationship("Item", back_populates="lots")

class StockMovement(Base):
    __tablename__ = "stock_movements"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    tenant_id = Column(String, ForeignKey("tenants.id"), nullable=False)
    site_id = Column(String, ForeignKey("sites.id"), nullable=False)
    item_id = Column(String, ForeignKey("items.id"), nullable=False)
    lot_id = Column(String, ForeignKey("inventory_lots.id"), nullable=False)
    location_id = Column(String, ForeignKey("locations.id"), nullable=False)
    movement_type = Column(Enum(MovementType), nullable=False)
    qty_base = Column(Float, nullable=False)
    reference_id = Column(String)
    reference_type = Column(String)
    reason = Column(String)
    created_at = Column(DateTime, server_default=func.now())
    created_by = Column(String, ForeignKey("users.id"))
    
    tenant = relationship("Tenant")
    site = relationship("Site")
    item = relationship("Item")
    lot = relationship("InventoryLot")
    location = relationship("Location")
    user = relationship("User")

class Transfer(Base):
    __tablename__ = "transfers"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    from_site_id = Column(String, ForeignKey("sites.id"), nullable=False)
    to_site_id = Column(String, ForeignKey("sites.id"), nullable=False)
    status = Column(Enum(TransferStatus), default=TransferStatus.PENDING)
    created_at = Column(DateTime, server_default=func.now())
    created_by = Column(String, ForeignKey("users.id"))
    
    from_site = relationship("Site", foreign_keys=[from_site_id])
    to_site = relationship("Site", foreign_keys=[to_site_id])
    lines = relationship("TransferLine", back_populates="transfer")

class TransferLine(Base):
    __tablename__ = "transfer_lines"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    transfer_id = Column(String, ForeignKey("transfers.id"), nullable=False)
    item_id = Column(String, ForeignKey("items.id"), nullable=False)
    qty_base = Column(Float, nullable=False)
    picked_qty = Column(Float, default=0)
    received_qty = Column(Float, default=0)
    
    transfer = relationship("Transfer", back_populates="lines")
    item = relationship("Item")
