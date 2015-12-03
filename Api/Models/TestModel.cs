using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Api.Models
{
    public class TestModel
    {
        public int Id { get; set; }

        public bool Rehire { get; set; }

        public List<string> Result { get; set; }
    }
}