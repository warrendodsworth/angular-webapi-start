﻿using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Threading.Tasks;
using System.Web;
using System.Web.Http;
using System.Web.Http.ModelBinding;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.EntityFramework;
using Microsoft.AspNet.Identity.Owin;
using Microsoft.Owin.Security;
using Microsoft.Owin.Security.Cookies;
using Microsoft.Owin.Security.OAuth;
using Web.Models;
using Web.Providers;
using Web.Results;
using Newtonsoft.Json.Linq;
using System.Linq;

namespace Web.Controllers
{
  [Authorize]
  [RoutePrefix("api/account")]
  public class AccountController : ApiController
  {
    public ISecureDataFormat<AuthenticationTicket> AccessTokenFormat { get; private set; }
    private const string LocalLoginProvider = "Local";
    private UserManager _userManager;

    public AccountController(UserManager userManager)
    {
      UserManager = userManager;
      AccessTokenFormat = Startup.OAuthOptions.AccessTokenFormat;
    }

    public UserManager UserManager
    {
      get
      {
        return _userManager ?? Request.GetOwinContext().GetUserManager<UserManager>();
      }
      private set
      {
        _userManager = value;
      }
    }

    #region Social
    //Thinking http://bitoftech.net/2014/08/11/asp-net-web-api-2-external-logins-social-logins-facebook-google-angularjs-app/

    [AllowAnonymous]
    [Route("external-logins")]
    public IEnumerable<ExternalLoginDto> GetExternalLogins(string returnUrl, bool generateState = false)
    {
      IEnumerable<AuthenticationDescription> descriptions = Authentication.GetExternalAuthenticationTypes();

      string state;

      if (generateState)
      {
        const int strengthInBits = 256;
        state = RandomOAuthStateGenerator.Generate(strengthInBits);
      }
      else
      {
        state = null;
      }

      var logins = new List<ExternalLoginDto>();

      foreach (AuthenticationDescription description in descriptions)
      {
        var login = new ExternalLoginDto
        {
          Name = description.Caption,
          Url = Url.Route("ExternalLogin", new
          {
            provider = description.AuthenticationType,
            response_type = "token",
            client_id = Startup.PublicClientId,
            redirect_uri = new Uri(Request.RequestUri, returnUrl).AbsoluteUri,
            state = state
          }),
          State = state
        };
        logins.Add(login);
      }

      return logins;
    }

    [AllowAnonymous]
    [OverrideAuthentication]
    [HostAuthentication(DefaultAuthenticationTypes.ExternalCookie)]
    [Route("external-login", Name = "ExternalLogin")]
    public async Task<IHttpActionResult> GetExternalLogin(string provider, string error = null)
    {
      if (error != null)
      {
        return Redirect(Url.Content("~/www/account/externalLogin.html") + "#/error=" + Uri.EscapeDataString(error));
      }

      //Send user to external provider to login
      if (!User.Identity.IsAuthenticated)
      {
        return new ChallengeResult(provider, this);
      }

      //Logged in - return from Facebook with External cookie
      ExternalLoginData externalLogin = ExternalLoginData.FromIdentity(User.Identity as ClaimsIdentity);
      if (externalLogin == null)
      {
        return InternalServerError();
      }

      if (externalLogin.LoginProvider != provider)
      {
        Authentication.SignOut(DefaultAuthenticationTypes.ExternalCookie);
        return new ChallengeResult(provider, this);
      }

      var user = await UserManager.FindAsync(new UserLoginInfo(externalLogin.LoginProvider, externalLogin.ProviderKey));
      var hasRegistered = user != null;

      if (hasRegistered)
      {
        //2rd case - sign user in 
        var oAuthIdentity = await user.GenerateUserIdentityAsync(UserManager, OAuthDefaults.AuthenticationType);
        var cookieIdentity = await user.GenerateUserIdentityAsync(UserManager, CookieAuthenticationDefaults.AuthenticationType);

        AuthenticationProperties properties = ApplicationOAuthProvider.CreateProperties(user);
        Authentication.SignIn(properties, oAuthIdentity, cookieIdentity);
        Authentication.SignOut(DefaultAuthenticationTypes.ExternalCookie);
      }
      else
      {
        //3nd case - wait for user to register
        var claims = externalLogin.GetClaims();
        var identity = new ClaimsIdentity(claims, OAuthDefaults.AuthenticationType);
        Authentication.SignIn(identity);
      }

      //http://leastprivilege.com/2013/11/26/dissecting-the-web-api-individual-accounts-templatepart-3-external-accounts/
      //Invoke externalLogin with the same URL as before - 2rd time after RegisterExternal - will come here now
      //the user is still authenticated using the same external cookie & the login provider / user id pair is now registered
      //The controller clears the external cookie and creates a new authentication ticket & this ticket translates to a new token with an issuer LOCAL
      //The callback URL transmits the token back to the client

      return Ok();
    }

    [HostAuthentication(DefaultAuthenticationTypes.ExternalBearer)]
    [Route("user-info")]
    public UserInfoDto GetUserInfo()
    {
      ExternalLoginData externalLogin = ExternalLoginData.FromIdentity(User.Identity as ClaimsIdentity);

      return new UserInfoDto
      {
        Name = externalLogin.Name,
        Email = externalLogin.Email,
        Username = externalLogin.Username,
        HasRegistered = externalLogin == null,
        LoginProvider = externalLogin != null ? externalLogin.LoginProvider : null
      };
    }

    [OverrideAuthentication]
    [HostAuthentication(DefaultAuthenticationTypes.ExternalBearer)]
    [Route("register-external")]
    public async Task<IHttpActionResult> RegisterExternal(RegisterExternalModel model)
    {
      if (!ModelState.IsValid)
      {
        return BadRequest(ModelState);
      }

      var info = await Authentication.GetExternalLoginInfoAsync();
      if (info == null)
      {
        return InternalServerError();
      }

      var userCheck = await UserManager.FindAsync(info.Login);
      if (userCheck != null)
      {
        return BadRequest("User already registered");
      }

      var user = new User() { UserName = model.Username, Email = model.Email };

      IdentityResult result = await UserManager.CreateAsync(user);
      if (!result.Succeeded)
      {
        return GetErrorResult(result);
      }

      result = await UserManager.AddLoginAsync(user.Id, info.Login); //Instead of password associate external login with this new account
      if (!result.Succeeded)
      {
        return GetErrorResult(result);
      }

      var accessToken = GenerateLocalAccessTokenResponse(user);

      return Ok(accessToken);
    }


    [Route("manage-info")]
    public async Task<ManageInfoDto> GetManageInfo(string returnUrl, bool generateState = false)
    {
      IdentityUser user = await UserManager.FindByIdAsync(User.Identity.GetUserId());

      if (user == null)
      {
        return null;
      }

      List<UserLoginInfoDto> logins = new List<UserLoginInfoDto>();

      foreach (IdentityUserLogin linkedAccount in user.Logins)
      {
        logins.Add(new UserLoginInfoDto
        {
          LoginProvider = linkedAccount.LoginProvider,
          ProviderKey = linkedAccount.ProviderKey
        });
      }

      if (user.PasswordHash != null)
      {
        logins.Add(new UserLoginInfoDto
        {
          LoginProvider = LocalLoginProvider,
          ProviderKey = user.UserName,
        });
      }

      return new ManageInfoDto
      {
        LocalLoginProvider = LocalLoginProvider,
        Email = user.UserName,
        Logins = logins,
        ExternalLoginProviders = GetExternalLogins(returnUrl, generateState)
      };
    }

    [Route("add-external-login")]
    public async Task<IHttpActionResult> AddExternalLogin(AddExternalLoginBindingModel model)
    {
      if (!ModelState.IsValid)
      {
        return BadRequest(ModelState);
      }

      Authentication.SignOut(DefaultAuthenticationTypes.ExternalCookie);

      AuthenticationTicket ticket = AccessTokenFormat.Unprotect(model.ExternalAccessToken);

      if (ticket == null || ticket.Identity == null || (ticket.Properties != null
          && ticket.Properties.ExpiresUtc.HasValue
          && ticket.Properties.ExpiresUtc.Value < DateTimeOffset.UtcNow))
      {
        return BadRequest("External login failure.");
      }

      ExternalLoginData externalData = ExternalLoginData.FromIdentity(ticket.Identity);

      if (externalData == null)
      {
        return BadRequest("The external login is already associated with an account.");
      }

      IdentityResult result = await UserManager.AddLoginAsync(User.Identity.GetUserId(),
          new UserLoginInfo(externalData.LoginProvider, externalData.ProviderKey));

      if (!result.Succeeded)
      {
        return GetErrorResult(result);
      }

      return Ok();
    }

    [Route("remove-login")]
    public async Task<IHttpActionResult> RemoveLogin(RemoveLoginModel model)
    {
      if (!ModelState.IsValid)
      {
        return BadRequest(ModelState);
      }

      IdentityResult result;

      if (model.LoginProvider == LocalLoginProvider)
      {
        result = await UserManager.RemovePasswordAsync(User.Identity.GetUserId());
      }
      else
      {
        result = await UserManager.RemoveLoginAsync(User.Identity.GetUserId(),
            new UserLoginInfo(model.LoginProvider, model.ProviderKey));
      }

      if (!result.Succeeded)
      {
        return GetErrorResult(result);
      }

      return Ok();
    }

    [AllowAnonymous]
    [HttpGet]
    [Route("local-access-token")]
    public async Task<IHttpActionResult> GetLocalAccessToken(string externalAccessToken)
    {
      if (string.IsNullOrWhiteSpace(externalAccessToken))
      {
        return BadRequest("Provider or external access token is not sent");
      }

      AuthenticationTicket ticket = AccessTokenFormat.Unprotect(externalAccessToken);

      if (ticket == null || ticket.Identity == null || (ticket.Properties != null
          && ticket.Properties.ExpiresUtc.HasValue
          && ticket.Properties.ExpiresUtc.Value < DateTimeOffset.UtcNow))
      {
        return BadRequest("External login failure.");
      }

      ExternalLoginData externalData = ExternalLoginData.FromIdentity(ticket.Identity);

      if (externalData == null)
      {
        return BadRequest("The external login is already associated with an account.");
      }

      User user = await UserManager.FindAsync(new UserLoginInfo(externalData.LoginProvider, externalData.ProviderKey));

      bool hasRegistered = user != null;

      if (!hasRegistered)
      {
        return BadRequest("External user is not registered");
      }

      var accessTokenResponse = GenerateLocalAccessTokenResponse(user);

      return Ok(accessTokenResponse);
    }

    #endregion

    #region Account

    [Route("me")]
    public async Task<IHttpActionResult> GetMe()
    {
      User user = await UserManager.FindByIdAsync(User.Identity.GetUserId());
      if (user == null)
      {
        return NotFound();
      }

      return Ok(new UserDto(user));
    }

    [Route("me")]
    public async Task<IHttpActionResult> PutMe(UserDto model)
    {
      User user = await UserManager.FindByIdAsync(User.Identity.GetUserId());
      if (user == null)
      {
        return NotFound();
      }

      user.Name = model.Name;
      user.Email = model.Email;
      user.UserName = model.Username;

      var result = await UserManager.UpdateAsync(user);
      if (!result.Succeeded)
        return GetErrorResult(result);

      return StatusCode(System.Net.HttpStatusCode.NoContent);
    }

    [AllowAnonymous]
    [Route("register")]
    public async Task<IHttpActionResult> Register(RegisterModel model)
    {
      if (!ModelState.IsValid)
      {
        return BadRequest(ModelState);
      }

      var user = new User() { UserName = model.Username, Email = model.Email };

      IdentityResult result = await UserManager.CreateAsync(user, model.Password);

      if (!result.Succeeded)
      {
        return GetErrorResult(result);
      }

      return Ok();
    }

    [HttpPut]
    [Route("deactivate")]
    public async Task<IHttpActionResult> Deactivate()
    {
      User user = await UserManager.FindByIdAsync(User.Identity.GetUserId());
      if (user == null)
      {
        return NotFound();
      }

      var result = await UserManager.UpdateUserStatus(user, UserStatus.Deactivated);
      if (!result.Succeeded)
      {
        return GetErrorResult(result);
      }

      return Ok();
    }

    [AllowAnonymous]
    [Route("forgot-password")]
    public async Task<IHttpActionResult> ForgotPassword(ForgotPasswordModel model)
    {
      if (!ModelState.IsValid)
      {
        return BadRequest(ModelState);
      }

      User user = await UserManager.FindByNameAsync(model.Username);
      if (user == null)
      {
        return NotFound();
      }

      var code = await UserManager.GeneratePasswordResetTokenAsync(user.Id);

      return Ok();
    }

    [Route("change-password")]
    public async Task<IHttpActionResult> ChangePassword(ChangePasswordModel model)
    {
      if (!ModelState.IsValid)
      {
        return BadRequest(ModelState);
      }

      IdentityResult result = await UserManager.ChangePasswordAsync(User.Identity.GetUserId(), model.OldPassword,
          model.NewPassword);

      if (!result.Succeeded)
      {
        return GetErrorResult(result);
      }

      return Ok();
    }

    [Route("set-password")]
    public async Task<IHttpActionResult> SetPassword(SetPasswordModel model)
    {
      if (!ModelState.IsValid)
      {
        return BadRequest(ModelState);
      }

      IdentityResult result = await UserManager.AddPasswordAsync(User.Identity.GetUserId(), model.NewPassword);

      if (!result.Succeeded)
      {
        return GetErrorResult(result);
      }

      return Ok();
    }

    #endregion

    #region Helpers

    private IAuthenticationManager Authentication
    {
      get { return Request.GetOwinContext().Authentication; }
    }

    private async Task<JObject> GenerateLocalAccessTokenResponse(User user)
    {
      var tokenExpiration = TimeSpan.FromDays(1);

      ClaimsIdentity identity = await user.GenerateUserIdentityAsync(UserManager, OAuthDefaults.AuthenticationType);

      var props = new AuthenticationProperties()
      {
        IssuedUtc = DateTime.UtcNow,
        ExpiresUtc = DateTime.UtcNow.Add(tokenExpiration),
      };

      var ticket = new AuthenticationTicket(identity, props);

      var accessToken = Startup.OAuthOptions.AccessTokenFormat.Protect(ticket);

      JObject tokenResponse = new JObject(
                                  new JProperty("username", user.UserName),
                                  new JProperty("access_token", accessToken),
                                  new JProperty("token_type", "bearer"),
                                  new JProperty("expires_in", tokenExpiration.TotalSeconds.ToString()),
                                  new JProperty(".issued", ticket.Properties.IssuedUtc.ToString()),
                                  new JProperty(".expires", ticket.Properties.ExpiresUtc.ToString())
                              );

      return tokenResponse;
    }

    private IHttpActionResult GetErrorResult(IdentityResult result)
    {
      if (result == null)
      {
        return InternalServerError();
      }

      if (!result.Succeeded)
      {
        if (result.Errors != null)
        {
          foreach (string error in result.Errors)
          {
            ModelState.AddModelError("", error);
          }
        }

        if (ModelState.IsValid)
        {
          // No ModelState errors are available to send, so just return an empty BadRequest.
          return BadRequest();
        }

        return BadRequest(ModelState);
      }

      return null;
    }

    private class ExternalLoginData
    {
      public string LoginProvider { get; set; }
      public string ProviderKey { get; set; }
      public string Username { get; set; }
      public string Name { get; set; }
      public string Email { get; set; }
      public string Token { get; set; }

      public IList<Claim> GetClaims()
      {
        var claims = new List<Claim>();
        claims.Add(new Claim(ClaimTypes.NameIdentifier, ProviderKey, null, LoginProvider));
        claims.Add(new Claim(ClaimTypes.Name, Name, null, LoginProvider));
        claims.Add(new Claim(ClaimTypes.Email, Email, null, LoginProvider));
        claims.Add(new Claim("FacebookAccessToken", Token, null, LoginProvider));

        if (Username != null)
        {
          //Facebook nolonger provides the users username
          claims.Add(new Claim("Username", Username, null, LoginProvider));
        }

        return claims;
      }

      //Identity recieved from Facebook login in the form of a Cookie set by Facebook
      public static ExternalLoginData FromIdentity(ClaimsIdentity identity)
      {
        if (identity == null)
        {
          return null;
        }

        Claim providerKeyClaim = identity.FindFirst(ClaimTypes.NameIdentifier);

        if (providerKeyClaim == null || String.IsNullOrEmpty(providerKeyClaim.Issuer)
            || String.IsNullOrEmpty(providerKeyClaim.Value))
        {
          return null;
        }

        if (providerKeyClaim.Issuer == ClaimsIdentity.DefaultIssuer)
        {
          return null;
        }

        return new ExternalLoginData
        {
          LoginProvider = providerKeyClaim.Issuer,
          ProviderKey = providerKeyClaim.Value,
          Username = identity.FindFirstValue("Username"),
          Name = identity.FindFirstValue(ClaimTypes.Name),
          Email = identity.FindFirstValue(ClaimTypes.Email),
          Token = identity.FindFirstValue("FacebookAccessToken")
        };
      }
    }

    private static class RandomOAuthStateGenerator
    {
      private static RandomNumberGenerator _random = new RNGCryptoServiceProvider();

      public static string Generate(int strengthInBits)
      {
        const int bitsPerByte = 8;

        if (strengthInBits % bitsPerByte != 0)
        {
          throw new ArgumentException("strengthInBits must be evenly divisible by 8.", "strengthInBits");
        }

        int strengthInBytes = strengthInBits / bitsPerByte;

        byte[] data = new byte[strengthInBytes];
        _random.GetBytes(data);
        return HttpServerUtility.UrlTokenEncode(data);
      }
    }

    protected override void Dispose(bool disposing)
    {
      if (disposing && _userManager != null)
      {
        _userManager.Dispose();
        _userManager = null;
      }

      base.Dispose(disposing);
    }

    #endregion
  }
}
