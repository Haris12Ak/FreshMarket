using Fresh.Model;
using Fresh.Model.Requests;

namespace Fresh.Services.Interfaces
{
    public interface IProductTypeService
    {
        Task<List<ProductType>> GetAll();
        Task<ProductType> GetById(int productTypeId);
        Task<ProductType> Insert(ProductTypeInsertRequest insertRequest);
        Task<ProductType> Update(int productTypeId, ProductTypeUpdateRequest updateRequest);
        Task<ProductType> Delete(int productTypeId);
    }
}
