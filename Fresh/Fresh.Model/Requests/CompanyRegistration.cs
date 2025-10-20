using System.ComponentModel;
using System.ComponentModel.DataAnnotations;

namespace Fresh.Model.Requests
{
    public class CompanyRegistration
    {
        [Required(ErrorMessage = "This filed is required!")]
        [StringLength(50, MinimumLength = 3, ErrorMessage = "You must enter a minimum of 3 letters!")]
        public string CompanyName { get; set; }

        [Required(ErrorMessage = "This filed is required!")]
        [StringLength(50, MinimumLength = 3, ErrorMessage = "You must enter a minimum of 3 letters!")]
        public string CompanyAddress { get; set; }

        [Required(ErrorMessage = "This filed is required!")]
        [StringLength(50, MinimumLength = 5, ErrorMessage = "You must enter a minimum of 5 letters!")]
        public string Username { get; set; }

        [Required(ErrorMessage = "This filed is required!")]
        [RegularExpression(@"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$", ErrorMessage = "Invalid email format.")]
        [DefaultValue("example@email.com")]
        public string Email { get; set; }

        [Required(ErrorMessage = "This filed is required!")]
        [RegularExpression(@"^[A-ZČĆŽŠĐ][a-zčćžšđ]{2,}$", ErrorMessage = "Please enter your correct first name, the first letter must be capitalized!")]
        [DefaultValue(("string"))]
        public string FirstName { get; set; }

        [Required(ErrorMessage = "This filed is required!")]
        [RegularExpression(@"^[A-ZČĆŽŠĐ][a-zčćžšđ]{2,}$", ErrorMessage = "Please enter your correct last name, the first letter must be capitalized!")]
        [DefaultValue(("string"))]
        public string LastName { get; set; }

        [RegularExpression(@"^\+?[0-9]{9,15}$", ErrorMessage = "Invalid phone number format.")]
        [DefaultValue("+38761222333")]
        public string? Phone { get; set; }

        [Required(ErrorMessage = "This filed is required!")]
        [StringLength(30, MinimumLength = 6, ErrorMessage = "Min Length 6 character!")]
        [Compare("ConfirmPassword", ErrorMessage = "Passwords do not match!")]
        public string Password { get; set; }

        [Required(ErrorMessage = "This filed is required!")]
        [StringLength(30, MinimumLength = 6, ErrorMessage = "Min Length 6 character!")]
        [Compare("Password", ErrorMessage = "Passwords do not match!")]
        public string ConfirmPassword { get; set; }
    }
}
