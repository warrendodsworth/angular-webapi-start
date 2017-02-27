using System.Linq;
using System.Web.Http;
using Microsoft.Owin.Security.OAuth;
using Newtonsoft.Json.Serialization;
using System.Net.Http.Formatting;
using System.Web.Configuration;
using System.Web.Http.Cors;
using System.Web.Http.ExceptionHandling;

namespace Web
{
  public static class WebApiConfig
  {
    public static void Register(HttpConfiguration config)
    {
      var appSettings = WebConfigurationManager.AppSettings;
      var corsPolicy = new EnableCorsAttribute(appSettings["cors:Origins"], appSettings["cors:Headers"], appSettings["cors:Methods"]);
      config.EnableCors(corsPolicy);

      // Configure Web API to use only bearer token authentication.
      config.SuppressDefaultHostAuthentication();
      config.Filters.Add(new HostAuthenticationFilter(OAuthDefaults.AuthenticationType));

      var jsonFormatter = config.Formatters.OfType<JsonMediaTypeFormatter>().First();
      jsonFormatter.SerializerSettings.ContractResolver = new CamelCasePropertyNamesContractResolver();

      config.MapHttpAttributeRoutes();

      config.Filters.Add(new HandleLogErrorApiAttribute());

      config.Routes.MapHttpRoute(
          name: "DefaultApi",
          routeTemplate: "api/{controller}/{id}",
          defaults: new { id = RouteParameter.Optional }
      );

      config.Services.Replace(typeof(IExceptionHandler), new OopsExceptionHandler());
      config.Services.Add(typeof(IExceptionLogger), new TraceExceptionLogger()); 

      AutofacConfig.InitApi(config);
    }
  }
}
