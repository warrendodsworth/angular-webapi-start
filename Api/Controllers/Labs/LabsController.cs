using Api.Models;
using Api.Models.Enums;
using Api.Services.Helpers;
using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Web.Http;

namespace Api.Controllers.Labs
{
  [RoutePrefix("api/labs")]
  public class LabsController : ApiController
  {
	[Route("")]
	public IHttpActionResult Get()
	{
	  var baseUrl = Request.RequestUri.GetLeftPart(UriPartial.Authority);

	  return Redirect(baseUrl + "/#/login");
	}

	[Route("users/status-list")]
	public IHttpActionResult GetUserStatusList()
	{
	  var enumVals = new List<object>();
	  foreach (var item in Enum.GetValues(typeof(UserStatus)))
	  {
		enumVals.Add(new { id = (int)item, name = item.ToString() });
	  }

	  return Ok(enumVals);
	}

	[Route("us-timezones")]
	public IHttpActionResult GetTimeZonesJson()
	{
	  var enumVals = new List<object>();

	  foreach (var item in Enum.GetValues(typeof(USTimeZones)))
	  {
		enumVals.Add(new { id = (int)item, name = EnumHelper.GetDescription<USTimeZones>(item.ToString()), value = item.ToString() });
	  }

	  return Ok(enumVals);
	}
  }
}