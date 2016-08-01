using Microsoft.VisualStudio.TestTools.UnitTesting;
using Effort;
using Api.Models;
using System.Linq;
using System.Data.Entity.Core.EntityClient;
using System.Security.Claims;
using Moq;
using Api.Controllers;
using System.Security.Principal;
using Microsoft.AspNet.Identity;
using System.Collections.Generic;
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
      //var claim = new Claim("test", "IdOfYourChoosing");
      //var mockIdentity = Mock.Of<ClaimsIdentity>(ci => ci.FindFirst(It.IsAny<string>()) == claim);
      //var controller = new HomeController()
      //{
      //  User = Mock.Of<IPrincipal>(ip => ip.Identity == mockIdentity)
      //};
      //controller.User.Identity.GetUserId(); //returns "IdOfYourChoosing"

      //Effort cannot use a data loader with a standard connection string.
      //EntityConnection connection = EntityConnectionFactory.CreateTransient("name=DefaultConnection");
      //db = new Db(connection.ConnectionString);
    }

    [TestMethod]
    public async Task Posts_GetAll()
    {
      //Arrange
      var db = new MockDbContext();
      SeetPosts(db);
      var controller = new HomeController(db);

      //Act
      var posts = await controller.Get();

      //Assert
      Assert.IsNotNull(posts);
      Assert.IsTrue(posts.items.Count() == 100);
    }

    private void SeetPosts(IDb db)
    {
      for (int i = 0; i < 100; i++)
      {
        db.Posts.Add(new Post
        {
          Id = i,
          Text = "Post text "+ i,          
        });
      }
    }
  }
}
