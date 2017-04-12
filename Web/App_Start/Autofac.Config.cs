using Autofac;
using Web.Models;
using System.Web.Http;
using System.Reflection;
using Autofac.Integration.WebApi;
using System.Web.Mvc;
using Autofac.Integration.Mvc;
using Microsoft.Owin.Security;
using Microsoft.Owin.Security.DataProtection;
using Microsoft.AspNet.Identity.EntityFramework;
using Microsoft.AspNet.Identity.Owin;
using System.Web;

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


      builder.RegisterType<AppDbContext>().AsSelf().AsImplementedInterfaces().InstancePerRequest();
      builder.RegisterType<UserManager>().AsSelf().InstancePerRequest();
      builder.Register(c => new UserStore<User>(c.Resolve<AppDbContext>())).AsImplementedInterfaces().InstancePerRequest();
      builder.Register(c => HttpContext.Current.GetOwinContext().Authentication).As<IAuthenticationManager>();
      builder.Register(c => new IdentityFactoryOptions<UserManager>
      {
        DataProtectionProvider = new DpapiDataProtectionProvider("Application​")
      });

      var container = builder.Build();

      DependencyResolver.SetResolver(new AutofacDependencyResolver(container));
      GlobalConfiguration.Configuration.DependencyResolver = new AutofacWebApiDependencyResolver(container);
    }
  }
}


//builder.RegisterType<TicketDataFo‌​rmat>().As<ISecureDataFormat<AuthenticationTicket>>();
//builder.Register(c => new DpapiDataProtectionProvider().Create("ASP.NET Identity")).As<IDataProtector>();
//builder.RegisterType<AppDbContext>().AsImplementedInterfaces().InstancePerRequest();

