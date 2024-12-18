namespace FreshMarket.Services.Database
{
    public class Client : ApplicationUser
    {
        public byte[]? ClientImage { get; set; }
        public string? ClientType { get; set; }
        public string? CompanyId { get; set; }

        public Company? Company { get; set; }

        public ICollection<Transaction> Transactions { get; set; } = new List<Transaction>();
    }
}
