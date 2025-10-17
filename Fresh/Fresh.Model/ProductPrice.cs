namespace Fresh.Model
{
    public class ProductPrice
    {
        public int Id { get; set; }
        public decimal PricePerUnit { get; set; }
        public DateTime EffectiveFrom { get; set; }
        public int ProductId { get; set; }

        public Products Products { get; set; }
    }
}
