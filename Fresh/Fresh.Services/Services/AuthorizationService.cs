using Fresh.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Fresh.Services.Services
{
    public class AuthorizationService : IAuthorizationService
    {
        private readonly ApplicationDbContext _context;

        public AuthorizationService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<bool> IsUserOfCompany(string keycloakUserId, int companyId)
        {
            return await _context.Companies
                .AsNoTracking()
                .AnyAsync(x => x.Id == companyId
                && (x.Owners.Any(owner => owner.KeycloakId == keycloakUserId && owner.CompanyId == companyId)
                || x.Clients.Any(client => client.KeycloakId == keycloakUserId && client.CompanyId == companyId)));
        }
    }
}
