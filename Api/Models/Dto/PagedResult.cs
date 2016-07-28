using PagedList;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Api.Models.Dto
{
  public interface IPagedResult<out T>: IEnumerable<T>
  {
    T this[int index] { get; }
    int total { get; }
  }

  public class PagedResult<T> where T : class
  {
    public IEnumerable<T> items { get; set; }
    public int total { get; set; }

    public PagedResult()
    {
    }
  }
}