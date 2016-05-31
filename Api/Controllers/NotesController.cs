using Api.Models;
using System.Data.Entity;
using System.Net;
using System.Threading.Tasks;
using System.Web.Http;
using System.Linq;
using Api.Models.Bind;
using PagedList.EntityFramework;
using Microsoft.AspNet.Identity;

namespace Api.Controllers
{
  [Authorize]
  [RoutePrefix("api/notes")]
  public class NotesController : ApiController
  {
    private Db _db = new Db();

    // GET api/notes
    [AllowAnonymous]
    public async Task<object> Get(string search = null, int page = 1, int show = 10)
    {
      var q = _db.Notes.Include(n => n.User).AsQueryable();

      if (search != null)
      {
        q = q.Where(x => x.Text.Contains(search) || x.Title.Contains(search));
      }

      var res = await q.OrderByDescending(n => n.Text).ToPagedListAsync(page, show);

      return new
      {
        items = res,
        total = res.TotalItemCount
      };
    }

    // GET api/notes/5
    [AllowAnonymous]
    public async Task<IHttpActionResult> Get(int id)
    {
      var note = await _db.Notes.FindAsync(id);
      if (note == null)
      {
        return NotFound();
      }

      return Ok(note);
    }

    // POST api/notes
    public async Task<IHttpActionResult> Post(Note note)
    {
      note.UserId = User.Identity.GetUserId();

      if (!ModelState.IsValid)
      {
        return BadRequest(ModelState);
      }

      _db.Notes.Add(note);
      await _db.SaveChangesAsync();

      return Ok();
    }

    // PUT api/notes/5
    public async Task<IHttpActionResult> Put(int id, NoteBindingModel note)
    {
      if (!ModelState.IsValid)
      {
        return BadRequest();
      }

      if (id != note.Id)
      {
        return BadRequest();
      }

      var oldNote = await _db.Notes.FindAsync(id);

      var m = Mapper.CreateMapper();
      m.Map(note, oldNote);

      _db.Entry(oldNote).State = EntityState.Modified;
      await _db.SaveChangesAsync();

      return StatusCode(HttpStatusCode.NoContent);
    }

    // DELETE api/notes/5
    public async Task<IHttpActionResult> Delete(int id)
    {
      var note = await _db.Notes.FindAsync(id);
      if (note == null)
      {
        return NotFound();
      }

      _db.Notes.Remove(note);
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
