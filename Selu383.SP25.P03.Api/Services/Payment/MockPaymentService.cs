using System;
using System.Collections.Concurrent;
using System.Threading.Tasks;

namespace Selu383.SP25.P03.Api.Services.Payment
{
    public class MockPaymentService : IPaymentService
    {
        private static readonly ConcurrentDictionary<string, PaymentStatus> _payments = new ConcurrentDictionary<string, PaymentStatus>();

        public async Task<PaymentResult> ProcessPayment(PaymentRequest request)
        {
            // Simulate network delay
            await Task.Delay(500);
            
            // Generate a unique payment ID
            string paymentId = Guid.NewGuid().ToString();
            
            // Simulate payment processing
            bool isSuccessful = IsValidCreditCard(request.CardNumber);
            PaymentStatus status = isSuccessful ? PaymentStatus.Successful : PaymentStatus.Failed;
            
            // Store payment status
            _payments[paymentId] = status;
            
            return new PaymentResult
            {
                Success = isSuccessful,
                PaymentId = paymentId,
                Message = isSuccessful ? "Payment processed successfully" : "Payment failed",
                Status = status
            };
        }

        public async Task<PaymentStatus> GetPaymentStatus(string paymentId)
        {
            // network delay
            await Task.Delay(200);
            
            return _payments.TryGetValue(paymentId, out var status) ? status : PaymentStatus.Failed;
        }
        
        private bool IsValidCreditCard(string cardNumber)
        {
            // For demo, cards ending with even numbers are valid
            if (string.IsNullOrEmpty(cardNumber) || cardNumber.Length < 4)
                return false;
                
            int lastDigit = int.Parse(cardNumber.Substring(cardNumber.Length - 1, 1));
            return lastDigit % 2 == 0;
        }
    }
}