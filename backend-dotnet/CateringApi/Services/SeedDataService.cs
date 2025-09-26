using CateringApi.Data;
using CateringApi.Models;

namespace CateringApi.Services
{
    public static class SeedDataService
    {
        public static async Task SeedAsync(CateringDbContext context)
        {
            if (context.Tenants.Any())
            {
                return; // Database already seeded
            }

            var tenant = new Tenant
            {
                Id = "tenant-1",
                Name = "Demo School District"
            };
            context.Tenants.Add(tenant);

            var user = new User
            {
                Id = "user-1",
                TenantId = tenant.Id,
                Email = "admin@school.edu",
                Name = "System Administrator"
            };
            context.Users.Add(user);

            var site = new Site
            {
                Id = "site-1",
                TenantId = tenant.Id,
                Name = "Central High School",
                Address = "123 Education St, Learning City, LC 12345"
            };
            context.Sites.Add(site);

            var locations = new[]
            {
                new Location { Id = "location-1", SiteId = site.Id, Name = "Main Kitchen Dry Store", StorageType = StorageType.Ambient },
                new Location { Id = "location-2", SiteId = site.Id, Name = "Main Kitchen Fridge", StorageType = StorageType.Chilled },
                new Location { Id = "location-3", SiteId = site.Id, Name = "Main Kitchen Freezer", StorageType = StorageType.Frozen }
            };
            context.Locations.AddRange(locations);

            var supplier = new Supplier
            {
                Id = "supplier-1",
                TenantId = tenant.Id,
                Name = "Fresh Foods Wholesale",
                AccountCode = "FF001",
                ContactEmail = "orders@freshfoods.com"
            };
            context.Suppliers.Add(supplier);

            var items = new[]
            {
                new Item
                {
                    Id = "item-1",
                    TenantId = tenant.Id,
                    Sku = "MILK-001",
                    Name = "Whole Milk",
                    Category = "Dairy",
                    StorageType = StorageType.Chilled,
                    BaseUom = "ml",
                    PackUom = "litre",
                    PackSize = 1000,
                    CaseUom = "case",
                    CaseSize = 12000,
                    StandardCost = 0.0015
                },
                new Item
                {
                    Id = "item-2",
                    TenantId = tenant.Id,
                    Sku = "PASTA-001",
                    Name = "Penne Pasta",
                    Category = "Dry Goods",
                    StorageType = StorageType.Ambient,
                    BaseUom = "g",
                    PackUom = "kg",
                    PackSize = 1000,
                    CaseUom = "case",
                    CaseSize = 20000,
                    StandardCost = 0.002
                },
                new Item
                {
                    Id = "item-3",
                    TenantId = tenant.Id,
                    Sku = "BREAD-001",
                    Name = "Wholemeal Bread",
                    Category = "Bakery",
                    StorageType = StorageType.Ambient,
                    BaseUom = "slice",
                    PackUom = "loaf",
                    PackSize = 20,
                    CaseUom = "case",
                    CaseSize = 240,
                    StandardCost = 0.15
                },
                new Item
                {
                    Id = "item-4",
                    TenantId = tenant.Id,
                    Sku = "CHICKEN-001",
                    Name = "Chicken Breast",
                    Category = "Meat",
                    StorageType = StorageType.Chilled,
                    BaseUom = "g",
                    PackUom = "kg",
                    PackSize = 1000,
                    CaseUom = "case",
                    CaseSize = 10000,
                    StandardCost = 0.008
                }
            };
            context.Items.AddRange(items);

            var recipe = new Recipe
            {
                Id = "recipe-1",
                TenantId = tenant.Id,
                Name = "Chicken Pasta Bake",
                YieldPortions = 50
            };
            context.Recipes.Add(recipe);

            var ingredients = new[]
            {
                new RecipeIngredient { RecipeId = recipe.Id, ItemId = "item-2", QtyBase = 2500, Uom = "g" }, // Pasta
                new RecipeIngredient { RecipeId = recipe.Id, ItemId = "item-4", QtyBase = 3000, Uom = "g" }, // Chicken
                new RecipeIngredient { RecipeId = recipe.Id, ItemId = "item-1", QtyBase = 1000, Uom = "ml" }  // Milk
            };
            context.RecipeIngredients.AddRange(ingredients);

            var lots = new[]
            {
                new InventoryLot
                {
                    Id = "lot-1",
                    ItemId = "item-1",
                    LotCode = "MILK-20250101",
                    ExpiryDate = DateTime.UtcNow.AddDays(7),
                    UnitCost = 0.0015
                },
                new InventoryLot
                {
                    Id = "lot-2",
                    ItemId = "item-2",
                    LotCode = "PASTA-20250101",
                    ExpiryDate = DateTime.UtcNow.AddDays(365),
                    UnitCost = 0.002
                },
                new InventoryLot
                {
                    Id = "lot-3",
                    ItemId = "item-3",
                    LotCode = "BREAD-20250101",
                    ExpiryDate = DateTime.UtcNow.AddDays(3),
                    UnitCost = 0.15
                },
                new InventoryLot
                {
                    Id = "lot-4",
                    ItemId = "item-4",
                    LotCode = "CHICKEN-20250101",
                    ExpiryDate = DateTime.UtcNow.AddDays(5),
                    UnitCost = 0.008
                }
            };
            context.InventoryLots.AddRange(lots);

            var movements = new[]
            {
                new StockMovement
                {
                    TenantId = tenant.Id,
                    SiteId = site.Id,
                    ItemId = "item-1",
                    LotId = "lot-1",
                    LocationId = "location-2", // Fridge
                    MovementType = MovementType.Receipt,
                    QtyBase = 12000, // 12 litres
                    ReferenceId = "initial-stock",
                    ReferenceType = "opening_balance"
                },
                new StockMovement
                {
                    TenantId = tenant.Id,
                    SiteId = site.Id,
                    ItemId = "item-2",
                    LotId = "lot-2",
                    LocationId = "location-1", // Dry store
                    MovementType = MovementType.Receipt,
                    QtyBase = 20000, // 20 kg
                    ReferenceId = "initial-stock",
                    ReferenceType = "opening_balance"
                },
                new StockMovement
                {
                    TenantId = tenant.Id,
                    SiteId = site.Id,
                    ItemId = "item-3",
                    LotId = "lot-3",
                    LocationId = "location-1", // Dry store
                    MovementType = MovementType.Receipt,
                    QtyBase = 240, // 12 loaves
                    ReferenceId = "initial-stock",
                    ReferenceType = "opening_balance"
                },
                new StockMovement
                {
                    TenantId = tenant.Id,
                    SiteId = site.Id,
                    ItemId = "item-4",
                    LotId = "lot-4",
                    LocationId = "location-2", // Fridge
                    MovementType = MovementType.Receipt,
                    QtyBase = 10000, // 10 kg
                    ReferenceId = "initial-stock",
                    ReferenceType = "opening_balance"
                }
            };
            context.StockMovements.AddRange(movements);

            await context.SaveChangesAsync();
        }
    }
}
