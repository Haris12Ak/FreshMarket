using AutoMapper;
using Fresh.Model;
using Fresh.Model.Requests;
using Fresh.Model.Search;
using Fresh.Services.Interfaces;
using Fresh.Services.SignalR;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;

namespace Fresh.Services.Services
{
    public class NotificationService : INotificationServcie
    {
        private readonly ApplicationDbContext _context;
        private readonly IMapper _mapper;
        private readonly IAuthorizationService _authorizationService;
        private readonly IHubContext<NotificationHub> _hubContext;

        public NotificationService(ApplicationDbContext context, IMapper mapper, IAuthorizationService authorizationService, IHubContext<NotificationHub> hubContext)
        {
            _context = context;
            _mapper = mapper;
            _authorizationService = authorizationService;
            _hubContext = hubContext;
        }

        public async Task<PagedResult<Model.Notification>> GetAll(string keycloakUserId, int companyId, NotificationSearch? search)
        {
            var isUserOfCompany = await _authorizationService.IsUserOfCompany(keycloakUserId, companyId);

            if (!isUserOfCompany)
                throw new Exception("Unable to access data, or companyId does not exist !");

            var query = _context.Notification
                .AsNoTracking()
                .Where(x => x.CompanyId == companyId);

            if (search?.IsCompanyIncluded == true)
                query = query.Include(x => x.Companies);

            var totalItems = await query.CountAsync();
            query = query.Skip(search!.Page * search.PageSize).Take(search.PageSize);
            var totalPages = (int)Math.Ceiling(totalItems / (double)search.PageSize);
            var list = await query
                .OrderByDescending(x => x.Id)
                .ToListAsync();

            PagedResult<Model.Notification> result = new PagedResult<Model.Notification>()
            {
                CurrentPage = search.Page,
                PageSize = search.PageSize,
                TotalItems = totalItems,
                TotalPages = totalPages,
                Items = _mapper.Map<List<Model.Notification>>(list)
            };

            return result;
        }

        public async Task<Model.Notification> GetById(string keycloakUserId, int companyId, int notificationId)
        {
            var isUserOfCompany = await _authorizationService.IsUserOfCompany(keycloakUserId, companyId);

            if (!isUserOfCompany)
                throw new Exception("Unable to access data, or companyId does not exist !");

            var notification = await _context.Notification
                .AsNoTracking()
                .FirstOrDefaultAsync(x => x.Id == notificationId);

            if (notification == null)
                throw new Exception("Notification does not exist !");

            return _mapper.Map<Model.Notification>(notification);
        }

        public async Task<Model.Notification> Insert(string keycloakUserId, int companyId, NotificationInsertRequest request)
        {
            var isOwnerOfCompany = await _authorizationService.IsUserOfCompany(keycloakUserId, companyId);

            if (!isOwnerOfCompany)
                throw new Exception("Unable to access data, or companyId does not exist !");

            var newNotification = _mapper.Map<Database.Notification>(request, opt =>
            {
                opt.AfterMap((src, dest) =>
                {
                    dest.CompanyId = companyId;
                    dest.CreatedAt = DateTime.Now;
                });
            });

            await _context.Notification.AddAsync(newNotification);
            await _context.SaveChangesAsync();

            var mapped = _mapper.Map<Model.Notification>(newNotification);

            await _hubContext.Clients.Group(companyId.ToString()).SendAsync("ReciveNotificationAdded", mapped);

            return mapped;
        }

        public async Task<Model.Notification> Update(string keycloakUserId, int companyId, int notificationId, NotificationUpdateRequest request)
        {
            var isOwnerOfCompany = await _authorizationService.IsUserOfCompany(keycloakUserId, companyId);

            if (!isOwnerOfCompany)
                throw new Exception("Unable to access data, or companyId does not exist !");

            var notification = await _context.Notification.FindAsync(notificationId);

            if (notification == null)
                throw new Exception("Notification does not exist !");

            _mapper.Map(request, notification, opt =>
            {
                opt.AfterMap((src, dest) => dest.CreatedAt = DateTime.Now);
            });

            await _context.SaveChangesAsync();

            Model.Notification mapped = _mapper.Map<Model.Notification>(notification);

            await _hubContext.Clients.Group(companyId.ToString()).SendAsync("ReciveNotificationUpdated", mapped);

            return mapped;
        }

        public async Task<Model.Notification> Delete(string keycloakUserId, int companyId, int notificationId)
        {
            var isOwnerOfCompany = await _authorizationService.IsUserOfCompany(keycloakUserId, companyId);

            if (!isOwnerOfCompany)
                throw new Exception("Unable to access data, or companyId does not exist !");

            var notification = await _context.Notification.FindAsync(notificationId);

            if (notification == null)
                throw new Exception("Notification does not exist !");

            _context.Notification.Remove(notification);
            await _context.SaveChangesAsync();

            Model.Notification mapped = _mapper.Map<Model.Notification>(notification);

            await _hubContext.Clients.Group(companyId.ToString()).SendAsync("ReciveNotificationDeleted", mapped);

            return mapped;
        }
    }
}
