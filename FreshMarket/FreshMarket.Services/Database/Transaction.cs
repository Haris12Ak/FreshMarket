namespace FreshMarket.Services.Database
{
    public class Transaction
    {
        public int TransactionId { get; set; }
        public decimal Quantity { get; set; }
        public decimal PricePerUnit { get; set; }
        public decimal TotalPrice { get; set; }
        public DateTime TransactionDateTime { get; set; }
        public int ProductId { get; set; }
        public string CompanyId { get; set; }
        public string ClientId { get; set; }

        public Product Product { get; set; }
        public Company Company { get; set; }
        public Client Client { get; set; }
    }
}
