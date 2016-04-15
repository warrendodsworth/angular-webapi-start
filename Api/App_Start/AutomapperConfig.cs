using Api.Models;
using Api.Models.Bind;
using Api.Models.Dto;
using AutoMapper;

namespace Api
{
  public class Mapper
  {
    public static MapperConfiguration Config = new MapperConfiguration(cfg =>
    {
      //Notes
      cfg.CreateMap<Note, NoteDto>();
      cfg.CreateMap<NoteBindingModel, Note>();

      //Users
      cfg.CreateMap<User, UserDto>();
    });

    public static IMapper CreateMapper()
    {
      return Config.CreateMapper();
    }
  }
}
