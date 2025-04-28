using Microsoft.AspNetCore.Identity;

namespace Selu383.SP25.P03.Api.Features.Users
{
    public class User : IdentityUser<int>
    {
        
        public virtual ICollection<UserRole> UserRoles { get; } = new List<UserRole>();
    }
}
