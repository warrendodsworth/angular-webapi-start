﻿using System.Linq;
using System.Web.Http;
using Microsoft.Owin.Security.OAuth;
using Newtonsoft.Json.Serialization;
using System.Net.Http.Formatting;

namespace Web
{
  public static class WebApiConfig
  {
    public static void Register(HttpConfiguration config)
    {
      // Web API configuration and services
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

      AutofacConfig.InitApi(config);
    }
  }
}
