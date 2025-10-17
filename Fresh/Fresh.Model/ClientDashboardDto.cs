namespace Fresh.Model
{
    public class ClientDashboardDto
    {
        public int TotalPurchases { get; set; }
        public decimal TotalEarnings { get; set; }
        public decimal TotalPaid { get; set; }
        public decimal TotalDebt { get; set; }
        public List<PurchasedProductsDto> PurchasedProducts { get; set; } = new List<PurchasedProductsDto>();
        public List<MonthlyPurchaseDto> MonthlyPurchase { get; set; } = new List<MonthlyPurchaseDto>();
        public List<TopProductsDto> TopProducts { get; set; } = new List<TopProductsDto>();
    }
}
