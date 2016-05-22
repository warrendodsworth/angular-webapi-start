using System.ComponentModel.DataAnnotations;

namespace Api.Models
{
  public class Note
  {
    public int Id { get; set; }

    [Required(ErrorMessage = "Please add a title")]
    [StringLength(100)]
    public string Title { get; set; }

    [Required(ErrorMessage = "Please add your note")]
    public string Text { get; set; }


    public string UserId { get; set; }

    public virtual User User { get; set; }
  }
}