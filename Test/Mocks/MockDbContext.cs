using Api.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Data.Entity;

namespace Test.Mocks
{
  public class MockDbContext : IDb
  {
    public DbSet<Post> Posts { get; set; }

    public IDbSet<User> Users { get; set; }

    public void Dispose()
    {
      this.Dispose();
    }

    public void MarkAsModified(object item)
    {
    }

    public int SaveChanges()
    {
      return 1;
    }

    public Task<int> SaveChangesAsync()
    {
      return Task.FromResult(SaveChanges());
    }
  }
}
