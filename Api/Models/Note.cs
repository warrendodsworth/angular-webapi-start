using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Api.Models
{
  public class Note
  {
    public int Id { get; set; }

    public string Title { get; set; }

    public string Text { get; set; }


    public string UserId { get; set; }

    public virtual User User { get; set; }
  }
}