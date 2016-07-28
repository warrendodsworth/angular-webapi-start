using System;
using System.Collections.Generic;
using System.ComponentModel;

namespace Api.Services.Helpers
{
  public static class EnumHelper
  {
    public static string GetDescription<T>(T value) where T : struct
    {
      var name = value.ToString();
      var field = typeof(T).GetField(name);
      var attr = (DescriptionAttribute[]) field.GetCustomAttributes(typeof(DescriptionAttribute), false);
      return attr.Length > 0 ? attr[0].Description : name;
    }

    public static string GetDescription<T>(string value) where T : struct
    {
      if (string.IsNullOrEmpty(value)) return value;
      try
      {
        return GetDescription(Parse<T>(value));
      }
      catch
      {
        return value;
      }
    }

    public static Dictionary<T, string> GetDescriptions<T>() where T : struct
    {
      var items = new Dictionary<T, string>();

      foreach (T e in Enum.GetValues(typeof(T)))
        items.Add(e, GetDescription(e));

      return items;
    }

    public static T Parse<T>(string name) where T : struct
    {
      return (T) Enum.Parse(typeof(T), name, true);
    }

    public static Dictionary<int, string> GetAsDictionary<TEnum>() where TEnum : struct
    {
      var enumerationType = typeof(TEnum);

      if (!enumerationType.IsEnum)
        throw new ArgumentException("Enum type missing");

      var dictionary = new Dictionary<int, string>();

      foreach (int value in Enum.GetValues(enumerationType))
      {
        var name = Enum.GetName(enumerationType, value);
        dictionary.Add(value, name);
      }

      return dictionary;
    }
  }
}



