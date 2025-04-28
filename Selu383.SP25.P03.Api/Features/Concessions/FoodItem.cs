using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Selu383.SP25.P03.Api.Features.Concessions
{
    public class FoodItem
    {
        public int Id { get; set; }
        
        [Required]
        [MaxLength(100)]
        public required string Name { get; set; }
        
        public string? Description { get; set; }
        
        [Required]
        public decimal Price { get; set; }
        
        public string? ImageUrl { get; set; }
        
        public bool IsAvailable { get; set; } = true;
        
        
        public int CategoryId { get; set; }
        
        
        public virtual FoodCategory? Category { get; set; }
        
        
        public virtual ICollection<FoodOrderItem> OrderItems { get; set; } = new List<FoodOrderItem>();
    }
}