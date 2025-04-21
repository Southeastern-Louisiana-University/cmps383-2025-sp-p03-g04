using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Selu383.SP25.P03.Api.Data;
using Selu383.SP25.P03.Api.Features.Users;

namespace Selu383.SP25.P03.Api.Controllers
{
    [Route("api/authentication")]
    public class AuthenticationController : ControllerBase
    {
        private readonly SignInManager<User> signInManager;
        private readonly UserManager<User> userManager;
        private readonly DataContext dataContext;
        private DbSet<User> users;

        public AuthenticationController(SignInManager<User> signInManager, UserManager<User> userManager, DataContext dataContext)
        {
            this.signInManager = signInManager;
            this.userManager = userManager;
            this.dataContext = dataContext;
            users = dataContext.Set<User>();
        }

[HttpPost]
[Route("register")]
[Authorize]
public async Task<ActionResult<UserDto>> Register([FromBody] CreateUserDto dto)
{
    if (dto.Roles == null || !dto.Roles.Any())
    {
        return BadRequest("User roles cannot be empty");
    }

    var roles = await dataContext.Roles.ToListAsync();
    if (!dto.Roles.All(roleName => roles.Any(dbRole => roleName == dbRole.Name)))
    {
        return BadRequest("One or more roles are invalid");
    }

    var result = await userManager.CreateAsync(new User { UserName = dto.Username }, dto.Password);
    
    if (result.Succeeded)
    {
        var user = await userManager.FindByNameAsync(dto.Username);
        if (user == null)
        {
            return BadRequest("User could not be created");
        }
        
        await userManager.AddToRolesAsync(user, dto.Roles);

        return new UserDto
        {
            Id = user.Id,
            UserName = dto.Username,
            Roles = dto.Roles
        };
    }
    
    return BadRequest(result.Errors);
}
        
        [HttpPost]
        [Route("login")]
        public async Task<ActionResult<UserDto>> Login([FromBody] LoginDto dto)
        {
            var result = await signInManager.PasswordSignInAsync(dto.UserName, dto.Password, false, false);
            if (result.Succeeded)
            {
                var user = await userManager.FindByNameAsync(dto.UserName);
                if (user == null)
                {
                    return BadRequest();
                }
                return new UserDto
                {
                    Id = user.Id,
                    UserName = user.UserName,
                    Roles = (await userManager.GetRolesAsync(user)).ToArray()
                };
            }
            return BadRequest();
        }

        [HttpGet]
        [Route("me")]
        [Authorize]
        public async Task<ActionResult<UserDto>> Me()
        {
            var user = await userManager.GetUserAsync(User);
            if (user == null)
            {
                return BadRequest();
            }
            return new UserDto
            {
                Id = user.Id,
                UserName = user.UserName,
                Roles = (await userManager.GetRolesAsync(user)).ToArray()
            };
        }

        [HttpPost]
        [Route("logout")]
        [Authorize]
        public async Task<ActionResult> Logout()
        {
            await signInManager.SignOutAsync();
            return Ok();
        }
    }
}
