using AutoMapper;
using Core.Models.TransportationStatus;
using Domain.Entities.Transportation;


namespace Core.Mappers
{
    public class TransportationStatusMapper : Profile
    {
        public TransportationStatusMapper()
        {
            CreateMap<TransportationStatusSeedModel, TransportationStatusEntity>();
        }
    }
}

