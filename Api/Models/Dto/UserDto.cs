using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Api.Models
{
  public class UserDto
  {
    public string Name { get; set; }
    public string Username { get; set; }
    public string Email { get; set; }

    public UserDto (User user)
    {
      Name = user.Name;
      Username = user.UserName;
      Email = user.Email;
    }
  }
}