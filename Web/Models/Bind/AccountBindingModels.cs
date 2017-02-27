using System;
using System.ComponentModel.DataAnnotations;
using Newtonsoft.Json;

namespace Web.Models
{
  public class AddExternalLoginBindingModel
  {
    [Required]
    public string ExternalAccessToken { get; set; }
  }

  public class ChangePasswordModel
  {
    [Required]
    public string OldPassword { get; set; }

    [Required]
    [StringLength(100, ErrorMessage = "The {0} must be at least {2} characters long.", MinimumLength = 6)]
    public string NewPassword { get; set; }

    [DataType(DataType.Password)]
    [Compare("NewPassword", ErrorMessage = "The new password and confirmation password do not match.")]
    public string ConfirmPassword { get; set; }
  }

  public class RegisterModel
  {
    [Required]
    public string Username { get; set; }

    [Required]
    public string Email { get; set; }

    [Required]
    [StringLength(100, ErrorMessage = "The {0} must be at least {2} characters long.", MinimumLength = 6)]
    public string Password { get; set; }
  }

  public class RegisterExternalModel
  {
    [Required]
    public string Username { get; set; }

    [Required]
    public string Email { get; set; }
  }

  public class RemoveLoginModel
  {
    [Required]
    public string LoginProvider { get; set; }

    [Required]
    public string ProviderKey { get; set; }
  }

  public class SetPasswordModel
  {
    [Required]
    [StringLength(100, ErrorMessage = "The {0} must be at least {2} characters long.", MinimumLength = 6)]
    public string NewPassword { get; set; }

    [DataType(DataType.Password)]
    [Compare("NewPassword", ErrorMessage = "The new password and confirmation password do not match.")]
    public string ConfirmPassword { get; set; }
  }

  public class ForgotPasswordModel
  {
    [Required]
    [StringLength(100, ErrorMessage = "The {0} must be at least {2} characters long.", MinimumLength = 2)]
    public string Username { get; set; }
  }

}
