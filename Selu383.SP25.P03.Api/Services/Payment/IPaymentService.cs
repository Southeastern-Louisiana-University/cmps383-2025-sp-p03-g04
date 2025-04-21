namespace Selu383.SP25.P03.Api.Services.Payment
{
    public interface IPaymentService
    {
        Task<PaymentResult> ProcessPayment(PaymentRequest request);
        Task<PaymentStatus> GetPaymentStatus(string paymentId);
    }

    public class PaymentRequest
    {
        public decimal Amount { get; set; }
        public required string CardNumber { get; set; }
        public required string ExpiryDate { get; set; }
        public required string Cvv { get; set; }
        public required string CardholderName { get; set; }
        public string PaymentMethod { get; set; } = "CreditCard";
        public int? ReservationId { get; set; }
    }

    public class PaymentResult
    {
        public bool Success { get; set; }
        public required string PaymentId { get; set; }
        public required string Message { get; set; }
        public PaymentStatus Status { get; set; }
    }

    public enum PaymentStatus
    {
        Pending,
        Successful,
        Failed,
        Refunded
    }
}