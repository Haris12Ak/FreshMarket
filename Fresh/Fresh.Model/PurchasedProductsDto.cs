namespace Fresh.Model
{
    public class PurchasedProductsDto
    {
        public string ProductName { get; set; }
        public decimal Quantity { get; set; }
        public decimal PricePerUnit { get; set; }
        public UnitType Unit { get; set; }
        public decimal Total { get; set; }
    }
}
