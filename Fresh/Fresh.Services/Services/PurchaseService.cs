using AutoMapper;
using Fresh.Model;
using Fresh.Model.Requests;
using Fresh.Model.Search;
using Fresh.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Fresh.Services.Services
{
    public class PurchaseService : IPurchaseService
    {
        private readonly ApplicationDbContext _context;
        private readonly IMapper _mapper;
        private readonly IAuthorizationService _authorizationService;

        public PurchaseService(ApplicationDbContext context, IMapper mapper, IAuthorizationService authorizationService)
        {
            _context = context;
            _mapper = mapper;
            _authorizationService = authorizationService;
        }

        public async Task<List<Model.Purchase>> GetAll(string keycloakUserId, int companyId, PurchaseSearch? search)
        {
            var isOwnerOfCompany = await _authorizationService.IsUserOfCompany(keycloakUserId, companyId);

            if (!isOwnerOfCompany)
                throw new Exception("Unable to access data, or companyId does not exist !");

            var query = _context.Purchase
                .AsNoTracking()
                .AsQueryable();

            if (search?.IsProductIncluded == true)
            {
                query = query.Include(x => x.Products);
            }

            if (search?.IsClientIncluded == true)
            {
                query = query.Include(x => x.Clients);
            }

            var purchase = await query
                .OrderByDescending(x => x.Id)
                .ToListAsync();

            return _mapper.Map<List<Model.Purchase>>(purchase);
        }

        public async Task<Model.Purchase> GetById(string keycloakUserId, int companyId, int purchaseId, PurchaseSearch? search)
        {
            var isOwnerOfCompany = await _authorizationService.IsUserOfCompany(keycloakUserId, companyId);

            if (!isOwnerOfCompany)
                throw new Exception("Unable to access data, or companyId does not exist !");

            var query = _context.Purchase
                .AsNoTracking()
                .Where(x => x.Id == purchaseId);

            if (search?.IsProductIncluded == true)
            {
                query = query.Include(x => x.Products)
                    .ThenInclude(y => y.ProductType);
            }

            if (search?.IsClientIncluded == true)
            {
                query = query.Include(x => x.Clients);
            }

            if (search?.IsPaymentsIncluded == true)
            {
                query = query.Include(x => x.Payments);
            }

            var purchase = await query.FirstOrDefaultAsync();

            if (purchase == null)
                return null;

            return _mapper.Map<Model.Purchase>(purchase);
        }

        public async Task<Model.Purchase> Insert(string keycloakUserId, int companyId, PurchaseInsertRequest request)
        {
            var isOwnerOfCompany = await _authorizationService.IsUserOfCompany(keycloakUserId, companyId);

            if (!isOwnerOfCompany)
                throw new Exception("Unable to access data, or companyId does not exist !");

            var client = await _context.Clients.FindAsync(request.ClientId);

            if (client == null)
                throw new Exception("Client does not exist !");

            var product = await _context.Products
                .Include(x => x.ProductPrices)
                .FirstOrDefaultAsync(x => x.Id == request.ProductId);

            if (product == null)
                throw new Exception("Product does not exist !");

            if (product.ProductPrices.Count != 0)
            {
                var currentPrice = product.ProductPrices
                    .OrderByDescending(x => x.EffectiveFrom)
                    .FirstOrDefault();

                var price = currentPrice!.PricePerUnit;

                var totalAmount = price * request.Quantity;

                var newPurchase = _mapper.Map<Database.Purchase>(request, opt =>
                {
                    opt.AfterMap((src, dest) =>
                    {
                        dest.PricePerUnit = price;
                        dest.TotalAmount = totalAmount;
                        dest.PurchaseDate = DateTime.Now;
                    });
                });

                await _context.Purchase.AddAsync(newPurchase);
                await _context.SaveChangesAsync();

                switch (request.PaymentType)
                {
                    case PaymentType.Immediate:
                        await AddImmediatePayment(newPurchase);
                        break;
                    case PaymentType.Monthly:
                        await AddMonthlyPayment(newPurchase);
                        break;
                    case PaymentType.Installments:
                        if (!request.NumberOfInstallments.HasValue || request.NumberOfInstallments <= 0)
                            throw new Exception("NumberOfInstallments must be set and greater than 0 for Installments payment type.");
                        await AddInstallmentsPaymnet(newPurchase);
                        break;
                }

                return _mapper.Map<Model.Purchase>(newPurchase);
            }
            else
                throw new Exception("The price of the product has not been set. Add the product price before adding a purchase !");
        }

        public async Task<Model.Purchase> Update(string keycloakUserId, int companyId, int purchaseId, PurchaseUpdateRequest request)
        {
            var isOwnerOfCompany = await _authorizationService.IsUserOfCompany(keycloakUserId, companyId);

            if (!isOwnerOfCompany)
                throw new Exception("Unable to access data, or companyId does not exist !");

            var purchase = await _context.Purchase
                .Include(p => p.Payments)
                .FirstOrDefaultAsync(x => x.Id == purchaseId);

            if (purchase == null)
                throw new Exception("Purchase with selected ID does not exist !");

            var product = await _context.Products
                .Include(x => x.ProductPrices)
                .FirstOrDefaultAsync(x => x.Id == request.ProductId);

            if (product == null)
                throw new Exception("Product does not exist !");

            if (request.PaymentType != null && request.PaymentType == PaymentType.Immediate)
            {
                if (purchase.Payments.Any(x => x.PaymentDate >= DateTime.Now))
                {
                    if (purchase.PaymentType == PaymentType.Installments)
                        purchase.NumberOfInstallments = null;

                    _context.Payment.RemoveRange(purchase.Payments);
                    await _context.SaveChangesAsync();

                    await AddImmediatePayment(purchase);
                }
                else
                {
                    throw new Exception("The selected purchase has already been paid for.");
                }
            }

            var price = purchase.PricePerUnit;
            var totalAmount = price * request.Quantity;

            _mapper.Map(request, purchase, opt =>
            {
                opt.AfterMap((src, dest) =>
                {
                    dest.PricePerUnit = price;
                    dest.TotalAmount = totalAmount;
                    dest.PurchaseDate = purchase.PurchaseDate;
                });
            });

            await _context.SaveChangesAsync();

            return _mapper.Map<Model.Purchase>(purchase);
        }

        public async Task<Model.Purchase> Delete(string keycloakUserId, int companyId, int purchaseId)
        {
            var isOwnerOfCompany = await _authorizationService.IsUserOfCompany(keycloakUserId, companyId);

            if (!isOwnerOfCompany)
                throw new Exception("Unable to access data, or companyId does not exist !");

            var purchase = await _context.Purchase
                .Include(p => p.Payments)
                .FirstOrDefaultAsync(x => x.Id == purchaseId);

            if (purchase == null)
                throw new Exception("Purchase with selected ID does not exist !");

            _context.Payment.RemoveRange(purchase.Payments);

            _context.Purchase.Remove(purchase);
            await _context.SaveChangesAsync();

            return _mapper.Map<Model.Purchase>(purchase);
        }

        public async Task<PagedResult<Model.PurchasesClientDto>> GetClientsByPurchases(string keycloakUserId, int companyId, ClientsPurchasesSearch? search)
        {
            var isOwnerOfCompany = await _authorizationService.IsUserOfCompany(keycloakUserId, companyId);

            if (!isOwnerOfCompany)
                throw new Exception("Unable to access data, or companyId does not exist !");

            var query = _context.Clients
                .Include(x => x.Purchases)
                   .ThenInclude(p => p.Products)
                .Include(x => x.Purchases)
                   .ThenInclude(p => p.Payments)
                .AsNoTracking()
                .Where(x => x.CompanyId == companyId && x.IsActive == true);

            if (!string.IsNullOrEmpty(search?.FirstNameAndLastName))
            {
                query = query.Where(client => (client.FirstName + " " + client.LastName).ToLower().Contains(search.FirstNameAndLastName.ToLower()) ||
                (client.LastName + " " + client.FirstName).ToLower().Contains(search.FirstNameAndLastName.ToLower()));
            }

            var totalItems = await query.CountAsync();
            query = query.Skip(search!.Page * search.PageSize).Take(search.PageSize);
            var totalPages = (int)Math.Ceiling(totalItems / (double)search.PageSize);
            var list = await query.ToListAsync();

            Model.PagedResult<PurchasesClientDto> result = new PagedResult<PurchasesClientDto>();

            result.CurrentPage = search.Page;
            result.PageSize = search.PageSize;
            result.TotalItems = totalItems;
            result.TotalPages = totalPages;

            if (list.Any())
            {
                foreach (var client in list)
                {
                    int totalPurchases = client.Purchases.Count;
                    decimal totalQuantity = client.Purchases.Sum(q => q.Quantity);
                    decimal totalEarnings = client.Purchases.Sum(a => a.TotalAmount);

                    decimal totalPaid = client.Purchases
                        .SelectMany(p => p.Payments)
                        .Where(pay => pay.PaymentDate <= DateTime.Now)
                        .Sum(pay => pay.Amount);

                    decimal totalDebt = totalEarnings - totalPaid;

                    result.Items.Add(new Model.PurchasesClientDto
                    {
                        ClientId = client.Id,
                        ClientFirstLastName = client.FirstName + " " + client.LastName,
                        ClientPhone = client.Phone,
                        ClientEmail = client.Email,
                        TotalPurchases = totalPurchases,
                        TotalQuantity = totalQuantity,
                        TotalEarnings = totalEarnings,
                        TotalPaid = totalPaid,
                        TotalDebt = totalDebt,
                    });
                }
            }

            return result;
        }

        public async Task<PagedResult<ClientPurchasesInfo>> GetClientPurchasesInfo(string keycloakUserId, int companyId, BaseSearch? search)
        {
            var isClientOfCompany = await _authorizationService.IsUserOfCompany(keycloakUserId, companyId);

            if (!isClientOfCompany)
                throw new Exception("Unable to access data, or companyId does not exist !");

            var query = _context.Purchase
                .Include(c => c.Clients)
                .Include(p => p.Payments)
                .Include(p => p.Products)
                .ThenInclude(t => t.ProductType)
                .AsNoTracking()
                .Where(x => x.Clients.KeycloakId == keycloakUserId);

            var totalItems = await query.CountAsync();
            query = query.Skip(search!.Page * search.PageSize).Take(search.PageSize);
            var totalPages = (int)Math.Ceiling(totalItems / (double)search.PageSize);
            var list = await query
                .OrderByDescending(x => x.Id)
                .ToListAsync();

            Model.PagedResult<Model.ClientPurchasesInfo> result = new PagedResult<Model.ClientPurchasesInfo>();

            result.CurrentPage = search.Page;
            result.PageSize = search.PageSize;
            result.TotalItems = totalItems;
            result.TotalPages = totalPages;

            if (list.Any())
            {
                int totalPurchases = list.Count();
                decimal totalQuantity = list.Sum(q => q.Quantity);
                decimal totalEarnings = list.Sum(e => e.TotalAmount);
                DateTime lastPurchaseDate = list.Max(d => d.PurchaseDate);

                string mostSoldProduct = list.GroupBy(p => p.Products.Name)
                    .OrderByDescending(q => q.Sum(q => q.Quantity))
                    .Select(x => x.Key)
                .FirstOrDefault()!;

                decimal totalPaid = list
                        .SelectMany(p => p.Payments)
                        .Where(pay => pay.PaymentDate <= DateTime.Now)
                        .Sum(pay => pay.Amount);

                decimal totalDebt = totalEarnings - totalPaid;

                result.Items.Add(new Model.ClientPurchasesInfo
                {
                    ClientId = list.First().ClientId,
                    TotalPurchases = totalPurchases,
                    TotalQuantity = totalQuantity,
                    TotalEarnings = totalEarnings,
                    MostSoldProduct = mostSoldProduct,
                    LastPurchaseDate = lastPurchaseDate,
                    TotalPaid = totalPaid,
                    TotalDebt = totalDebt,
                });

                return result;
            }

            return result;
        }

        public async Task<PagedResult<Model.Purchase>> GetPurchasesByClientId(string keycloakUserId, int companyId, int clientId, PurchaseSearch? search)
        {
            var isClientOfCompany = await _authorizationService.IsUserOfCompany(keycloakUserId, companyId);

            if (!isClientOfCompany)
                throw new Exception("Unable to access data, or companyId does not exist !");

            var query = _context.Purchase
               .Include(c => c.Clients)
               .Include(p => p.Payments)
               .Include(p => p.Products)
               .ThenInclude(t => t.ProductType)
               .AsNoTracking()
               .Where(x => x.ClientId == clientId);

            if (!string.IsNullOrEmpty(search?.ProductType))
            {
                query = query.Where(purchase => purchase.Products.ProductType.Name.ToLower().Contains(search.ProductType.ToLower()));
            }

            if (search?.DateFrom != null && search?.DateTo != null)
            {
                if (search.DateFrom >= search.DateTo)
                    throw new Exception("Date From cannot be greater than Date To !");
            }

            if (search?.DateFrom != null)
            {
                query = query.Where(purchase => purchase.PurchaseDate.Date >= search.DateFrom.Value.Date);
            }

            if (search?.DateTo != null)
            {
                query = query.Where(purchase => purchase.PurchaseDate.Date <= search.DateTo.Value.Date);
            }

            var totalItems = await query.CountAsync();
            query = query.Skip(search!.Page * search.PageSize).Take(search.PageSize);
            var totalPages = (int)Math.Ceiling(totalItems / (double)search.PageSize);
            var list = await query
                .OrderByDescending(x => x.Id)
                .ToListAsync();

            Model.PagedResult<Model.Purchase> result = new PagedResult<Model.Purchase>();

            result.CurrentPage = search.Page;
            result.PageSize = search.PageSize;
            result.TotalItems = totalItems;
            result.TotalPages = totalPages;

            if (list.Any())
            {
                foreach (var purchase in list)
                {
                    result.Items.Add(new Model.Purchase
                    {
                        Id = purchase.Id,
                        Quantity = purchase.Quantity,
                        PricePerUnit = purchase.PricePerUnit,
                        TotalAmount = purchase.TotalAmount,
                        PurchaseDate = purchase.PurchaseDate,
                        NumberOfInstallments = purchase.NumberOfInstallments,
                        PaymentType = purchase.PaymentType,
                        ClientId = purchase.ClientId,
                        ProductId = purchase.ProductId,
                        Products = new Model.Products
                        {
                            Id = purchase.Products.Id,
                            Name = purchase.Products.Name,
                            Image = purchase.Products.Image,
                            Unit = purchase.Products.Unit,
                            IsActive = purchase.Products.IsActive,
                            CompanyId = purchase.Products.CompanyId,
                            ProductTypeId = purchase.Products.ProductTypeId,
                            ProductType = new Model.ProductType
                            {
                                Id = purchase.Products.ProductType.Id,
                                Name = purchase.Products.ProductType.Name,
                                Descriptions = purchase.Products.ProductType.Descriptions,
                            },
                        },
                        Payments = purchase.Payments.Select(pay => new Model.Payment
                        {
                            Id = pay.Id,
                            Amount = pay.Amount,
                            PaymentDate = pay.PaymentDate,
                            IsFinalPayment = pay.IsFinalPayment,
                            PurchaseId = pay.PurchaseId,
                        }).ToList()
                    });
                }
            }

            return result;
        }

        private async Task AddImmediatePayment(Database.Purchase purchase)
        {
            var payment = new Database.Payment
            {
                PurchaseId = purchase.Id,
                Amount = purchase.TotalAmount,
                PaymentDate = DateTime.Now,
                IsFinalPayment = true,
            };

            await _context.Payment.AddAsync(payment);
            await _context.SaveChangesAsync();
        }

        private async Task AddMonthlyPayment(Database.Purchase purchase)
        {
            var payment = new Database.Payment
            {
                PurchaseId = purchase.Id,
                Amount = purchase.TotalAmount,
                PaymentDate = DateTime.Now.AddMonths(1),
                IsFinalPayment = true,
            };

            await _context.Payment.AddAsync(payment);
            await _context.SaveChangesAsync();
        }

        private async Task AddInstallmentsPaymnet(Database.Purchase purchase)
        {
            int installments = purchase.NumberOfInstallments ?? 3;
            decimal installmentAmount = Math.Round(purchase.TotalAmount / installments, 2);

            for (int i = 1; i <= installments; i++)
            {
                var payment = new Database.Payment
                {
                    PurchaseId = purchase.Id,
                    Amount = installmentAmount,
                    PaymentDate = DateTime.Now.AddMonths(i),
                    IsFinalPayment = (i == installments),
                };

                await _context.Payment.AddAsync(payment);
            }

            await _context.SaveChangesAsync();
        }

        public async Task<List<AllPurchasesCSVDto>> GetAllPurchasesCsv(string keycloakUserId, int companyId)
        {
            var isOwnerOfCompany = await _authorizationService.IsUserOfCompany(keycloakUserId, companyId);

            if (!isOwnerOfCompany)
                throw new Exception("Unable to access data, or companyId does not exist !");

            var purchases = await _context.Purchase
                .Include(p => p.Products)
                .ThenInclude(t => t.ProductType)
                .Include(c => c.Clients)
                .Include(p => p.Payments)
                .AsNoTracking()
                .Where(x => x.Clients.CompanyId == companyId)
                .ToListAsync();

            List<AllPurchasesCSVDto> data = new List<AllPurchasesCSVDto>();

            if (purchases.Any())
            {
                foreach (var purchase in purchases)
                {
                    var totalPaid = purchase.Payments
                        .Where(p => p.PaymentDate <= DateTime.Now)
                        .Sum(p => p.Amount);

                    var remainingDebt = purchase.TotalAmount - totalPaid;

                    data.Add(new AllPurchasesCSVDto
                    {
                        PurchaseId = purchase.Id,
                        ClientFirstLastName = purchase.Clients.FirstName + " " + purchase.Clients.LastName,
                        ProductName = purchase.Products.Name,
                        ProductType = purchase.Products.ProductType.Name,
                        Unit = purchase.Products.Unit,
                        Quantity = purchase.Quantity,
                        PricePerUnit = purchase.PricePerUnit,
                        TotalAmount = purchase.TotalAmount,
                        PurchaseDate = purchase.PurchaseDate,
                        NumberOfInstallments = purchase.NumberOfInstallments,
                        PaymentType = purchase.PaymentType,
                        IsPaid = remainingDebt <= 0,
                        TotalPaid = totalPaid,
                        TotalDebt = remainingDebt > 0 ? remainingDebt : 0,
                    });
                }

                return data;
            }

            return data;
        }

        public async Task<PrintReportPurchaseDto> PrintPdf(string keycloakUserId, int companyId, int purchaseId)
        {
            var isOwnerOfCompany = await _authorizationService.IsUserOfCompany(keycloakUserId, companyId);

            if (!isOwnerOfCompany)
                throw new Exception("Unable to access data, or companyId does not exist !");

            var owner = await _context.Owners
                .Include(c => c.Companies)
                .AsNoTracking()
                .FirstOrDefaultAsync(x => x.CompanyId == companyId);

            var purchase = await _context.Purchase
                .Include(p => p.Products)
                .ThenInclude(t => t.ProductType)
                .Include(c => c.Clients)
                .Include(p => p.Payments)
                .AsNoTracking()
                .FirstOrDefaultAsync(x => x.Clients.CompanyId == companyId && x.Id == purchaseId);

            PrintReportPurchaseDto report = new PrintReportPurchaseDto();

            if (purchase != null && owner != null)
            {
                report = new PrintReportPurchaseDto()
                {
                    CompanyName = owner.Companies.CompanyName,
                    CompanyAddress = owner.Companies.CompanyAddress,
                    CompanyEmail = owner.Email,
                    ClientName = purchase.Clients.FirstName + " " + purchase.Clients.LastName,
                    ClientEmail = purchase.Clients.Email,
                    ProductName = purchase.Products.Name,
                    ProductType = purchase.Products.ProductType.Name,
                    Unit = purchase.Products.Unit,
                    Quantity = purchase.Quantity,
                    PricePerUnit = purchase.PricePerUnit,
                    TotalAmount = purchase.TotalAmount,
                    PurchaseDate = purchase.PurchaseDate,
                    NumberOfInstallments = purchase.NumberOfInstallments ?? 0,
                    PaymentType = purchase.PaymentType,
                    Payments = purchase.Payments.Select(payment => new Model.Payment
                    {
                        Amount = payment.Amount,
                        PaymentDate = payment.PaymentDate,
                        IsFinalPayment = payment.IsFinalPayment,
                    }).ToList()
                };

                return report;
            }

            return report;
        }
    }
}
