using Fresh.Model;
using Fresh.Model.Requests;
using Fresh.Model.Search;

namespace Fresh.Services.Interfaces
{
    public interface IProductService
    {
        Task<Products> GetById(string keycloakUserId, int productId);
        Task<PagedResult<Products>> GetProductsByCompanyId(string keycloakUserId, int companyId, ProductSearch? search);
        Task<Products> Insert(int companyId, string keycloakUserId, ProductInsertRequest productInsert);
        Task<Products> Update(int productId, string keycloakUserId, ProductUpdateRequest productUpdate);
        Task<Products> Delete(int productId, string keycloakUserId);
    }
}
