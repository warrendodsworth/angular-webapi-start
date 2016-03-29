using Microsoft.AspNet.Identity.EntityFramework;
using System.Data.Entity;

namespace Api.Models
{
  public class Db : IdentityDbContext<User>
  {
    public Db()
      : base("DefaultConnection", throwIfV1Schema: false)
    {
    }

    public DbSet<Note> Notes { get; set; }

    public static Db Create()
    {
      return new Db();
    }
  }
}