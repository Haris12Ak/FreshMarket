namespace FreshMarket.Services.Database
{
    public class Company : ApplicationUser
    {
        public string CompanyName { get; set; } = string.Empty;
        public string CompanyAddress { get; set; } = string.Empty;
        public byte[]? CompanyLogo { get; set; }

        public ICollection<Product> Products { get; set; } = new List<Product>();
        public ICollection<Client> Clients { get; set; } = new List<Client>();
        public ICollection<Transaction> Transactions { get; set; } = new List<Transaction>();
    }
}
