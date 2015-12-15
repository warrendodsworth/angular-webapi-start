using System;
using System.Collections.Generic;
using System.Data.Entity.Validation;
using System.Linq;
using System.Web;
using System.Web.Http.Filters;

namespace Api
{
  //API
  public class HandleLogErrorApiAttribute : ExceptionFilterAttribute
  {
    public override void OnException(HttpActionExecutedContext actionExecutedContext)
    {
      var e = actionExecutedContext.Exception;
      var ms = actionExecutedContext.ActionContext.ModelState;
      if (e is DbEntityValidationException)
      {
        //Add to ModelState
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
        //Log
      }

      base.OnException(actionExecutedContext);
    }

    public override System.Threading.Tasks.Task OnExceptionAsync(HttpActionExecutedContext actionExecutedContext, System.Threading.CancellationToken cancellationToken)
    {
      return base.OnExceptionAsync(actionExecutedContext, cancellationToken);
    }
  }
}
