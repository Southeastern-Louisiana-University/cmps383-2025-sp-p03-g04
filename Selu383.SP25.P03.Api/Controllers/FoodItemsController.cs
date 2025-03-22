using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Selu383.SP25.P03.Api.Data;
using Selu383.SP25.P03.Api.Features.Concessions;
using Selu383.SP25.P03.Api.Features.Users;
using System.Linq;
using System.Threading.Tasks;

namespace Selu383.SP25.P03.Api.Controllers
{
    [Route("api/food-items")]
    [ApiController]
    public class FoodItemsController : ControllerBase
    {
        private readonly DataContext dataContext;
        private readonly DbSet<FoodItem> foodItems;

        public FoodItemsController(DataContext dataContext)
        {
            this.dataContext = dataContext;
            foodItems = dataContext.Set<FoodItem>();
        }

        [HttpGet]
        public IQueryable<FoodItemDto> GetAllFoodItems()
        {
            return foodItems
                .Include(f => f.Category)
                .Select(f => new FoodItemDto
                {
                    Id = f.Id,
                    Name = f.Name,
                    Description = f.Description,
                    Price = f.Price,
                    ImageUrl = f.ImageUrl,
                    IsAvailable = f.IsAvailable,
                    CategoryId = f.CategoryId,
                    CategoryName = f.Category != null ? f.Category.Name : null
                });
        }

        [HttpGet("category/{categoryId}")]
        public IQueryable<FoodItemDto> GetFoodItemsByCategory(int categoryId)
        {
            return foodItems
                .Include(f => f.Category)
                .Where(f => f.CategoryId == categoryId)
                .Select(f => new FoodItemDto
                {
                    Id = f.Id,
                    Name = f.Name,
                    Description = f.Description,
                    Price = f.Price,
                    ImageUrl = f.ImageUrl,
                    IsAvailable = f.IsAvailable,
                    CategoryId = f.CategoryId,
                    CategoryName = f.Category != null ? f.Category.Name : null
                });
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<FoodItemDto>> GetFoodItemById(int id)
        {
            var foodItem = await foodItems
                .Include(f => f.Category)
                .FirstOrDefaultAsync(f => f.Id == id);

            if (foodItem == null)
            {
                return NotFound();
            }

            return new FoodItemDto
            {
                Id = foodItem.Id,
                Name = foodItem.Name,
                Description = foodItem.Description,
                Price = foodItem.Price,
                ImageUrl = foodItem.ImageUrl,
                IsAvailable = foodItem.IsAvailable,
                CategoryId = foodItem.CategoryId,
                CategoryName = foodItem.Category?.Name
            };
        }

        [HttpPost]
        [Authorize(Roles = UserRoleNames.Admin)]
        public async Task<ActionResult<FoodItemDto>> CreateFoodItem(FoodItemDto dto)
        {
            if (string.IsNullOrWhiteSpace(dto.Name))
            {
                return BadRequest("Food item name is required");
            }

            // Check if category exists
            var categoryExists = await dataContext.FoodCategories.AnyAsync(c => c.Id == dto.CategoryId);
            if (!categoryExists)
            {
                return BadRequest("Invalid category ID");
            }

            var foodItem = new FoodItem
            {
                Name = dto.Name,
                Description = dto.Description,
                Price = dto.Price,
                ImageUrl = dto.ImageUrl,
                IsAvailable = dto.IsAvailable,
                CategoryId = dto.CategoryId
            };

            foodItems.Add(foodItem);
            await dataContext.SaveChangesAsync();

            // Reload the food item with its category
            foodItem = await foodItems
                .Include(f => f.Category)
                .FirstOrDefaultAsync(f => f.Id == foodItem.Id);

            if (foodItem == null)
            {
                return BadRequest("Failed to create food item");
            }

            return CreatedAtAction(nameof(GetFoodItemById), new { id = foodItem.Id }, new FoodItemDto
            {
                Id = foodItem.Id,
                Name = foodItem.Name,
                Description = foodItem.Description,
                Price = foodItem.Price,
                ImageUrl = foodItem.ImageUrl,
                IsAvailable = foodItem.IsAvailable,
                CategoryId = foodItem.CategoryId,
                CategoryName = foodItem.Category?.Name
            });
        }

        [HttpPut("{id}")]
        [Authorize(Roles = UserRoleNames.Admin)]
        public async Task<ActionResult<FoodItemDto>> UpdateFoodItem(int id, FoodItemDto dto)
        {
            if (string.IsNullOrWhiteSpace(dto.Name))
            {
                return BadRequest("Food item name is required");
            }

            var foodItem = await foodItems.FindAsync(id);

            if (foodItem == null)
            {
                return NotFound();
            }

            // Check if category exists
            var categoryExists = await dataContext.FoodCategories.AnyAsync(c => c.Id == dto.CategoryId);
            if (!categoryExists)
            {
                return BadRequest("Invalid category ID");
            }

            foodItem.Name = dto.Name;
            foodItem.Description = dto.Description;
            foodItem.Price = dto.Price;
            foodItem.ImageUrl = dto.ImageUrl;
            foodItem.IsAvailable = dto.IsAvailable;
            foodItem.CategoryId = dto.CategoryId;

            await dataContext.SaveChangesAsync();

            // Reload the food item with its category
            foodItem = await foodItems
                .Include(f => f.Category)
                .FirstOrDefaultAsync(f => f.Id == foodItem.Id);

            if (foodItem == null)
            {
                return BadRequest("Failed to create food item");
            }
            
            return new FoodItemDto
            {
                Id = foodItem.Id,
                Name = foodItem.Name,
                Description = foodItem.Description,
                Price = foodItem.Price,
                ImageUrl = foodItem.ImageUrl,
                IsAvailable = foodItem.IsAvailable,
                CategoryId = foodItem.CategoryId,
                CategoryName = foodItem.Category?.Name
            };
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = UserRoleNames.Admin)]
        public async Task<ActionResult> DeleteFoodItem(int id)
        {
            var foodItem = await foodItems.FindAsync(id);

            if (foodItem == null)
            {
                return NotFound();
            }

            // Check if the food item is part of any orders
            var isInOrders = await dataContext.FoodOrderItems.AnyAsync(oi => oi.FoodItemId == id);
            if (isInOrders)
            {
                // Instead of deleting, just mark it as unavailable
                foodItem.IsAvailable = false;
                await dataContext.SaveChangesAsync();
                return Ok();
            }

            foodItems.Remove(foodItem);
            await dataContext.SaveChangesAsync();

            return NoContent();
        }
    }
}