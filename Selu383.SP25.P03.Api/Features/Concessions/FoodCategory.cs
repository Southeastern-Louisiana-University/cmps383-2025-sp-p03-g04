using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Selu383.SP25.P03.Api.Features.Concessions
{
    public class FoodCategory
    {
        public int Id { get; set; }
        
        [Required]
        [MaxLength(50)]
        public required string Name { get; set; }
        
        
        public virtual ICollection<FoodItem> Items { get; set; } = new List<FoodItem>();
    }
}