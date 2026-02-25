using Core.Models.Location.Country;
using Domain;
using FluentValidation;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Core.Validators.Country
{
    public class CountryUpdateValidator : AbstractValidator<CountryUpdateModel>
    {
        public CountryUpdateValidator(AppDbTransferContext db)
        {
            RuleFor(x => x.Id)
                .NotEmpty().WithMessage("ID країни не може бути порожнім")
                .GreaterThan(0).WithMessage("ID країни має бути більшим за 0")
                .DependentRules(() =>
                {
                    RuleFor(x => x.Id)
                        .MustAsync(async (id, cancellation) =>
                            await db.Countries.AnyAsync(c => c.Id == id && !c.IsDeleted, cancellation))
                        .WithMessage("Країна не знайдена");
                });

            RuleFor(x => x.Name)
                .NotEmpty().WithMessage("Назва країни не може бути порожнім")
                .MaximumLength(10).WithMessage("Назва не може перевищувати 100 символів")
                .DependentRules(() =>
                {
                    RuleFor(x => x)
                     .MustAsync(async (model, cancellation) =>
                         !await db.Countries
                             .AnyAsync(c => c.Name.ToLower() == model.Name.ToLower().Trim() && c.Id != model.Id && !c.IsDeleted, cancellation))
                     .WithMessage("Країна з такою назвою вже існує");
                });

            RuleFor(x => x.Code)
                .NotEmpty().WithMessage("Код країни не може бути порожнім")
                .MaximumLength(10).WithMessage("Код країни не може перевищувати 10 символів")
                .DependentRules(() =>
                {
                    RuleFor(x => x)
                        .MustAsync(async (model, cancellation) =>
                            !await db.Countries.AnyAsync(c => c.Code.ToLower() == model.Code.ToLower().Trim() && c.Id != model.Id && !c.IsDeleted, cancellation))
                        .WithMessage("Країна з таким кодом вже існує");
                });


            RuleFor(x => x.Slug)
                .NotEmpty().WithMessage("Slug країни не може бути порожнім")
                .MaximumLength(100).WithMessage("Slug країни не може перевищувати 100 символів")
                .DependentRules(() =>
                {
                    RuleFor(x => x)
                        .MustAsync(async (model, cancellation) =>
                            !await db.Countries.AnyAsync(c => c.Slug.ToLower() == model.Slug.ToLower().Trim() && c.Id != model.Id && !c.IsDeleted, cancellation))
                        .WithMessage("Країна з таким slug вже існує");
                });

            RuleFor(x => x.Image)
                .NotEmpty().WithMessage("Файл зображення є обов'язковим");
        }
    }
}
