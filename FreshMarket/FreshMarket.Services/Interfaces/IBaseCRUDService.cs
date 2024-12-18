namespace FreshMarket.Services.Interfaces
{
    public interface IBaseCRUDService<T, TInsert, Tupdate> : IBaseService<T> where T : class where TInsert : class where Tupdate : class
    {
        Task<T> Insert(TInsert insert);
        Task<T> Update(int id, Tupdate update);
        Task<T> Delete(int id);
    }
}
