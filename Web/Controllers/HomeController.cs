using Web.Models;
using Web.Models.Dto;
using AutoMapper;
using PagedList.EntityFramework;
using System.Linq;
using System.Threading.Tasks;
using System.Web.Http;
using System.Data.Entity;

namespace Web.Controllers
{
  [RoutePrefix("api")]
  public class HomeController : ApiController
  {
    private IAppDbContext _db;

    public HomeController(IAppDbContext db)
    {
      _db = db;
    }

    [Route("posts")]
    public async Task<PagedResult<PostDto>> GetPosts(string search = null, int page = 1, int show = 10)
    {
      var q = _db.Posts.Include(n => n.User).AsQueryable();

      if (search != null)
        q = q.Where(x => x.Text.Contains(search));

      var res = await q.OrderByDescending(n => n.CreateDate).ToPagedListAsync(page, show);

      return new PagedResult<PostDto>
      {
        Items = res.Select(x => Mapper.Map<PostDto>(x)),
        Total = res.TotalItemCount
      };
    }

    [Route("posts/{id:int}")]
    public async Task<IHttpActionResult> GetPost(int id)
    {
      var post = await _db.Posts.FindAsync(id);
      if (post == null)
      {
        return NotFound();
      }

      return Ok(post);
    }

  }
}
