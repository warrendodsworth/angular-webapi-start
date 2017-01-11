namespace Web.Migrations
{
  using System;
  using System.Collections.Generic;
  using System.Data.Entity;
  using System.Data.Entity.Migrations;
  using System.Linq;
  using Microsoft.AspNet.Identity;
  using Models;
  internal sealed class Configuration : DbMigrationsConfiguration<Web.Models.AppDbContext>
  {
    public Configuration()
    {
      AutomaticMigrationsEnabled = true;
      AutomaticMigrationDataLossAllowed = true;

#if DEBUG
      Database.SetInitializer(new DropCreateDatabaseAlways<AppDbContext>());
#endif
    }

    protected override void Seed(Web.Models.AppDbContext db)
    {
      var userManager = new UserManager(db);
      var user = userManager.FindByName("warren");
      if (user == null)
      {
        user = new User { Name = "W", UserName = "warren" };
        userManager.Create(user, "daywalker");
      }

      var posts = new List<Post>();
      for (int i = 1; i <= 500; i++)
      {
        posts.Add(new Post
        {
          Text = "Thinking " + i,
          UserId = user.Id,
          CreateDate = DateTime.UtcNow
        });
      }
      db.Posts.AddOrUpdate(posts.ToArray());
      db.SaveChanges();
    }
  }
}
