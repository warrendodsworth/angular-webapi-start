using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace Web.Models.Enums
{
  public enum USTimeZones
  {
	[Description("Alaskan Daylight Time")]
	AlaskanDaylightTime,
	AlaskanStandardTime,
	CentralDaylightTime,
	CentralStandardTime,
	EasternDaylightTime,
	EasternStandardTime,
	HawaiianStandardTime,
	MountainDaylightTime,
	MountainStandardTime,
	MountainTime,
	PacificDaylightTime,
	PacificStandardTime,
	USEasternStandardTime,
	USMountainStanardTime
  };
}