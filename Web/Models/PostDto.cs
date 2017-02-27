using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Web.Models.Dto
{
  public class PostDto : IValidatableObject
  {
    public int Id { get; set; }
    public string Text { get; set; }
    public DateTime CreateDate { get; set; }

    public string UserId { get; set; }
    public UserDto User { get; set; }

    public IEnumerable<ValidationResult> Validate(ValidationContext validationContext)
    {
      return null;
    }
  }
}