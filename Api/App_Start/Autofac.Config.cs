using Autofac;
using Api.Models;
using System.Web.Http;
using System.Reflection;
using Autofac.Integration.WebApi;

namespace Api
{
  public class AutofacConfig
  {
    public static void InitApi(HttpConfiguration config)
    {
      var builder = new ContainerBuilder();
      builder.RegisterType<Db>()
             .AsImplementedInterfaces()
             .InstancePerLifetimeScope();
  
      builder.RegisterApiControllers(Assembly.GetExecutingAssembly());

      var container = builder.Build();
      var resolver = new AutofacWebApiDependencyResolver(container);
      config.DependencyResolver = resolver;
    }
  }
}


