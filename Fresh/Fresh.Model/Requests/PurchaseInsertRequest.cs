namespace Fresh.Model.Requests
{
    public class PurchaseInsertRequest
    {
        public decimal Quantity { get; set; }
        public int ClientId { get; set; }
        public int ProductId { get; set; }
        public PaymentType PaymentType { get; set; }
        public int? NumberOfInstallments { get; set; }
    }
}
