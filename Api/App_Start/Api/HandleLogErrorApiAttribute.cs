using System;
using System.Collections.Generic;
using System.Data.Entity.Validation;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using System.Web.Http.Filters;

namespace Api
{
  //API
  public class HandleLogErrorApiAttribute : ExceptionFilterAttribute
  {
    public override void OnException (HttpActionExecutedContext actionExecutedContext)
    {
      base.OnException(actionExecutedContext);
    }

    public override Task OnExceptionAsync (HttpActionExecutedContext actionExecutedContext, System.Threading.CancellationToken cancellationToken)
    {
      return base.OnExceptionAsync(actionExecutedContext, cancellationToken);
    }

    private void Handle (HttpActionExecutedContext context)
    {
      var e = context.Exception;
      var ms = context.ActionContext.ModelState;
      if ( e is DbEntityValidationException )
      {
        //Add to ModelState
        foreach ( var entity in ( (DbEntityValidationException) e ).EntityValidationErrors )
        {
          foreach ( var error in entity.ValidationErrors )
          {
            ms.AddModelError(error.PropertyName, error.ErrorMessage);
          }
        }
      }
      else
      {
        //Log
        ms.AddModelError("", e.Message);
      }
    }
  }
}
