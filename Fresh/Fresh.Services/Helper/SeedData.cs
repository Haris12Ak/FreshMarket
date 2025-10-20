using Fresh.Model.Requests;
using Fresh.Services.Interfaces;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;

namespace Fresh.Services.Helper
{
    public static class SeedData
    {
        public static async Task InitializeAsync(IServiceProvider serviceProvider)
        {
            using var scope = serviceProvider.CreateScope();

            var companyService = scope.ServiceProvider.GetRequiredService<ICompanyService>();
            var context = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();

            if (context.Companies.Any())
                return;

            var registration = new CompanyRegistration
            {
                CompanyName = "Test Company",
                CompanyAddress = "Address 123",
                Username = "admin_company",
                Email = "admin_company@example.com",
                FirstName = "Admin",
                LastName = "Admin",
                Password = "admin1234",
                Phone = "062123456"
            };

            await companyService.RegisterCompany(registration);

            var owner = await context.Owners.FirstOrDefaultAsync(x => x.Email == registration.Email);

            if (owner == null)
                throw new Exception("Owner was not created properly!"); ;

            List<ClientInsertRequest> clients = new List<ClientInsertRequest>()
            {
                new ClientInsertRequest { Email = "test_client@example.com", FirstName = "Test", LastName = "Test", Phone = "+234554324" },
                new ClientInsertRequest { Email = "client123@example.com", FirstName = "New", LastName = "Client", Phone = "+032574734" },
            };

            foreach (var client in clients)
            {
                await companyService.AddClientToCompany(owner.CompanyId, owner.KeycloakId, client);
            }

            var client1 = await context.Clients.FirstOrDefaultAsync(c => c.Email == "test_client@example.com");
            var client2 = await context.Clients.FirstOrDefaultAsync(c => c.Email == "client123@example.com");

            context.Notification.Add(new Database.Notification
            {
                Title = "Nova obavijest o otkupu proizvoda",
                Content = $"Obavještavamo Vas da će se naredni otkup proizvoda održati dana {DateTime.Now.AddDays(2)} u vremenu od 10:00h na lokaciji {registration.CompanyAddress}.\r\n\r\nMolimo Vas da donesete svoje proizvode (gljive, šumske plodove, domaće proizvode) na vrijeme kako bi proces otkupa bio što brži i jednostavniji.\r\n\r\nZa dodatne informacije možete nas kontaktirati putem e-maila {owner.Email} ili telefona {owner.Phone}.\r\n\r\nHvala na saradnji!\r\nVaša kompanija {registration.CompanyName}",
                CreatedAt = DateTime.Now,
                CompanyId = owner.CompanyId
            });

            await context.SaveChangesAsync();

            List<Database.ProductType> productTypes = new List<Database.ProductType>()
            {
                new Database.ProductType { Name = "Forest Mushroom", Descriptions = "" },
                new Database.ProductType { Name = "Forest Fruit", Descriptions = "" },
                new Database.ProductType { Name = "Honey Product", Descriptions = "" },
                new Database.ProductType { Name = "Homemade Preserve", Descriptions = "" },
                new Database.ProductType { Name = "Grain Product", Descriptions = "" },
                new Database.ProductType { Name = "Domestic Vegetable", Descriptions = "" },
                new Database.ProductType { Name = "Domestic Fruit", Descriptions = "" }
            };

            foreach (var productType in productTypes)
            {
                context.ProductType.Add(productType);
                await context.SaveChangesAsync();
            }

            List<Database.Products> products = new List<Database.Products>()
            {
                new Database.Products { Name = "Boletus", Unit = Model.UnitType.Kilogram, IsActive = true, CompanyId = owner.CompanyId, ProductTypeId = 1 },
                new Database.Products { Name = "Blueberry", Unit = Model.UnitType.Kilogram, IsActive = true, CompanyId = owner.CompanyId, ProductTypeId = 2 },
                new Database.Products { Name = "Strawberry", Unit = Model.UnitType.Kilogram, IsActive = true, CompanyId = owner.CompanyId, ProductTypeId = 2 },
                new Database.Products { Name = "Raspberry", Unit = Model.UnitType.Kilogram, IsActive = true, CompanyId = owner.CompanyId, ProductTypeId = 2 },
                new Database.Products { Name = "Chanterelle", Unit = Model.UnitType.Kilogram, IsActive = true, CompanyId = owner.CompanyId, ProductTypeId = 1 }
            };

            foreach (var product in products)
            {
                context.Products.Add(product);
                await context.SaveChangesAsync();
            }

            List<Database.ProductPrice> productPrices = new List<Database.ProductPrice>()
            {
                new Database.ProductPrice { PricePerUnit = 10, EffectiveFrom = new DateTime(2025, 9, 5, 0, 0, 0), ProductId = 1 },
                new Database.ProductPrice { PricePerUnit = 12, EffectiveFrom = new DateTime(2025, 9, 5, 0, 0, 0), ProductId = 2 },
                new Database.ProductPrice { PricePerUnit = 15, EffectiveFrom = new DateTime(2025, 9, 5, 0, 0, 0), ProductId = 3 },
                new Database.ProductPrice { PricePerUnit = 8, EffectiveFrom = new DateTime(2025, 9, 5, 0, 0, 0), ProductId = 4 },
                new Database.ProductPrice { PricePerUnit = 5, EffectiveFrom = new DateTime(2025, 9, 5, 0, 0, 0), ProductId = 5 }
            };

            foreach (var productPrice in productPrices)
            {
                context.ProductPrice.Add(productPrice);
                await context.SaveChangesAsync();
            }

            List<Database.Purchase> purchases = new List<Database.Purchase>()
            {
                new Database.Purchase { Quantity = 5, PricePerUnit = 10, TotalAmount = 50, PurchaseDate = DateTime.Now, PaymentType = Model.PaymentType.Immediate, ClientId = client1!.Id, ProductId = 1 },
                new Database.Purchase { Quantity = 15, PricePerUnit = 10, TotalAmount = 150, PurchaseDate = new DateTime(2025, 9, 9, 10, 5, 0), PaymentType = Model.PaymentType.Immediate, ClientId = client1!.Id, ProductId = 1 },
                new Database.Purchase { Quantity = 20, PricePerUnit = 12, TotalAmount = 240, PurchaseDate = new DateTime(2025, 9, 6, 10, 5, 0), PaymentType = Model.PaymentType.Immediate, ClientId = client1!.Id, ProductId = 2 },
                new Database.Purchase { Quantity = 30, PricePerUnit = 10, TotalAmount = 300, PurchaseDate = new DateTime(2025, 9, 10, 10, 5, 0), PaymentType = Model.PaymentType.Immediate, ClientId = client1!.Id, ProductId = 1 },
                new Database.Purchase { Quantity = 42, PricePerUnit = 10, TotalAmount = 420, PurchaseDate = new DateTime(2025, 9, 15, 10, 5, 0), PaymentType = Model.PaymentType.Immediate, ClientId = client2!.Id, ProductId = 1 },
                new Database.Purchase { Quantity = 25, PricePerUnit = 12, TotalAmount = 300, PurchaseDate = new DateTime(2025, 9, 20, 10, 5, 0), PaymentType = Model.PaymentType.Immediate, ClientId = client2!.Id, ProductId = 2 },
                new Database.Purchase { Quantity = 8, PricePerUnit = 15, TotalAmount = 120, PurchaseDate = new DateTime(2025, 9, 18, 10, 5, 0), PaymentType = Model.PaymentType.Immediate, ClientId = client2!.Id, ProductId = 3 }
            };

            foreach (var purchase in purchases)
            {
                context.Purchase.Add(purchase);
                await context.SaveChangesAsync();
            }

            List<Database.Payment> payments = new List<Database.Payment>()
            {
                new Database.Payment { Amount = 50, PaymentDate = DateTime.Now, IsFinalPayment = true, PurchaseId = 1 },
                new Database.Payment { Amount = 150, PaymentDate = new DateTime(2025, 9, 9, 10, 5, 0), IsFinalPayment = true, PurchaseId = 2 },
                new Database.Payment { Amount = 240, PaymentDate = new DateTime(2025, 9, 6, 10, 5, 0), IsFinalPayment = true, PurchaseId = 3 },
                new Database.Payment { Amount = 300, PaymentDate = new DateTime(2025, 9, 10, 10, 5, 0), IsFinalPayment = true, PurchaseId = 4 },
                new Database.Payment { Amount = 420, PaymentDate = new DateTime(2025, 9, 15, 10, 5, 0), IsFinalPayment = true, PurchaseId = 5 },
                new Database.Payment { Amount = 300, PaymentDate = new DateTime(2025, 9, 20, 10, 5, 0), IsFinalPayment = true, PurchaseId = 6 },
                new Database.Payment { Amount = 120, PaymentDate = new DateTime(2025, 9, 18, 10, 5, 0), IsFinalPayment = true, PurchaseId = 7 }
            };

            foreach (var payment in payments)
            {
                context.Payment.Add(payment);
                await context.SaveChangesAsync();
            }
        }
    }
}
