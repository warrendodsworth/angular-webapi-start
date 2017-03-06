using System.Linq;
using System.Threading.Tasks;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Effort;
using System.Collections.Generic;
using Web.Models;
using Web.Controllers;

namespace Test
{
  [TestClass]
  public class HomeControllerTests
  {
    private IAppDbContext db;
    private HomeController ctrl;

    [TestInitialize]
    public void BeforeEachTest()
    {
      db = Seed();
      ctrl = new HomeController(db);
    }

    [TestMethod]
    public async Task Home_Posts_GetAll()
    {
      var posts = await ctrl.GetPosts();

      Assert.IsNotNull(posts);
      Assert.AreEqual(posts.Items.Count(), 10);
      Assert.AreEqual(posts.Total, 100);
      Assert.AreEqual("Post text 0", posts.Items.First()?.Text);
    }

    [TestMethod]
    public async Task Home_Posts_GetAll_ShouldReturnSearch()
    {
      var posts = await ctrl.GetPosts(search: "0");

      Assert.IsNotNull(posts);
      Assert.AreEqual(10, posts.Items.Count());
      Assert.AreEqual(10, posts.Total);
    }

    private IAppDbContext Seed(IAppDbContext db = null)
    {
      db = db ?? new AppDbContext(DbConnectionFactory.CreateTransient());  //new MockDbContext();

      var user = new User { Name = "User", Email = "a@test.com", UserName = "user" };
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
