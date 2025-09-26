using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CateringApi.Models
{
    public class TransferLine
    {
        [Key]
        public string Id { get; set; } = Guid.NewGuid().ToString();
        
        [Required]
        [ForeignKey("Transfer")]
        public string TransferId { get; set; } = string.Empty;
        
        [Required]
        [ForeignKey("Item")]
        public string ItemId { get; set; } = string.Empty;
        
        [Required]
        public double QtyBase { get; set; }
        
        public double PickedQty { get; set; } = 0;
        
        public double ReceivedQty { get; set; } = 0;
        
        public virtual Transfer Transfer { get; set; } = null!;
        public virtual Item Item { get; set; } = null!;
    }
}
