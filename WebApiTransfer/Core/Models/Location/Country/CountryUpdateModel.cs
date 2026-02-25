using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Core.Models.Location.Country
{
    public class CountryUpdateModel
    {
        public int Id { get; set; }
        public string Name { get; set; } = null!;
        public string Code { get; set; } = null!;
        public string Slug { get; set; } = null!;
        public IFormFile? Image { get; set; } = null!;
    }
}
