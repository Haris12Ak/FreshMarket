namespace Fresh.Model.Search
{
    public class PurchaseSearch : BaseSearch
    {
        public string? ProductType { get; set; }
        public DateTime? DateFrom { get; set; }
        public DateTime? DateTo { get; set; }
        public bool? IsProductIncluded { get; set; }
        public bool? IsClientIncluded { get; set; }
        public bool? IsPaymentsIncluded { get; set; }
    }
}
