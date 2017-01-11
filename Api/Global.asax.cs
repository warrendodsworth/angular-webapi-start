using System.Data.Entity;
using System.Web.Http;
using System.Web.Mvc;
using System.Web.Routing;
using Web.Models;
using Microsoft.ApplicationInsights.Extensibility;

namespace Web
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
      Database.SetInitializer(new CreateDatabaseIfNotExists<AppDbContext>());

      TelemetryConfiguration.Active.InstrumentationKey = AppSettings.ApplicationInsightsKey;
    }
  }
}


//bool isAppInsLoggingEnabled = false;
//bool.TryParse(ConfigurationManager.AppSettings["EnableApplicationInsightLogging"], out isAppInsLoggingEnabled);

//if (!isAppInsLoggingEnabled)
//{
//  TelemetryConfiguration.Active.DisableTelemetry = true;
//}
