namespace Fresh.Model
{
    public class Notification
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Content { get; set; }
        public DateTime CreatedAt { get; set; }
        public int CompanyId { get; set; }

        public CompanyInfo Companies { get; set; }
    }
}
