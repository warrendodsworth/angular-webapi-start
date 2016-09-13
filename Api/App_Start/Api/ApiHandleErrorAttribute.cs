using System;
using System.Data.Entity.Validation;
using System.Threading.Tasks;
using System.Web.Http.Filters;
using Microsoft.ApplicationInsights;

namespace Api
{
  [AttributeUsage(AttributeTargets.Class | AttributeTargets.Method, Inherited = true, AllowMultiple = true)]
  public class HandleLogErrorApiAttribute : ExceptionFilterAttribute
  {
    public override void OnException(HttpActionExecutedContext actionExecutedContext)
    {
      base.OnException(actionExecutedContext);
    }

    public override Task OnExceptionAsync(HttpActionExecutedContext actionExecutedContext, System.Threading.CancellationToken cancellationToken)
    {
      return base.OnExceptionAsync(actionExecutedContext, cancellationToken);
    }

    private void Handle(HttpActionExecutedContext context)
    {
      if (context != null && context.Exception != null)
      {
        var e = context.Exception;
        var ms = context.ActionContext.ModelState;
        var ai = new TelemetryClient();

        ai.TrackException(context.Exception);

        if (e is DbEntityValidationException)
        {
          foreach (var entity in ((DbEntityValidationException) e).EntityValidationErrors)
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
    }
  }
}
