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
    // Remove the [Authorize] attribute from the class level
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
        // Remove the authorization requirement for this endpoint to allow guest checkout
        public async Task<ActionResult<CombinedCheckoutResult>> CombinedCheckout(CombinedCheckoutRequest request)
        {
            Console.WriteLine($"Checkout request received at {DateTime.Now}");
            
            // Try to get the current user
            var user = await _userManager.GetUserAsync(User);
            
            // Log whether this is a logged-in user or guest checkout
            bool isGuestCheckout = user == null;
            Console.WriteLine($"Is Guest Checkout: {isGuestCheckout}");
            
            try
            {
                Console.WriteLine($"Processing checkout for showtime ID: {request.ReservationRequest.ShowtimeId}");
                Console.WriteLine($"Ticket count: {request.ReservationRequest.Tickets?.Count ?? 0}");
                
                // Create the reservation
                var reservation = await CreateReservationInternal(request.ReservationRequest, user);
                Console.WriteLine($"Reservation created successfully. ID: {reservation.Id}");
                
                // Create food orders and link them to the reservation
                var foodOrders = new List<FoodOrderDto>();
                if (request.FoodOrders != null && request.FoodOrders.Any())
                {
                    Console.WriteLine($"Processing {request.FoodOrders.Count} food orders");
                    foreach (var orderDto in request.FoodOrders)
                    {
                        var foodOrder = await CreateFoodOrderInternal(orderDto, user, reservation.Id);
                        foodOrders.Add(foodOrder);
                        Console.WriteLine($"Food order created. ID: {foodOrder.Id}");
                    }
                }

                // Calculate the total amount
                decimal totalAmount = reservation.TotalAmount + foodOrders.Sum(o => o.TotalAmount);
                Console.WriteLine($"Total amount: {totalAmount}");

                // Process payment
                request.PaymentInfo.Amount = totalAmount;
                request.PaymentInfo.ReservationId = reservation.Id;
                Console.WriteLine($"Processing payment for ${totalAmount}");
                
                var paymentResult = await _paymentService.ProcessPayment(request.PaymentInfo);
                Console.WriteLine($"Payment result: {paymentResult.Success}, Message: {paymentResult.Message}");

                if (paymentResult.Success)
                {
                    // Mark reservation as paid
                    reservation.IsPaid = true;
                    await _dataContext.SaveChangesAsync();
                    Console.WriteLine($"Reservation {reservation.Id} marked as paid");

                    return new CombinedCheckoutResult
                    {
                        Reservation = reservation,
                        FoodOrders = foodOrders,
                        PaymentResult = paymentResult,
                        TotalAmount = totalAmount
                    };
                }
                else
                {
                    // Payment failed - clean up
                    Console.WriteLine($"Payment failed, cleaning up reservation {reservation.Id}");
                    _dataContext.Reservations.Remove(await _dataContext.Reservations.FindAsync(reservation.Id));
                    await _dataContext.SaveChangesAsync();
                    return BadRequest(paymentResult.Message);
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error during checkout: {ex.Message}");
                Console.WriteLine($"Stack trace: {ex.StackTrace}");
                return BadRequest(ex.Message);
            }
        }

        private async Task<ReservationDto> CreateReservationInternal(CreateReservationRequest request, User? user)
        {
            // Verify showtime exists
            var showtime = await _dataContext.Showtimes
                .Include(s => s.Movie)
                .Include("Screen.Theater")
                .FirstOrDefaultAsync(s => s.Id == request.ShowtimeId);

            if (showtime == null)
            {
                throw new Exception("Showtime not found");
            }

            // Create reservation
            var reservation = new Reservation
            {
                ShowtimeId = request.ShowtimeId,
                UserId = user?.Id,  // Null for guest users
                ReservationTime = DateTime.UtcNow,
                TotalAmount = 0,  // Will be calculated
                IsPaid = false
            };

            _dataContext.Reservations.Add(reservation);
            await _dataContext.SaveChangesAsync();

            // Add seats and calculate total
            decimal totalAmount = 0;
            foreach (var ticket in request.Tickets)
            {
                var seat = await _dataContext.Seats.FindAsync(ticket.SeatId);
                if (seat == null)
                {
                    throw new Exception($"Seat {ticket.SeatId} not found");
                }

                // Calculate ticket price based on type
                decimal ticketPrice = showtime.TicketPrice;
                switch (ticket.TicketType.ToLower())
                {
                    case "child":
                        ticketPrice *= 0.75m;
                        break;
                    case "senior":
                        ticketPrice *= 0.8m;
                        break;
                }

                _dataContext.ReservationSeats.Add(new ReservationSeat
                {
                    ReservationId = reservation.Id,
                    SeatId = ticket.SeatId,
                    TicketType = ticket.TicketType,
                    Price = ticketPrice
                });

                totalAmount += ticketPrice;
            }

            reservation.TotalAmount = totalAmount;
            await _dataContext.SaveChangesAsync();

            // Map to DTO
            var ticketDtos = await _dataContext.ReservationSeats
                .Where(rs => rs.ReservationId == reservation.Id)
                .Include(rs => rs.Seat)
                .Select(rs => new TicketDto
                {
                    Id = rs.Id,
                    SeatId = rs.SeatId,
                    Row = rs.Seat.Row,
                    Number = rs.Seat.Number,
                    TicketType = rs.TicketType,
                    Price = rs.Price
                })
                .ToListAsync();

            return new ReservationDto
            {
                Id = reservation.Id,
                ReservationTime = reservation.ReservationTime,
                IsPaid = reservation.IsPaid,
                TotalAmount = reservation.TotalAmount,
                UserId = reservation.UserId,
                ShowtimeId = reservation.ShowtimeId,
                ShowtimeStartTime = showtime.StartTime,
                MovieTitle = showtime.Movie?.Title ?? string.Empty,
                TheaterName = showtime.Screen?.Theater?.Name ?? string.Empty,
                ScreenName = showtime.Screen?.Name ?? string.Empty,
                Tickets = ticketDtos
            };
        }

        private async Task<FoodOrderDto> CreateFoodOrderInternal(FoodOrderDto dto, User? user, int reservationId)
        {
            var order = new FoodOrder
            {
                OrderTime = DateTime.UtcNow,
                Status = "Pending",
                DeliveryType = dto.DeliveryType,
                UserId = user?.Id,
                ReservationId = reservationId,
                OrderItems = new List<FoodOrderItem>()
            };

            decimal totalAmount = 0;
            foreach (var itemDto in dto.OrderItems)
            {
                var foodItem = await _dataContext.FoodItems.FindAsync(itemDto.FoodItemId);
                if (foodItem == null || !foodItem.IsAvailable)
                {
                    throw new Exception($"Food item {itemDto.FoodItemId} is not available");
                }

                var orderItem = new FoodOrderItem
                {
                    FoodItemId = itemDto.FoodItemId,
                    Quantity = itemDto.Quantity,
                    Price = foodItem.Price,
                    SpecialInstructions = itemDto.SpecialInstructions
                };

                order.OrderItems.Add(orderItem);
                totalAmount += orderItem.Price * orderItem.Quantity;
            }

            order.TotalAmount = totalAmount;

            _dataContext.FoodOrders.Add(order);
            await _dataContext.SaveChangesAsync();

            // Map to DTO
            return new FoodOrderDto
            {
                Id = order.Id,
                OrderTime = order.OrderTime,
                Status = order.Status,
                DeliveryType = order.DeliveryType,
                TotalAmount = order.TotalAmount,
                UserId = order.UserId,
                ReservationId = order.ReservationId,
                OrderItems = order.OrderItems.Select(oi => new FoodOrderItemDto
                {
                    Id = oi.Id,
                    FoodItemId = oi.FoodItemId,
                    FoodItemName = oi.FoodItem?.Name ?? string.Empty,
                    Quantity = oi.Quantity,
                    Price = oi.Price,
                    SpecialInstructions = oi.SpecialInstructions,
                    FoodItemImageUrl = oi.FoodItem?.ImageUrl
                }).ToList()
            };
        }
    }
}