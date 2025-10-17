using Fresh.Model;
using Fresh.Model.Requests;
using Fresh.Model.Search;
using Fresh.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Fresh.Controllers
{
    [Authorize]
    [Route("[controller]")]
    [ApiController]
    public class NotificationController : ControllerBase
    {
        private readonly INotificationServcie _notificationServcie;
        private readonly ICurrentUserService _currentUserService;

        public NotificationController(INotificationServcie notificationServcie, ICurrentUserService currentUserService)
        {
            _notificationServcie = notificationServcie;
            _currentUserService = currentUserService;
        }

        [HttpGet("GetAll/{companyId}")]
        public async Task<PagedResult<Notification>> GetAll(int companyId, [FromQuery] NotificationSearch? search)
        {
            return await _notificationServcie.GetAll(_currentUserService.KeycloakUserId, companyId, search);
        }

        [HttpGet("companies/{companyId}/notifications/{notificationId}")]
        public async Task<Model.Notification> GetById(int companyId, int notificationId)
        {
            return await _notificationServcie.GetById(_currentUserService.KeycloakUserId, companyId, notificationId);
        }

        [Authorize(Roles = "admin")]
        [HttpPost("Insert/{companyId}")]
        public async Task<Model.Notification> Insert(int companyId, [FromBody] NotificationInsertRequest request)
        {
            return await _notificationServcie.Insert(_currentUserService.KeycloakUserId, companyId, request);
        }

        [Authorize(Roles = "admin")]
        [HttpPut("companies/{companyId}/notifications/{notificationId}")]
        public async Task<Model.Notification> Update(int companyId, int notificationId, [FromBody] NotificationUpdateRequest request)
        {
            return await _notificationServcie.Update(_currentUserService.KeycloakUserId, companyId, notificationId, request);
        }

        [Authorize(Roles = "admin")]
        [HttpDelete("companies/{companyId}/notifications/{notificationId}")]
        public async Task<Model.Notification> Delete(int companyId, int notificationId)
        {
            return await _notificationServcie.Delete(_currentUserService.KeycloakUserId, companyId, notificationId);
        }
    }
}
