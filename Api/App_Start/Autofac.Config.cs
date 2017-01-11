using Autofac;
using Web.Models;
using System.Web.Http;
using System.Reflection;
using Autofac.Integration.WebApi;
using System.Web.Mvc;
using Autofac.Integration.Mvc;

namespace Web
{
  public class AutofacConfig
  {
    public static void InitApi(HttpConfiguration config)
    {
            var builder = new ContainerBuilder();

            builder.RegisterControllers(Assembly.GetExecutingAssembly());
            builder.RegisterApiControllers(Assembly.GetExecutingAssembly());

            builder.RegisterFilterProvider();
            builder.RegisterWebApiFilterProvider(GlobalConfiguration.Configuration);

            builder.RegisterType<AppDbContext>()
                   .AsImplementedInterfaces()
                   .InstancePerRequest();


            var container = builder.Build();
            DependencyResolver.SetResolver(new AutofacDependencyResolver(container));
            GlobalConfiguration.Configuration.DependencyResolver = new AutofacWebApiDependencyResolver(container);

        }
    }
}


