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

namespace Test
{
  [TestClass]
  public class Main
  {
    private Db db;

    [TestInitialize]
    public void Initialize()
    {
      //var claim = new Claim("test", "IdOfYourChoosing");
      //var mockIdentity = Mock.Of<ClaimsIdentity>(ci => ci.FindFirst(It.IsAny<string>()) == claim);

      //var controller = new HomeController()
      //{
      //  User = Mock.Of<IPrincipal>(ip => ip.Identity == mockIdentity)
      //};

      //controller.User.Identity.GetUserId(); //returns "IdOfYourChoosing"


      //Effort cannot use a data loader with a standard connection string.
      EntityConnection connection = EntityConnectionFactory.CreateTransient("name=DefaultConnection");

      db = new Db(connection.ConnectionString);
    }

    [TestMethod]
    public void Notes_GetList()
    {
      var items = db.Posts.ToList();

      Assert.IsFalse(false);
    }
  }
}
