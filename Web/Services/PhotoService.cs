using System.Configuration;
using System.IO;
using System.Web;
using System.Web.Hosting;

namespace Web.Services
{
  public class PhotoService
  {
    public static string BaseUrl = ConfigurationManager.AppSettings["StorageBaseUrl"];

    public string SavePhoto(HttpPostedFile file)
    {
      var filename = Path.GetFileName(file.FileName);

      var filePath = HostingEnvironment.MapPath("~/www/img") + "/" + file.FileName;

      file.SaveAs(filePath);

      return filePath;
    }
  }
}


//file.InputStream.Position = 0;
//var data = new byte[file.ContentLength];
//file.InputStream.Read(data, 0, file.ContentLength);

//var image = _imageService.SaveImage(new Image
//{
//  FileName = filename,
//  MimeType = file.ContentType,
//  ContentLength = file.ContentLength,
//  Data = data,
//});

