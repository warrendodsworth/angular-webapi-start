using Api.Models;
using System.Collections.Generic;
using System.Data.Entity;
using System.Net;
using System.Threading.Tasks;
using System.Web.Http;
using System.Linq;

namespace Api.Controllers
{
  [Authorize]
  [RoutePrefix("api/notes")]
  public class NotesController : ApiController
  {
    private AppContext db = new AppContext();

    // GET api/notes
    [AllowAnonymous]
    public async Task<IEnumerable<Note>> Get (string search = null)
    {
      var q = db.Notes.AsQueryable();

      if ( search != null )
      {
        q = q.Where(x => x.Text.Contains(search) || x.Title.Contains(search));
      }

      return await q.ToListAsync();
    }

    // GET api/notes/5
    public async Task<IHttpActionResult> Get (int id)
    {
      var note = await db.Notes.FindAsync(id);
      if ( note == null )
      {
        return NotFound();
      }

      return Ok(note);
    }

    // POST api/notes
    public async Task<IHttpActionResult> Post (Note note)
    {
      if ( !ModelState.IsValid )
      {
        return BadRequest(ModelState);
      }

      db.Notes.Add(note);
      await db.SaveChangesAsync();

      return Ok();
    }

    // PUT api/notes/5
    public async Task<IHttpActionResult> Put (int id, Note note)
    {
      if ( !ModelState.IsValid )
      {
        return BadRequest();
      }

      if ( id != note.Id )
      {
        return BadRequest();
      }

      db.Entry<Note>(note).State = EntityState.Modified;
      await db.SaveChangesAsync();

      return StatusCode(HttpStatusCode.NoContent);
    }

    // DELETE api/notes/5
    public async Task<IHttpActionResult> Delete (int id)
    {
      var note = await db.Notes.FindAsync(id);
      if ( note == null )
      {
        return NotFound();
      }

      db.Notes.Remove(note);
      await db.SaveChangesAsync();

      return Ok();
    }

    protected override void Dispose (bool disposing)
    {
      if ( disposing )
      {
        db.Dispose();
      }
      base.Dispose(disposing);
    }
  }
}
