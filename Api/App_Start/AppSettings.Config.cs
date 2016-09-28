using System.Configuration;

namespace Api
{
  public static class AppSettings
  {
    public static string StorageBaseUrl = ConfigurationManager.AppSettings["StorageBaseUrl"];

    public static string MandrillApiKey = ConfigurationManager.AppSettings["MandrillApiKey"];

    public static string ApplicationInsightsKey = ConfigurationManager.AppSettings["ApplicationInsightsKey"];
  }
}