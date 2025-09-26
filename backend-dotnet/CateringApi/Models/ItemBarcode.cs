using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CateringApi.Models
{
    public class ItemBarcode
    {
        [Key]
        public string Id { get; set; } = Guid.NewGuid().ToString();
        
        [Required]
        [ForeignKey("Item")]
        public string ItemId { get; set; } = string.Empty;
        
        [Required]
        public string Barcode { get; set; } = string.Empty;
        
        public bool IsPrimary { get; set; } = false;
        
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        
        public virtual Item Item { get; set; } = null!;
    }
}
