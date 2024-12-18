using FreshMarket.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace FreshMarket.Controllers
{
    [Route("api/[controller]")]
    public class BaseController<T> : ControllerBase
    {
        protected IBaseService<T> _service;
        protected ILogger<BaseController<T>> _logger;

        public BaseController(ILogger<BaseController<T>> logger, IBaseService<T> service)
        {
            _logger = logger;
            _service = service;
        }

        [HttpGet]
        public virtual async Task<List<T>> GetAll()
        {
            return await _service.GetAll();
        }

        [HttpGet("{id}")]
        public virtual async Task<T> GetById(int id)
        {
            return await _service.GetById(id);
        }
    }
}
