using Fresh.Services.Interfaces;
using Microsoft.AspNetCore.Http;
using System.Security.Claims;

namespace Fresh.Services.Services
{
    public class CurrentUserService : ICurrentUserService
    {
        private readonly IHttpContextAccessor _httpContextAccessor;

        public CurrentUserService(IHttpContextAccessor httpContextAccessor)
        {
            _httpContextAccessor = httpContextAccessor;
        }

        public string KeycloakUserId =>
            _httpContextAccessor.HttpContext?.User.FindFirst(ClaimTypes.NameIdentifier)?.Value
           ?? throw new Exception("User is not authorized !");
    }
}
