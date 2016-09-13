using System.Configuration;
using System.Data.Entity;
using System.Web.Http;
using System.Web.Mvc;
using System.Web.Routing;
using Api.Models;
using Microsoft.ApplicationInsights.Extensibility;

namespace Api
{
  public class WebApiApplication : System.Web.HttpApplication
  {
    protected void Application_Start()
    {
      AreaRegistration.RegisterAllAreas();
      GlobalConfiguration.Configure(WebApiConfig.Register);
      FilterConfig.RegisterGlobalFilters(GlobalFilters.Filters);
      RouteConfig.RegisterRoutes(RouteTable.Routes);
      AutomapperConfig.Init();
      Database.SetInitializer(new CreateDatabaseIfNotExists<Db>());
   
      bool isAppInsLoggingEnabled = false;
      bool.TryParse(ConfigurationManager.AppSettings["EnableApplicationInsightLogging"], out isAppInsLoggingEnabled);

      if (!isAppInsLoggingEnabled)
      {
        TelemetryConfiguration.Active.DisableTelemetry = true;
      }
    }
  }
}
