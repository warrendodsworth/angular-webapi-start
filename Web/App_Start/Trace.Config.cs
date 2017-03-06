using System.Web.Http;
using System.Web.Http.Tracing;

namespace Web
{
  //https://docs.microsoft.com/en-us/aspnet/web-api/overview/testing-and-debugging/tracing-in-aspnet-web-api
  public class TraceConfig
  {
    public static void Init(HttpConfiguration config)
    {
      SystemDiagnosticsTraceWriter traceWriter = config.EnableSystemDiagnosticsTracing();
      traceWriter.IsVerbose = false;
      traceWriter.MinimumLevel = TraceLevel.Fatal;
    }
  }
}


