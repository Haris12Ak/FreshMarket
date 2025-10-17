using Fresh.Services.Database;
using Microsoft.EntityFrameworkCore;

namespace Fresh.Services
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        {

        }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            base.OnConfiguring(optionsBuilder);
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
        }

        public DbSet<Clients> Clients { get; set; }
        public DbSet<Companies> Companies { get; set; }
        public DbSet<Notification> Notification { get; set; }
        public DbSet<Owners> Owners { get; set; }
        public DbSet<ProductPrice> ProductPrice { get; set; }
        public DbSet<Products> Products { get; set; }
        public DbSet<ProductType> ProductType { get; set; }
        public DbSet<Purchase> Purchase { get; set; }
        public DbSet<Payment> Payment { get; set; }
    }
}
