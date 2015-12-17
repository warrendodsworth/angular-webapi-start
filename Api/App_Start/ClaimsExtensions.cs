using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Security.Principal;
using System.Security.Claims;
using Microsoft.AspNet.Identity;

namespace Api
{
  public static class ClaimsExtensions
  {
    public static string GetName(this IPrincipal user)
    {
      var identity = user as ClaimsIdentity;
      return identity.FindFirstValue("FullName");
    }
  }
}