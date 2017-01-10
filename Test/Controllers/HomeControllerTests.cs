using Api.Models;
using System.Linq;
using Api.Controllers;
using System;
using System.Threading.Tasks;
using Api;
using Test.Mocks;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Effort;
using System.Collections.Generic;

namespace Test
{
  [TestClass]
  public class HomeControllerTests
  {
    [TestInitialize]
    public void Init()
    {
      AutomapperConfig.Init();
    }

    [TestMethod]
    public async Task Home_Posts_GetAll()
    {
      var db = Seed();
      var controller = new HomeController(db);

      var posts = await controller.Get();

      Assert.IsNotNull(posts);
      Assert.AreEqual(posts.Items.Count(), 10);
      Assert.AreEqual(posts.Total, 100);
      Assert.AreEqual("Post text 0", posts.Items.First()?.Text);
    }

    [TestMethod]
    public async Task Home_Posts_GetAll_ShouldReturnSearch()
    {
      var db = Seed();
      var controller = new HomeController(db);

      var posts = await controller.Get(search: "0");

      Assert.IsNotNull(posts);
      Assert.AreEqual(10, posts.Items.Count());
      Assert.AreEqual(10, posts.Total);
    }

    private IAppDbContext Seed(IAppDbContext db = null)
    {
      var connection = DbConnectionFactory.CreateTransient();
      db = db ?? new AppDbContext(connection);  //new MockDbContext();

      var user = new User
      {
        Name = "User",
        Email = "a@test.com",
        UserName = "user"
      };
      db.Users.Add(user);
      db.SaveChanges();

      var posts = new List<Post>();
      for (int i = 0; i < 100; i++)
      {
        posts.Add(new Post
        {
          Id = i,
          Text = "Post text " + i,
          User = user
        });
      }

      db.Posts.AddRange(posts);
      db.SaveChanges();


      return db;
    }
  }
}
