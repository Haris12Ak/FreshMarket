using System.ComponentModel.DataAnnotations;

namespace Fresh.Model.Requests
{
    public class ProductUpdateRequest
    {
        [Required(ErrorMessage = "This filed is required !")]
        public string Name { get; set; }

        public byte[]? Image { get; set; }

        [Required(ErrorMessage = "This filed is required !")]
        public UnitType Unit { get; set; }

        [Required(ErrorMessage = "This filed is required !")]
        public bool IsActive { get; set; }

        [Required(ErrorMessage = "This filed is required !")]
        public int ProductTypeId { get; set; }
    }
}
