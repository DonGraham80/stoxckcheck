using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CateringApi.Models
{
    public class Item
    {
        [Key]
        public string Id { get; set; } = Guid.NewGuid().ToString();
        
        [Required]
        [ForeignKey("Tenant")]
        public string TenantId { get; set; } = string.Empty;
        
        [Required]
        public string Sku { get; set; } = string.Empty;
        
        [Required]
        public string Name { get; set; } = string.Empty;
        
        public string? Category { get; set; }
        
        [Required]
        public StorageType StorageType { get; set; }
        
        [Required]
        public string BaseUom { get; set; } = string.Empty;
        
        public string? PackUom { get; set; }
        
        public double? PackSize { get; set; }
        
        public string? CaseUom { get; set; }
        
        public double? CaseSize { get; set; }
        
        public double? StandardCost { get; set; }
        
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        
        public virtual Tenant Tenant { get; set; } = null!;
        public virtual ICollection<ItemBarcode> Barcodes { get; set; } = new List<ItemBarcode>();
        public virtual ICollection<InventoryLot> Lots { get; set; } = new List<InventoryLot>();
    }
}
