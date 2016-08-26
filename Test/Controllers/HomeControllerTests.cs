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
    public async Task Posts_GetAll()
    {
      //Arrange
      var db = new MockDbContext();
      Seed(db);
      var controller = new HomeController(db);

      //Act
      var posts = await controller.Get();

      //Assert
      Assert.NotNull(posts);
      Assert.Equal(posts.Items.Count(), 10);
      Assert.Equal(posts.Total, 100);
      Assert.Equal("Post text 0", posts.Items.First()?.Text);
    }

    private void Seed(IDb db)
    {
      var user = new User
      {
        Id = Guid.NewGuid().ToString(),
        Name = "Test User",
      };
      //db.Users.Add(user);

      for (int i = 0; i < 100; i++)
      {
        db.Posts.Add(new Post
        {
          Id = i,
          Text = "Post text " + i,
          UserId = user.Id,
        });
      }
    }
  }
}
