namespace Api.Migrations
{
  using System;
  using System.Data.Entity;
  using System.Data.Entity.Migrations;
  using System.Linq;
  using Microsoft.AspNet.Identity;
  using Models;
  internal sealed class Configuration : DbMigrationsConfiguration<Api.Models.Db>
  {
    public Configuration()
    {
      AutomaticMigrationsEnabled = true;
      AutomaticMigrationDataLossAllowed = true;
    }

    protected override void Seed(Api.Models.Db db)
    {
      var userManager = new UserManager(db);
      var user = userManager.FindByName("user");
      if(user == null)
      {
        userManager.Create(new User { Name = "Test", UserName = "user" }, "password");
      }
    }
  }
}
