using Core.Models.Location.City;
using Domain;
using Domain.Entities.Location;
using FluentValidation;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Core.Validators.City
{
    public class CityByCountryValidator : AbstractValidator<int>
    {
        public CityByCountryValidator(AppDbTransferContext db)
        {
            RuleFor(countryId => countryId)
                .NotEmpty().WithMessage("ID країни не може бути порожнім")
                .GreaterThan(0).WithMessage("ID країни має бути більшим за 0")
                .MustAsync(async (countryId, cancellation) =>
                    await db.Countries.AnyAsync(
                        c => c.Id == countryId && !c.IsDeleted,
                        cancellation))
                .WithMessage("Така країна не знайдена");
        }
    }
}
