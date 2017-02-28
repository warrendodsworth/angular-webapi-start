using System.Net;
using System.Net.Http;
using System.Web;
using System.Web.Http;
using Web.Services;

namespace Web.Controllers
{
  [Authorize]
  [RoutePrefix("api/photos")]
  public class PhotosController : ApiController
  {
    private PhotoService _service;
    public PhotosController()
    {
      _service = new PhotoService();
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

      var path = _service.SavePhoto(file);

      return Ok(new { Name = file.FileName, Path = path });
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
