namespace Fresh.Services.Interfaces
{
    public interface IAuthorizationService
    {
        Task<bool> IsUserOfCompany(string keycloakUserId, int companyId);
    }
}
