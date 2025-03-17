using Microsoft.AspNetCore.Identity;

namespace Selu383.SP25.P03.Api.Features.Users
{
    public class UserRole : IdentityUserRole<int>
    {
        required public virtual User User { get; set; }
        required public virtual Role Role { get; set; }
    }
}
