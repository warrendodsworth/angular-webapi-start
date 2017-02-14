using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Web.Models;

namespace Web.Services
{
  public class OrderService
  {
    public IAppDbContext Db;

    public OrderService(IAppDbContext db)
    {
      Db = db;
    }

    public IQueryable<Ticket> Tickets { get { return Db.OrderItems.OfType<Ticket>(); } }

    public IQueryable<Ticket> GetOrderTickets(int orderId)
    {
      return Tickets.Where(t => t.OrderId == orderId);
    }
  }
}