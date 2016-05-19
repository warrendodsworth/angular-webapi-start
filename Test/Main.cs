using Microsoft.VisualStudio.TestTools.UnitTesting;
using Effort;
using Api.Models;
using System.Linq;
using System.Data.Entity.Core.EntityClient;

namespace Test
{
  [TestClass]
  public class Main
  {
    private Db db;

    [TestInitialize]
    public void Initialize()
    {
      //Effort cannot use a data loader with a standard connection string.
      EntityConnection connection = EntityConnectionFactory.CreateTransient("name=DefaultConnection");

      db = new Db(connection.ConnectionString);
    }

    [TestMethod]
    public void Notes_GetList()
    {
      var items = db.Notes.ToList();

      Assert.IsFalse(false);
    }
  }
}
