namespace Fresh.Model
{
    public class PurchasesClientDto
    {
        public int ClientId { get; set; }
        public string ClientFirstLastName { get; set; }
        public string? ClientPhone { get; set; }
        public string ClientEmail { get; set; }

        public int TotalPurchases { get; set; } = 0;
        public decimal TotalQuantity { get; set; } = 0;
        public decimal TotalEarnings { get; set; } = 0;
        public decimal TotalPaid { get; set; } = 0;
        public decimal TotalDebt { get; set; } = 0;
    }
}
