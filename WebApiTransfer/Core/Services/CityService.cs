using AutoMapper;
using AutoMapper.QueryableExtensions;
using Core.Interfaces;
using Core.Models.Location.City;
using Domain;
using Domain.Entities.Location;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Core.Services
{
    public class CityService(AppDbTransferContext appDbContext,
    IImageService imageService,
    IMapper mapper) : ICityService
    {
        public async Task<CityItemModel> CreateAsync(CityCreateModel model)
        {
            var entity = mapper.Map<CityEntity>(model);
            if (model.Image != null)
            {
                entity.Image = await imageService.UploadImageAsync(model.Image);
            }
            await appDbContext.Cities.AddAsync(entity);
            await appDbContext.SaveChangesAsync();

            var city = await appDbContext.Cities
                .ProjectTo<CityItemModel>(mapper.ConfigurationProvider)
                .FirstOrDefaultAsync(c => c.Id == entity.Id);
            return city;
        }

        public async Task<List<CityItemModel>> GetCitiesByCountryAsync(int countryId)
        {
            var cities = await appDbContext.Cities
                .Where(c => c.CountryId == countryId)
                .Where(c => !c.IsDeleted)
                .ProjectTo<CityItemModel>(mapper.ConfigurationProvider)
                .ToListAsync();
            return cities;
        }

        public async Task<List<CityItemModel>> GetListAsync()
        {
            var list = await appDbContext.Cities
                .ProjectTo<CityItemModel>(mapper.ConfigurationProvider)
                .ToListAsync();
            return list;
        }
    }
}
