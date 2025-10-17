using Fresh.Model;
using Fresh.Model.Search;

namespace Fresh.Services.Interfaces
{
    public interface IClientService
    {
        Task<PagedResult<Model.Clients>> GetClientsByCompany(string adminUserId, ClientSearch? search);
        Task<Model.Clients> GetClientInfo(string keycloakUserId);
        Task<Model.Clients> Deactivate(string keycloakUserId, int clientId, int companyId, bool isActive);
    }
}
