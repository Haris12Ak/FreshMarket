using AutoMapper;

namespace FreshMarket.Services
{
    public class AutoMapperProfile : Profile
    {
        public AutoMapperProfile()
        {
            CreateMap<Database.Country, Model.Country>();
            CreateMap<Model.Requests.CountryInsertRequest, Database.Country>();
            CreateMap<Model.Requests.CountryUpdateRequest, Database.Country>();

            CreateMap<Database.City, Model.City>();
            CreateMap<Model.Requests.CityInsertRequest, Database.City>();
            CreateMap<Model.Requests.CityUpdateRequest, Database.City>();

        }
    }
}
