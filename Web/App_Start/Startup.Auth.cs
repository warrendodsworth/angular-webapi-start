using System;
using Microsoft.AspNet.Identity;
using Microsoft.Owin;
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
using System.Net.Http;
using Newtonsoft.Json;
using System.Web;
using System.Net;

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
        AuthorizeEndpointPath = new PathString("/api/account/external-ogin"),
        AccessTokenExpireTimeSpan = TimeSpan.FromDays(14),
        // In production mode set AllowInsecureHttp = false
        AllowInsecureHttp = true
      };

      FacebookOptions = new FacebookAuthenticationOptions
      {
        AppId = appSettings["FacebookAppId"],
        AppSecret = appSettings["FacebookAppSecret"],
        Scope = { "email", "user_hometown", "user_location" },
        BackchannelHttpHandler = new FacebookBackChannelHandler(),
        UserInformationEndpoint = "https://graph.facebook.com/v2.8/me?fields=id,name,email,first_name,last_name",
    };

      // Configure the db context and user manager to use a single instance per request
      app.CreatePerOwinContext(AppDbContext.Create);
      app.CreatePerOwinContext<UserManager>(UserManager.Create);

      app.UseCors(corsOptions);
      app.UseOAuthBearerTokens(OAuthOptions);
      app.UseFacebookAuthentication(FacebookOptions);
      app.UseExternalSignInCookie(DefaultAuthenticationTypes.ExternalCookie);
    }
  }

  public class FacebookBackChannelHandler : HttpClientHandler
  {
    protected override async Task<HttpResponseMessage> SendAsync(HttpRequestMessage request, CancellationToken cancellationToken)
    {
      if (!request.RequestUri.AbsolutePath.Contains("/oauth"))
      {
        request.RequestUri = new Uri(request.RequestUri.AbsoluteUri.Replace("?access_token", "&access_token"));
      }

      var result = await base.SendAsync(request, cancellationToken);
      if (!request.RequestUri.AbsolutePath.Contains("/oauth"))
      {
        return result;
      }

      var content = await result.Content.ReadAsStringAsync();
      var facebookOauthResponse = JsonConvert.DeserializeObject<FacebookOauthResponse>(content);

      var outgoingQueryString = HttpUtility.ParseQueryString(string.Empty);
      outgoingQueryString.Add(nameof(facebookOauthResponse.access_token), facebookOauthResponse.access_token);
      outgoingQueryString.Add(nameof(facebookOauthResponse.expires_in), facebookOauthResponse.expires_in + string.Empty);
      outgoingQueryString.Add(nameof(facebookOauthResponse.token_type), facebookOauthResponse.token_type);
      var postdata = outgoingQueryString.ToString();

      var modifiedResult = new HttpResponseMessage(HttpStatusCode.OK)
      {
        Content = new StringContent(postdata)
      };

      return modifiedResult;
    }
  }

  public class FacebookOauthResponse
  {
    public string access_token { get; set; }
    public long expires_in { get; set; }
    public string token_type { get; set; }
  }
}

// For more information on configuring authentication, please visit http://go.microsoft.com/fwlink/?LinkId=301864
// Enable the application to use a cookie to store information for the signed in user
// and to use a cookie to temporarily store information about a user logging in with a third party login provider
