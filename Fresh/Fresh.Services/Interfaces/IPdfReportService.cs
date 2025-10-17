using Fresh.Model;

namespace Fresh.Services.Interfaces
{
    public interface IPdfReportService
    {
        byte[] GeneratePurchaseReport(PrintReportPurchaseDto dto);
        byte[] GenerateCsv(List<AllPurchasesCSVDto> data);
    }
}
