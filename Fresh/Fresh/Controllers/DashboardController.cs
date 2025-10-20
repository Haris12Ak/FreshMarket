using Fresh.Model;
using Fresh.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Fresh.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class DashboardController : ControllerBase
    {
        private readonly IDashboardService _dashboardService;
        private readonly ICurrentUserService _currentUserService;


        public DashboardController(IDashboardService dashboardService, ICurrentUserService currentUserService)
        {
            _dashboardService = dashboardService;
            _currentUserService = currentUserService;
        }

        [Authorize(Roles = "admin")]
        [HttpGet("admin-dashboard/{companyId}")]
        public async Task<AdminDashboardDto> AdminDashboardView(int companyId)
        {
            return await _dashboardService.AdminDashboardView(_currentUserService.KeycloakUserId, companyId);
        }

        [Authorize(Roles = "client")]
        [HttpGet("client-dashboard/{companyId}")]
        public async Task<ClientDashboardDto> ClientDashboardView(int companyId)
        {
            return await _dashboardService.ClientDashboardView(_currentUserService.KeycloakUserId, companyId);
        }
    }
}
