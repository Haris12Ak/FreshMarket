namespace FreshMarket.Model
{
    public class City
    {
        public int CityId { get; set; }
        public string Name { get; set; } = string.Empty;
        public int? PostalCode { get; set; }
        public int CountryId { get; set; }
    }
}
