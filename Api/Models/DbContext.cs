using Microsoft.AspNet.Identity.EntityFramework;
using System.Data.Common;
using System.Data.Entity;
using System;
using System.Threading.Tasks;
using System.Threading;
using System.Linq;

namespace Api.Models
{
  public interface IDb : IDisposable
  {
    IDbSet<User> Users { get; set; }
    DbSet<Post> Posts { get; set; }

    void MarkAsModified(object item);
    int SaveChanges();
    Task<int> SaveChangesAsync();

  }

  public class Db : IdentityDbContext<User>, IDb
  {
    public Db()
      : base("DefaultConnection", throwIfV1Schema: false)
    {
    }

    //Effort in memory db
    public Db(string connection) : base(connection)
    {

    }

    public DbSet<Post> Posts { get; set; }

    public static Db Create()
    {
      return new Db();
    }

    public void MarkAsModified(object item)
    {
      Entry(item).State = EntityState.Modified;
    }

    protected override void OnModelCreating(DbModelBuilder modelBuilder)
    {
      base.OnModelCreating(modelBuilder);
    }

    public override int SaveChanges()
    {
      DateTime saveTime = DateTime.Now;
      foreach (var entry in this.ChangeTracker.Entries().Where(e => e.State == EntityState.Added))
      {
        if (typeof(IEntity) == entry.GetType())
        {
          var e = ((IEntity) entry.Entity);
          if (e.CreateDate == null)
            e.CreateDate = saveTime;
        }
      }
      return base.SaveChanges();
    }

    public override Task<int> SaveChangesAsync()
    {
      DateTime saveTime = DateTime.Now;
      foreach (var entry in this.ChangeTracker.Entries().Where(e => e.State == EntityState.Added))
      {
        if (typeof(IEntity) == entry.GetType())
        {
          var e = ((IEntity) entry.Entity);
          if (e.CreateDate == null)
            e.CreateDate = saveTime;
        }
      }
      return base.SaveChangesAsync();
    }
  }
}