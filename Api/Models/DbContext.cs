using Microsoft.AspNet.Identity.EntityFramework;
using System.Data.Common;
using System.Data.Entity;
using System;

namespace Api.Models
{
  public interface IDb : IDisposable
  {
    DbSet<Post> Posts { get; set; }
  }

  public class Db : IdentityDbContext<User>, IDb
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