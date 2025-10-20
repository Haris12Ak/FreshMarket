using System.ComponentModel.DataAnnotations;

namespace Fresh.Model.Requests
{
    public class NotificationUpdateRequest
    {
        [Required(ErrorMessage = "This field is required!")]
        public string Title { get; set; }

        [Required(ErrorMessage = "This field is required!")]
        public string Content { get; set; }
    }
}
