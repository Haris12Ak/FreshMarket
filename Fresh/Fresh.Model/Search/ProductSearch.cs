namespace Fresh.Model.Search
{
    public class ProductSearch : BaseSearch
    {
        public string? Name { get; set; }
        public string? ProductType { get; set; }
        public bool? IsActive { get; set; }
    }
}
