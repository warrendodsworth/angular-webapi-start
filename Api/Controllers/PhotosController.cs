using System.IO;
using System.Net;
using System.Net.Http;
using System.Web;
using System.Web.Hosting;
using System.Web.Http;

namespace Api.Controllers
{
  [Authorize]
  [RoutePrefix("api/photos")]
  public class PhotosController : ApiController
  {
    public IHttpActionResult PostPhoto()
    {
      if (!Request.Content.IsMimeMultipartContent())
        throw new HttpResponseException(Request.CreateResponse(HttpStatusCode.UnsupportedMediaType));

      var context = HttpContext.Current;

      if (context.Request.Files.Count == 0)
        return BadRequest("No files");

      var file = context.Request.Files[0];
      var filename = Path.GetFileName(file.FileName);
      file.InputStream.Position = 0;
      var data = new byte[file.ContentLength];
      file.InputStream.Read(data, 0, file.ContentLength);

      file.SaveAs(HostingEnvironment.MapPath("~/App_Data") + "//" + file.FileName);

      return Ok();
    }

    [HttpDelete, Route("{imageID:int}")]
    public IHttpActionResult DeletePhoto(int id)
    {
      if (id <= 0)
        return BadRequest();

      return Ok();
    }
  }
}



//var image = _imageService.GetImageByID(imageID);
//if (image == null)
//  throw new HttpResponseException(HttpStatusCode.NotFound);

//var success = _imageService.DeleteImage(image, false);


//var image = _imageService.SaveImage(new Image
//{
//  FileName = filename,
//  MimeType = file.ContentType,
//  ContentLength = file.ContentLength,
//  Data = data,
//});

//if (image == null || image.ValidationErrors.Any())
//  return BadRequest(  "Failed to save image" );
