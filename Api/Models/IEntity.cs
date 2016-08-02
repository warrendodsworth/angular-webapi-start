using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace Api.Models
{
  public interface IEntity
  {
    int Id { get; set; }
    DateTime CreateDate { get; set; }
    string CreateBy { get; set; }
    byte[] RowVersion { get; set; }
  }

  public class Entity : IEntity
  {
    public int Id { get; set; }

    public string CreateBy { get; set; }

    public DateTime CreateDate { get; set; }

    [Timestamp]
    public virtual byte[] RowVersion { get; set; }
  }
}