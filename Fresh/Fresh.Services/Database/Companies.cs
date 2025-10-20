using System.ComponentModel.DataAnnotations;

namespace Fresh.Services.Database
{
    public class Companies
    {
        [Key]
        public int Id { get; set; }
        public string CompanyName { get; set; }
        public string CompanyAddress { get; set; }
        public byte[]? CompanyLogo { get; set; }

        public ICollection<Owners> Owners { get; set; } = new List<Owners>();
        public ICollection<Clients> Clients { get; set; } = new List<Clients>();
        public ICollection<Notification> Notification { get; set; } = new List<Notification>();
        public ICollection<Products> Products { get; set; } = new List<Products>();
    }
}
