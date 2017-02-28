using Web.Models;
using System.Data.Entity;
using System.Net;
using System.Threading.Tasks;
using System.Web.Http;
using System.Linq;
using PagedList.EntityFramework;
using Microsoft.AspNet.Identity;
using AutoMapper;
using Web.Models.Dto;

namespace Web.Controllers
{
  [Authorize]
  [RoutePrefix("api/user/posts")]
  public class UserPostsController : ApiController
  {
    private IAppDbContext _db;

    public UserPostsController(IAppDbContext db)
    {
      _db = db;
    }

    [Route("")]
    public async Task<PagedResult<PostDto>> Get(string search = null, int page = 1, int show = 10)
    {
      var userId = User.Identity.GetUserId();
      var q = _db.Posts.Include(n => n.User)
                       .Where(x => x.UserId == userId).AsQueryable();

      if (search != null)
      {
        q = q.Where(x => x.Text.Contains(search));
      }

      var res = await q.OrderByDescending(n => n.CreateDate).ToPagedListAsync(page, show);

      return new PagedResult<PostDto>
      {
        Items = res.Select(x => Mapper.Map<PostDto>(x)),
        Total = res.TotalItemCount
      };
    }

    [Route("{id:int}", Name = "UserPost")]
    public async Task<IHttpActionResult> Get(int id)
    {
      var post = await _db.Posts.FindAsync(id);
      if (post == null)
      {
        return NotFound();
      }

      return Ok(post);
    }

    [Route("")]
    public async Task<IHttpActionResult> Post(PostDto dto)
    {
      if (!ModelState.IsValid)
      {
        return BadRequest(ModelState);
      }      

      var post = dto.ToModel();
      post.UserId = User.Identity.GetUserId();

      _db.Posts.Add(post);
      var created = 1 == await _db.SaveChangesAsync();
      if (created)
        return CreatedAtRoute("UserPost", new { id = post.Id }, Mapper.Map<PostDto>(post));

      return BadRequest(ModelState);
    }

    [Route("{id:int}")]
    public async Task<IHttpActionResult> Put(int id, PostDto model)
    {
      if (!ModelState.IsValid)
      {
        return BadRequest();
      }

      if (id != model.Id)
      {
        return BadRequest();
      }

      var post = await _db.Posts.FindAsync(id);

      Mapper.Map(model, post);

      _db.MarkAsModified(post);
      await _db.SaveChangesAsync();

      return StatusCode(HttpStatusCode.NoContent);
    }

    [Route("{id:int}")]
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
  }
}
