//using Microsoft.AspNet.Identity;
//using Api.Models;
//using System.Threading.Tasks;

//namespace Api
//{
//  // Configure the application user manager used in this application. UserManager is defined in ASP.NET Identity and is used by the application.
//  public class UserManager : UserManager<User>
//  {
//    //public UserManager()
//    //{
//    //}


//    //public static UserManager Create(IdentityFactoryOptions<UserManager> options, IOwinContext context)
//    //{
//    //  var manager = new UserManager(new UserStore<User>(context.Get<AppContext>()));
//    //  // Configure validation logic for usernames
//    //  manager.UserValidator = new UserValidator<User>(manager)
//    //  {
//    //    AllowOnlyAlphanumericUserNames = false,
//    //    RequireUniqueEmail = true
//    //  };
//    //  // Configure validation logic for passwords
//    //  manager.PasswordValidator = new PasswordValidator
//    //  {
//    //    RequiredLength = 6,
//    //    RequireNonLetterOrDigit = false,
//    //    RequireDigit = false,
//    //    RequireLowercase = false,
//    //    RequireUppercase = false,
//    //  };
//    //  var dataProtectionProvider = options.DataProtectionProvider;
//    //  if (dataProtectionProvider != null)
//    //  {
//    //    manager.UserTokenProvider = new DataProtectorTokenProvider<User>(dataProtectionProvider.Create("ASP.NET Identity"));
//    //  }
//    //  return manager;
//    //}

//    //public async Task<IdentityResult> UpdateUserStatus(User user, UserStatus status)
//    //{
//    //  user.Status = status;
//    //  return await UpdateAsync(user);
//    //}
//  }
//}
