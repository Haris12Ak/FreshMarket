namespace Fresh.Model
{
    public class MonthlyPurchaseDto
    {
        public int Year { get; set; }
        public int Month { get; set; }
        public decimal TotalQuantity { get; set; }
        public decimal TotalProfit { get; set; }
    }
}
