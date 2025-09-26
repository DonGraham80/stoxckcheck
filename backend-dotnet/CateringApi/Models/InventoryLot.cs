using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CateringApi.Models
{
    public class InventoryLot
    {
        [Key]
        public string Id { get; set; } = Guid.NewGuid().ToString();
        
        [Required]
        [ForeignKey("Item")]
        public string ItemId { get; set; } = string.Empty;
        
        [Required]
        public string LotCode { get; set; } = string.Empty;
        
        public DateTime? ExpiryDate { get; set; }
        
        public double? UnitCost { get; set; }
        
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        
        public virtual Item Item { get; set; } = null!;
    }
}
