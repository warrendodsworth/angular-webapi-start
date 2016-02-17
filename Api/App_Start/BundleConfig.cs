using System.Web;
using System.Web.Optimization;

namespace Api
{
  public class BundleConfig
  {
    // For more information on bundling, visit http://go.microsoft.com/fwlink/?LinkId=301862
    public static void RegisterBundles (BundleCollection bundles)
    {
      // Use the development version of Modernizr to develop with and learn from. Then, when you're
      // ready for production, use the build tool at http://modernizr.com to pick only the tests you need.
      // bundles.Add(new ScriptBundle("~/bundles/modernizr").Include(
      //             "~/Scripts/modernizr-*"));
    }
  }
}


//bundles.Add(new ScriptBundle("~/bundles/angular").Include(
//              "~/scripts/angular.js",
//              "~/scripts/angular-mocks.js",
//              "~/scripts/angular-route.js",

//              "~/lib/angular/angular-local-storage.min.js",

//              //Jq + bootstrap - to be replaced with UI bootstrap
//              "~/Scripts/jquery-{version}.js",
//              "~/Scripts/bootstrap.js",
//              "~/Scripts/respond.js"));

//bundles.Add(new StyleBundle("~/Content/css").Include(
//          "~/Content/bootstrap.css",
//          "~/Content/site.css"));

//"~/js/app.js",
//"~/js/home/IndexController.js",
//"~/js/account/LoginController.js",
//"~/js/account/RegisterController.js",
//"~/js/account/ExternalLoginController.js",
//"~/js/account/manage/ManageControllers.js",
//"~/js/account/AccountService.js",
//"~/js/account/AuthInterceptorService.js",
//"~/js/shared/NavbarController.js",