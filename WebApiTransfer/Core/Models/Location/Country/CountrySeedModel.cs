using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Core.Models.Location.Country
{
    public class CountrySeedModel
    {
        public string Name { get; set; } = null!;
        public string Code { get; set; } = null!;
        public string Slug { get; set; } = null!;
        public string Image { get; set; } = null!;
    }
}
