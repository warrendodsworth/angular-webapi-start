﻿using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;

namespace Web.Models
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

    [Column(TypeName = "datetime2")]
    public DateTime CreateDate { get; set; }

    [Timestamp]
    public virtual byte[] RowVersion { get; set; }
  }
}