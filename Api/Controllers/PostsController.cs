using Api.Models;
using System.Data.Entity;
using System.Net;
using System.Threading.Tasks;
using System.Web.Http;
using System.Linq;
using Api.Models.Bind;
using PagedList.EntityFramework;
using Microsoft.AspNet.Identity;
using AutoMapper;
using Api.Models.Dto;

namespace Api.Controllers
{
  [Authorize]
  [RoutePrefix("api/posts")]
  public class PostsController : ApiController
  {
    private Db _db = new Db();

    // GET api/posts
    [AllowAnonymous]
    public async Task<object> Get(string search = null, int page = 1, int show = 10)
    {
      var q = _db.Posts.Include(n => n.User).AsQueryable();

      if (search != null)
      {
        q = q.Where(x => x.Text.Contains(search));
      }

      var res = await q.OrderByDescending(n => n.CreateDate).ToPagedListAsync(page, show);

      return new
      {
        items = res.Select(x => Mapper.Map<PostDto>(x)),
        total = res.TotalItemCount
      };
    }

    // GET api/posts/5
    [AllowAnonymous]
    public async Task<IHttpActionResult> Get(int id)
    {
      var post = await _db.Posts.FindAsync(id);
      if (post == null)
      {
        return NotFound();
      }

      return Ok(post);
    }

    // POST api/posts
    public async Task<IHttpActionResult> Post(PostBindingModel item)
    {
      item.UserId = User.Identity.GetUserId();

      if (!ModelState.IsValid)
      {
        return BadRequest(ModelState);
      }

      Post post = Mapper.Map<Post>(item);

      _db.Posts.Add(post);
      await _db.SaveChangesAsync();

      return Ok();
    }

    // PUT api/posts/5
    public async Task<IHttpActionResult> Put(int id, PostBindingModel item)
    {
      if (!ModelState.IsValid)
      {
        return BadRequest();
      }

      if (id != item.Id)
      {
        return BadRequest();
      }

      var post = await _db.Posts.FindAsync(id);

      Mapper.Map(item, post);

      _db.Entry(post).State = EntityState.Modified;
      await _db.SaveChangesAsync();

      return StatusCode(HttpStatusCode.NoContent);
    }

    // DELETE api/posts/5
    public async Task<IHttpActionResult> Delete(int id)
    {
      var note = await _db.Posts.FindAsync(id);
      if (note == null)
      {
        return NotFound();
      }

      _db.Posts.Remove(note);
      await _db.SaveChangesAsync();

      return Ok();
    }

    protected override void Dispose(bool disposing)
    {
      if (disposing)
      {
        _db.Dispose();
      }
      base.Dispose(disposing);
    }
  }
}
