using AutoMapper;
using Core.Models.Location.City;
using Domain;
using Domain.Entities.Location;

namespace WebApiTransfer.Worker
{
    public class CitySeedWorker : BaseSeedWorker<CitySeedModel, CityEntity>
    {
        public CitySeedWorker(IMapper mapper, AppDbTransferContext context) : base(mapper, context)
        {
        }
    }
}
