using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CateringApi.Models
{
    public class RecipeIngredient
    {
        [Key, Column(Order = 0)]
        [ForeignKey("Recipe")]
        public string RecipeId { get; set; } = string.Empty;
        
        [Key, Column(Order = 1)]
        [ForeignKey("Item")]
        public string ItemId { get; set; } = string.Empty;
        
        [Required]
        public double QtyBase { get; set; }
        
        [Required]
        public string Uom { get; set; } = string.Empty;
        
        public virtual Recipe Recipe { get; set; } = null!;
        public virtual Item Item { get; set; } = null!;
    }
}
