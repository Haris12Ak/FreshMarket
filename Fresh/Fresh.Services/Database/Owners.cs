using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Fresh.Services.Database
{
    public class Owners
    {
        [Key]
        public int Id { get; set; }
        public string KeycloakId { get; set; }
        public string Username { get; set; }
        public string Email { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string? Phone { get; set; }
        public DateTime CreatedAt { get; set; }

        [ForeignKey(nameof(CompanyId))]
        public Companies Companies { get; set; }
        public int CompanyId { get; set; }
    }
}
