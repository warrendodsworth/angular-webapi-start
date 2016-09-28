using System;
using System.Net.Http;
using System.Web.Http;

namespace Api.Controllers.Labs
{
  [RoutePrefix("api/labs")]
  public class LabsController : ApiController
  {
    [Route("")]
    public IHttpActionResult Get()
    {
      var baseUrl = Request.RequestUri.GetLeftPart(UriPartial.Authority);

      return Redirect(baseUrl + "/#/login");
    }
  }
}