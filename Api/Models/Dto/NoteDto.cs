using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Api.Models.Dto
{
  public class NoteDto
  {
    public int Id { get; set; }

    public string Title { get; set; }

    public string Text { get; set; }

    public UserDto User{ get; set; }
  }
}