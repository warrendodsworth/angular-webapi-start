using Microsoft.AspNet.Identity.EntityFramework;
using System.Data.Entity;

namespace Api.Models
{
  public class AppContext : IdentityDbContext<User>
  {
    public AppContext()
      : base("DefaultConnection", throwIfV1Schema: false)
    {
    }

    public DbSet<Note> Notes { get; set; }

    public static AppContext Create()
    {
      return new AppContext();
    }
  }
}