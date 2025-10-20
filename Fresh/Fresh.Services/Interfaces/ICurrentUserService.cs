namespace Fresh.Services.Interfaces
{
    public interface ICurrentUserService
    {
        string KeycloakUserId { get; }
    }
}
