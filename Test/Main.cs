using System;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Effort.DataLoaders;
using Effort;
using Api.Models;
using Microsoft.AspNet.Identity.EntityFramework;
using System.Linq;
using System.Data;


namespace Test
{
  [TestClass]
  public class Main
  {
    private Db _db;

    [TestInitialize]
    public void Initialize()
    {
      var connection = DbConnectionFactory.CreateTransient();
      _db = new Db(connection.ConnectionString);
    }

    [TestMethod]
    public void TestMethod1()
    {
      IDataLoader loader = new EntityDataLoader("name=DefaultConnection");

      //using (Db db = ObjectContextFactory.CreateTransient<Db>(loader))
      //{
      //  var items = db.Notes.ToList();
      //}
    }
  }
}
