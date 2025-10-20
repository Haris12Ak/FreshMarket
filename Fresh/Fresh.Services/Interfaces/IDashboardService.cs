using Fresh.Model;

namespace Fresh.Services.Interfaces
{
    public interface IDashboardService
    {
        Task<AdminDashboardDto> AdminDashboardView(string keycloakUserId, int companyId);
        Task<ClientDashboardDto> ClientDashboardView(string keycloakUserId, int companyId);
    }
}
