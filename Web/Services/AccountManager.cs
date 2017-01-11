using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web;
using System.Web.Http.Controllers;
using Api.Models;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.EntityFramework;
using Microsoft.Owin.Security;

namespace Api.Services
{
  public class AccountManager
  {
    public UserManager<User> UserManager { get; private set; }
    public HttpRequestMessage HttpContext { get; private set; }

    public AccountManager()
        : this(new UserManager<User>(new UserStore<User>(new Db())))
    {
    }

    public AccountManager(UserManager<User> userManager)
    {
      UserManager = userManager;
    }

    public void Initialize(HttpRequestMessage context)
    {
      HttpContext = context;
    }

    private IAuthenticationManager AuthenticationManager
    {
      get
      {
        return HttpContext.GetOwinContext().Authentication;
      }
    }

    public async Task SignInAsync(User user, bool isPersistent)
    {
      AuthenticationManager.SignOut(DefaultAuthenticationTypes.ExternalCookie);
      var identity = await UserManager.CreateIdentityAsync(user, DefaultAuthenticationTypes.ApplicationCookie);
      AuthenticationManager.SignIn(new AuthenticationProperties() { IsPersistent = isPersistent }, identity);
    }
  }
}