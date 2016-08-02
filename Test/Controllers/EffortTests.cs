using Api;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Test.Controllers
{
  [TestClass]
  public class EffortTests
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
  }
}
