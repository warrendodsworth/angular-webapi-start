using Api.Models;
using AutoMapper.QueryableExtensions;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace Api.Controllers.Admin
{
  //Working on automapper for user crud
  [RoutePrefix("api/users")]
  public class UsersController : ApiController
  {
    private Db db;

    public UsersController()
    {
      db = new Db();
    }

    //public IList<UserDto> GetUsers()
    //{
    //  //var builder = AutomapperConfig.Config.CreateExpressionBuilder();
    //  //var users = db.Users.ProjectTo<UserDto>(builder);
    //}
  }
}
