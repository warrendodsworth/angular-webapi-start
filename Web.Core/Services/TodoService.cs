using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using TodoApi.Models;

namespace Web.Services
{
  public interface ITodoService
  {
    void Add(TodoItem item);
    IEnumerable<TodoItem> GetAll();
    TodoItem Find(long key);
    void Remove(long key);
    void Update(TodoItem item);
  }

  public class TodoService : ITodoService
  {
    private readonly TodoContext _context;

    public TodoService(TodoContext context)
    {
      _context = context;
      Add(new TodoItem { Name = "Item todo, think about it" });
      Add(new TodoItem { Name = "Do it again" });
    }

    public IEnumerable<TodoItem> GetAll()
    {
      return _context.TodoItems.ToList();
    }

    public void Add(TodoItem item)
    {
      _context.TodoItems.Add(item);
      _context.SaveChanges();
    }

    public TodoItem Find(long key)
    {
      return _context.TodoItems.FirstOrDefault(t => t.Key == key);
    }

    public void Remove(long key)
    {
      var entity = _context.TodoItems.First(t => t.Key == key);
      _context.TodoItems.Remove(entity);
      _context.SaveChanges();
    }

    public void Update(TodoItem item)
    {
      _context.TodoItems.Update(item);
      _context.SaveChanges();
    }
  }
}
