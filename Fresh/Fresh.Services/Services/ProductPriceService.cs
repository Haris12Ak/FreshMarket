using AutoMapper;
using Fresh.Model;
using Fresh.Model.Requests;
using Fresh.Model.Search;
using Fresh.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Fresh.Services.Services
{
    public class ProductPriceService : IProductPriceService
    {
        private readonly ApplicationDbContext _context;
        private readonly IMapper _mapper;
        private readonly IProductService _productService;

        public ProductPriceService(ApplicationDbContext context, IMapper mapper, IProductService productService)
        {
            _context = context;
            _mapper = mapper;
            _productService = productService;
        }

        public async Task<PagedResult<Model.ProductPrice>> GetByProductId(string keycloakUserId, int productId, ProductPriceSearch? search)
        {
            var product = await _productService.GetById(keycloakUserId, productId);

            var query = _context.ProductPrice
                .AsNoTracking()
                .Where(x => x.ProductId == productId);

            if (search?.Date != null)
            {
                query = query.Where(x => x.EffectiveFrom.Date == search.Date.Value.Date);
            }

            var totalItems = await query.CountAsync();
            query = query.Skip(search!.Page * search.PageSize).Take(search.PageSize);
            var totalPages = (int)Math.Ceiling(totalItems / (double)search.PageSize);
            var list = await query.ToListAsync();

            PagedResult<Model.ProductPrice> result = new PagedResult<Model.ProductPrice>()
            {
                CurrentPage = search.Page,
                PageSize = search.PageSize,
                TotalItems = totalItems,
                TotalPages = totalPages,
                Items = _mapper.Map<List<Model.ProductPrice>>(list)
            };

            return result;
        }

        public async Task<Model.ProductPrice> Insert(string keycloakUserId, int productId, ProductPriceInsertRequest request)
        {

            var product = await _productService.GetById(keycloakUserId, productId);

            var productPrices = await _context.ProductPrice
                .Where(x => x.ProductId == productId)
                .ToListAsync();

            foreach (var price in productPrices)
            {
                if (price.PricePerUnit == request.PricePerUnit)
                    throw new Exception("The price of the product is already set !");
            }

            var newProductPrice = _mapper.Map<Database.ProductPrice>(request, opt =>
            {
                opt.AfterMap((src, dest) =>
                {
                    dest.EffectiveFrom = DateTime.Now;
                    dest.ProductId = product.Id;
                });
            });

            await _context.ProductPrice.AddAsync(newProductPrice);
            await _context.SaveChangesAsync();

            return _mapper.Map<Model.ProductPrice>(newProductPrice);
        }

        public async Task<Model.ProductPrice> Update(string keycloakUserId, int productPriceId, ProductPriceUpdateRequest request)
        {
            var productPrice = await _context.ProductPrice.FindAsync(productPriceId);

            if (productPrice == null)
                return null;

            var product = await _productService.GetById(keycloakUserId, productPrice.ProductId);

            if (product != null)
            {
                _mapper.Map(request, productPrice);
                await _context.SaveChangesAsync();
            }

            return _mapper.Map<Model.ProductPrice>(productPrice);
        }

        public async Task<Model.ProductPrice> Delete(string keycloakUserId, int productPriceId)
        {
            var productPrice = await _context.ProductPrice.FindAsync(productPriceId);

            if (productPrice == null)
                return null;

            var product = await _productService.GetById(keycloakUserId, productPrice.ProductId);

            if (product != null)
            {
                _context.ProductPrice.Remove(productPrice);
                await _context.SaveChangesAsync();
            }

            return _mapper.Map<Model.ProductPrice>(productPrice);
        }
    }
}
