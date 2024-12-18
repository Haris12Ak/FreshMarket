namespace FreshMarket.Services.Interfaces
{
    public interface IBaseService<T>
    {
        Task<List<T>> GetAll();
        Task<T> GetById(int id);
    }
}
