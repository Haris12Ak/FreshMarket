namespace Fresh.Model.Requests
{
    public class PurchaseUpdateRequest
    {
        public decimal Quantity { get; set; }
        public int ProductId { get; set; }
        public PaymentType? PaymentType { get; set; }
    }
}
