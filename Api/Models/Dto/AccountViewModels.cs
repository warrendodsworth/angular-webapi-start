using System.Collections.Generic;

namespace Web.Models
{
  public class ManageInfoDto
  {
    public string LocalLoginProvider { get; set; }

    public string Email { get; set; }

    public IEnumerable<UserLoginInfoDto> Logins { get; set; }

    public IEnumerable<ExternalLoginDto> ExternalLoginProviders { get; set; }
  }

  public class UserInfoDto
  {
    public string Name { get; set; }

    public string Username { get; set; }

    public string Email { get; set; }

    public bool HasRegistered { get; set; }

    public string LoginProvider { get; set; }
  }

  public class ExternalLoginDto
  {
    public string Name { get; set; }

    public string Url { get; set; }

    public string State { get; set; }
  }



  public class UserLoginInfoDto
  {
    public string LoginProvider { get; set; }

    public string ProviderKey { get; set; }
  }
}
