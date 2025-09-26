using CateringApi.Models;

namespace CateringApi.DTOs
{
    public class ItemResponse
    {
        public string Id { get; set; } = string.Empty;
        public string Sku { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public string? Category { get; set; }
        public StorageType StorageType { get; set; }
        public string BaseUom { get; set; } = string.Empty;
        public double? StandardCost { get; set; }
    }

    public class LocationResponse
    {
        public string Id { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public StorageType StorageType { get; set; }
    }

    public class SiteResponse
    {
        public string Id { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public string? Address { get; set; }
        public List<LocationResponse> Locations { get; set; } = new();
    }

    public class SupplierResponse
    {
        public string Id { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public string? AccountCode { get; set; }
        public string? ContactEmail { get; set; }
    }

    public class RecipeResponse
    {
        public string Id { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public int YieldPortions { get; set; }
    }

    public class InventoryOnHandResponse
    {
        public string ItemId { get; set; } = string.Empty;
        public string ItemName { get; set; } = string.Empty;
        public string ItemSku { get; set; } = string.Empty;
        public string LocationId { get; set; } = string.Empty;
        public string LocationName { get; set; } = string.Empty;
        public string LotId { get; set; } = string.Empty;
        public string LotCode { get; set; } = string.Empty;
        public DateTime? ExpiryDate { get; set; }
        public double QtyOnHand { get; set; }
        public double? UnitCost { get; set; }
        public double TotalValue { get; set; }
    }

    public class StockMovementResponse
    {
        public string Id { get; set; } = string.Empty;
        public string MovementType { get; set; } = string.Empty;
        public string ItemName { get; set; } = string.Empty;
        public double QtyBase { get; set; }
        public string LocationName { get; set; } = string.Empty;
        public string LotCode { get; set; } = string.Empty;
        public string? Reason { get; set; }
        public DateTime CreatedAt { get; set; }
    }

    public class TransferResponse
    {
        public string Id { get; set; } = string.Empty;
        public string FromSiteName { get; set; } = string.Empty;
        public string ToSiteName { get; set; } = string.Empty;
        public TransferStatus Status { get; set; }
        public DateTime CreatedAt { get; set; }
        public List<object> Lines { get; set; } = new();
    }
}
