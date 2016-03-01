using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNet.Http;
using Microsoft.AspNet.Mvc;
using Microsoft.Data.Entity;
using Api.Models;

namespace Api.Controllers
{
  [Produces("application/json")]
  [Route("api/Trips")]
  public class TripsController : Controller
  {
    private AppDbContext _context;

    public TripsController(AppDbContext context)
    {
      _context = context;
    }

    // GET: api/Trips
    [HttpGet]
    public IEnumerable<Trip> GetTrips()
    {
      return _context.Trips;
    }

    // GET: api/Trips/5
    [HttpGet("{id}", Name = "GetTrip")]
    public async Task<IActionResult> GetTrip([FromRoute] int id)
    {
      if (!ModelState.IsValid)
      {
        return HttpBadRequest(ModelState);
      }

      Trip trip = await _context.Trips.SingleAsync(m => m.Id == id);

      if (trip == null)
      {
        return HttpNotFound();
      }

      return Ok(trip);
    }

    // PUT: api/Trips/5
    [HttpPut("{id}")]
    public async Task<IActionResult> PutTrip([FromRoute] int id, [FromBody] Trip trip)
    {
      if (!ModelState.IsValid)
      {
        return HttpBadRequest(ModelState);
      }

      if (id != trip.Id)
      {
        return HttpBadRequest();
      }

      _context.Entry(trip).State = EntityState.Modified;

      try
      {
        await _context.SaveChangesAsync();
      }
      catch (DbUpdateConcurrencyException)
      {
        if (!TripExists(id))
        {
          return HttpNotFound();
        }
        else
        {
          throw;
        }
      }

      return new HttpStatusCodeResult(StatusCodes.Status204NoContent);
    }

    // POST: api/Trips
    [HttpPost]
    public async Task<IActionResult> PostTrip([FromBody] Trip trip)
    {
      if (!ModelState.IsValid)
      {
        return HttpBadRequest(ModelState);
      }

      _context.Trips.Add(trip);
      try
      {
        await _context.SaveChangesAsync();
      }
      catch (DbUpdateException)
      {
        if (TripExists(trip.Id))
        {
          return new HttpStatusCodeResult(StatusCodes.Status409Conflict);
        }
        else
        {
          throw;
        }
      }

      return CreatedAtRoute("GetTrip", new { id = trip.Id }, trip);
    }

    // DELETE: api/Trips/5
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteTrip([FromRoute] int id)
    {
      if (!ModelState.IsValid)
      {
        return HttpBadRequest(ModelState);
      }

      Trip trip = await _context.Trips.SingleAsync(m => m.Id == id);
      if (trip == null)
      {
        return HttpNotFound();
      }

      _context.Trips.Remove(trip);
      await _context.SaveChangesAsync();

      return Ok(trip);
    }

    protected override void Dispose(bool disposing)
    {
      if (disposing)
      {
        _context.Dispose();
      }
      base.Dispose(disposing);
    }

    private bool TripExists(int id)
    {
      return _context.Trips.Count(e => e.Id == id) > 0;
    }
  }
}