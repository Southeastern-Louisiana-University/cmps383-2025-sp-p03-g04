using System.ComponentModel.DataAnnotations;

namespace Selu383.SP25.P03.Api.Features.Concessions
{
    public class FoodOrderItem
    {
        public int Id { get; set; }
        
        public int Quantity { get; set; }
        
        public decimal Price { get; set; }
        
        public string? SpecialInstructions { get; set; }
        
        // Foreign keys
        public int OrderId { get; set; }
        
        public int FoodItemId { get; set; }
        
        // Navigation properties
        public virtual FoodOrder? Order { get; set; }
        
        public virtual FoodItem? FoodItem { get; set; }
    }
}