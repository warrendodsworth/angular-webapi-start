using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Labs.Models
{
  public class Trip
  {
    public int Id { get; set; }
    public string Name { get; set; }
    public DateTime Created { get; set; }
    public string UserName { get; set; }

    public IList<Stop> Stops { get; set; }
  }

  public class Stop
  {
    public int Id { get; set; }
    public string Name { get; set; }
    public double Longitude { get; set; }
    public double Latitude { get; set; }
    public DateTime Arrival { get; set; }
  }
}
