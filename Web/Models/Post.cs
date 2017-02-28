using System;
using System.ComponentModel.DataAnnotations;

namespace Web.Models
{
  public class Post : Entity
  {
    [Required(ErrorMessage = "Add your post")]
    public string Text { get; set; }

    [Required]
    [StringLength(128)]
    public string UserId { get; set; }

    public virtual User User { get; set; }
  }
}