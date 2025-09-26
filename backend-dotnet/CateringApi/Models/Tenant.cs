using System.ComponentModel.DataAnnotations;

namespace CateringApi.Models
{
    public class Tenant
    {
        [Key]
        public string Id { get; set; } = Guid.NewGuid().ToString();
        
        [Required]
        public string Name { get; set; } = string.Empty;
        
        public string? Domain { get; set; }
        
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        
        public virtual ICollection<User> Users { get; set; } = new List<User>();
        public virtual ICollection<Site> Sites { get; set; } = new List<Site>();
        public virtual ICollection<Supplier> Suppliers { get; set; } = new List<Supplier>();
        public virtual ICollection<Item> Items { get; set; } = new List<Item>();
        public virtual ICollection<Recipe> Recipes { get; set; } = new List<Recipe>();
    }
}
