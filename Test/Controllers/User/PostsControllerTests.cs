using Microsoft.VisualStudio.TestTools.UnitTesting;
using System.Linq;
using System.Threading.Tasks;
using Test.Mocks;
using Moq;
using System.Security.Principal;
using System.Security.Claims;
using System.Web.Http.Controllers;
using Microsoft.AspNet.Identity;
using Web.Models;
using Web.Controllers;
using Web;
using Web.Models.Dto;
using System.Web.Http.Results;
using Effort;

namespace Test
{
  [TestClass]
  public class PostsControllerTests
  {
    public Mock<HttpRequestContext> requestContext { get; set; }
    private IAppDbContext db;
    private UserPostsController ctrl;

    [TestInitialize]
    public void BeforeEachTest()
    {
      var identity = new GenericIdentity("test", "");
      identity.AddClaim(new Claim(ClaimTypes.NameIdentifier, "test"));

      var mockPrincipal = new Mock<IPrincipal>();
      mockPrincipal.Setup(p => p.IsInRole(It.IsAny<string>())).Returns(true);
      mockPrincipal.SetupGet(p => p.Identity).Returns(identity);

      requestContext = new Mock<HttpRequestContext>();
      requestContext.Setup(x => x.Principal).Returns(mockPrincipal.Object);

      db = Seed();
      ctrl = new UserPostsController(db) { RequestContext = requestContext.Object };
    }

    [TestMethod]
    public void User_Should_GetUserId_From_Identity()
    {
      Assert.AreEqual("test", ctrl.User.Identity.GetUserId());
      Assert.IsTrue(ctrl.User.Identity.IsAuthenticated);
    }

    [TestMethod]
    public async Task User_Posts_GetAll()
    {
      var posts = await ctrl.GetPosts();

      Assert.IsNotNull(posts);
      Assert.AreEqual(posts.Items.Count(), 10);
      Assert.AreEqual(posts.Total, 100);
      Assert.AreEqual("Post text 0", posts.Items.First()?.Text);
    }

    [TestMethod]
    public async Task User_Posts_Create()
    {
      var post = new PostDto { Text = "Test", UserId = "test" };
      var res = await ctrl.PostPost(post) as CreatedAtRouteNegotiatedContentResult<PostDto>;

      Assert.IsNotNull(res);
      Assert.IsNotNull(res.Content);
    }

    private IAppDbContext Seed(IAppDbContext db = null)
    {
      db = db ?? new AppDbContext(DbConnectionFactory.CreateTransient());

      var user = new User { Id = "test", Name = "Test User", UserName = "test", };
      db.Users.Add(user);
      db.SaveChanges();

      for (int i = 0; i < 100; i++)
      {
        db.Posts.Add(new Post
        {
          Id = i,
          Text = "Post text " + i,
          UserId = user.Id,
        });
      }

      db.SaveChanges();

      return db;
    }
  }
}



//Mock httpcontext tryadd to controller context
//var context = new Mock<HttpContext>();
//context.SetupGet(x => x.User).Returns(principal);
//controller.ControllerContext = new ControllerContext(context.Object, new RouteData(), controller);
//controllerContext.SetupGet(x => x.HttpContext.User).Returns(principal.Object);
//controller.ControllerContext = controllerContext.Object;
