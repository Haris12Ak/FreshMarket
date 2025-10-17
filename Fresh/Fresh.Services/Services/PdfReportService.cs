using Fresh.Model;
using Fresh.Services.Interfaces;
using iText.Kernel.Pdf;
using iText.Layout;
using iText.Layout.Element;
using iText.Layout.Properties;
using System.Text;

namespace Fresh.Services.Services
{
    public class PdfReportService : IPdfReportService
    {
        public byte[] GenerateCsv(List<AllPurchasesCSVDto> data)
        {
            var sb = new StringBuilder();
            sb.AppendLine("PurchaseId,Client,Product,ProductType,Unit,Quantity,PricePerUnit,TotalAmount,PurchaseDate,NumberOfInstallments,PaymentType,IsPaid,TotalPaid,TotalDebt");
            foreach (var p in data)
            {
                sb.AppendLine($"{p.PurchaseId},{p.ClientFirstLastName},{p.ProductName},{p.ProductType},{p.Unit},{p.Quantity},{p.PricePerUnit},{p.TotalAmount},{p.PurchaseDate},{p.NumberOfInstallments},{p.PaymentType},{p.IsPaid},{p.TotalPaid},{p.TotalDebt}");
            }

            var bytes = Encoding.UTF8.GetBytes(sb.ToString());

            return bytes;
        }

        public byte[] GeneratePurchaseReport(PrintReportPurchaseDto dto)
        {
            using var ms = new MemoryStream();
            var writer = new PdfWriter(ms);
            var pdf = new PdfDocument(writer);
            var document = new Document(pdf);

            document.Add(new Paragraph("Company Information")
                .SetBold().SetFontSize(14));
            document.Add(new Paragraph($"{dto.CompanyName}"));
            document.Add(new Paragraph($"Address: {dto.CompanyAddress}"));
            document.Add(new Paragraph($"Email: {dto.CompanyEmail}"));
            document.Add(new Paragraph("\n"));

            document.Add(new Paragraph("Client Information")
                .SetBold().SetFontSize(14));
            document.Add(new Paragraph($"{dto.ClientName}"));
            document.Add(new Paragraph($"Email: {dto.ClientEmail}"));
            document.Add(new Paragraph("\n"));

            document.Add(new Paragraph("Purchase Details")
                .SetBold().SetFontSize(14));

            var purchaseTable = new Table(UnitValue.CreatePercentArray(new float[] { 3, 3 }))
                .UseAllAvailableWidth();

            purchaseTable.AddHeaderCell(
                new Cell().Add(new Paragraph("Field").SetBold()).SetPadding(5));
            purchaseTable.AddHeaderCell(
                new Cell().Add(new Paragraph("Value").SetBold()).SetPadding(5));

            purchaseTable.AddCell(new Cell().Add(new Paragraph("Product").SetBold()).SetPadding(5));
            purchaseTable.AddCell(new Cell().Add(new Paragraph(dto.ProductName)).SetPadding(5));

            purchaseTable.AddCell(new Cell().Add(new Paragraph("Product Type").SetBold()).SetPadding(5));
            purchaseTable.AddCell(new Cell().Add(new Paragraph(dto.ProductType)).SetPadding(5));

            purchaseTable.AddCell(new Cell().Add(new Paragraph("Unit").SetBold()).SetPadding(5));
            purchaseTable.AddCell(new Cell().Add(new Paragraph(dto.Unit.ToString())).SetPadding(5));

            purchaseTable.AddCell(new Cell().Add(new Paragraph("Quantity").SetBold()).SetPadding(5));
            purchaseTable.AddCell(new Cell().Add(new Paragraph(dto.Quantity.ToString())).SetPadding(5));

            purchaseTable.AddCell(new Cell().Add(new Paragraph("Price per Unit").SetBold()).SetPadding(5));
            purchaseTable.AddCell(new Cell().Add(new Paragraph(dto.PricePerUnit.ToString())).SetPadding(5));

            purchaseTable.AddCell(new Cell().Add(new Paragraph("Total Amount").SetBold()).SetPadding(5));
            purchaseTable.AddCell(new Cell().Add(new Paragraph(dto.TotalAmount.ToString("C"))).SetPadding(5));

            purchaseTable.AddCell(new Cell().Add(new Paragraph("Purchase Date").SetBold()).SetPadding(5));
            purchaseTable.AddCell(new Cell().Add(new Paragraph(dto.PurchaseDate.ToShortDateString())).SetPadding(5));

            purchaseTable.AddCell(new Cell().Add(new Paragraph("Installments").SetBold()).SetPadding(5));
            purchaseTable.AddCell(new Cell().Add(new Paragraph(dto.NumberOfInstallments?.ToString() ?? "-")).SetPadding(5));

            purchaseTable.AddCell(new Cell().Add(new Paragraph("Payment Type").SetBold()).SetPadding(5));
            purchaseTable.AddCell(new Cell().Add(new Paragraph(dto.PaymentType.ToString())).SetPadding(5));

            document.Add(purchaseTable);
            document.Add(new Paragraph("\n"));

            document.Add(new Paragraph("Payments")
                .SetBold().SetFontSize(14));

            var paymentTable = new Table(UnitValue.CreatePercentArray(new float[] { 1, 2, 2 }))
                .UseAllAvailableWidth();

            paymentTable.AddHeaderCell(
                new Cell().Add(new Paragraph("Amount").SetBold()).SetPadding(5));
            paymentTable.AddHeaderCell(
                new Cell().Add(new Paragraph("Payment Date").SetBold()).SetPadding(5));
            paymentTable.AddHeaderCell(
                new Cell().Add(new Paragraph("Final Payment").SetBold()).SetPadding(5));

            foreach (var payment in dto.Payments)
            {
                paymentTable.AddCell(new Cell().Add(new Paragraph(payment.Amount.ToString("C"))).SetPadding(5));
                paymentTable.AddCell(new Cell().Add(new Paragraph(payment.PaymentDate.ToShortDateString())).SetPadding(5));
                paymentTable.AddCell(new Cell().Add(new Paragraph(payment.IsFinalPayment ? "Yes" : "No")).SetPadding(5));
            }

            document.Add(paymentTable);

            document.Close();
            return ms.ToArray();
        }
    }
}
