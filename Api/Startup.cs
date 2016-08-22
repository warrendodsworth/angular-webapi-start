﻿using System;
using System.Collections.Generic;
using System.Linq;
using Hangfire;
using Microsoft.Owin;
using Owin;

[assembly: OwinStartup(typeof(Api.Startup))]

namespace Api
{
  public partial class Startup
  {
    public void Configuration(IAppBuilder app)
    {
      ConfigureAuth(app);
      GlobalConfiguration.Configuration.UseSqlServerStorage("Hangfire");
      app.UseHangfireDashboard();
    }
  }
}
