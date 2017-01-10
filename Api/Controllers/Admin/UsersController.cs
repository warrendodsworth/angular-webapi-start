using Api.Models;
using Microsoft.AspNet.Identity.Owin;
using System.Collections.Generic;
using System.Net.Http;
using System.Web.Http;

namespace Api.Controllers.Admin
{
  [RoutePrefix("api/users")]
  public class AdminUsersController : ApiController
  {
    private IAppDbContext _db;
    private UserManager _userManager;

    public AdminUsersController(IAppDbContext db)
    {
      _db = db;
    }

    public UserManager UserManager
    {
      get
      {
        return _userManager ?? Request.GetOwinContext().GetUserManager<UserManager>();
      }
      private set
      {
        _userManager = value;
      }
    }

    [Route("")]
    public IList<UserDto> GetUsers()
    {
      return null;
    }
  }
}
