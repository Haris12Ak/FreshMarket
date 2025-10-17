using Fresh.Model;
using Fresh.Model.Search;
using Fresh.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Fresh.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class ClientsController : ControllerBase
    {
        private readonly IClientService _clientService;
        private readonly ICurrentUserService _currentUserService;

        public ClientsController(IClientService clientService, ICurrentUserService currentUserService)
        {
            _clientService = clientService;
            _currentUserService = currentUserService;
        }

        [Authorize(Roles = "admin")]
        [HttpGet("GetClientsByCompany")]
        public async Task<PagedResult<Model.Clients>> GetClientsByCompany([FromQuery] ClientSearch? search)
        {
            return await _clientService.GetClientsByCompany(_currentUserService.KeycloakUserId, search);
        }

        [Authorize(Roles = "client")]
        [HttpGet("client-info")]
        public async Task<ActionResult<Model.Clients>> GetClientInfo()
        {
            Model.Clients client = await _clientService.GetClientInfo(_currentUserService.KeycloakUserId);

            if (client == null)
            {
                return Unauthorized(new { message = "Your account is inactive. Contact support." });
            }

            return Ok(client);
        }

        [Authorize(Roles = "admin")]
        [HttpPut("deactivate/{companyId}/client/{clientId}")]
        public async Task<Model.Clients> Deactivate(int clientId, int companyId, [FromQuery] bool isActive)
        {
            return await _clientService.Deactivate(_currentUserService.KeycloakUserId, clientId, companyId, isActive);
        }
    }
}
