using Fresh.Model;
using Fresh.Model.Requests;

namespace Fresh.Services.Interfaces
{
    public interface ICompanyService
    {
        Task RegisterCompany(CompanyRegistration registration);
        Task AddClientToCompany(int companyId, string adminUserId, ClientInsertRequest request);
        Task<CompanyInfo> GetCompanyInformation(string adminUserId);
        Task DeleteClientFromCompany(int clientId, string adminUserId);
    }
}
