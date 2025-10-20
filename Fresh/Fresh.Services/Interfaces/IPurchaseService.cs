using Fresh.Model;
using Fresh.Model.Requests;
using Fresh.Model.Search;

namespace Fresh.Services.Interfaces
{
    public interface IPurchaseService
    {
        Task<List<Purchase>> GetAll(string keycloakUserId, int companyId, PurchaseSearch? search);
        Task<Purchase> GetById(string keycloakUserId, int companyId, int purchaseId, PurchaseSearch? search);
        Task<PagedResult<PurchasesClientDto>> GetClientsByPurchases(string keycloakUserId, int companyId, ClientsPurchasesSearch? search);
        Task<PagedResult<ClientPurchasesInfo>> GetClientPurchasesInfo(string keycloakUserId, int companyId, BaseSearch? search);
        Task<PagedResult<Purchase>> GetPurchasesByClientId(string keycloakUserId, int companyId, int clientId, PurchaseSearch? search);
        Task<Purchase> Insert(string keycloakUserId, int companyId, PurchaseInsertRequest request);
        Task<Purchase> Update(string keycloakUserId, int companyId, int purchaseId, PurchaseUpdateRequest request);
        Task<Purchase> Delete(string keycloakUserId, int companyId, int purchaseId);
        Task<List<AllPurchasesCSVDto>> GetAllPurchasesCsv(string keycloakUserId, int companyId);
        Task<PrintReportPurchaseDto> PrintPdf(string keycloakUserId, int companyId, int purchaseId);
    }
}
