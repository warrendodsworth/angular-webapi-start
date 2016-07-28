using Api.Models;
using Api.Models.Bind;
using Api.Models.Dto;
using AutoMapper;

namespace Api
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
