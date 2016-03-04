using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNet.Mvc;
using Api.Models;
using Api.Services;

namespace Api.Controllers
{
  public class HomeController : Controller
  {
    private TripService service;

    public HomeController(TripService service)
    {
      this.service = service;
    }

    public IActionResult Index()
    {
      var trips = service.GetAllTrips();

      return View(trips);
    }

    public IActionResult About()
    {
      ViewData["Message"] = "Your application description page.";

      return View();
    }

    public IActionResult Contact()
    {
      ViewData["Message"] = "Your contact page.";

      return View();
    }

    public IActionResult Error()
    {
      return View();
    }
  }
}
