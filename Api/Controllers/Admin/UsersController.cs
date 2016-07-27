using Api.Models;
using System.Collections.Generic;
using System.Web.Http;

namespace Api.Controllers.Admin
{
  [RoutePrefix("api/users")]
  public class AdminUsersController : ApiController
  {
    private IDb _db;

    public AdminUsersController(IDb db)
    {
      _db = db;
    }

    [Route("")]
    public IList<UserDto> GetUsers()
    {
      return null;
    }
  }
}
