using AutoMapper;

namespace Fresh.Services
{
    public class AutoMapperProfile : Profile
    {
        public AutoMapperProfile()
        {
            CreateMap<Database.Companies, Model.CompanyInfo>()
                .ForMember(dest => dest.CompanyId, opt => opt.MapFrom(src => src.Id));

            CreateMap<Database.Clients, Model.Clients>();

            CreateMap<Database.ProductType, Model.ProductType>();
            CreateMap<Model.Requests.ProductTypeInsertRequest, Database.ProductType>();
            CreateMap<Model.Requests.ProductTypeUpdateRequest, Database.ProductType>();

            CreateMap<Database.Products, Model.Products>()
                .ForMember(dest => dest.CurrentPricePerUnit, opt => opt.MapFrom(src =>
                src.ProductPrices
               .OrderByDescending(pp => pp.EffectiveFrom)
               .Select(pp => (decimal?)pp.PricePerUnit)
               .FirstOrDefault()
            ));

            CreateMap<Model.Requests.ProductInsertRequest, Database.Products>();
            CreateMap<Model.Requests.ProductUpdateRequest, Database.Products>();

            CreateMap<Database.ProductPrice, Model.ProductPrice>();
            CreateMap<Model.Requests.ProductPriceInsertRequest, Database.ProductPrice>();
            CreateMap<Model.Requests.ProductPriceUpdateRequest, Database.ProductPrice>();

            CreateMap<Database.Purchase, Model.Purchase>();
            CreateMap<Model.Requests.PurchaseInsertRequest, Database.Purchase>();
            CreateMap<Model.Requests.PurchaseUpdateRequest, Database.Purchase>();

            CreateMap<Database.Notification, Model.Notification>();
            CreateMap<Model.Requests.NotificationInsertRequest, Database.Notification>();
            CreateMap<Model.Requests.NotificationUpdateRequest, Database.Notification>();

            CreateMap<Database.Payment, Model.Payment>();
        }
    }
}
