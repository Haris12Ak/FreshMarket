namespace Fresh.Model
{
    public class PrintReportPurchaseDto
    {
        public string CompanyName { get; set; }
        public string CompanyAddress { get; set; }
        public string CompanyEmail { get; set; }
        public string ClientName { get; set; }
        public string ClientEmail { get; set; }
        public string ProductName { get; set; }
        public string ProductType { get; set; }
        public UnitType Unit { get; set; }
        public decimal Quantity { get; set; }
        public decimal PricePerUnit { get; set; }
        public decimal TotalAmount { get; set; }
        public DateTime PurchaseDate { get; set; }
        public int? NumberOfInstallments { get; set; }
        public PaymentType PaymentType { get; set; }

        public List<Payment> Payments = new List<Payment>();
    }


}
