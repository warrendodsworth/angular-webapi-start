using Autofac;
using Web.Models;
using System.Web.Http;
using System.Reflection;
using Autofac.Integration.WebApi;
using System.Web.Mvc;
using Autofac.Integration.Mvc;
using Microsoft.Owin.Security;
using Microsoft.Owin.Security.DataProtection;
using Microsoft.Owin.Security.DataHandler;

namespace Web
{
  public class AutofacConfig
  {
    public static void Init(HttpConfiguration config)
    {
      var builder = new ContainerBuilder();

      builder.RegisterControllers(Assembly.GetExecutingAssembly());
      builder.RegisterApiControllers(Assembly.GetExecutingAssembly());

      builder.RegisterFilterProvider();
      builder.RegisterWebApiFilterProvider(GlobalConfiguration.Configuration);

      builder.RegisterType<AppDbContext>()
             .AsImplementedInterfaces()
             .InstancePerRequest();


      builder.RegisterType<TicketDataFo‌​rmat>()
             .As<ISecureDataFormat<AuthenticationTicket>>();
      builder.Register(c => new DpapiDataProtectionProvider().Create("ASP.NET Identity"))
             .As<IDataProtector>();

      var container = builder.Build();
      DependencyResolver.SetResolver(new AutofacDependencyResolver(container));
      GlobalConfiguration.Configuration.DependencyResolver = new AutofacWebApiDependencyResolver(container);
    }
  }
}


