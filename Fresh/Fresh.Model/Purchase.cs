namespace Fresh.Model
{
    public class Purchase
    {
        public int Id { get; set; }
        public decimal Quantity { get; set; }
        public decimal PricePerUnit { get; set; }
        public decimal TotalAmount { get; set; }
        public DateTime PurchaseDate { get; set; }
        public int? NumberOfInstallments { get; set; }
        public PaymentType PaymentType { get; set; }
        public int ClientId { get; set; }
        public int ProductId { get; set; }

        public Clients Clients { get; set; }
        public Products Products { get; set; }
        public List<Payment> Payments { get; set; } = new List<Payment>();
    }
}
