using Fresh.Model.Requests;
using Fresh.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Fresh.Controllers
{
    [Authorize]
    [Route("[controller]")]
    [ApiController]
    public class ProductTypeController : ControllerBase
    {
        private readonly IProductTypeService _productTypeService;

        public ProductTypeController(IProductTypeService productTypeService)
        {
            _productTypeService = productTypeService;
        }

        [HttpGet("GetAll")]
        public async Task<List<Model.ProductType>> GetAll()
        {
            return await _productTypeService.GetAll();
        }

        [HttpGet("GetById/{productTypeId}")]
        public async Task<Model.ProductType> GetById(int productTypeId)
        {
            return await _productTypeService.GetById(productTypeId);
        }

        [Authorize(Roles = "admin")]
        [HttpPost("Insert")]
        public async Task<Model.ProductType> Insert([FromBody] ProductTypeInsertRequest insertRequest)
        {
            return await _productTypeService.Insert(insertRequest);
        }

        [Authorize(Roles = "admin")]
        [HttpPut("Update/{productTypeId}")]
        public async Task<Model.ProductType> Update(int productTypeId, [FromBody] ProductTypeUpdateRequest updateRequest)
        {
            return await _productTypeService.Update(productTypeId, updateRequest);
        }

        [Authorize(Roles = "admin")]
        [HttpDelete("Delete/{productTypeId}")]
        public async Task<Model.ProductType> Delete(int productTypeId)
        {
            return await _productTypeService.Delete(productTypeId);
        }
    }
}
