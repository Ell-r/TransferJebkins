using AutoMapper;
using Core.Models.Location.Country;
using Domain;
using Domain.Entities.Location;

namespace WebApiTransfer.Worker
{
    public class CountrySeedWorker : BaseSeedWorker<CountrySeedModel, CountryEntity>
    {
        public CountrySeedWorker(IMapper mapper, AppDbTransferContext context) : base(mapper, context)
        {
        }
    }
}
