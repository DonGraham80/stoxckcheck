from sqlalchemy.orm import Session
from .database import SessionLocal, engine
from .models import *
import uuid
from datetime import datetime, timedelta

def create_seed_data():
    """Create initial seed data for the application"""
    db = SessionLocal()
    
    try:
        tenant = Tenant(name="Demo School District")
        db.add(tenant)
        db.flush()
        
        user = User(
            tenant_id=tenant.id,
            email="admin@school.edu",
            name="Admin User"
        )
        db.add(user)
        db.flush()
        
        central_high = Site(
            tenant_id=tenant.id,
            name="Central High",
            address="123 School St, Education City"
        )
        db.add(central_high)
        db.flush()
        
        chiller1 = Location(
            site_id=central_high.id,
            name="Chiller 1",
            storage_type=StorageType.CHILLED
        )
        freezer1 = Location(
            site_id=central_high.id,
            name="Freezer 1",
            storage_type=StorageType.FROZEN
        )
        dry_store = Location(
            site_id=central_high.id,
            name="Dry Store",
            storage_type=StorageType.AMBIENT
        )
        db.add_all([chiller1, freezer1, dry_store])
        db.flush()
        
        supplier = Supplier(
            tenant_id=tenant.id,
            name="FreshFoods Ltd",
            account_code="FF001",
            contact_email="purchasing@freshfoods.example"
        )
        db.add(supplier)
        db.flush()
        
        milk = Item(
            tenant_id=tenant.id,
            sku="MILK-1L",
            name="Semi-skimmed Milk 1L",
            category="Dairy",
            storage_type=StorageType.CHILLED,
            base_uom="ml",
            pack_uom="L",
            pack_size=1000,
            case_uom="case",
            case_size=12,
            standard_cost=0.65
        )
        
        pasta = Item(
            tenant_id=tenant.id,
            sku="PASTA-500G",
            name="Spaghetti Pasta 500g",
            category="Dry Goods",
            storage_type=StorageType.AMBIENT,
            base_uom="g",
            pack_uom="pack",
            pack_size=500,
            case_uom="case",
            case_size=20,
            standard_cost=1.25
        )
        
        db.add_all([milk, pasta])
        db.flush()
        
        milk_barcode = ItemBarcode(
            item_id=milk.id,
            barcode="5012345678901",
            is_primary=True
        )
        db.add(milk_barcode)
        
        recipe = Recipe(
            tenant_id=tenant.id,
            name="Spaghetti Bolognese",
            yield_portions=60
        )
        db.add(recipe)
        db.flush()
        
        ingredient = RecipeIngredient(
            recipe_id=recipe.id,
            item_id=milk.id,
            qty_base=100,
            uom="ml"
        )
        db.add(ingredient)
        
        milk_lot = InventoryLot(
            item_id=milk.id,
            lot_code="M123",
            expiry_date=datetime.now() + timedelta(days=7),
            unit_cost=0.65
        )
        db.add(milk_lot)
        db.flush()
        
        initial_stock = StockMovement(
            tenant_id=tenant.id,
            site_id=central_high.id,
            item_id=milk.id,
            lot_id=milk_lot.id,
            location_id=chiller1.id,
            movement_type=MovementType.RECEIPT,
            qty_base=24000,  # 24 liters in ml
            reference_id="INITIAL-STOCK",
            reference_type="initial",
            created_by=user.id
        )
        db.add(initial_stock)
        
        db.commit()
        print("Seed data created successfully!")
        
    except Exception as e:
        db.rollback()
        print(f"Error creating seed data: {e}")
        raise
    finally:
        db.close()

if __name__ == "__main__":
    create_seed_data()
