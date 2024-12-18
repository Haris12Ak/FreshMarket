using FreshMarket.Model;
using FreshMarket.Model.Requests;
using FreshMarket.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace FreshMarket.Controllers
{
    [ApiController]
    public class CityController : BaseCRUDController<Model.City, Model.Requests.CityInsertRequest, Model.Requests.CityUpdateRequest>
    {
        public CityController(ILogger<BaseCRUDController<City, CityInsertRequest, CityUpdateRequest>> logger, ICityService service) : base(logger, service)
        {
        }
    }
}
