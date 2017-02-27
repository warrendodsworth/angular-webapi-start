using System;
using System.Data.Entity.Validation;
using System.Threading.Tasks;
using System.Web.Http.Filters;
using Microsoft.ApplicationInsights;
using System.Web.Http.ExceptionHandling;
using System.Web.Http.Results;
using System.Net;
using System.Web.Http;
using System.Net.Http;
using System.Threading;
using System.Diagnostics;

namespace Web
{
  [AttributeUsage(AttributeTargets.Class | AttributeTargets.Method, Inherited = true, AllowMultiple = true)]
  public class HandleLogErrorApiAttribute : ExceptionFilterAttribute
  {
    public override Task OnExceptionAsync(HttpActionExecutedContext actionExecutedContext, System.Threading.CancellationToken cancellationToken)
    {
      if (actionExecutedContext != null && actionExecutedContext.Exception != null)
      {
        var e = actionExecutedContext.Exception;
        var ms = actionExecutedContext.ActionContext.ModelState;
        var ai = new TelemetryClient();

        ai.TrackException(e);

        if (e is DbEntityValidationException)
        {
          foreach (var entity in ((DbEntityValidationException)e).EntityValidationErrors)
          {
            foreach (var error in entity.ValidationErrors)
            {
              ms.AddModelError(error.PropertyName, error.ErrorMessage);
            }
          }
        }
        else
        {
          ms.AddModelError("", e.Message);
        }
      }

      return base.OnExceptionAsync(actionExecutedContext, cancellationToken);
    }
  }

  //https://docs.microsoft.com/en-us/aspnet/web-api/overview/error-handling/web-api-global-error-handling
  public class OopsExceptionHandler : ExceptionHandler
  {
    public override void Handle(ExceptionHandlerContext context)
    {
      context.Result = new TextPlainErrorResult
      {
        Request = context.ExceptionContext.Request,
        Content = "Oops! Sorry! Something went wrong." +
                    "Please contact support@contoso.com so we can try to fix it."
      };
    }

    private class TextPlainErrorResult : IHttpActionResult
    {
      public HttpRequestMessage Request { get; set; }

      public string Content { get; set; }

      public Task<HttpResponseMessage> ExecuteAsync(CancellationToken cancellationToken)
      {
        HttpResponseMessage response =
                         new HttpResponseMessage(HttpStatusCode.InternalServerError);
        response.Content = new StringContent(Content);
        response.RequestMessage = Request;
        return Task.FromResult(response);
      }
    }
  }

  public class TraceExceptionLogger : ExceptionLogger
  {
    public override void Log(ExceptionLoggerContext context)
    {
      Trace.TraceError(context.ExceptionContext.Exception.ToString());
    }
  }
}
