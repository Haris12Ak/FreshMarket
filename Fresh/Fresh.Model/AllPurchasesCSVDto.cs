namespace Fresh.Model
{
    public class AllPurchasesCSVDto
    {
        public int PurchaseId { get; set; }
        public string ClientFirstLastName { get; set; }
        public string ProductName { get; set; }
        public string ProductType { get; set; }
        public UnitType Unit { get; set; }
        public decimal Quantity { get; set; }
        public decimal PricePerUnit { get; set; }
        public decimal TotalAmount { get; set; }
        public DateTime PurchaseDate { get; set; }
        public int? NumberOfInstallments { get; set; }
        public PaymentType PaymentType { get; set; }
        public bool IsPaid { get; set; }
        public decimal TotalPaid { get; set; }
        public decimal TotalDebt { get; set; }

    }
}
