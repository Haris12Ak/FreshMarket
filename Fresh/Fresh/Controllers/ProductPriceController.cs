using Fresh.Model;
using Fresh.Model.Requests;
using Fresh.Model.Search;
using Fresh.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Fresh.Controllers
{
    [Authorize]
    [Route("[controller]")]
    [ApiController]
    public class ProductPriceController : ControllerBase
    {
        private readonly IProductPriceService _productPriceService;
        private readonly ICurrentUserService _currentUserService;

        public ProductPriceController(IProductPriceService productPriceService, ICurrentUserService currentUserService)
        {
            _productPriceService = productPriceService;
            _currentUserService = currentUserService;
        }

        [Authorize(Roles = "admin, client")]
        [HttpGet("GetByProductId/{productId}")]
        public async Task<PagedResult<Model.ProductPrice>> GetByProductId(int productId, [FromQuery] ProductPriceSearch? search)
        {
            return await _productPriceService.GetByProductId(_currentUserService.KeycloakUserId, productId, search);
        }

        [Authorize(Roles = "admin")]
        [HttpPost("Insert/{productId}")]
        public async Task<Model.ProductPrice> Insert(int productId, [FromBody] ProductPriceInsertRequest request)
        {
            return await _productPriceService.Insert(_currentUserService.KeycloakUserId, productId, request);
        }

        [Authorize(Roles = "admin")]
        [HttpPut("Update/{productPriceId}")]
        public async Task<Model.ProductPrice> Update(int productPriceId, [FromBody] ProductPriceUpdateRequest request)
        {
            return await _productPriceService.Update(_currentUserService.KeycloakUserId, productPriceId, request);
        }

        [Authorize(Roles = "admin")]
        [HttpDelete("Delete/{productPriceId}")]
        public async Task<Model.ProductPrice> Delete(int productPriceId)
        {
            return await _productPriceService.Delete(_currentUserService.KeycloakUserId, productPriceId);
        }
    }
}
