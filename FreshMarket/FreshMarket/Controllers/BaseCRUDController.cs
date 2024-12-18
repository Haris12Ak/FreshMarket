using FreshMarket.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace FreshMarket.Controllers
{
    [Route("[controller]")]
    public class BaseCRUDController<T, TInsert, TUpdate> : BaseController<T> where T : class where TInsert : class where TUpdate : class
    {
        protected new IBaseCRUDService<T, TInsert, TUpdate> _service;
        protected new ILogger<BaseCRUDController<T, TInsert, TUpdate>> _logger;

        public BaseCRUDController(ILogger<BaseCRUDController<T, TInsert, TUpdate>> logger, IBaseCRUDService<T, TInsert, TUpdate> service) : base(logger, service)
        {
            _service = service;
            _logger = logger;
        }

        [HttpPost]
        public virtual async Task<T> Insert(TInsert insert)
        {
            return await _service.Insert(insert);
        }

        [HttpPut("{id}")]
        public virtual async Task<T> Update(int id, TUpdate update)
        {
            return await _service.Update(id, update);
        }

        [HttpDelete("{id}")]
        public virtual async Task<T> Delete(int id)
        {
            return await _service.Delete(id);
        }
    }
}
