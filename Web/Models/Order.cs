using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Web.Models
{
  public class Order : Entity
  {
    public decimal Amount { get; set; }

    public string UserId { get; set; }
    public User User { get; set; }
  }
}