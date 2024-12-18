namespace FreshMarket.Services.Database
{
    public class City
    {
        public int CityId { get; set; }
        public string Name { get; set; } = string.Empty;
        public int? PostalCode { get; set; }
        public int CountryId { get; set; }

        public Country Country { get; set; }

        public ICollection<ApplicationUser> ApplicationUsers { get; set; } = new List<ApplicationUser>();
    }
}
