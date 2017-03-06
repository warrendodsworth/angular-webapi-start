using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Web.Models
{
  public class UserDto : IValidatableObject
  {
    public string Name { get; set; }
    [JsonProperty("username")]
    public string UserName { get; set; }
    public string Email { get; set; }
    public string PhotoUrl { get; set; }

    public UserDto() { }

    public UserDto (User user)
    {
      Name = user.Name;
      UserName = user.UserName;
      Email = user.Email;
    }

    public User ToModel (User model)
    {
      model = model ?? new User();

      model.Name = Name;
      model.UserName = UserName;
      model.Email = Email;

      return model;
    }

    public IEnumerable<ValidationResult> Validate(ValidationContext validationContext)
    {
      throw new NotImplementedException();
    }
  }
}