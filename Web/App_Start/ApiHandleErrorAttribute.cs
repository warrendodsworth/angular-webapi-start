using System;
using System.Data.Entity.Validation;
using System.Threading.Tasks;
using System.Web.Http.Filters;
using Microsoft.ApplicationInsights;

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

      return base.OnExceptionAsync(actionExecutedContext, cancellationToken);
    }
  }
}
