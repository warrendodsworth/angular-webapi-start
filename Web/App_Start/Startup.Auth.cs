using System;
using Microsoft.AspNet.Identity;
using Microsoft.Owin;
using Microsoft.Owin.Security.Cookies;
using Microsoft.Owin.Security.OAuth;
using Owin;
using Web.Providers;
using Web.Models;
using Microsoft.Owin.Security.Facebook;
using System.Web.Configuration;
using System.Web.Http.Cors;
using Microsoft.Owin.Cors;
using System.Threading.Tasks;
using System.Web.Cors;
using System.Threading;

namespace Web
{
  public partial class Startup
  {
    public static OAuthAuthorizationServerOptions OAuthOptions { get; private set; }
    public static FacebookAuthenticationOptions FacebookOptions { get; private set; }
    public static string PublicClientId { get; private set; }

    public void ConfigureAuth(IAppBuilder app)
    {
      var appSettings = WebConfigurationManager.AppSettings;
      var corsPolicy = new EnableCorsAttribute(appSettings["cors:Origins"], appSettings["cors:Headers"], appSettings["cors:Methods"]);
      var corsOptions = new CorsOptions
      {
        PolicyProvider = new CorsPolicyProvider
        {
          PolicyResolver = request =>
              request.Path.Value == "/token" ?
              corsPolicy.GetCorsPolicyAsync(null, CancellationToken.None) :
              Task.FromResult<CorsPolicy>(null)
        }
      };

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

      FacebookOptions = new FacebookAuthenticationOptions
      {
        AppId = appSettings["FacebookAppId"],
        AppSecret = appSettings["FacebookAppSecret"],
      };
      FacebookOptions.Scope.Add("email");
      FacebookOptions.Scope.Add("user_hometown");
      FacebookOptions.Scope.Add("user_location");


      // Configure the db context and user manager to use a single instance per request
      app.CreatePerOwinContext(AppDbContext.Create);
      app.CreatePerOwinContext<UserManager>(UserManager.Create);

      app.UseCors(corsOptions);
      app.UseOAuthBearerTokens(OAuthOptions);
      app.UseFacebookAuthentication(FacebookOptions);
      app.UseCookieAuthentication(new CookieAuthenticationOptions());
      app.UseExternalSignInCookie(DefaultAuthenticationTypes.ExternalCookie);
    }
  }
}

// For more information on configuring authentication, please visit http://go.microsoft.com/fwlink/?LinkId=301864
// Enable the application to use a cookie to store information for the signed in user
// and to use a cookie to temporarily store information about a user logging in with a third party login provider
