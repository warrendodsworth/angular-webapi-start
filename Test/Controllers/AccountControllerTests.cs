using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Web.Controllers;
using Web.Models;
using Effort;
using Web;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.EntityFramework;
using System.Net;
using Microsoft.Owin.Security.DataHandler;
using Microsoft.Owin.Security.DataProtection;
using System.Web.Http;
using System.Web.Http.Results;

namespace Test.Controllers
{
  [TestClass]
  public class AccountControllerTests
  {
    private AppDbContext db;
    private UserManager userManager;
    private AccountController ctrl;

    [TestInitialize]
    public void BeforeEachTest()
    {
      db = Seed();
      userManager = new UserManager(db);
      ctrl = new AccountController(userManager, new TicketDataFormat(new DpapiDataProtectionProvider().Create("ASP.NET Identity")));
    }

    [TestMethod]
    public async Task Account_Register_Success()
    {
      var res = await ctrl.Register(new RegisterModel { Username = "warren", Email = "w@a.com", Password = "tester1" });

      Assert.IsNotNull(res);
      Assert.IsInstanceOfType(res, typeof(OkResult));
    }


    private AppDbContext Seed(AppDbContext db = null)
    {
      db = new AppDbContext(DbConnectionFactory.CreateTransient());

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
