using System.ComponentModel;
using System.ComponentModel.DataAnnotations;

namespace Fresh.Model.Requests
{
    public class ClientInsertRequest
    {
        [Required(ErrorMessage = "This filed is required!")]
        [RegularExpression(@"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$", ErrorMessage = "Invalid email format.")]
        [DefaultValue("example@email.com")]
        public string Email { get; set; }

        [Required(ErrorMessage = "This filed is required!")]
        [RegularExpression(@"^[A-Z][a-z]{2,}$", ErrorMessage = "Please enter your correct first name, the first letter must be capitalized!")]
        [DefaultValue(("string"))]
        public string FirstName { get; set; }

        [Required(ErrorMessage = "This filed is required!")]
        [RegularExpression(@"^[A-Z][a-z]{2,}$", ErrorMessage = "Please enter your correct last name, the first letter must be capitalized!")]
        [DefaultValue(("string"))]
        public string LastName { get; set; }

        [RegularExpression(@"^\+?[0-9]{9,15}$", ErrorMessage = "Invalid phone number format.")]
        [DefaultValue("+38761222333")]
        public string? Phone { get; set; }
    }
}
