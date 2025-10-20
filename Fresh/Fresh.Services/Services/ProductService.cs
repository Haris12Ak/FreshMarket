using AutoMapper;
using Fresh.Model;
using Fresh.Model.Requests;
using Fresh.Model.Search;
using Fresh.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Fresh.Services.Services
{
    public class ProductService : IProductService
    {
        private readonly ApplicationDbContext _context;
        private readonly IMapper _mapper;
        private readonly IAuthorizationService _authorizationService;

        public ProductService(ApplicationDbContext context, IMapper mapper, IAuthorizationService authorizationService)
        {
            _context = context;
            _mapper = mapper;
            _authorizationService = authorizationService;
        }

        public async Task<Model.Products> GetById(string keycloakUserId, int productId)
        {
            var product = await _context.Products
                .AsNoTracking()
                .FirstOrDefaultAsync(x => x.Id == productId);

            if (product == null)
                return null;

            var isUserOfCompany = await _authorizationService.IsUserOfCompany(keycloakUserId, product.CompanyId);

            if (!isUserOfCompany)
                throw new Exception("Unable to access data, or companyId does not exist !");

            return _mapper.Map<Model.Products>(product);
        }

        public async Task<PagedResult<Model.Products>> GetProductsByCompanyId(string keycloakUserId, int companyId, ProductSearch? search)
        {
            var isUserOfCompany = await _authorizationService.IsUserOfCompany(keycloakUserId, companyId);

            if (!isUserOfCompany)
                throw new Exception("Unable to access data, or companyId does not exist !");

            var query = _context.Products
                .Include(p => p.ProductType)
                .Include(p => p.ProductPrices)
                .AsNoTracking()
                .Where(x => x.CompanyId == companyId);

            if (!string.IsNullOrEmpty(search?.Name))
            {
                query = query.Where(x => x.Name.ToLower().StartsWith(search.Name.ToLower()));
            }

            if (!string.IsNullOrEmpty(search?.ProductType))
            {
                query = query.Where(x => x.ProductType.Name.ToLower().StartsWith(search.ProductType.ToLower()));
            }

            if (search?.IsActive != null)
            {
                query = query.Where(x => x.IsActive == search.IsActive);
            }

            var totalItems = await query.CountAsync();
            query = query.Skip(search!.Page * search.PageSize).Take(search.PageSize);
            var totalPages = (int)Math.Ceiling(totalItems / (double)search.PageSize);
            var list = await query
                .OrderByDescending(x => x.Id)
                .ToListAsync();

            PagedResult<Model.Products> result = new PagedResult<Model.Products>()
            {
                CurrentPage = search.Page,
                PageSize = search.PageSize,
                TotalItems = totalItems,
                TotalPages = totalPages,
                Items = _mapper.Map<List<Model.Products>>(list)
            };

            return result;
        }

        public async Task<Model.Products> Insert(int companyId, string keycloakUserId, ProductInsertRequest productInsert)
        {
            var isUserOfCompany = await _authorizationService.IsUserOfCompany(keycloakUserId, companyId);

            if (!isUserOfCompany)
                throw new Exception("Unable to access data, or companyId does not exist !");

            var productType = await _context.ProductType.FindAsync(productInsert.ProductTypeId);

            if (productType == null)
                throw new Exception("Product Type does not exist !");

            var newProduct = _mapper.Map<Database.Products>(productInsert, opt =>
            {
                opt.AfterMap((src, dest) => dest.CompanyId = companyId);
            });

            await _context.Products.AddAsync(newProduct);
            await _context.SaveChangesAsync();

            return _mapper.Map<Model.Products>(newProduct);
        }

        public async Task<Model.Products> Update(int productId, string keycloakUserId, ProductUpdateRequest productUpdate)
        {
            var product = await _context.Products
                .FirstOrDefaultAsync(x => x.Id == productId);

            if (product == null)
                return null;

            var isUserOfCompany = await _authorizationService.IsUserOfCompany(keycloakUserId, product.CompanyId);

            if (!isUserOfCompany)
                throw new Exception("Unable to access data, or companyId does not exist !");

            _mapper.Map(productUpdate, product);
            await _context.SaveChangesAsync();

            return _mapper.Map<Model.Products>(product);
        }

        public async Task<Model.Products> Delete(int productId, string keycloakUserId)
        {
            var product = await _context.Products
                .Include(x => x.ProductPrices)
                .FirstOrDefaultAsync(x => x.Id == productId);

            if (product == null)
                return null;

            var isUserOfCompany = await _authorizationService.IsUserOfCompany(keycloakUserId, product.CompanyId);

            if (!isUserOfCompany)
                throw new Exception("Unable to access data, or companyId does not exist !");

            _context.ProductPrice.RemoveRange(product.ProductPrices);
            _context.Products.Remove(product);
            await _context.SaveChangesAsync();

            return _mapper.Map<Model.Products>(product);
        }
    }
}
