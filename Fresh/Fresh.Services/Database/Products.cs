using Fresh.Model;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Fresh.Services.Database
{
    public class Products
    {
        [Key]
        public int Id { get; set; }
        public string Name { get; set; }
        public byte[]? Image { get; set; }
        public UnitType Unit { get; set; }
        public bool IsActive { get; set; } = true;

        [ForeignKey(nameof(CompanyId))]
        public Companies Companies { get; set; }
        public int CompanyId { get; set; }

        [ForeignKey(nameof(ProductTypeId))]
        public ProductType ProductType { get; set; }
        public int ProductTypeId { get; set; }

        public ICollection<ProductPrice> ProductPrices { get; set; } = new List<ProductPrice>();
        public ICollection<Purchase> Purchases { get; set; } = new List<Purchase>();
    }
}
