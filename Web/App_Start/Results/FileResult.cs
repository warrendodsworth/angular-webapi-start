using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading;
using System.Threading.Tasks;
using System.Web;
using System.Web.Http;

namespace Web
{
  public class FileResult : IHttpActionResult
  {
    private readonly byte[] file;
    private readonly string filePath;
    private readonly string contentType;

    public FileResult(string filePath, string contentType = null)
    {
      this.filePath = filePath;
      this.contentType = contentType;
    }

    public FileResult(byte[] file, string contentType = null)
    {
      this.file = file;
      this.contentType = contentType;
    }

    public Task<HttpResponseMessage> ExecuteAsync(CancellationToken cancellationToken)
    {
      return Task.Run(() =>
      {
        var response = new HttpResponseMessage(HttpStatusCode.OK);

        if (file != null)
          response.Content = new StringContent(Convert.ToBase64String(file));
        else
          response.Content = new StreamContent(File.OpenRead(filePath));

        var contentType = this.contentType ?? MimeMapping.GetMimeMapping(Path.GetExtension(filePath));
        response.Content.Headers.ContentType = new MediaTypeHeaderValue(contentType);

        return response;
      }, cancellationToken);
    }
  }
}