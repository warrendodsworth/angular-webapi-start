using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web;
using System.Web.Http;

namespace Api.Controllers
{
  [Authorize]
  [RoutePrefix("api/photos")]
  public class PhotosController : ApiController
  {
    public IHttpActionResult Post()
    {
      if (!Request.Content.IsMimeMultipartContent())
        throw new HttpResponseException(Request.CreateResponse(HttpStatusCode.UnsupportedMediaType));

      var context = HttpContext.Current;

      int formID;
      if (!int.TryParse(context.Request.Form["formID"], out formID))
        throw new HttpResponseException(HttpStatusCode.BadRequest);

      if (context.Request.Files.Count == 0)
        throw new HttpResponseException(HttpStatusCode.BadRequest);

      var file = context.Request.Files[0];
      var filename = Path.GetFileName(file.FileName);
      file.InputStream.Position = 0;
      var data = new byte[file.ContentLength];
      file.InputStream.Read(data, 0, file.ContentLength);

      //var image = _imageService.SaveImage(new Image
      //{
      //  FileName = filename,
      //  MimeType = file.ContentType,
      //  ContentLength = file.ContentLength,
      //  Data = data,
      //});

      //if (image == null || image.ValidationErrors.Any())
      //  return BadRequest(  "Failed to save image" );

      return Ok(new
      {
        ImageID = 1 //image.ID
      });
    }

    [HttpDelete, Route("{imageID:int}")]
    public IHttpActionResult DeleteImage(int imageID)
    {
      if (imageID <= 0)
        throw new HttpResponseException(HttpStatusCode.BadRequest);

      //var image = _imageService.GetImageByID(imageID);
      //if (image == null)
      //  throw new HttpResponseException(HttpStatusCode.NotFound);

      //var success = _imageService.DeleteImage(image, false);
      return Ok();
    }
  }
}
