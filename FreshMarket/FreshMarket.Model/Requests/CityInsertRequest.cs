namespace FreshMarket.Model.Requests
{
    public class CityInsertRequest
    {
        public string Name { get; set; } = string.Empty;
        public int? PostalCode { get; set; }
        public int CountryId { get; set; }
    }
}
