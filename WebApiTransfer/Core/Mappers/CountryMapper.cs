using AutoMapper;
using Core.Models.Location.Country;
using Domain.Entities.Location;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Core.Mappers
{
    public class CountryMapper : Profile
    {
        public CountryMapper()
        {
            CreateMap<CountryEntity, CountryItemModel>();
            CreateMap<CountrySeedModel, CountryEntity>();
            CreateMap<CountryCreateModel, CountryEntity>()
                .ForMember(x => x.Image, opt => opt.Ignore());

            CreateMap<CountryUpdateModel, CountryEntity>()
                .ForMember(x => x.Image, opt => opt.Ignore());
        }
    }
}
