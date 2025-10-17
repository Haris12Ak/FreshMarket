namespace Fresh.Model
{
    public class PagedResult<T> where T : class
    {
        public int CurrentPage { get; set; }
        public int PageSize { get; set; }
        public int TotalItems { get; set; }
        public int TotalPages { get; set; }
        public List<T> Items { get; set; } = new List<T>();
    }
}
