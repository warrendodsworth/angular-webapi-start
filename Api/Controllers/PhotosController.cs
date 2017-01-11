using System.IO;
using System.Net;
using System.Net.Http;
using System.Web;
using System.Web.Hosting;
using System.Web.Http;
using Web.Services;

namespace Web.Controllers
{
  [Authorize]
  [RoutePrefix("api/photos")]
  public class PhotosController : ApiController
  {
    private PhotoService service;
    public PhotosController()
    {
      service = new PhotoService();
    }

    [Route("")]
    public IHttpActionResult PostPhoto()
    {
      if (!Request.Content.IsMimeMultipartContent())
        throw new HttpResponseException(Request.CreateResponse(HttpStatusCode.UnsupportedMediaType));

      var context = HttpContext.Current;

      if (context.Request.Files.Count == 0)
        return BadRequest("No files");

      var file = context.Request.Files[0];

      service.SavePhoto(file);

      return Ok();
    }

    [Route("{imageID:int}")]
    public IHttpActionResult DeletePhoto(int id)
    {
      if (id <= 0)
        return BadRequest();

      return Ok();
    }
  }
}
