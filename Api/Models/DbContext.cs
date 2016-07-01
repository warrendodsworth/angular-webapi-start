using Microsoft.AspNet.Identity.EntityFramework;
using System.Data.Common;
using System.Data.Entity;

namespace Api.Models
{
  public class Db : IdentityDbContext<User>
  {
    public Db()
      : base("DefaultConnection", throwIfV1Schema: false)
    {
    }

    public Db(string connection): base(connection)
    {

    }

    public DbSet<Post> Posts { get; set; }

    public static Db Create()
    {
      return new Db();
    }
  }
}