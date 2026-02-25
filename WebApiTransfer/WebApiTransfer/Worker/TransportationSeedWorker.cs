using AutoMapper;
using Core.Models.Account;
using Core.Models.Transportation;
using Domain;
using Domain.Entities.Identity;
using Domain.Entities.Transportation;
using Microsoft.EntityFrameworkCore;

namespace WebApiTransfer.Worker
{
    public class TransportationSeedWorker : BaseSeedWorker<TransportationSeedModel, TransportationEntity>
    {
        public TransportationSeedWorker(IMapper mapper, AppDbTransferContext context) : base(mapper, context)
        {
        }
    }
}
