using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Api.Models.Bind
{
  public class NoteBindingModel
  {
    public int Id { get; set; }

    public string Title { get; set; }

    public string Text { get; set; }

  }
}