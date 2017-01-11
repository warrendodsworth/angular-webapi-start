using Microsoft.AspNet.Identity.EntityFramework;
using System.Data.Entity;
using System;
using System.Threading.Tasks;
using System.Linq;
using System.Data.Common;

namespace Web.Models
{
  public interface IAppDbContext
  {
    IDbSet<User> Users { get; set; }
    DbSet<Post> Posts { get; set; }

    void MarkAsModified(object item);
    int SaveChanges();
    Task<int> SaveChangesAsync();
  }

  public class AppDbContext : IdentityDbContext<User>, IAppDbContext
  { 
    public AppDbContext()
      : base("DefaultConnection", throwIfV1Schema: false)
    {
    }

    //Effort in memory db
    public AppDbContext(DbConnection connection) : base(connection, contextOwnsConnection: true)
    {
    }

    public DbSet<Post> Posts { get; set; }

    public static AppDbContext Create()
    {
      return new AppDbContext();
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