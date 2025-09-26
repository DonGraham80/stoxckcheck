using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CateringApi.Data;
using CateringApi.Models;
using CateringApi.DTOs;

namespace CateringApi.Controllers
{
    [ApiController]
    [Route("api/v1")]
    public class InventoryController : ControllerBase
    {
        private readonly CateringDbContext _context;

        public InventoryController(CateringDbContext context)
        {
            _context = context;
        }

        [HttpPost("receipts")]
        public async Task<IActionResult> CreateReceipt([FromBody] CreateReceiptRequest request)
        {
            try
            {
                var receiptId = Guid.NewGuid().ToString();
                
                foreach (var line in request.Lines)
                {
                    var lotCode = line.Lot ?? $"LOT-{DateTime.UtcNow:yyyyMMdd}-{Guid.NewGuid().ToString()[..8]}";
                    
                    var lot = await _context.InventoryLots
                        .FirstOrDefaultAsync(l => l.ItemId == line.ItemId && l.LotCode == lotCode);
                    
                    if (lot == null)
                    {
                        lot = new InventoryLot
                        {
                            ItemId = line.ItemId,
                            LotCode = lotCode,
                            ExpiryDate = line.Expiry,
                            UnitCost = line.UnitCost
                        };
                        _context.InventoryLots.Add(lot);
                        await _context.SaveChangesAsync();
                    }

                    var movement = new StockMovement
                    {
                        TenantId = "tenant-1", // Default tenant for MVP
                        SiteId = request.SiteId,
                        ItemId = line.ItemId,
                        LotId = lot.Id,
                        LocationId = line.LocationId,
                        MovementType = MovementType.Receipt,
                        QtyBase = line.Qty,
                        ReferenceId = receiptId,
                        ReferenceType = "receipt"
                    };
                    
                    _context.StockMovements.Add(movement);
                }

                await _context.SaveChangesAsync();
                return Ok(new { id = receiptId, message = "Receipt created successfully" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }

        [HttpPost("production-runs")]
        public async Task<IActionResult> CreateProductionRun([FromBody] CreateProductionRunRequest request)
        {
            try
            {
                var productionId = Guid.NewGuid().ToString();
                
                var recipe = await _context.Recipes
                    .Include(r => r.Ingredients)
                    .ThenInclude(ri => ri.Item)
                    .FirstOrDefaultAsync(r => r.Id == request.RecipeId);

                if (recipe == null)
                {
                    return NotFound("Recipe not found");
                }

                var scaleFactor = (double)request.Portions / recipe.YieldPortions;

                foreach (var ingredient in recipe.Ingredients)
                {
                    var requiredQty = ingredient.QtyBase * scaleFactor;
                    
                    var availableLots = await _context.StockMovements
                        .Where(sm => sm.ItemId == ingredient.ItemId && sm.SiteId == request.SiteId)
                        .Include(sm => sm.Lot)
                        .GroupBy(sm => sm.LotId)
                        .Select(g => new { LotId = g.Key, QtyOnHand = g.Sum(sm => sm.QtyBase) })
                        .Where(x => x.QtyOnHand > 0)
                        .ToListAsync();

                    if (availableLots.Sum(l => l.QtyOnHand) < requiredQty)
                    {
                        return BadRequest($"Insufficient stock for item {ingredient.Item.Name}");
                    }

                    var firstLot = availableLots.First();
                    
                    var movement = new StockMovement
                    {
                        TenantId = "tenant-1",
                        SiteId = request.SiteId,
                        ItemId = ingredient.ItemId,
                        LotId = firstLot.LotId,
                        LocationId = "location-1", // Default location for MVP
                        MovementType = MovementType.Production,
                        QtyBase = -requiredQty, // Negative for consumption
                        ReferenceId = productionId,
                        ReferenceType = "production"
                    };
                    
                    _context.StockMovements.Add(movement);
                }

                await _context.SaveChangesAsync();
                return Ok(new { id = productionId, message = "Production run created successfully" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }

        [HttpPost("wastage")]
        public async Task<IActionResult> CreateWastage([FromBody] CreateWastageRequest request)
        {
            try
            {
                var wastageId = Guid.NewGuid().ToString();
                
                var movement = new StockMovement
                {
                    TenantId = "tenant-1",
                    SiteId = request.SiteId,
                    ItemId = request.ItemId,
                    LotId = request.LotId,
                    LocationId = request.LocationId,
                    MovementType = MovementType.Wastage,
                    QtyBase = -request.QtyBase, // Negative for wastage
                    ReferenceId = wastageId,
                    ReferenceType = "wastage",
                    Reason = request.Reason
                };
                
                _context.StockMovements.Add(movement);
                await _context.SaveChangesAsync();
                
                return Ok(new { id = wastageId, message = "Wastage recorded successfully" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }

        [HttpPost("transfers")]
        public async Task<IActionResult> CreateTransfer([FromBody] CreateTransferRequest request)
        {
            try
            {
                var transfer = new Transfer
                {
                    FromSiteId = request.FromSiteId,
                    ToSiteId = request.ToSiteId,
                    Status = TransferStatus.Pending
                };
                
                _context.Transfers.Add(transfer);

                foreach (var line in request.Lines)
                {
                    var transferLine = new TransferLine
                    {
                        TransferId = transfer.Id,
                        ItemId = line.ItemId,
                        QtyBase = line.QtyBase
                    };
                    
                    _context.TransferLines.Add(transferLine);
                }

                await _context.SaveChangesAsync();
                return Ok(new { id = transfer.Id, message = "Transfer created successfully" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }

        [HttpPost("counts")]
        public async Task<IActionResult> CreateCount([FromBody] CreateCountRequest request)
        {
            try
            {
                var countId = Guid.NewGuid().ToString();
                
                foreach (var line in request.Lines)
                {
                    var currentQty = await _context.StockMovements
                        .Where(sm => sm.ItemId == line.ItemId && 
                                   sm.LocationId == line.LocationId && 
                                   sm.LotId == line.LotId)
                        .SumAsync(sm => sm.QtyBase);

                    var adjustment = line.ActualQty - currentQty;
                    
                    if (adjustment != 0)
                    {
                        var movement = new StockMovement
                        {
                            TenantId = "tenant-1",
                            SiteId = request.SiteId,
                            ItemId = line.ItemId,
                            LotId = line.LotId,
                            LocationId = line.LocationId,
                            MovementType = MovementType.Adjustment,
                            QtyBase = adjustment,
                            ReferenceId = countId,
                            ReferenceType = "count",
                            Reason = $"Count adjustment: Expected {line.ExpectedQty}, Actual {line.ActualQty}"
                        };
                        
                        _context.StockMovements.Add(movement);
                    }
                }

                await _context.SaveChangesAsync();
                return Ok(new { id = countId, message = "Count completed successfully" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }

        [HttpGet("on-hand")]
        public async Task<IActionResult> GetInventoryOnHand([FromQuery] string? siteId = null)
        {
            try
            {
                var query = _context.StockMovements
                    .Include(sm => sm.Item)
                    .Include(sm => sm.Location)
                    .Include(sm => sm.Lot)
                    .AsQueryable();

                if (!string.IsNullOrEmpty(siteId))
                {
                    query = query.Where(sm => sm.SiteId == siteId);
                }

                var inventory = await query
                    .GroupBy(sm => new { sm.ItemId, sm.LocationId, sm.LotId })
                    .Select(g => new InventoryOnHandResponse
                    {
                        ItemId = g.Key.ItemId,
                        ItemName = g.First().Item.Name,
                        ItemSku = g.First().Item.Sku,
                        LocationId = g.Key.LocationId,
                        LocationName = g.First().Location.Name,
                        LotId = g.Key.LotId,
                        LotCode = g.First().Lot.LotCode,
                        ExpiryDate = g.First().Lot.ExpiryDate,
                        QtyOnHand = g.Sum(sm => sm.QtyBase),
                        UnitCost = g.First().Lot.UnitCost,
                        TotalValue = g.Sum(sm => sm.QtyBase) * (g.First().Lot.UnitCost ?? 0)
                    })
                    .Where(i => i.QtyOnHand > 0)
                    .ToListAsync();

                return Ok(inventory);
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }

        [HttpGet("movements")]
        public async Task<IActionResult> GetStockMovements([FromQuery] string? siteId = null)
        {
            try
            {
                var query = _context.StockMovements
                    .Include(sm => sm.Item)
                    .Include(sm => sm.Location)
                    .Include(sm => sm.Lot)
                    .AsQueryable();

                if (!string.IsNullOrEmpty(siteId))
                {
                    query = query.Where(sm => sm.SiteId == siteId);
                }

                var movements = await query
                    .OrderByDescending(sm => sm.CreatedAt)
                    .Take(100)
                    .Select(sm => new StockMovementResponse
                    {
                        Id = sm.Id,
                        MovementType = sm.MovementType.ToString().ToLower(),
                        ItemName = sm.Item.Name,
                        QtyBase = sm.QtyBase,
                        LocationName = sm.Location.Name,
                        LotCode = sm.Lot.LotCode,
                        Reason = sm.Reason,
                        CreatedAt = sm.CreatedAt
                    })
                    .ToListAsync();

                return Ok(movements);
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }

        [HttpGet("items")]
        public async Task<IActionResult> GetItems()
        {
            try
            {
                var items = await _context.Items
                    .Select(i => new ItemResponse
                    {
                        Id = i.Id,
                        Sku = i.Sku,
                        Name = i.Name,
                        Category = i.Category,
                        StorageType = i.StorageType,
                        BaseUom = i.BaseUom,
                        StandardCost = i.StandardCost
                    })
                    .ToListAsync();

                return Ok(items);
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }

        [HttpGet("sites")]
        public async Task<IActionResult> GetSites()
        {
            try
            {
                var sites = await _context.Sites
                    .Include(s => s.Locations)
                    .Select(s => new SiteResponse
                    {
                        Id = s.Id,
                        Name = s.Name,
                        Address = s.Address,
                        Locations = s.Locations.Select(l => new LocationResponse
                        {
                            Id = l.Id,
                            Name = l.Name,
                            StorageType = l.StorageType
                        }).ToList()
                    })
                    .ToListAsync();

                return Ok(sites);
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }

        [HttpGet("suppliers")]
        public async Task<IActionResult> GetSuppliers()
        {
            try
            {
                var suppliers = await _context.Suppliers
                    .Select(s => new SupplierResponse
                    {
                        Id = s.Id,
                        Name = s.Name,
                        AccountCode = s.AccountCode,
                        ContactEmail = s.ContactEmail
                    })
                    .ToListAsync();

                return Ok(suppliers);
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }

        [HttpGet("recipes")]
        public async Task<IActionResult> GetRecipes()
        {
            try
            {
                var recipes = await _context.Recipes
                    .Select(r => new RecipeResponse
                    {
                        Id = r.Id,
                        Name = r.Name,
                        YieldPortions = r.YieldPortions
                    })
                    .ToListAsync();

                return Ok(recipes);
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }

        [HttpGet("transfers")]
        public async Task<IActionResult> GetTransfers()
        {
            try
            {
                var transfers = await _context.Transfers
                    .Include(t => t.FromSite)
                    .Include(t => t.ToSite)
                    .Include(t => t.Lines)
                    .Select(t => new TransferResponse
                    {
                        Id = t.Id,
                        FromSiteName = t.FromSite.Name,
                        ToSiteName = t.ToSite.Name,
                        Status = t.Status,
                        CreatedAt = t.CreatedAt,
                        Lines = t.Lines.Select(l => new { l.ItemId, l.QtyBase }).Cast<object>().ToList()
                    })
                    .ToListAsync();

                return Ok(transfers);
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }
    }
}
