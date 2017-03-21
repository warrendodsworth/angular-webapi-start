using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Web;

namespace Web
{
  public static class UrlExtensions
  {
    public static string BaseUrl(this HttpRequestMessage req)
    {
      return string.Concat(req.RequestUri.Scheme, "://", req.RequestUri.Authority);
    }
  }
}