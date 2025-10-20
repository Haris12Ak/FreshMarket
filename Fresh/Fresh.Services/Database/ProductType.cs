using System.ComponentModel.DataAnnotations;

namespace Fresh.Services.Database
{
    public class ProductType
    {
        [Key]
        public int Id { get; set; }
        public string Name { get; set; }
        public string? Descriptions { get; set; }

        public ICollection<Products> Products { get; set; } = new List<Products>();
    }
}
