using Api.Models;
using Api.Models.Dto;
using AutoMapper;
using PagedList.EntityFramework;
using System.Linq;
using System.Threading.Tasks;
using System.Web.Http;
using System.Data.Entity;

namespace Api.Controllers
{
  [RoutePrefix("api")]
  public class HomeController : ApiController
  {
    private Db _db;

    public HomeController()
    {
      _db = new Db();
    }

    [Route("posts")]
    public async Task<PagedResult<PostDto>> Get(string search = null, int page = 1, int show = 10)
    {
      var q = _db.Posts.Include(n => n.User).AsQueryable();

      if (search != null)
        q = q.Where(x => x.Text.Contains(search));

      var res = await q.OrderByDescending(n => n.CreateDate).ToPagedListAsync(page, show);

      return new PagedResult<PostDto>
      {
        items = res.Select(x => Mapper.Map<PostDto>(x)),
        total = res.TotalItemCount
      };
    }

    [Route("posts/{id:int}")]
    public async Task<IHttpActionResult> Get(int id)
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
