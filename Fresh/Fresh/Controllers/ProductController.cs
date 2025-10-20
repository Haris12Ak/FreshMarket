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
    public class ProductController : ControllerBase
    {
        private readonly IProductService _productService;
        private readonly ICurrentUserService _currentUser;

        public ProductController(IProductService productService, ICurrentUserService currentUser)
        {
            _productService = productService;
            _currentUser = currentUser;
        }

        [HttpGet("GetById/{productId}")]
        public async Task<Products> GetById(int productId)
        {
            return await _productService.GetById(_currentUser.KeycloakUserId, productId);
        }

        [HttpGet("GetProductsByCompanyId/{companyId}")]
        public async Task<PagedResult<Model.Products>> GetProductsByCompanyId(int companyId, [FromQuery] ProductSearch? search)
        {
            return await _productService.GetProductsByCompanyId(_currentUser.KeycloakUserId, companyId, search);
        }

        [Authorize(Roles = "admin")]
        [HttpPost("Insert/{companyId}")]
        public async Task<Products> Insert(int companyId, [FromBody] ProductInsertRequest productInsert)
        {
            return await _productService.Insert(companyId, _currentUser.KeycloakUserId, productInsert);
        }

        [Authorize(Roles = "admin")]
        [HttpPut("Update/{productId}")]
        public async Task<Model.Products> Update(int productId, [FromBody] ProductUpdateRequest productUpdate)
        {
            return await _productService.Update(productId, _currentUser.KeycloakUserId, productUpdate);
        }

        [Authorize(Roles = "admin")]
        [HttpDelete("Delete/{productId}")]
        public async Task<Model.Products> Delete(int productId)
        {
            return await _productService.Delete(productId, _currentUser.KeycloakUserId);
        }
    }
}
