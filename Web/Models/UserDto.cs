using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Web.Models
{
  public class UserDto
  {
    public string Name { get; set; }
    [Required]
    public string Username { get; set; }
    [Required]
    public string Email { get; set; }
    public string PhotoUrl { get; set; }

    public UserDto() { }

    public UserDto(User user)
    {
      Name = user.Name;
      Username = user.UserName;
      Email = user.Email;
    }
  }
}