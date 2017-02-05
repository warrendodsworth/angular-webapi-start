using Microsoft.VisualStudio.TestTools.UnitTesting;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading.Tasks;

namespace Test.Labs
{
  [TestClass]
  public class HttpTest
  {
    private string Url = "http://api.local/";
    private HttpClient client;

    [TestInitialize]
    public void Init()
    {
      client = new HttpClient();

      client.BaseAddress = new Uri(Url);
      client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
    }

    [TestMethod]
    public async Task Http_Login()
    {
      var postData = new Dictionary<string, string>()
      {
        { "grant_type", "password" },
        { "username", "warren" },
        { "password", "daywalker" },
      };

      var response = await client.PostAsync("token", new FormUrlEncodedContent(postData));
      var content = await response.Content.ReadAsStringAsync();
      var token = JsonConvert.DeserializeObject<dynamic>(content);
      string access_token = token.access_token;

      Assert.AreEqual(response.StatusCode, System.Net.HttpStatusCode.OK);
      Assert.IsNotNull(access_token);
    }
  }


}
