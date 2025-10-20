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
    public class PurchaseController : ControllerBase
    {
        private readonly IPurchaseService _purchaseService;
        private readonly ICurrentUserService _currentUserService;
        private readonly IPdfReportService _pdfReportService;

        public PurchaseController(IPurchaseService purchaseService, ICurrentUserService currentUserService, IPdfReportService pdfReportService)
        {
            _purchaseService = purchaseService;
            _currentUserService = currentUserService;
            _pdfReportService = pdfReportService;
        }

        [Authorize(Roles = "admin")]
        [HttpGet("GetAll/{companyId}")]
        public async Task<List<Model.Purchase>> GetAll(int companyId, [FromQuery] PurchaseSearch? search)
        {
            return await _purchaseService.GetAll(_currentUserService.KeycloakUserId, companyId, search);
        }

        [Authorize(Roles = "admin, client")]
        [HttpGet("companies/{companyId}/purchases/{purchaseId}")]
        public async Task<Model.Purchase> GetById(int companyId, int purchaseId, [FromQuery] PurchaseSearch? search)
        {
            return await _purchaseService.GetById(_currentUserService.KeycloakUserId, companyId, purchaseId, search);
        }

        [HttpGet("GetClientsByPurchases/{companyId}")]
        public async Task<PagedResult<Model.PurchasesClientDto>> GetClientsByPurchases(int companyId, [FromQuery] ClientsPurchasesSearch? search)
        {
            return await _purchaseService.GetClientsByPurchases(_currentUserService.KeycloakUserId, companyId, search);
        }

        [Authorize(Roles = "client")]
        [HttpGet("GetClientPurchasesInfo/{companyId}")]
        public async Task<PagedResult<ClientPurchasesInfo>> GetClientPurchasesInfo(int companyId, [FromQuery] BaseSearch? search)
        {
            return await _purchaseService.GetClientPurchasesInfo(_currentUserService.KeycloakUserId, companyId, search);
        }

        [HttpGet("companies/{companyId}/clients/{clientId}")]
        public async Task<PagedResult<Model.Purchase>> GetPurchasesByClientId(int companyId, int clientId, [FromQuery] PurchaseSearch? search)
        {
            return await _purchaseService.GetPurchasesByClientId(_currentUserService.KeycloakUserId, companyId, clientId, search);
        }

        [Authorize(Roles = "admin")]
        [HttpPost("Insert/{companyId}")]
        public async Task<Model.Purchase> Insert(int companyId, [FromBody] PurchaseInsertRequest request)
        {
            return await _purchaseService.Insert(_currentUserService.KeycloakUserId, companyId, request);
        }

        [Authorize(Roles = "admin")]
        [HttpPut("companies/{companyId}/purchases/{purchaseId}")]
        public async Task<Model.Purchase> Update(int companyId, int purchaseId, [FromBody] PurchaseUpdateRequest request)
        {
            return await _purchaseService.Update(_currentUserService.KeycloakUserId, companyId, purchaseId, request);
        }

        [Authorize(Roles = "admin")]
        [HttpDelete("companies/{companyId}/purchases/{purchaseId}")]
        public async Task<Model.Purchase> Delete(int companyId, int purchaseId)
        {
            return await _purchaseService.Delete(_currentUserService.KeycloakUserId, companyId, purchaseId);
        }

        [Authorize(Roles = "admin")]
        [HttpGet("generate-csv/{companyId}")]
        public async Task<ActionResult<List<AllPurchasesCSVDto>>> GetAllPurchasesCsv(int companyId)
        {
            var data = await _purchaseService.GetAllPurchasesCsv(_currentUserService.KeycloakUserId, companyId);

            var csvBytes = _pdfReportService.GenerateCsv(data);

            return File(csvBytes, "text/csv", "purchases.csv");
        }

        [Authorize(Roles = "admin")]
        [HttpGet("report/{companyId}/{purchaseId}")]
        public async Task<ActionResult<PrintReportPurchaseDto>> PrintPdf(int companyId, int purchaseId)
        {
            var data = await _purchaseService.PrintPdf(_currentUserService.KeycloakUserId, companyId, purchaseId);

            var pdfBytes = _pdfReportService.GeneratePurchaseReport(data);

            return File(pdfBytes, "application/pdf", "purchase-report.pdf");
        }
    }
}
