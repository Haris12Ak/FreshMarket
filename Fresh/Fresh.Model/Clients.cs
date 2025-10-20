namespace Fresh.Model
{
    public class Clients
    {
        public int Id { get; set; }
        public string KeycloakId { get; set; }
        public string Username { get; set; }
        public string Email { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string? Phone { get; set; }
        public DateTime CreatedAt { get; set; }
        public bool IsActive { get; set; }
        public int CompanyId { get; set; }

        public List<Purchase> Purchases { get; set; }
    }
}
