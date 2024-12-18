using FreshMarket.Model;
using FreshMarket.Model.Requests;
using FreshMarket.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace FreshMarket.Controllers
{
    [ApiController]
    public class CountryController : BaseCRUDController<Model.Country, Model.Requests.CountryInsertRequest, Model.Requests.CountryUpdateRequest>
    {
        public CountryController(ILogger<BaseCRUDController<Country, CountryInsertRequest, CountryUpdateRequest>> logger, ICountryService service) : base(logger, service)
        {
        }
    }
}
