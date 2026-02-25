using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Entities.Transportation
{
    [Table("tblTransportationStatuses")]
    public class TransportationStatusEntity : BaseEntity<int>
    {
        [StringLength(255)]
        public string Name { get; set; } = string.Empty;
        public ICollection<TransportationEntity> Transportations { get; set; }
    }
}
