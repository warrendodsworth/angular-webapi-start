using Microsoft.VisualStudio.TestTools.UnitTesting;
using Api.Models;
using System.Linq;
using Api.Controllers;
using System;
using System.Threading.Tasks;
using Api;
using Test.Mocks;

namespace Test
{
  [TestClass]
  public class HomeControllerTests
  {
    [TestInitialize]
    public void Initialize()
    {
      AutomapperConfig.Init();      
    }

    [TestMethod]
    public async Task Posts_GetAll()
    {
      //Arrange
      var db = new MockDbContext();
      Seed(db);
      var controller = new HomeController(db);

      //Act
      var posts = await controller.Get();

      //Assert
      Assert.IsNotNull(posts);
      Assert.AreEqual(posts.Items.Count(), 10);
      Assert.AreEqual(posts.Total, 100);
      Assert.AreEqual("Post text 0", posts.Items.First()?.Text);
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
