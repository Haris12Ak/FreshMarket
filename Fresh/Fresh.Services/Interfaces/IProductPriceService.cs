using Fresh.Model;
using Fresh.Model.Requests;
using Fresh.Model.Search;

namespace Fresh.Services.Interfaces
{
    public interface IProductPriceService
    {
        Task<PagedResult<ProductPrice>> GetByProductId(string keycloakUserId, int productId, ProductPriceSearch? search);
        Task<ProductPrice> Insert(string keycloakUserId, int productId, ProductPriceInsertRequest request);
        Task<ProductPrice> Update(string keycloakUserId, int productPriceId, ProductPriceUpdateRequest request);
        Task<ProductPrice> Delete(string keycloakUserId, int productPriceId);
    }
}
