using Api.Models;
using System.Collections.Generic;
using System.Web.Http;

namespace Api.Controllers.Admin
{
  [RoutePrefix("api/users")]
  public class AdminUsersController : ApiController
  {
    private Db _db;

    public AdminUsersController()
    {
      _db = new Db();
    }

    [Route("")]
    public IList<UserDto> GetUsers()
    {
      return null;
    }

  }
}
