using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Selu383.SP25.P03.Api.Data;
using Selu383.SP25.P03.Api.Features.Users;

namespace Selu383.SP25.P03.Api.Controllers
{
    [Route("api/users")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly UserManager<User> userManager;
        private readonly RoleManager<Role> roleManager;
        private readonly DataContext dataContext;
        private DbSet<Role> roles;

        public UsersController(
            RoleManager<Role> roleManager,
            UserManager<User> userManager,
            DataContext dataContext)
        {
            this.roleManager = roleManager;
            this.userManager = userManager;
            this.dataContext = dataContext;
            roles = dataContext.Set<Role>();
        }

        [HttpPost]
        [Authorize]
        public async Task<ActionResult<UserDto>> CreateUser([FromBody] CreateUserDto dto)
        {
    if (dto.Roles == null || !dto.Roles.Any())
    {
        return BadRequest("User roles cannot be empty");
    }

        if (!dto.Roles.All(roleName => roles.Any(dbRole => roleName == dbRole.Name)))
    {
        return BadRequest("One or more roles are invalid");
    }

    var result = await userManager.CreateAsync(new User { UserName = dto.Username }, dto.Password);
    
    if (result.Succeeded)
    {
        // Find the user by username
        var user = await userManager.FindByNameAsync(dto.Username);
        
        // Additional null check to ensure user was created
        if (user == null)
        {
            return BadRequest("User could not be created");
        }
        
        // Add roles to the user
        await userManager.AddToRolesAsync(user, dto.Roles);

        // Return the user DTO
        return new UserDto
        {
            Id = user.Id,
            UserName = dto.Username,
            Roles = dto.Roles
        };
    }
    
    return BadRequest(result.Errors);
}
    }
}
