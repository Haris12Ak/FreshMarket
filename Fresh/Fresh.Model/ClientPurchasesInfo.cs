namespace Fresh.Model
{
    public class ClientPurchasesInfo
    {
        public int ClientId { get; set; }
        public int TotalPurchases { get; set; } = 0;
        public decimal TotalQuantity { get; set; } = 0;
        public decimal TotalEarnings { get; set; } = 0;
        public string MostSoldProduct { get; set; } = string.Empty;
        public DateTime LastPurchaseDate { get; set; } = DateTime.MinValue;
        public decimal TotalPaid { get; set; } = 0;
        public decimal TotalDebt { get; set; } = 0;
    }
}
