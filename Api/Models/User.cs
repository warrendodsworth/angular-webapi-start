using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.EntityFramework;
using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;

namespace Api.Models
{
  // You can add profile data for the user by adding more properties to your ApplicationUser class, please visit http://go.microsoft.com/fwlink/?LinkID=317594 to learn more.
  public class User : IdentityUser
  {
    public string Name { get; set; }

    public UserStatus Status { get; set; }

    public virtual IList<Post> Posts { get; set; }

    public async Task<ClaimsIdentity> GenerateUserIdentityAsync(UserManager<User> manager, string authenticationType)
    {
      // Note the authenticationType must match the one defined in CookieAuthenticationOptions.AuthenticationType
      var userIdentity = await manager.CreateIdentityAsync(this, authenticationType);

      // Add custom user claims here
      userIdentity.AddClaim(new Claim("Username", UserName));
      userIdentity.AddClaim(new Claim("Name", Name));

      return userIdentity;
    }
  }

  public enum UserStatus
  {
    Active,
    Deactivated
  }
}