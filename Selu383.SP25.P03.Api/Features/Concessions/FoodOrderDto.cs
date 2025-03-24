using System;
using System.Collections.Generic;

namespace Selu383.SP25.P03.Api.Features.Concessions
{
    public class FoodOrderDto
    {
        public int Id { get; set; }
        public DateTime OrderTime { get; set; }
        public required string Status { get; set; }
        public required string DeliveryType { get; set; }
        public decimal TotalAmount { get; set; }
        public int? UserId { get; set; }
        public int? ReservationId { get; set; }
        public List<FoodOrderItemDto> OrderItems { get; set; } = new List<FoodOrderItemDto>();
    }
}