using Api.Models;
using System.Linq;
using Api.Controllers;
using System;
using System.Threading.Tasks;
using Api;
using Test.Mocks;
using Xunit;

namespace Test
{
  public class HomeControllerTests
  {
    public HomeControllerTests()
    {
      AutomapperConfig.Init();
    }

    [Fact]
    public async Task Home_Posts_GetAll()
    {
      var db = Seed();
      var controller = new HomeController(db);

      var posts = await controller.Get();

      Assert.NotNull(posts);
      Assert.Equal(posts.Items.Count(), 10);
      Assert.Equal(posts.Total, 100);
      Assert.Equal("Post text 0", posts.Items.First()?.Text);
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
