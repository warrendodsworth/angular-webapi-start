using System;
using Microsoft.AspNet.Identity;
using Microsoft.Owin;
using Microsoft.Owin.Security.Cookies;
using Microsoft.Owin.Security.OAuth;
using Owin;
using Api.Providers;
using Api.Models;
using Microsoft.Owin.Security.Facebook;

namespace Api
{
  public partial class Startup
  {
    public static OAuthAuthorizationServerOptions OAuthOptions { get; private set; }

    public static string PublicClientId { get; private set; }


    // For more information on configuring authentication, please visit http://go.microsoft.com/fwlink/?LinkId=301864
    public void ConfigureAuth(IAppBuilder app)
    {
      // Configure the db context and user manager to use a single instance per request
      app.CreatePerOwinContext(Db.Create);
      app.CreatePerOwinContext<UserManager>(UserManager.Create);

      // Enable the application to use a cookie to store information for the signed in user
      // and to use a cookie to temporarily store information about a user logging in with a third party login provider
      app.UseCookieAuthentication(new CookieAuthenticationOptions());
      app.UseExternalSignInCookie(DefaultAuthenticationTypes.ExternalCookie);


      //OAuth config
      PublicClientId = "self";
      OAuthOptions = new OAuthAuthorizationServerOptions
      {
        TokenEndpointPath = new PathString("/token"),
        Provider = new ApplicationOAuthProvider(PublicClientId),
        AuthorizeEndpointPath = new PathString("/api/account/externalLogin"),
        AccessTokenExpireTimeSpan = TimeSpan.FromDays(14),
        // In production mode set AllowInsecureHttp = false
        AllowInsecureHttp = true
      };

      app.UseOAuthBearerTokens(OAuthOptions); //OAuth enable


      var facebookOptions = new FacebookAuthenticationOptions
      {
        AppId = "292179600807388",
        AppSecret = "2ccc6fd1bada1fddbdb6577d47b93996",
      };
      facebookOptions.Scope.Add("email");
      facebookOptions.Scope.Add("user_hometown");
      facebookOptions.Scope.Add("user_location");

      app.UseFacebookAuthentication(facebookOptions); //Facebook OAuth enable
    }
  }
}
