using AutoMapper;
using FreshMarket.Services.Interfaces;

namespace FreshMarket.Services.Services
{
    public class CountryService : BaseCRUDService<Model.Country, Database.Country, Model.Requests.CountryInsertRequest, Model.Requests.CountryUpdateRequest>, ICountryService
    {
        public CountryService(ApplicationDbContext dbContext, IMapper mapper) : base(dbContext, mapper)
        {
        }
    }
}
