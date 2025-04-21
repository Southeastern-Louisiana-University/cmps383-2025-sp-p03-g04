using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Selu383.SP25.P03.Api.Data;
using Selu383.SP25.P03.Api.Features.Concessions;
using Selu383.SP25.P03.Api.Features.Reservations;
using Selu383.SP25.P03.Api.Features.Users;
using Selu383.SP25.P03.Api.Services.Payment;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Selu383.SP25.P03.Api.Controllers
{
    [Route("api/checkout")]
    [ApiController]
    [Authorize]
    public class CheckoutController : ControllerBase
    {
        private readonly DataContext _dataContext;
        private readonly UserManager<User> _userManager;
        private readonly IPaymentService _paymentService;

        public CheckoutController(
            DataContext dataContext,
            UserManager<User> userManager,
            IPaymentService paymentService)
        {
            _dataContext = dataContext;
            _userManager = userManager;
            _paymentService = paymentService;
        }

        public class CombinedCheckoutRequest
        {
            public required CreateReservationRequest ReservationRequest { get; set; }
            public List<FoodOrderDto> FoodOrders { get; set; } = new List<FoodOrderDto>();
            public required PaymentRequest PaymentInfo { get; set; }
        }

        public class CombinedCheckoutResult
        {
            public required ReservationDto Reservation { get; set; }
            public List<FoodOrderDto> FoodOrders { get; set; } = new List<FoodOrderDto>();
            public required PaymentResult PaymentResult { get; set; }
            public decimal TotalAmount { get; set; }
        }

        [HttpPost]
        public async Task<ActionResult<CombinedCheckoutResult>> CombinedCheckout(CombinedCheckoutRequest request)
        {
            var user = await _userManager.GetUserAsync(User);
            if (user == null)
            {
                return Unauthorized();
            }

            // Create the reservation
            var reservationController = new ReservationsController(_dataContext, _userManager);
            reservationController.ControllerContext = ControllerContext;
            
            var reservationResult = await reservationController.CreateReservation(request.ReservationRequest);
            if (!(reservationResult.Result is CreatedAtActionResult createdResult) || createdResult.Value == null)
            {
                if (reservationResult.Result == null)
                {
                    return BadRequest("Reservation creation failed.");
                }
                return reservationResult.Result;
            }
            
            var reservationDto = (ReservationDto)createdResult.Value;
            var reservationId = reservationDto.Id;

            // Create food orders and link them to the reservation
            var foodOrders = new List<FoodOrderDto>();
            foreach (var orderDto in request.FoodOrders)
            {
                var foodOrdersController = new FoodOrdersController(_dataContext, _userManager);
                foodOrdersController.ControllerContext = ControllerContext;
                
                // Set the reservation ID for each order
                orderDto.ReservationId = reservationId;
                
                var orderResult = await foodOrdersController.CreateOrder(orderDto);
                if (orderResult.Result is CreatedAtActionResult createdOrderResult && createdOrderResult.Value != null)
                {
                    foodOrders.Add((FoodOrderDto)createdOrderResult.Value);
                }
                // If food order creation fails, still continue with the checkout
            }

            // Calculate the total amount
            decimal totalAmount = reservationDto.TotalAmount + foodOrders.Sum(o => o.TotalAmount);


            // Process payment
request.PaymentInfo.Amount = totalAmount;
request.PaymentInfo.ReservationId = reservationId;

var paymentsController = new PaymentsController(_paymentService, _dataContext);
paymentsController.ControllerContext = ControllerContext;

var paymentResult = await paymentsController.ProcessPayment(request.PaymentInfo);

if (paymentResult.Result is ObjectResult objectResult && 
    objectResult.Value is PaymentResult paymentValue &&
    paymentValue.Success)
{
    // Payment succeeded
    return new CombinedCheckoutResult
    {
        Reservation = reservationDto,
        FoodOrders = foodOrders,
        PaymentResult = paymentValue,
        TotalAmount = totalAmount
    };
}
else
{
    // Payment failed
    return paymentResult.Result ?? BadRequest("Payment processing failed");
}
    }
}
}