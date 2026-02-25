using AutoMapper;
using Core.Models.Location.City;
using Core.Models.Location.Country;
using Domain.Entities.Location;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Core.Mappers
{
    public class CityMapper : Profile
    {
        public CityMapper()
        {
            CreateMap<CityEntity, CityItemModel>()
                .ForMember(x => x.Country, opt => opt.MapFrom(x => x.Country.Name));

            CreateMap<CityCreateModel, CityEntity>()
                .ForMember(x => x.Image, opt => opt.Ignore());

            CreateMap<CitySeedModel, CityEntity>();
        }
    }
}
