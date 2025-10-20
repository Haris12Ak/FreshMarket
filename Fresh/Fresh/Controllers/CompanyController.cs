using Fresh.Model;
using Fresh.Model.Requests;
using Fresh.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Fresh.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class CompanyController : ControllerBase
    {
        private readonly ICompanyService _companyService;
        private readonly ICurrentUserService _currentUserService;

        public CompanyController(ICompanyService companyService, ICurrentUserService currentUserService)
        {
            _companyService = companyService;
            _currentUserService = currentUserService;
        }

        [HttpPost("register")]
        public async Task<IActionResult> RegisterCompany([FromBody] CompanyRegistration registration)
        {
            await _companyService.RegisterCompany(registration);

            return Ok(new { Message = "You have successfully registered your company." });
        }

        [Authorize(Roles = "admin")]
        [HttpPost("AddClientToCompany/{companyId}")]
        public async Task<IActionResult> AddClientToCompany(int companyId, [FromBody] ClientInsertRequest request)
        {
            await _companyService.AddClientToCompany(companyId, _currentUserService.KeycloakUserId, request);

            return Ok(new { Message = $"Client {request.FirstName} {request.LastName} has been successfully added." });
        }

        [Authorize]
        [HttpGet("CompanyInformation")]
        public async Task<CompanyInfo> GetCompanyInfo()
        {
            return await _companyService.GetCompanyInformation(_currentUserService.KeycloakUserId);
        }

        [Authorize(Roles = "admin")]
        [HttpDelete("DeleteClient/{clientId}")]
        public async Task<IActionResult> DeleteClientFromCompany(int clientId)
        {
            await _companyService.DeleteClientFromCompany(clientId, _currentUserService.KeycloakUserId);

            return Ok(new { Message = "Client successfully deleted" });
        }
    }
}
