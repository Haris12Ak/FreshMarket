using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Fresh.Services.Database
{
    public class ProductPrice
    {
        [Key]
        public int Id { get; set; }
        public decimal PricePerUnit { get; set; }
        public DateTime EffectiveFrom { get; set; }

        [ForeignKey(nameof(ProductId))]
        public Products Products { get; set; }
        public int ProductId { get; set; }
    }
}
