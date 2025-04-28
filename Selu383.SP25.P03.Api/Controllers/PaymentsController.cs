using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Selu383.SP25.P03.Api.Data;
using Selu383.SP25.P03.Api.Features.Reservations;
using Selu383.SP25.P03.Api.Services.Payment;
using System.Threading.Tasks;

namespace Selu383.SP25.P03.Api.Controllers
{
    [Route("api/payments")]
    [ApiController]
    public class PaymentsController : ControllerBase
    {
        private readonly IPaymentService _paymentService;
        private readonly DataContext _dataContext;

        public PaymentsController(IPaymentService paymentService, DataContext dataContext)
        {
            _paymentService = paymentService;
            _dataContext = dataContext;
        }

        [HttpPost]
        [Authorize]
        public async Task<ActionResult<PaymentResult>> ProcessPayment(PaymentRequest request)
        {
            if (request.ReservationId.HasValue)
            {
                var reservation = await _dataContext.Reservations.FindAsync(request.ReservationId.Value);
                if (reservation == null)
                {
                    return NotFound("Reservation not found");
                }

                
                if (request.Amount != reservation.TotalAmount)
                {
                    return BadRequest("Payment amount does not match reservation total");
                }
            }

            var result = await _paymentService.ProcessPayment(request);
            
            if (result.Success && request.ReservationId.HasValue)
            {
                
                var reservation = await _dataContext.Reservations.FindAsync(request.ReservationId.Value);
                if (reservation != null)
                {
                    reservation.IsPaid = true;
                    await _dataContext.SaveChangesAsync();
                }
            }
            
            return result;
        }

        [HttpGet("{paymentId}")]
        [Authorize]
        public async Task<ActionResult<PaymentStatus>> GetPaymentStatus(string paymentId)
        {
            var status = await _paymentService.GetPaymentStatus(paymentId);
            return status;
        }
    }
}