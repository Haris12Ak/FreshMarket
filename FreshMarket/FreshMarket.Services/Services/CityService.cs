using AutoMapper;
using FreshMarket.Services.Interfaces;

namespace FreshMarket.Services.Services
{
    public class CityService : BaseCRUDService<Model.City, Database.City, Model.Requests.CityInsertRequest, Model.Requests.CityUpdateRequest>, ICityService
    {
        public CityService(ApplicationDbContext dbContext, IMapper mapper) : base(dbContext, mapper)
        {
        }
    }
}
