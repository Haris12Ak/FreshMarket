namespace Fresh.Model
{
    public class AdminDashboardDto
    {
        public int TotalProducts { get; set; }
        public int TotalClients { get; set; }
        public int TotalPurchases { get; set; }
        public decimal TotalPaid { get; set; }
        public decimal TotalDebt { get; set; }
        public List<PurchasedProductsDto> PurchasedProducts { get; set; } = new List<PurchasedProductsDto>();
        public List<MonthlyPurchaseDto> MonthlyPurchase { get; set; } = new List<MonthlyPurchaseDto>();
        public List<TopClientsDto> TopClients { get; set; } = new List<TopClientsDto>();
        public List<PaymentTypeDto> PaymentType { get; set; } = new List<PaymentTypeDto>();
    }
}
