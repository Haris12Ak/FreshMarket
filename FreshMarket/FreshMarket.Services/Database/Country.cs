namespace FreshMarket.Services.Database
{
    public class Country
    {
        public int CountryId { get; set; }
        public string Name { get; set; } = string.Empty;

        public ICollection<City> Cities { get; set; } = new List<City>();
    }
}
