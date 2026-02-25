using Core.Models.Location.City;
using Domain;
using FluentValidation;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Core.Validators.City
{
    public class CityCreateValidator : AbstractValidator<CityCreateModel>
    {
        public CityCreateValidator(AppDbTransferContext db)
        {
            RuleFor(x => x.Name)
                .NotEmpty().WithMessage("Назва міста не може бути порожньою")
                .MaximumLength(100).WithMessage("Назва міста не може перевищувати 100 символів")
                .DependentRules(() =>
                {
                    RuleFor(x => x.Name)
                        .MustAsync(async (name, cancellation) =>
                            !await db.Cities.AnyAsync(c => c.Name.ToLower() == name.ToLower().Trim() && !c.IsDeleted, cancellation))
                        .WithMessage("Місто з такою назвою вже існує");
                });

            RuleFor(x => x.CountryId)
                .NotEmpty().WithMessage("Країна повинна бути вказана")
                .GreaterThan(0).WithMessage("ID країни має бути більшим за 0")
                .DependentRules(() =>
                {
                    RuleFor(x => x.CountryId)
                        .MustAsync(async (id, cancellation) =>
                            await db.Countries.AnyAsync(c => c.Id == id && !c.IsDeleted, cancellation))
                        .WithMessage("Дана країна не існує");
                });

            RuleFor(x => x.Slug)
                .NotEmpty().WithMessage("Slug країни не може бути порожнім")
                .MaximumLength(100).WithMessage("Slug країни не може перевищувати 100 символів")
                .MustAsync(async (slug, cancellation) =>
                !await db.Cities.AnyAsync(c =>
                    c.Slug.ToLower() == slug.ToLower().Trim() && !c.IsDeleted,
                    cancellation))
                .WithMessage("Місто з таким slug вже існує");

            RuleFor(x => x.Image)
                .NotEmpty().WithMessage("Файл зображення є обов'язковим");
        }
    }
}
