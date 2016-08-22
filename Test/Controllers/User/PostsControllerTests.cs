using Microsoft.VisualStudio.TestTools.UnitTesting;
using Api.Models;
using System.Linq;
using Api.Controllers;
using System;
using System.Threading.Tasks;
using Api;
using Test.Mocks;
using Moq;
using System.Security.Principal;
using System.Web;
using System.Security.Claims;
using System.Web.Http;
using System.Web.Routing;
using System.Web.Http.Controllers;
using Microsoft.AspNet.Identity;

namespace Test
{
  [TestClass]
  public class PostsControllerTests
  {
    public Mock<HttpRequestContext> requestContext { get; set; }

    [TestInitialize]
    public void Initialize()
    {
      AutomapperConfig.Init();

      var identity = new GenericIdentity("test", "");
      identity.AddClaim(new Claim(ClaimTypes.NameIdentifier, "test"));

      var mockPrincipal = new Mock<IPrincipal>();
      mockPrincipal.Setup(p => p.IsInRole(It.IsAny<string>())).Returns(true);
      mockPrincipal.SetupGet(p => p.Identity).Returns(identity);

      requestContext = new Mock<HttpRequestContext>();
      requestContext.Setup(x => x.Principal).Returns(mockPrincipal.Object);
    }

    [TestMethod]
    public void Should_GetUserId_From_Identity()
    {
      var db = new MockDbContext();
      Seed(db);

      var controller = new UserPostsController(db) { RequestContext = requestContext.Object };

      Assert.AreEqual("test", controller.User.Identity.GetUserId());
      Assert.IsTrue(controller.User.Identity.IsAuthenticated);
    }

    [TestMethod]
    public async Task User_Posts_GetAll()
    {
      var db = new MockDbContext();
      Seed(db);

      var controller = new UserPostsController(db) { RequestContext = requestContext.Object };

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
        Id = "test",
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



//Mock httpcontext tryadd to controller context
//var context = new Mock<HttpContext>();
//context.SetupGet(x => x.User).Returns(principal);
//controller.ControllerContext = new ControllerContext(context.Object, new RouteData(), controller);
//controllerContext.SetupGet(x => x.HttpContext.User).Returns(principal.Object);
//controller.ControllerContext = controllerContext.Object;
