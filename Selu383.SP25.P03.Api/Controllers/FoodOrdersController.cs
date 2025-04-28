using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Selu383.SP25.P03.Api.Data;
using Selu383.SP25.P03.Api.Features.Concessions;
using Selu383.SP25.P03.Api.Features.Users;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Selu383.SP25.P03.Api.Controllers
{
    [Route("api/food-orders")]
    [ApiController]
    [Authorize]
    public class FoodOrdersController : ControllerBase
    {
        private readonly DataContext dataContext;
        private readonly DbSet<FoodOrder> foodOrders;
        private readonly UserManager<User> userManager;

        public FoodOrdersController(DataContext dataContext, UserManager<User> userManager)
        {
            this.dataContext = dataContext;
            this.foodOrders = dataContext.Set<FoodOrder>();
            this.userManager = userManager;
        }

[HttpGet]
[Authorize(Roles = UserRoleNames.Admin)]
public async Task<ActionResult<IEnumerable<FoodOrderDto>>> GetAllOrders()
{
    var orders = await foodOrders
        .Include(o => o.OrderItems)
        .ThenInclude(oi => oi.FoodItem)
        .OrderByDescending(o => o.OrderTime)
        .ToListAsync();

    var result = new List<FoodOrderDto>();
    foreach (var order in orders)
    {
        var dto = MapOrderToDto(order);
        if (dto != null)
        {
            result.Add(dto);
        }
    }
    return result;
}

[HttpGet("reservation/{reservationId}")]
[Authorize]
public async Task<ActionResult<IEnumerable<FoodOrderDto>>> GetOrdersByReservation(int reservationId)
{
    var user = await userManager.GetUserAsync(User);
    if (user == null)
    {
        return Unauthorized();
    }

    
    var reservation = await dataContext.Reservations.FindAsync(reservationId);
    if (reservation == null)
    {
        return NotFound("Reservation not found");
    }

    
    if (reservation.UserId != user.Id && !User.IsInRole(UserRoleNames.Admin))
    {
        return Forbid();
    }

    var orders = await foodOrders
        .Include(o => o.OrderItems)
        .ThenInclude(oi => oi.FoodItem)
        .Where(o => o.ReservationId == reservationId)
        .ToListAsync();

    return orders.Select(o => MapOrderToDto(o)).ToList();
}

[HttpGet("my-orders")]
public async Task<ActionResult<IEnumerable<FoodOrderDto>>> GetMyOrders()
{
    var user = await userManager.GetUserAsync(User);
    if (user == null)
    {
        return Unauthorized();
    }

    var orders = await foodOrders
        .Include(o => o.OrderItems)
        .ThenInclude(oi => oi.FoodItem)
        .Where(o => o.UserId == user.Id)
        .OrderByDescending(o => o.OrderTime)
        .ToListAsync();

    var result = new List<FoodOrderDto>();
    foreach (var order in orders)
    {
        var dto = MapOrderToDto(order);
        if (dto != null)
        {
            result.Add(dto);
        }
    }
    return result;
}

[HttpGet("pending")]
[Authorize(Roles = UserRoleNames.Admin)]
public async Task<ActionResult<IEnumerable<FoodOrderDto>>> GetPendingOrders()
{
    var orders = await foodOrders
        .Include(o => o.OrderItems)
        .ThenInclude(oi => oi.FoodItem)
        .Where(o => o.Status == "Pending" || o.Status == "Preparing")
        .OrderByDescending(o => o.OrderTime)
        .ToListAsync();

    var result = new List<FoodOrderDto>();
    foreach (var order in orders)
    {
        var dto = MapOrderToDto(order);
        if (dto != null)
        {
            result.Add(dto);
        }
    }
    return result;
}

        [HttpGet("{id}")]
        public async Task<ActionResult<FoodOrderDto>> GetOrder(int id)
        {
            var order = await foodOrders
                .Include(o => o.OrderItems)
                .ThenInclude(oi => oi.FoodItem)
                .FirstOrDefaultAsync(o => o.Id == id);

            if (order == null)
            {
                return NotFound();
            }

            var user = await userManager.GetUserAsync(User);
            if (user == null)
            {
                return Unauthorized();
            }

            
            if (order.UserId != user.Id && !User.IsInRole(UserRoleNames.Admin))
            {
                return Forbid();
            }

            var orderDto = MapOrderToDto(order);
            if (orderDto == null)
            {
                return NotFound();
            }
            
            return orderDto;
        }

        [HttpPost]
        public async Task<ActionResult<FoodOrderDto>> CreateOrder(FoodOrderDto dto)
        {
            if (dto == null || dto.OrderItems == null || dto.OrderItems.Count == 0)
            {
                return BadRequest("Order must contain at least one item");
            }

            var user = await userManager.GetUserAsync(User);
            if (user == null)
            {
                return Unauthorized();
            }

            
            var foodItemIds = dto.OrderItems.Select(oi => oi.FoodItemId).ToList();
            var foodItems = await dataContext.FoodItems
                .Where(fi => foodItemIds.Contains(fi.Id) && fi.IsAvailable)
                .ToDictionaryAsync(fi => fi.Id, fi => fi);

            if (foodItems.Count != dto.OrderItems.Count(oi => oi.Quantity > 0))
            {
                return BadRequest("One or more food items are unavailable or invalid");
            }

            
            var order = new FoodOrder
            {
                OrderTime = DateTime.UtcNow,
                Status = "Pending",
                DeliveryType = dto.DeliveryType,
                UserId = user.Id,
                ReservationId = dto.ReservationId,
                OrderItems = new List<FoodOrderItem>()
            };

            
            decimal totalAmount = 0;
            foreach (var itemDto in dto.OrderItems)
            {
                if (itemDto.Quantity <= 0 || !foodItems.TryGetValue(itemDto.FoodItemId, out var foodItem))
                {
                    continue; 
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

            
            foodOrders.Add(order);
            await dataContext.SaveChangesAsync();

            
            order = await foodOrders
                .Include(o => o.OrderItems)
                .ThenInclude(oi => oi.FoodItem)
                .FirstOrDefaultAsync(o => o.Id == order.Id);

            if (order == null)
            {
                return BadRequest("Failed to create order");
            }

            var orderDto = MapOrderToDto(order);
            if (orderDto == null)
            {
                return BadRequest("Failed to map order data");
            }

            return CreatedAtAction(nameof(GetOrder), new { id = order.Id }, orderDto);
        }

        [HttpPut("{id}/status")]
        [Authorize(Roles = UserRoleNames.Admin)]
        public async Task<ActionResult<FoodOrderDto>> UpdateOrderStatus(int id, [FromBody] string status)
        {
            var order = await foodOrders.FindAsync(id);
            if (order == null)
            {
                return NotFound();
            }

            
            string[] validStatuses = { "Pending", "Preparing", "Ready", "Delivered", "Cancelled" };
            if (!validStatuses.Contains(status))
            {
                return BadRequest($"Invalid status. Valid values are: {string.Join(", ", validStatuses)}");
            }

            order.Status = status;
            await dataContext.SaveChangesAsync();

            
            order = await foodOrders
                .Include(o => o.OrderItems)
                .ThenInclude(oi => oi.FoodItem)
                .FirstOrDefaultAsync(o => o.Id == order.Id);

            if (order == null)
            {
                return NotFound();
            }

            var orderDto = MapOrderToDto(order);
            if (orderDto == null)
            {
                return BadRequest("Failed to map order data");
            }

            return orderDto;
        }

        [HttpPut("{orderId}/link-reservation/{reservationId}")]
[Authorize]
public async Task<ActionResult<FoodOrderDto>> LinkOrderToReservation(int orderId, int reservationId)
{
    var user = await userManager.GetUserAsync(User);
    if (user == null)
    {
        return Unauthorized();
    }

    var order = await foodOrders
        .Include(o => o.OrderItems)
        .ThenInclude(oi => oi.FoodItem)
        .FirstOrDefaultAsync(o => o.Id == orderId);

    if (order == null)
    {
        return NotFound("Order not found");
    }

    
    if (order.UserId != user.Id && !User.IsInRole(UserRoleNames.Admin))
    {
        return Forbid();
    }

    
    var reservation = await dataContext.Reservations.FindAsync(reservationId);
    if (reservation == null)
    {
        return NotFound("Reservation not found");
    }

    
    if (reservation.UserId != user.Id && !User.IsInRole(UserRoleNames.Admin))
    {
        return Forbid();
    }

    
    order.ReservationId = reservationId;
    await dataContext.SaveChangesAsync();

    return MapOrderToDto(order);
}

        [HttpDelete("{id}")]
        public async Task<ActionResult> CancelOrder(int id)
        {
            var order = await foodOrders.FindAsync(id);
            if (order == null)
            {
                return NotFound();
            }

            var user = await userManager.GetUserAsync(User);
            if (user == null)
            {
                return Unauthorized();
            }

            
            if (order.UserId != user.Id && !User.IsInRole(UserRoleNames.Admin))
            {
                return Forbid();
            }

            
            if (order.Status != "Pending")
            {
                return BadRequest("Only pending orders can be cancelled");
            }

            order.Status = "Cancelled";
            await dataContext.SaveChangesAsync();

            return NoContent();
        }

        
        private FoodOrderDto? MapOrderToDto(FoodOrder? order)
{
    if (order == null)
    {
        return null;  
    }

    return new FoodOrderDto
    {
        Id = order.Id,
        OrderTime = order.OrderTime,
        Status = order.Status,
        DeliveryType = order.DeliveryType,
        TotalAmount = order.TotalAmount,
        UserId = order.UserId,
        ReservationId = order.ReservationId,
        OrderItems = order.OrderItems?.Select(oi => new FoodOrderItemDto
        {
            Id = oi.Id,
            FoodItemId = oi.FoodItemId,
            FoodItemName = oi.FoodItem?.Name ?? "Unknown Item",
            Quantity = oi.Quantity,
            Price = oi.Price,
            SpecialInstructions = oi.SpecialInstructions,
            FoodItemImageUrl = oi.FoodItem?.ImageUrl
        })?.ToList() ?? new List<FoodOrderItemDto>()
    };
}
    }
}