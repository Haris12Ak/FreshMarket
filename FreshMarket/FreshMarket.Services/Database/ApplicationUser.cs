using Microsoft.AspNetCore.Identity;

namespace FreshMarket.Services.Database
{
    public abstract class ApplicationUser : IdentityUser
    {
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public int? CityId { get; set; }

        public City? City { get; set; }
    }
}
