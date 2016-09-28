using System;
using System.Collections.Generic;
using System.Configuration;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.Hosting;

namespace Api.Services
{
  public class PhotoService
  {
    public static string BaseUrl = ConfigurationManager.AppSettings["StorageBaseUrl"];

    public void SavePhoto(HttpPostedFile file)
    {
      var filename = Path.GetFileName(file.FileName);

      file.SaveAs(HostingEnvironment.MapPath("~/img") + "/" + file.FileName);
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

