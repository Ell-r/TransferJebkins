using Core.Interfaces;
using Core.Models.Location.City;
using Core.Validators.City;
using Core.Validators.Country;
using Domain;
using Microsoft.AspNetCore.Mvc;

namespace WebApiTransfer.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CityController(ICityService cityService, AppDbTransferContext context) : ControllerBase
    {

        [HttpGet]

        public async Task<IActionResult> GetCities()
        {
            var list = await cityService.GetListAsync();
            return Ok(list);
        }

        [HttpPost("CreateCity")]

        public async Task<IActionResult> CreateCity([FromForm] CityCreateModel model)
        {
            var validator = new  CityCreateValidator(context);
            var validationResult = await validator.ValidateAsync(model);

            if (!validationResult.IsValid)
            {
                var errors = validationResult.Errors.Select(e => e.ErrorMessage).ToArray();
                return BadRequest(new { errors });
            }

            var item = await cityService.CreateAsync(model);
            return Ok(item);
        }

        [HttpGet("by-country/{countryId}")]

        public async Task<IActionResult> GetCitiesByCountry(int countryId)
        {
            var validator = new CityByCountryValidator(context);
            var validationResult = await validator.ValidateAsync(countryId);
            if (!validationResult.IsValid)
            {
                var errors = validationResult.Errors.Select(e => e.ErrorMessage).ToArray();
                return BadRequest(new { errors });
            }
            var list = await cityService.GetCitiesByCountryAsync(countryId);
            return Ok(list);
        }
    }
}
