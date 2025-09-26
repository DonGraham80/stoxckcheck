using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;
using CateringApi.Models;

namespace CateringApi.Data
{
    public class CateringDbContext : IdentityDbContext<User>
    {
        public CateringDbContext(DbContextOptions<CateringDbContext> options) : base(options)
        {
        }

        public DbSet<Tenant> Tenants { get; set; }
        public DbSet<Site> Sites { get; set; }
        public DbSet<Location> Locations { get; set; }
        public DbSet<Supplier> Suppliers { get; set; }
        public DbSet<Item> Items { get; set; }
        public DbSet<ItemBarcode> ItemBarcodes { get; set; }
        public DbSet<Recipe> Recipes { get; set; }
        public DbSet<RecipeIngredient> RecipeIngredients { get; set; }
        public DbSet<InventoryLot> InventoryLots { get; set; }
        public DbSet<StockMovement> StockMovements { get; set; }
        public DbSet<Transfer> Transfers { get; set; }
        public DbSet<TransferLine> TransferLines { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<RecipeIngredient>()
                .HasKey(ri => new { ri.RecipeId, ri.ItemId });

            modelBuilder.Entity<Item>()
                .HasIndex(i => i.Sku)
                .IsUnique();

            modelBuilder.Entity<User>()
                .HasIndex(u => u.Email)
                .IsUnique();

            modelBuilder.Entity<ItemBarcode>()
                .HasIndex(ib => ib.Barcode)
                .IsUnique();

            modelBuilder.Entity<Transfer>()
                .HasOne(t => t.FromSite)
                .WithMany()
                .HasForeignKey(t => t.FromSiteId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Transfer>()
                .HasOne(t => t.ToSite)
                .WithMany()
                .HasForeignKey(t => t.ToSiteId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Location>()
                .Property(l => l.StorageType)
                .HasConversion<string>();

            modelBuilder.Entity<Item>()
                .Property(i => i.StorageType)
                .HasConversion<string>();

            modelBuilder.Entity<StockMovement>()
                .Property(sm => sm.MovementType)
                .HasConversion<string>();

            modelBuilder.Entity<Transfer>()
                .Property(t => t.Status)
                .HasConversion<string>();
        }
    }
}
