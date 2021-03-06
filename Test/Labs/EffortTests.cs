﻿using Microsoft.VisualStudio.TestTools.UnitTesting;
using System;
using System.Linq;
using System.Threading.Tasks;
using Effort;
using Web.Models;
using Web.Controllers;

namespace Test.Controllers
{
  [TestClass]
  public class EffortTests
  {
    private IAppDbContext db;

    [TestInitialize]
    public void BeforeEachTest()
    {
      db = Seed();
    }

    [TestMethod]
    public async Task Effort_Posts_GetAll()
    {
      var controller = new HomeController(db);

      var posts = await controller.GetPosts();

      Assert.IsNotNull(posts);
      Assert.AreEqual(10, posts.Items.Count());
      Assert.AreEqual(posts.Total, 100);
      Assert.AreEqual("Post text 1", posts.Items.First()?.Text);
    }

    private IAppDbContext Seed()
    {
      var db = new AppDbContext(DbConnectionFactory.CreateTransient());

      var user = new User
      {
        Id = Guid.NewGuid().ToString(),
        Name = "Test User",
        Email = "a@b.com",
        UserName = "test",
        Status = UserStatus.Active
      };
      db.Users.Add(user);
      db.SaveChanges();

      for (int i = 1; i <= 100; i++)
      {
        db.Posts.Add(new Post
        {
          Id = i,
          Text = "Post text " + i,
          UserId = user.Id,
        });
        db.SaveChanges();
      }

      return db;
    }
  }
}
