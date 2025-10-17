using System.ComponentModel.DataAnnotations;

namespace Fresh.Model.Requests
{
    public class ProductPriceInsertRequest
    {
        [Required(ErrorMessage = "This field is required !")]
        public decimal PricePerUnit { get; set; }

    }
}
