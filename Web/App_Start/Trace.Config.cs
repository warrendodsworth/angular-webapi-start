using System;
using System.IO;
using System.Net.Http;
using System.Text;
using System.Web.Hosting;
using System.Web.Http;
using System.Web.Http.Tracing;

namespace Web
{
  //https://docs.microsoft.com/en-us/aspnet/web-api/overview/testing-and-debugging/tracing-in-aspnet-web-api
  public class TraceConfig
  {
    public static void Init(HttpConfiguration config)
    {
      var traceWriter = config.EnableSystemDiagnosticsTracing();
      traceWriter.IsVerbose = false;
      traceWriter.MinimumLevel = TraceLevel.Fatal;

      //config.Services.Add(typeof(ITraceWriter), new FileTraceWriter());
    }
  }

  public class FileTraceWriter : ITraceWriter
  {
    public void Trace(HttpRequestMessage request, string category, TraceLevel level, Action<TraceRecord> traceAction)
    {
      var traceRecord = new TraceRecord(request, category, level);
      traceAction(traceRecord);

      var path = HostingEnvironment.MapPath("/trace.txt");
      File.AppendAllLines(path, GetDetails(traceRecord).Split(new string[] { "\r\n" }, StringSplitOptions.None));
    }

    private string GetDetails(TraceRecord traceRecord)
    {
      var sb = new StringBuilder();
      sb.AppendFormat("\r\n\t{0} {1}\r\n\tCategory={2}, Level={3}, Kind={4}\r\n\tOperator:{5}, Operation: {6}",
              traceRecord.Request.Method,
              traceRecord.Request.RequestUri,
              traceRecord.Category,
              traceRecord.Level,
              traceRecord.Kind,
              traceRecord.Operator,
              traceRecord.Operation);

      if (traceRecord.Exception != null)
      {
        sb.AppendFormat("\r\n\tException : {0}", traceRecord.Exception.GetBaseException().Message);
      }
      else if (traceRecord.Message != null)
      {
        sb.AppendFormat("\r\n\tMessage : {0}", traceRecord.Message);
      }
      sb.AppendLine();
      return sb.ToString();
    }
  }
}


