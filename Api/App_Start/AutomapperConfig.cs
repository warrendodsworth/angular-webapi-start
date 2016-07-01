using Api.Models;
using Api.Models.Bind;
using Api.Models.Dto;
using AutoMapper;

namespace Api
{
  public class AutomapperConfig
  {
    public AutomapperConfig()
    {
      Mapper.Initialize(c =>
      {
        c.AddProfile<NoteProfile>();
        c.AddProfile<UserProfile>();
      });
    }
  }

  public class NoteProfile : Profile
  {
    public NoteProfile()
    {
      CreateMap<Note, NoteDto>();
      CreateMap<NoteBindingModel, Note>();
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
