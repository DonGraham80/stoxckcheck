using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CateringApi.Models
{
    public class Transfer
    {
        [Key]
        public string Id { get; set; } = Guid.NewGuid().ToString();
        
        [Required]
        [ForeignKey("FromSite")]
        public string FromSiteId { get; set; } = string.Empty;
        
        [Required]
        [ForeignKey("ToSite")]
        public string ToSiteId { get; set; } = string.Empty;
        
        public TransferStatus Status { get; set; } = TransferStatus.Pending;
        
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        
        [ForeignKey("User")]
        public string? CreatedBy { get; set; }
        
        public virtual Site FromSite { get; set; } = null!;
        public virtual Site ToSite { get; set; } = null!;
        public virtual User? User { get; set; }
        public virtual ICollection<TransferLine> Lines { get; set; } = new List<TransferLine>();
    }
}
