namespace FreshMarket.Services.Database
{
    public class Product
    {
        public int ProductId { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public byte[]? Image { get; set; }
        public decimal Price { get; set; }
        public decimal PricePerUnit { get; set; }
        public int ProductTypeId { get; set; }
        public string CompanyId { get; set; }

        public ProductType ProductType { get; set; }
        public Company Company { get; set; }

        public ICollection<Transaction> Transactions { get; set; } = new List<Transaction>();
    }
}
