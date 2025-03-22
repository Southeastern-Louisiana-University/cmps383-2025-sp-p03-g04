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
    [Route("api/food-categories")]
    [ApiController]
    public class FoodCategoriesController : ControllerBase
    {
        private readonly DataContext dataContext;
        private readonly DbSet<FoodCategory> foodCategories;

        public FoodCategoriesController(DataContext dataContext)
        {
            this.dataContext = dataContext;
            foodCategories = dataContext.Set<FoodCategory>();
        }

        [HttpGet]
        public IQueryable<FoodCategoryDto> GetAllCategories()
        {
            return foodCategories
                .Select(c => new FoodCategoryDto
                {
                    Id = c.Id,
                    Name = c.Name
                });
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<FoodCategoryDto>> GetCategoryById(int id)
        {
            var category = await foodCategories.FindAsync(id);

            if (category == null)
            {
                return NotFound();
            }

            return new FoodCategoryDto
            {
                Id = category.Id,
                Name = category.Name
            };
        }

        [HttpPost]
        [Authorize(Roles = UserRoleNames.Admin)]
        public async Task<ActionResult<FoodCategoryDto>> CreateCategory(FoodCategoryDto dto)
        {
            if (string.IsNullOrWhiteSpace(dto.Name))
            {
                return BadRequest("Category name is required");
            }

            var category = new FoodCategory
            {
                Name = dto.Name
            };

            foodCategories.Add(category);
            await dataContext.SaveChangesAsync();

            dto.Id = category.Id;

            return CreatedAtAction(nameof(GetCategoryById), new { id = category.Id }, dto);
        }

        [HttpPut("{id}")]
        [Authorize(Roles = UserRoleNames.Admin)]
        public async Task<ActionResult<FoodCategoryDto>> UpdateCategory(int id, FoodCategoryDto dto)
        {
            if (string.IsNullOrWhiteSpace(dto.Name))
            {
                return BadRequest("Category name is required");
            }

            var category = await foodCategories.FindAsync(id);

            if (category == null)
            {
                return NotFound();
            }

            category.Name = dto.Name;

            await dataContext.SaveChangesAsync();

            return new FoodCategoryDto
            {
                Id = category.Id,
                Name = category.Name
            };
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = UserRoleNames.Admin)]
        public async Task<ActionResult> DeleteCategory(int id)
        {
            var category = await foodCategories.FindAsync(id);

            if (category == null)
            {
                return NotFound();
            }

            // Check if the category has any food items
            var hasItems = await dataContext.FoodItems.AnyAsync(i => i.CategoryId == id);
            if (hasItems)
            {
                return BadRequest("Cannot delete category that contains food items");
            }

            foodCategories.Remove(category);
            await dataContext.SaveChangesAsync();

            return NoContent();
        }
    }
}