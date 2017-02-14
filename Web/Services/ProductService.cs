using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Web.Models;

namespace Web.Services
{
  public class ProductService
  {
    public IAppDbContext Db;

    public ProductService(IAppDbContext db)
    {
      Db = db;
    }

    private IQueryable<TicketType> TicketTypes { get { return Db.Products.OfType<TicketType>(); } }

    public IQueryable<TicketType> GetTicketTypes()
    {
      return TicketTypes;
    }
  }
}