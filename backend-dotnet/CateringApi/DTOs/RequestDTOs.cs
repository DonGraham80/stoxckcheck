using System.ComponentModel.DataAnnotations;
using CateringApi.Models;

namespace CateringApi.DTOs
{
    public class ReceiptLineDto
    {
        [Required]
        public string ItemId { get; set; } = string.Empty;
        
        [Required]
        public double Qty { get; set; }
        
        [Required]
        public string Uom { get; set; } = string.Empty;
        
        public string? Lot { get; set; }
        
        public DateTime? Expiry { get; set; }
        
        public double? UnitCost { get; set; }
        
        [Required]
        public string LocationId { get; set; } = string.Empty;
    }

    public class CreateReceiptRequest
    {
        [Required]
        public string SupplierId { get; set; } = string.Empty;
        
        [Required]
        public string SiteId { get; set; } = string.Empty;
        
        public string? DeliveryRef { get; set; }
        
        [Required]
        public List<ReceiptLineDto> Lines { get; set; } = new();
    }

    public class CreateProductionRunRequest
    {
        [Required]
        public string SiteId { get; set; } = string.Empty;
        
        [Required]
        public string RecipeId { get; set; } = string.Empty;
        
        [Required]
        public int Portions { get; set; }
        
        public string LotStrategy { get; set; } = "FEFO";
    }

    public class CreateWastageRequest
    {
        [Required]
        public string SiteId { get; set; } = string.Empty;
        
        [Required]
        public string ItemId { get; set; } = string.Empty;
        
        [Required]
        public double QtyBase { get; set; }
        
        [Required]
        public string Reason { get; set; } = string.Empty;
        
        [Required]
        public string LotId { get; set; } = string.Empty;
        
        [Required]
        public string LocationId { get; set; } = string.Empty;
    }

    public class TransferLineRequestDto
    {
        [Required]
        public string ItemId { get; set; } = string.Empty;
        
        [Required]
        public double QtyBase { get; set; }
    }

    public class CreateTransferRequest
    {
        [Required]
        public string FromSiteId { get; set; } = string.Empty;
        
        [Required]
        public string ToSiteId { get; set; } = string.Empty;
        
        [Required]
        public List<TransferLineRequestDto> Lines { get; set; } = new();
    }

    public class CountLineDto
    {
        [Required]
        public string ItemId { get; set; } = string.Empty;
        
        [Required]
        public string LocationId { get; set; } = string.Empty;
        
        [Required]
        public string LotId { get; set; } = string.Empty;
        
        public double? ExpectedQty { get; set; }
        
        [Required]
        public double ActualQty { get; set; }
    }

    public class CreateCountRequest
    {
        [Required]
        public string SiteId { get; set; } = string.Empty;
        
        [Required]
        public List<CountLineDto> Lines { get; set; } = new();
    }

    public class CreateSiteRequest
    {
        [Required]
        public string Name { get; set; } = string.Empty;
        
        public string? Address { get; set; }
        
        [Required]
        public List<CreateLocationRequest> Locations { get; set; } = new();
    }

    public class CreateLocationRequest
    {
        [Required]
        public string Name { get; set; } = string.Empty;
        
        [Required]
        public StorageType StorageType { get; set; }
    }

    public class LoginRequest
    {
        [Required]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;
        
        [Required]
        public string Password { get; set; } = string.Empty;
    }

    public class RegisterRequest
    {
        [Required]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;
        
        [Required]
        [MinLength(6)]
        public string Password { get; set; } = string.Empty;
        
        [Required]
        public string FirstName { get; set; } = string.Empty;
        
        [Required]
        public string LastName { get; set; } = string.Empty;
        
        public string? TenantName { get; set; }
        
        public string? TenantId { get; set; }
    }

    public class GoogleAuthRequest
    {
        [Required]
        public string IdToken { get; set; } = string.Empty;
        
        public string? TenantName { get; set; }
        
        public string? TenantId { get; set; }
    }
}
