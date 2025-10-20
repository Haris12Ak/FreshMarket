using AutoMapper;
using Fresh.Model;
using Fresh.Model.Requests;
using Fresh.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Fresh.Services.Services
{
    public class CompanyService : ICompanyService
    {
        private readonly ApplicationDbContext _context;
        private readonly KeycloakAuthService _keycloakAuthService;
        private readonly IMapper _mapper;
        private readonly IMessageProducer _messageProducer;

        public CompanyService(ApplicationDbContext context, KeycloakAuthService keycloakAuthService, IMapper mapper, IMessageProducer messageProducer)
        {
            _context = context;
            _keycloakAuthService = keycloakAuthService;
            _mapper = mapper;
            _messageProducer = messageProducer;
        }

        public async Task RegisterCompany(CompanyRegistration registration)
        {
            await _keycloakAuthService.AuthenticateAdminAsync();

            var user = new UserDto
            {
                Username = registration.Username,
                Email = registration.Email,
                FirstName = registration.FirstName,
                LastName = registration.LastName,
                Password = registration.Password,
            };

            var keycloakId = await _keycloakAuthService.CreateUserAsync(user, false);

            await _keycloakAuthService.AssignRoleAsync(keycloakId, "admin");

            var company = new Database.Companies
            {
                CompanyName = registration.CompanyName,
                CompanyAddress = registration.CompanyAddress,
            };

            await _context.Companies.AddAsync(company);
            await _context.SaveChangesAsync();

            var owner = new Database.Owners
            {
                KeycloakId = keycloakId,
                Username = registration.Username,
                Email = registration.Email,
                FirstName = registration.FirstName,
                LastName = registration.LastName,
                Phone = registration.Phone,
                CreatedAt = DateTime.Now,
                CompanyId = company.Id,
            };

            await _context.Owners.AddAsync(owner);
            await _context.SaveChangesAsync();
        }

        public async Task AddClientToCompany(int companyId, string adminUserId, ClientInsertRequest request)
        {
            var company = await _context.Companies.FindAsync(companyId);

            var adminUserInfo = await _context.Owners.Where(x => x.KeycloakId == adminUserId).FirstOrDefaultAsync();

            if (company == null || adminUserInfo == null)
            {
                throw new Exception("Data not found !");
            }

            if (adminUserInfo.CompanyId == company.Id)
            {
                var username = $"{request.FirstName.ToLower()}_{request.LastName.ToLower()}";
                var password = Helper.PasswordGenerator.GeneratePassword();

                var user = new UserDto
                {
                    Username = username,
                    Email = request.Email,
                    FirstName = request.FirstName,
                    LastName = request.LastName,
                    Password = password,
                };

                await _keycloakAuthService.AuthenticateAdminAsync();

                var keycloakId = await _keycloakAuthService.CreateUserAsync(user, true);

                await _keycloakAuthService.AssignRoleAsync(keycloakId, "client");

                var client = new Database.Clients
                {
                    KeycloakId = keycloakId,
                    Username = username,
                    Email = request.Email,
                    FirstName = request.FirstName,
                    LastName = request.LastName,
                    Phone = request.Phone,
                    CreatedAt = DateTime.Now,
                    IsActive = true,
                    CompanyId = company.Id
                };

                await _context.Clients.AddAsync(client);
                await _context.SaveChangesAsync();

                Model.EmailMessageDto emailMessage = new Model.EmailMessageDto
                {
                    Username = username,
                    Email = client.Email,
                    FirstName = client.FirstName,
                    LastName = client.LastName,
                    Password = password,
                    CompanyName = company.CompanyName,
                    CompanyAddress = company.CompanyAddress
                };

                _messageProducer.SendingObject(emailMessage);
            }
            else
            {
                throw new Exception("It is not possible to add a client for the selected company !");
            }
        }

        public async Task<CompanyInfo> GetCompanyInformation(string adminUserId)
        {
            var company = await _context.Companies
                .Include(o => o.Owners)
                .Include(c => c.Clients)
                .AsNoTracking()
                .FirstOrDefaultAsync(x => x.Owners.Any(owner => owner.KeycloakId == adminUserId) || x.Clients.Any(client => client.KeycloakId == adminUserId));

            if (company == null)
                return null;

            return _mapper.Map<CompanyInfo>(company);
        }

        public async Task DeleteClientFromCompany(int clientId, string adminUserId)
        {
            var isOwner = await _context.Owners
                .Where(x => x.KeycloakId == adminUserId)
                .FirstOrDefaultAsync();

            if (isOwner == null)
                throw new Exception("You are not the owner of the selected company!");

            var client = await _context.Clients
                .Where(x => x.Id == clientId)
                .FirstOrDefaultAsync();

            if (client == null)
                throw new Exception("Client not found !");

            if (isOwner.CompanyId != client.CompanyId)
                throw new Exception("It is not possible to delete a client if the client does not belong to your company!");

            _context.Clients.Remove(client);
            await _context.SaveChangesAsync();

            await _keycloakAuthService.AuthenticateAdminAsync();

            var result = await _keycloakAuthService.DeleteUserAsync(client.KeycloakId);

            if (!result)
                throw new Exception("User deleted from DB but failed to delete from Keycloak.");
        }
    }
}
