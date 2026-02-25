using Core.Models.Location.City;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Core.Interfaces
{
    public interface ICityService
    {
        Task<List<CityItemModel>> GetListAsync();

        Task<CityItemModel> CreateAsync(CityCreateModel model);

        Task<List<CityItemModel>> GetCitiesByCountryAsync(int countryId);
    }
}
