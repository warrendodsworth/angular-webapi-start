using Microsoft.VisualStudio.TestTools.UnitTesting;
using System;
using Web;

namespace Test
{
  [TestClass]
  public class Test
  {
    [AssemblyInitialize]
    public static void AssemblyInit(TestContext context)
    {
      AutomapperConfig.Init();
    }

    [ClassInitialize]
    public static void ClassInit(TestContext context)
    {
      Console.WriteLine("ClassInit " + context.TestName);
    }
  }
}
