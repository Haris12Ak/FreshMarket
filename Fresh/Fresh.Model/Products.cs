namespace Fresh.Model
{
    public class Products
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public byte[]? Image { get; set; }
        public UnitType Unit { get; set; }
        public bool IsActive { get; set; }
        public int CompanyId { get; set; }
        public int ProductTypeId { get; set; }
        public decimal? CurrentPricePerUnit { get; set; }

        public ProductType ProductType { get; set; }
    }
}
