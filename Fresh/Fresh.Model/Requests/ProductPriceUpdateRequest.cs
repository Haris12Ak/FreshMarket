using System.ComponentModel.DataAnnotations;

namespace Fresh.Model.Requests
{
    public class ProductPriceUpdateRequest
    {
        [Required(ErrorMessage = "This field is required !")]
        public decimal PricePerUnit { get; set; }

        [Required(ErrorMessage = "This field is required !")]
        public DateTime EffectiveFrom { get; set; }

        [Required(ErrorMessage = "This field is required !")]
        public int ProductId { get; set; }
    }
}
