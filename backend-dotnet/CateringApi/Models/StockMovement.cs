using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CateringApi.Models
{
    public class StockMovement
    {
        [Key]
        public string Id { get; set; } = Guid.NewGuid().ToString();
        
        [Required]
        [ForeignKey("Tenant")]
        public string TenantId { get; set; } = string.Empty;
        
        [Required]
        [ForeignKey("Site")]
        public string SiteId { get; set; } = string.Empty;
        
        [Required]
        [ForeignKey("Item")]
        public string ItemId { get; set; } = string.Empty;
        
        [Required]
        [ForeignKey("InventoryLot")]
        public string LotId { get; set; } = string.Empty;
        
        [Required]
        [ForeignKey("Location")]
        public string LocationId { get; set; } = string.Empty;
        
        [Required]
        public MovementType MovementType { get; set; }
        
        [Required]
        public double QtyBase { get; set; }
        
        public string? ReferenceId { get; set; }
        
        public string? ReferenceType { get; set; }
        
        public string? Reason { get; set; }
        
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        
        [ForeignKey("User")]
        public string? CreatedBy { get; set; }
        
        public virtual Tenant Tenant { get; set; } = null!;
        public virtual Site Site { get; set; } = null!;
        public virtual Item Item { get; set; } = null!;
        public virtual InventoryLot Lot { get; set; } = null!;
        public virtual Location Location { get; set; } = null!;
        public virtual User? User { get; set; }
    }
}
