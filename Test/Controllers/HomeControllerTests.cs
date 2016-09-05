using Api.Models;
using System.Linq;
using Api.Controllers;
using System;
using System.Threading.Tasks;
using Api;
using Test.Mocks;
using Microsoft.VisualStudio.TestTools.UnitTesting;

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
    public async Task Home_Posts_GetAll_ShouldReturnSearch ()
    {
      var db = Seed();
      var controller = new HomeController(db);

      var posts = await controller.Get(search: "0");

      Assert.IsNotNull(posts);
      Assert.AreEqual(10, posts.Items.Count());
      Assert.AreEqual(10, posts.Total);
    }

    private IDb Seed(IDb db = null)
    {
      db = db ?? new MockDbContext();

      var user = new User
      {
        Id = Guid.NewGuid().ToString(),
        Name = "User",
      };
      db.Users.Add(user);

      for (int i = 0; i < 100; i++)
      {
        db.Posts.Add(new Post
        {
          Id = i,
          Text = "Post text " + i,
          UserId = user.Id,
        });
      }

      return db;
    }
  }
}
