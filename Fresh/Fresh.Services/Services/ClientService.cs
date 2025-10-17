using AutoMapper;
using Fresh.Model;
using Fresh.Model.Search;
using Fresh.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Fresh.Services.Services
{
    public class ClientService : IClientService
    {
        private readonly ApplicationDbContext _context;
        private readonly IMapper _mapper;
        private readonly IAuthorizationService _authorizationService;

        public ClientService(ApplicationDbContext context, IMapper mapper, IAuthorizationService authorizationService)
        {
            _context = context;
            _mapper = mapper;
            _authorizationService = authorizationService;
        }

        public async Task<Model.Clients> Deactivate(string keycloakUserId, int clientId, int companyId, bool isActive)
        {
            var isUserOfCompany = await _authorizationService.IsUserOfCompany(keycloakUserId, companyId);

            if (!isUserOfCompany)
                throw new Exception("Unable to access data, or companyId does not exist !");

            var client = await _context.Clients
                .Where(x => x.Id == clientId && x.CompanyId == companyId)
                .FirstOrDefaultAsync();

            if (client == null)
                throw new Exception("Client does not exist !");

            client.IsActive = isActive;

            await _context.SaveChangesAsync();

            return _mapper.Map<Model.Clients>(client);
        }

        public async Task<Model.Clients> GetClientInfo(string keycloakUserId)
        {
            var client = await _context.Clients
                .AsNoTracking()
                .FirstOrDefaultAsync(x => x.KeycloakId == keycloakUserId && x.IsActive == true);

            if (client == null)
                return null;

            return _mapper.Map<Model.Clients>(client);
        }

        public async Task<PagedResult<Model.Clients>> GetClientsByCompany(string adminUserId, ClientSearch? search)
        {
            var company = await _context.Companies
                .Include(o => o.Owners)
                .AsNoTracking()
                .FirstOrDefaultAsync(x => x.Owners.Any(o => o.KeycloakId == adminUserId));

            if (company == null)
                throw new Exception("Data not found !");

            var query = _context.Clients
                .AsNoTracking()
                .Where(x => x.CompanyId == company.Id && x.IsActive == true);

            if (!string.IsNullOrWhiteSpace(search?.firstName))
            {
                query = query.Where(x => x.FirstName.ToLower().StartsWith(search.firstName.ToLower()));
            }

            if (!string.IsNullOrWhiteSpace(search?.lastName))
            {
                query = query.Where(x => x.LastName.ToLower().StartsWith(search.lastName.ToLower()));
            }

            var totalItems = await query.CountAsync();
            query = query.Skip(search!.Page * search.PageSize).Take(search.PageSize);
            var totalPages = (int)Math.Ceiling(totalItems / (double)search.PageSize);
            var list = await query
                .OrderByDescending(x => x.Id)
                .ToListAsync();

            PagedResult<Model.Clients> result = new PagedResult<Model.Clients>()
            {
                CurrentPage = search.Page,
                PageSize = search.PageSize,
                TotalItems = totalItems,
                TotalPages = totalPages,
                Items = _mapper.Map<List<Model.Clients>>(list)
            };

            return result;
        }
    }
}
