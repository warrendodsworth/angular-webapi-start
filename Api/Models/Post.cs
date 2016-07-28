using System;
using System.ComponentModel.DataAnnotations;

namespace Api.Models
{
  public class Post
  {
    public int Id { get; set; }

    [Required(ErrorMessage = "Add your post")]
    public string Text { get; set; }

    public DateTime CreateDate { get; set; } = DateTime.UtcNow;

    [Timestamp]
    public byte[] RowVersion { get; set; }

    [Required]
    [StringLength(128)]
    public string UserId { get; set; }

    public virtual User User { get; set; }
  }
}