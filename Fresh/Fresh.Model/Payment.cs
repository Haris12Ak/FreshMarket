namespace Fresh.Model
{
    public class Payment
    {
        public int Id { get; set; }
        public decimal Amount { get; set; }
        public DateTime PaymentDate { get; set; }
        public bool IsFinalPayment { get; set; }
        public int PurchaseId { get; set; }
    }
}
