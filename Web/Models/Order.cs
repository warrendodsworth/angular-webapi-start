using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Web.Models
{
  //order
  public class Order : Entity
  {
    public decimal Amount { get; set; }

    public string UserId { get; set; }
    public User User { get; set; }
  }


  //order-item
  public abstract class OrderItem : Entity
  {
    public int Quantity { get; set; }
    public decimal Price { get; set; }

    public int OrderId { get; set; }
    public Order Order { get; set; }

    public int ProductId { get; set; }
    public Product Product { get; set; }
  }

  public class Ticket : OrderItem
  {
    public string Names { get; set; }
  }


  //product
  public abstract class Product : Entity
  {
    public string Name { get; set; }

    public IList<OrderItem> OrderItems { get; set; }
  }

  public class TicketType : Product
  {
    public int Sold { get; set; }
  }

  public class Ad : Product
  {
    public int Clicks { get; set; }
  }
}