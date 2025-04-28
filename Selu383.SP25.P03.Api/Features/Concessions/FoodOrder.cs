using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using Selu383.SP25.P03.Api.Features.Users;
using Selu383.SP25.P03.Api.Features.Reservations;

namespace Selu383.SP25.P03.Api.Features.Concessions
{
    public class FoodOrder
    {
        public int Id { get; set; }
        
        public DateTime OrderTime { get; set; }
        
        [Required]
        [MaxLength(20)]
        public required string Status { get; set; }
        
        [Required]
        [MaxLength(20)]
        public required string DeliveryType { get; set; }
        
        public decimal TotalAmount { get; set; }
        
        
        public int? UserId { get; set; }
        
        public int? ReservationId { get; set; }
        
        
        public virtual User? User { get; set; }
        
        public virtual Reservation? Reservation { get; set; }
        
        public virtual ICollection<FoodOrderItem> OrderItems { get; set; } = new List<FoodOrderItem>();
    }
}