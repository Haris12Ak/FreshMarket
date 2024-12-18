namespace FreshMarket.Model.Requests
{
    public class CityUpdateRequest
    {
        public string Name { get; set; } = string.Empty;
        public int? PostalCode { get; set; }
        public int CountryId { get; set; }
    }
}
