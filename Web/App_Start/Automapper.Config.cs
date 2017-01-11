using Web.Models;
using Web.Models.Bind;
using Web.Models.Dto;
using AutoMapper;

namespace Web
{
  public class AutomapperConfig
  {
    public static void Init()
    {
      Mapper.Initialize(c =>
      {
        c.AddProfile<UserProfile>();
        c.AddProfile<PostProfile>();
      });
    }
  }

  public class PostProfile : Profile
  {
    public PostProfile()
    {
      CreateMap<Post, PostDto>();
      CreateMap<PostBindingModel, Post>();
    }
  }


  public class UserProfile : Profile
  {
    public UserProfile()
    {
      CreateMap<User, UserDto>();
    }
  }
}
