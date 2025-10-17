using Fresh.Model;
using Fresh.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Fresh.Services.Services
{
    public class DashboardService : IDashboardService
    {
        private readonly ApplicationDbContext _context;
        private readonly IAuthorizationService _authorizationService;

        public DashboardService(ApplicationDbContext context, IAuthorizationService authorizationService)
        {
            _context = context;
            _authorizationService = authorizationService;
        }

        public async Task<AdminDashboardDto> AdminDashboardView(string keycloakUserId, int companyId)
        {
            var isOwnerOfCompany = await _authorizationService.IsUserOfCompany(keycloakUserId, companyId);

            if (!isOwnerOfCompany)
                throw new Exception("Unable to access data, or companyId does not exist !");

            var clients = await _context.Clients
                .AsNoTracking()
                .Where(x => x.CompanyId == companyId)
                .ToListAsync();

            var products = await _context.Products
                .AsNoTracking()
                .Where(x => x.CompanyId == companyId)
                .ToListAsync();

            var purchases = await _context.Purchase
                .Include(c => c.Clients)
                .Include(p => p.Payments)
                .Include(pr => pr.Products)
                .AsNoTracking()
                .Where(x => x.Clients.CompanyId == companyId)
                .ToListAsync();

            decimal totalEarnings = 0;
            var totalClients = 0;
            var totalProducts = 0;
            var totalPurchases = 0;

            if (clients.Any())
                totalClients = clients.Count();

            if (products.Any())
                totalProducts = products.Count();

            if (purchases.Any())
            {
                totalPurchases = purchases.Count();
                totalEarnings = purchases.Sum(purchase => purchase.TotalAmount);

                var totalPaid = purchases
                    .SelectMany(p => p.Payments)
                    .Where(date => date.PaymentDate <= DateTime.Now)
                    .Sum(total => total.Amount);

                var totalDebt = totalEarnings - totalPaid;

                List<Model.PurchasedProductsDto> purchaseProduct = purchases
                    .GroupBy(product => product.Products.Name)
                    .Select(g => new Model.PurchasedProductsDto
                    {
                        ProductName = g.Key,
                        Quantity = g.Sum(p => p.Quantity),
                        PricePerUnit = g.First().PricePerUnit,
                        Unit = g.First().Products.Unit,
                        Total = g.Sum(p => p.Quantity * p.PricePerUnit)
                    }).ToList();

                List<Model.MonthlyPurchaseDto> monthlyPurchases = purchases
                    .GroupBy(p => new { p.PurchaseDate.Year, p.PurchaseDate.Month })
                    .Select(g => new Model.MonthlyPurchaseDto
                    {
                        Year = g.Key.Year,
                        Month = g.Key.Month,
                        TotalQuantity = g.Sum(p => p.Quantity),
                        TotalProfit = g.Sum(p => p.Quantity * p.PricePerUnit)
                    })
                    .OrderBy(x => x.Year)
                    .ThenBy(x => x.Month)
                    .ToList();

                List<Model.TopClientsDto> topClients = purchases
                   .GroupBy(p => new { p.Clients.FirstName, p.Clients.LastName })
                   .Select(g => new Model.TopClientsDto
                   {
                       FullName = $"{g.Key.FirstName} {g.Key.LastName}",
                       TotalQuantity = g.Sum(p => p.Quantity),
                       TotalProfit = g.Sum(p => p.Quantity * p.PricePerUnit)
                   })
                   .OrderByDescending(x => x.TotalQuantity)
                   .Take(5)
                   .ToList();

                List<Model.PaymentTypeDto> paymentType = purchases
                  .GroupBy(pay => pay.PaymentType)
                  .Select(g => new Model.PaymentTypeDto
                  {
                      PaymentType = g.Key,
                      TotalAmount = g.Sum(p => p.Payments.Sum(pay => pay.Amount)),
                      Count = g.Count()
                  })
                  .ToList();

                Model.AdminDashboardDto result = new Model.AdminDashboardDto()
                {
                    TotalProducts = totalProducts,
                    TotalClients = totalClients,
                    TotalPurchases = totalPurchases,
                    TotalPaid = totalPaid,
                    TotalDebt = totalDebt,
                    PurchasedProducts = purchaseProduct,
                    MonthlyPurchase = monthlyPurchases,
                    TopClients = topClients,
                    PaymentType = paymentType
                };

                return result;
            }

            return new Model.AdminDashboardDto()
            {
                TotalProducts = totalProducts,
                TotalClients = totalClients,
                TotalPurchases = totalPurchases,
                TotalPaid = 0,
                TotalDebt = 0,
                PurchasedProducts = new List<PurchasedProductsDto>(),
                MonthlyPurchase = new List<MonthlyPurchaseDto>(),
                TopClients = new List<TopClientsDto>(),
                PaymentType = new List<PaymentTypeDto>()
            };
        }

        public async Task<ClientDashboardDto> ClientDashboardView(string keycloakUserId, int companyId)
        {
            var isClientOfCompany = await _authorizationService.IsUserOfCompany(keycloakUserId, companyId);

            if (!isClientOfCompany)
                throw new Exception("Unable to access data, or companyId does not exist !");

            var client = await _context.Clients
                .AsNoTracking()
                .FirstOrDefaultAsync(x => x.KeycloakId == keycloakUserId);

            if (client == null)
                throw new Exception("Client does not exist!");

            var purchases = await _context.Purchase
                .Include(p => p.Products)
                .Include(pay => pay.Payments)
                .AsNoTracking()
                .Where(x => x.ClientId == client.Id)
                .ToListAsync();

            if (purchases.Any())
            {
                var totalPurchases = purchases.Count();
                var totalEarnings = purchases.Sum(x => x.TotalAmount);
                var totalPaid = purchases
                    .SelectMany(x => x.Payments)
                    .Where(p => p.PaymentDate <= DateTime.Now)
                    .Sum(t => t.Amount);

                var totalDebt = totalEarnings - totalPaid;

                List<Model.PurchasedProductsDto> purchaseProduct = purchases
                     .GroupBy(product => product.Products.Name)
                     .Select(g => new Model.PurchasedProductsDto
                     {
                         ProductName = g.Key,
                         Quantity = g.Sum(p => p.Quantity),
                         PricePerUnit = g.First().PricePerUnit,
                         Unit = g.First().Products.Unit,
                         Total = g.Sum(p => p.Quantity * p.PricePerUnit)
                     }).ToList();

                List<Model.MonthlyPurchaseDto> monthlyPurchases = purchases
                    .GroupBy(p => new { p.PurchaseDate.Year, p.PurchaseDate.Month })
                    .Select(g => new Model.MonthlyPurchaseDto
                    {
                        Year = g.Key.Year,
                        Month = g.Key.Month,
                        TotalQuantity = g.Sum(p => p.Quantity),
                        TotalProfit = g.Sum(p => p.Quantity * p.PricePerUnit)
                    })
                    .OrderBy(x => x.Year)
                    .ThenBy(x => x.Month)
                    .ToList();

                List<Model.TopProductsDto> topProducts = purchases
                  .GroupBy(p => p.Products.Name)
                  .Select(g => new Model.TopProductsDto
                  {
                      ProductName = g.Key,
                      TotalQuantity = g.Sum(p => p.Quantity),
                      TotalProfit = g.Sum(p => p.Quantity * p.PricePerUnit)
                  })
                  .OrderByDescending(x => x.TotalQuantity)
                  .Take(3)
                  .ToList();

                Model.ClientDashboardDto result = new ClientDashboardDto()
                {
                    TotalPurchases = totalPurchases,
                    TotalEarnings = totalEarnings,
                    TotalPaid = totalPaid,
                    TotalDebt = totalDebt,
                    PurchasedProducts = purchaseProduct,
                    MonthlyPurchase = monthlyPurchases,
                    TopProducts = topProducts
                };

                return result;
            }

            return new Model.ClientDashboardDto()
            {
                TotalPurchases = 0,
                TotalEarnings = 0,
                TotalPaid = 0,
                TotalDebt = 0,
                PurchasedProducts = new List<PurchasedProductsDto>(),
                MonthlyPurchase = new List<MonthlyPurchaseDto>(),
                TopProducts = new List<TopProductsDto>()
            };
        }
    }
}
