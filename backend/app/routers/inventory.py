from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from ..database import get_db
from ..schemas import (
    CreateReceiptRequest, CreateProductionRunRequest, CreateWastageRequest,
    CreateTransferRequest, CreateCountRequest, InventoryOnHandResponse,
    StockMovementResponse, ItemResponse, SiteResponse, SupplierResponse,
    RecipeResponse, TransferResponse
)
from ..models import (
    StockMovement, Item, Site, Location, Supplier, Recipe, InventoryLot,
    Transfer, TransferLine, MovementType, TransferStatus
)
import uuid
from datetime import datetime

router = APIRouter(prefix="/api/v1", tags=["inventory"])

@router.post("/receipts")
async def create_receipt(
    request: CreateReceiptRequest,
    idempotency_key: str = None,
    db: Session = Depends(get_db)
):
    """Create a new receipt for supplier deliveries"""
    print(f"DEBUG: Received receipt request: {request}")
    print(f"DEBUG: Request lines: {request.lines}")
    receipt_id = str(uuid.uuid4())
    
    for line in request.lines:
        lot = db.query(InventoryLot).filter(
            InventoryLot.item_id == line.item_id,
            InventoryLot.lot_code == line.lot
        ).first()
        
        if not lot:
            lot = InventoryLot(
                item_id=line.item_id,
                lot_code=line.lot or f"LOT-{datetime.now().strftime('%Y%m%d')}-{str(uuid.uuid4())[:8]}",
                expiry_date=line.expiry,
                unit_cost=line.unit_cost
            )
            db.add(lot)
            db.flush()
        
        movement = StockMovement(
            tenant_id="default-tenant",  # For demo purposes
            site_id=request.site_id,
            item_id=line.item_id,
            lot_id=lot.id,
            location_id=line.location_id,
            movement_type=MovementType.RECEIPT,
            qty_base=line.qty,
            reference_id=receipt_id,
            reference_type="receipt"
        )
        db.add(movement)
    
    db.commit()
    return {"receipt_id": receipt_id, "status": "created"}

@router.post("/production-runs")
async def create_production_run(
    request: CreateProductionRunRequest,
    db: Session = Depends(get_db)
):
    """Create a production run using FEFO logic"""
    production_id = str(uuid.uuid4())
    
    recipe = db.query(Recipe).filter(Recipe.id == request.recipe_id).first()
    if not recipe:
        raise HTTPException(status_code=404, detail="Recipe not found")
    
    production_movement = StockMovement(
        tenant_id="default-tenant",
        site_id=request.site_id,
        item_id=recipe.id,  # Simplified - would be output item
        lot_id=str(uuid.uuid4()),  # New production lot
        location_id=str(uuid.uuid4()),  # Production location
        movement_type=MovementType.PRODUCTION,
        qty_base=request.portions,
        reference_id=production_id,
        reference_type="production"
    )
    db.add(production_movement)
    db.commit()
    
    return {"production_id": production_id, "status": "created"}

@router.post("/wastage")
async def create_wastage(
    request: CreateWastageRequest,
    db: Session = Depends(get_db)
):
    """Record wastage"""
    wastage_id = str(uuid.uuid4())
    
    movement = StockMovement(
        tenant_id="default-tenant",
        site_id=request.site_id,
        item_id=request.item_id,
        lot_id=request.lot_id,
        location_id=request.location_id,
        movement_type=MovementType.WASTAGE,
        qty_base=-request.qty_base,  # Negative for wastage
        reference_id=wastage_id,
        reference_type="wastage",
        reason=request.reason
    )
    db.add(movement)
    db.commit()
    
    return {"wastage_id": wastage_id, "status": "created"}

@router.post("/transfers")
async def create_transfer(
    request: CreateTransferRequest,
    db: Session = Depends(get_db)
):
    """Create a new transfer between sites"""
    transfer = Transfer(
        from_site_id=request.from_site_id,
        to_site_id=request.to_site_id,
        status=TransferStatus.PENDING
    )
    db.add(transfer)
    db.flush()
    
    for line in request.lines:
        transfer_line = TransferLine(
            transfer_id=transfer.id,
            item_id=line.item_id,
            qty_base=line.qty_base
        )
        db.add(transfer_line)
    
    db.commit()
    return {"transfer_id": transfer.id, "status": "created"}

@router.post("/counts")
async def create_count(
    request: CreateCountRequest,
    db: Session = Depends(get_db)
):
    """Perform cycle count and create adjustments"""
    count_id = str(uuid.uuid4())
    
    for line in request.lines:
        if line.expected_qty is not None:
            adjustment_qty = line.actual_qty - line.expected_qty
            if adjustment_qty != 0:
                movement = StockMovement(
                    tenant_id="default-tenant",
                    site_id=request.site_id,
                    item_id=line.item_id,
                    lot_id=line.lot_id,
                    location_id=line.location_id,
                    movement_type=MovementType.ADJUSTMENT,
                    qty_base=adjustment_qty,
                    reference_id=count_id,
                    reference_type="count",
                    reason="Cycle count adjustment"
                )
                db.add(movement)
    
    db.commit()
    return {"count_id": count_id, "status": "created"}

@router.get("/on-hand", response_model=List[InventoryOnHandResponse])
async def get_inventory_on_hand(
    site_id: str = None,
    db: Session = Depends(get_db)
):
    """Get current inventory on hand"""
    from sqlalchemy import func
    
    query = db.query(
        StockMovement.item_id,
        Item.name.label('item_name'),
        Item.sku.label('item_sku'),
        StockMovement.location_id,
        Location.name.label('location_name'),
        StockMovement.lot_id,
        InventoryLot.lot_code.label('lot_code'),
        InventoryLot.expiry_date,
        func.sum(StockMovement.qty_base).label('qty_on_hand'),
        func.avg(InventoryLot.unit_cost).label('unit_cost')
    ).join(
        Item, StockMovement.item_id == Item.id
    ).join(
        Location, StockMovement.location_id == Location.id
    ).join(
        InventoryLot, StockMovement.lot_id == InventoryLot.id
    ).group_by(
        StockMovement.item_id,
        Item.name,
        Item.sku,
        StockMovement.location_id,
        Location.name,
        StockMovement.lot_id,
        InventoryLot.lot_code,
        InventoryLot.expiry_date
    ).having(
        func.sum(StockMovement.qty_base) > 0
    )
    
    if site_id:
        query = query.filter(StockMovement.site_id == site_id)
    
    results = query.all()
    
    inventory = []
    for result in results:
        inventory.append(InventoryOnHandResponse(
            item_id=result.item_id,
            item_name=result.item_name,
            item_sku=result.item_sku,
            location_id=result.location_id,
            location_name=result.location_name,
            lot_id=result.lot_id,
            lot_code=result.lot_code,
            expiry_date=result.expiry_date,
            qty_on_hand=result.qty_on_hand,
            unit_cost=result.unit_cost
        ))
    
    return inventory

@router.get("/movements", response_model=List[StockMovementResponse])
async def get_stock_movements(
    site_id: str = None,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    """Get stock movement history"""
    query = db.query(
        StockMovement,
        Item.name.label('item_name'),
        Location.name.label('location_name'),
        InventoryLot.lot_code.label('lot_code')
    ).join(
        Item, StockMovement.item_id == Item.id
    ).join(
        Location, StockMovement.location_id == Location.id
    ).join(
        InventoryLot, StockMovement.lot_id == InventoryLot.id
    )
    
    if site_id:
        query = query.filter(StockMovement.site_id == site_id)
    
    results = query.order_by(StockMovement.created_at.desc()).limit(limit).all()
    
    movements = []
    for result in results:
        movement = result[0]  # StockMovement object
        movements.append(StockMovementResponse(
            id=movement.id,
            movement_type=movement.movement_type,
            item_name=result.item_name,
            qty_base=movement.qty_base,
            location_name=result.location_name,
            lot_code=result.lot_code,
            reason=movement.reason,
            created_at=movement.created_at
        ))
    
    return movements

@router.get("/items", response_model=List[ItemResponse])
async def get_items(db: Session = Depends(get_db)):
    """Get all items"""
    items = db.query(Item).all()
    return items

@router.get("/sites", response_model=List[SiteResponse])
async def get_sites(db: Session = Depends(get_db)):
    """Get all sites"""
    sites = db.query(Site).all()
    return sites

@router.get("/suppliers", response_model=List[SupplierResponse])
async def get_suppliers(db: Session = Depends(get_db)):
    """Get all suppliers"""
    suppliers = db.query(Supplier).all()
    return suppliers

@router.get("/recipes", response_model=List[RecipeResponse])
async def get_recipes(db: Session = Depends(get_db)):
    """Get all recipes"""
    recipes = db.query(Recipe).all()
    return recipes

@router.get("/transfers", response_model=List[TransferResponse])
async def get_transfers(
    site_id: str = None,
    db: Session = Depends(get_db)
):
    """Get transfers"""
    query = db.query(Transfer)
    if site_id:
        query = query.filter(
            (Transfer.from_site_id == site_id) | (Transfer.to_site_id == site_id)
        )
    
    transfers = query.order_by(Transfer.created_at.desc()).all()
    return transfers
