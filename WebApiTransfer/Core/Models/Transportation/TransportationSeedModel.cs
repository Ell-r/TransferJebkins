using Domain.Entities.Location;
using Domain.Entities.Transportation;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Core.Models.Transportation
{
    public class TransportationSeedModel
    {
        public string Code { get; set; } = null!;

        public int FromCityId { get; set; }
        public int ToCityId { get; set; }
        public DateTime DepartureTime { get; set; } 
        public DateTime ArrivalTime { get; set; }
        public int SeatsTotal { get; set; }
        public int SeatsAvailable { get; set; }
        public int StatusId { get; set; }
    }
}
