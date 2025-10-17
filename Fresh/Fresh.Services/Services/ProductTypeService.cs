using AutoMapper;
using Fresh.Model.Requests;
using Fresh.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Fresh.Services.Services
{
    public class ProductTypeService : IProductTypeService
    {
        private readonly ApplicationDbContext _context;
        private readonly IMapper _mapper;

        public ProductTypeService(ApplicationDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<List<Model.ProductType>> GetAll()
        {
            var productsType = await _context.ProductType
                .AsNoTracking()
                .ToListAsync();

            return _mapper.Map<List<Model.ProductType>>(productsType);
        }

        public async Task<Model.ProductType> GetById(int productTypeId)
        {
            var productType = await _context.ProductType
                .AsNoTracking()
                .FirstOrDefaultAsync(x => x.Id == productTypeId);

            if (productType == null)
                return null;

            return _mapper.Map<Model.ProductType>(productType);
        }

        public async Task<Model.ProductType> Insert(ProductTypeInsertRequest insertRequest)
        {
            var newProductType = _mapper.Map<Database.ProductType>(insertRequest);

            await _context.ProductType.AddAsync(newProductType);
            await _context.SaveChangesAsync();

            return _mapper.Map<Model.ProductType>(newProductType);
        }

        public async Task<Model.ProductType> Update(int productTypeId, ProductTypeUpdateRequest updateRequest)
        {
            var productType = await _context.ProductType.FindAsync(productTypeId);

            if (productType == null)
                return null;

            _mapper.Map(updateRequest, productType);

            await _context.SaveChangesAsync();

            return _mapper.Map<Model.ProductType>(productType);
        }

        public async Task<Model.ProductType> Delete(int productTypeId)
        {
            var productTpye = await _context.ProductType.FindAsync(productTypeId);

            if (productTpye == null)
                return null;

            _context.ProductType.Remove(productTpye);
            await _context.SaveChangesAsync();

            return _mapper.Map<Model.ProductType>(productTpye);
        }
    }
}
