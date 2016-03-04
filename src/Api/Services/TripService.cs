using Api.Models;
using Microsoft.Data.Entity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Api.Services
{
  public class TripService
  {
    public AppDbContext db;
    public TripService(AppDbContext db)
    {
      this.db = db;
    }

    public IEnumerable<Trip> GetAllTrips()
    {
      return db.Trips.OrderBy(t => t.Name).ToList();
    }

    public IEnumerable<Trip> GetAllTripsWithStops()
    {
      return db.Trips.Include(t => t.Stops).OrderBy(t => t.Name).ToList();
    }

  }
}
