using Fresh.Model;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Fresh.Services.Database
{
    public class Purchase
    {
        [Key]
        public int Id { get; set; }
        public decimal Quantity { get; set; }
        public decimal PricePerUnit { get; set; }
        public decimal TotalAmount { get; set; }
        public DateTime PurchaseDate { get; set; }
        public int? NumberOfInstallments { get; set; }
        public PaymentType PaymentType { get; set; }

        [ForeignKey(nameof(ClientId))]
        public Clients Clients { get; set; }
        public int ClientId { get; set; }

        [ForeignKey(nameof(ProductId))]
        public Products Products { get; set; }
        public int ProductId { get; set; }

        public ICollection<Payment> Payments { get; set; } = new List<Payment>();
    }
}
