using Core.Interfaces;
using Core.Models.Location.Country;
using Core.Validators.Country;
using Domain;
using FluentValidation;
using Microsoft.AspNetCore.Mvc;

namespace WebApiTransfer.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CountryController(ICountryService countryService,
        AppDbTransferContext context) : ControllerBase
    {
        [HttpGet]

        public async Task<IActionResult> GetCountries()
        {
            var list = await countryService.GetListAsync();
            return Ok(list); //Код 200
        }

        [HttpPost("CreateCountry")]

        public async Task<IActionResult> CreateCountry([FromForm] CountryCreateModel model)
        {
            var validator = new CountryCreateValidator(context);
            var validationResult = await validator.ValidateAsync(model);

            if (!validationResult.IsValid)
            {
                var errors = validationResult.Errors.Select(e => e.ErrorMessage).ToArray();
                return BadRequest(new { errors });
            }

            var item = await countryService.CreateAsync(model);
            return Ok(item);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteAsync(int id)
        {
            await countryService.DeleteAsync(id);
            return Ok();
        }

        [HttpPut("UpdateCountry")]
        public async Task<IActionResult> UpdateAsync([FromForm] CountryUpdateModel model)
        {
            var validator = new CountryUpdateValidator(context);
            var validationResult = await validator.ValidateAsync(model);

            if (!validationResult.IsValid)
            {
                var errors = validationResult.Errors.Select(e => e.ErrorMessage).ToArray();
                return BadRequest(new { errors });
            }

            var res = await countryService.UpdateAsync(model);
            return Ok(res);
        }
    }
}
