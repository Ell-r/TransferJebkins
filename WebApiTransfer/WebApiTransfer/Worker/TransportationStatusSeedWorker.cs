using AutoMapper;
using Core.Models.TransportationStatus;
using Domain;
using Domain.Entities.Transportation;
using Microsoft.EntityFrameworkCore;

namespace WebApiTransfer.Worker
{
    public class TransportationStatusSeedWorker : BaseSeedWorker<TransportationStatusSeedModel, TransportationStatusEntity>
    {
        public TransportationStatusSeedWorker(IMapper mapper, AppDbTransferContext context) : base(mapper, context)
        {
        }
    }
}
