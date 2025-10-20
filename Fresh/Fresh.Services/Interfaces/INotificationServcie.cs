using Fresh.Model;
using Fresh.Model.Requests;
using Fresh.Model.Search;

namespace Fresh.Services.Interfaces
{
    public interface INotificationServcie
    {
        Task<PagedResult<Notification>> GetAll(string keycloakUserId, int companyId, NotificationSearch? search);
        Task<Notification> GetById(string keycloakUserId, int companyId, int notificationId);
        Task<Notification> Insert(string keycloakUserId, int companyId, NotificationInsertRequest request);
        Task<Notification> Update(string keycloakUserId, int companyId, int notificationId, NotificationUpdateRequest request);
        Task<Notification> Delete(string keycloakUserId, int companyId, int notificationId);
    }
}
