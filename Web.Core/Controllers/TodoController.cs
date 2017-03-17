using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using TodoApi.Models;
using Web.Services;

namespace Web.Controllers
{
  [Route("api/[controller]")]
  public class TodoController : Controller
  {
    private ITodoService _service;

    public TodoController(ITodoService service)
    {
      _service = service;
    }

    [HttpGet]
    public IEnumerable<TodoItem> GetAll()
    {
      return _service.GetAll();
    }

    [HttpGet("{id}", Name = "GetTodo")]
    public IActionResult GetById(long id)
    {
      var item = _service.Find(id);
      if (item == null) {
        return NotFound();
      }
      return new ObjectResult(item);
    }

    [HttpPost]
    public IActionResult Create([FromBody] TodoItem item)
    {
      if (item == null) {
        return BadRequest();
      }

      _service.Add(item);

      return CreatedAtRoute("GetTodo", new { id = item.Key }, item);
    }

    [HttpPut("{id}")]
    public IActionResult Update(long id, [FromBody] TodoItem item)
    {
      if (item == null || item.Key != id) {
        return BadRequest();
      }

      var todo = _service.Find(id);
      if (todo == null) {
        return NotFound();
      }

      todo.IsComplete = item.IsComplete;
      todo.Name = item.Name;

      _service.Update(todo);
      return new NoContentResult();
    }

    [HttpDelete("{id}")]
    public IActionResult Delete(long id)
    {
      var todo = _service.Find(id);
      if (todo == null) {
        return NotFound();
      }

      _service.Remove(id);
      return new NoContentResult();
    }
  }
}
