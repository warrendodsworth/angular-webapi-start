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

namespace Test
{
  [TestClass]
  public class PostsControllerTests
  {
    [TestInitialize]
    public void Initialize()
    {
      AutomapperConfig.Init();
    }

    [TestMethod]
    public void Should_GetUserId_From_Identity()
    {
      //Arrange
      var username = "test@test.com";
      var identity = new GenericIdentity(username, "");
      var nameIdentifierClaim = new Claim(ClaimTypes.NameIdentifier, username);
      identity.AddClaim(nameIdentifierClaim);

      var mockPrincipal = new Mock<IPrincipal>();
      mockPrincipal.Setup(x => x.Identity).Returns(identity);
      mockPrincipal.Setup(x => x.IsInRole(It.IsAny<string>())).Returns(true);

      //Kernel.Rebind<IPrincipal>().ToConstant(mockPrincipal.Object);

      ////Act
      //var principal = Kernel.Get<IPrincipal>();

      //Asserts        
      //Assert.AreEqual(username, principal.Identity.GetUserId());
      //Assert.IsTrue(principal.Identity.IsAuthenticated);
    }

    [TestMethod]
    public async Task User_Posts_GetAll()
    {
      //Arrange
      var db = new MockDbContext();
      Seed(db);

      //Identity & Principal
      var identity = new GenericIdentity("test", "");
      identity.AddClaim(new Claim(ClaimTypes.NameIdentifier, "test"));

      var principal = new GenericPrincipal(identity, new[] { "user" });

      var requestContext = new Mock<HttpRequestContext>();
      requestContext.Setup(x => x.Principal).Returns(principal);

      var controller = new UserPostsController(db)
      {
        RequestContext = requestContext.Object,
      };

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



////Mock principal - not used
//var mockPrincipal = new Mock<IPrincipal>();
//mockPrincipal.Setup(p => p.IsInRole("user")).Returns(true);
//mockPrincipal.SetupGet(x => x.Identity.Name).Returns("test");

//var httpContext = new Mock<HttpContext>();
//httpContext.SetupGet(x => x.User).Returns(principal);

//controller.ControllerContext = new ControllerContext(context.Object, new RouteData(), controller);

//var context = new Mock<HttpContextBase>();
//var mockIdentity = new Mock<IIdentity>();

//context.SetupGet(x => x.User.Identity).Returns(mockIdentity.Object);
//mockIdentity.Setup(x => x.Name).Returns("test_name");

//var username = "test@test.com";
//var principal = new Moq.Mock<IPrincipal>();
//principal.Setup(p => p.IsInRole("Administrator")).Returns(true);
//principal.SetupGet(x => x.Identity.Name).Returns(username);
//controllerContext.SetupGet(x => x.HttpContext.User).Returns(principal.Object);
//controller.ControllerContext = controllerContext.Object;
