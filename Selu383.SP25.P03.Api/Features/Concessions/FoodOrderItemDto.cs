namespace Selu383.SP25.P03.Api.Features.Concessions
{
    public class FoodOrderItemDto
    {
        public int Id { get; set; }
        public int FoodItemId { get; set; }
        public required string FoodItemName { get; set; }
        public int Quantity { get; set; }
        public decimal Price { get; set; }
        public string? SpecialInstructions { get; set; }
        public string? FoodItemImageUrl { get; set; }
    }
}