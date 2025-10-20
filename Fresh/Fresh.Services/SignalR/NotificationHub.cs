using Microsoft.AspNetCore.SignalR;

namespace Fresh.Services.SignalR
{
    public class NotificationHub : Hub
    {
        public async override Task OnConnectedAsync()
        {
            var companyId = Context.GetHttpContext()?.Request.Query["companyId"].ToString();

            if (!string.IsNullOrEmpty(companyId))
            {
                await Groups.AddToGroupAsync(Context.ConnectionId, companyId);
            }

            await base.OnConnectedAsync();
        }

        public async override Task OnDisconnectedAsync(Exception? exception)
        {
            var companyId = Context.GetHttpContext()?.Request.Query["companyId"].ToString();

            if (!string.IsNullOrEmpty(companyId))
            {
                await Groups.RemoveFromGroupAsync(Context.ConnectionId, companyId);
            }

            await base.OnDisconnectedAsync(exception);
        }

    }
}
