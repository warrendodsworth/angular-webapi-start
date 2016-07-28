using System;

namespace Api.Models.Dto
{
  public class PostDto
  {
    public int Id { get; set; }
    public string Text { get; set; }
    public DateTime CreateDate { get; set; }
    public UserDto User{ get; set; }
  }
}