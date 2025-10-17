using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Fresh.Services.Database
{
    public class Notification
    {
        [Key]
        public int Id { get; set; }
        public string Title { get; set; }
        public string Content { get; set; }
        public DateTime CreatedAt { get; set; }

        [ForeignKey(nameof(CompanyId))]
        public Companies Companies { get; set; }
        public int CompanyId { get; set; }
    }
}
