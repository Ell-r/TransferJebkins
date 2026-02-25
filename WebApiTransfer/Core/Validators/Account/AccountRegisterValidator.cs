using Core.Models.Account;
using Core.Models.Location.Country;
using Domain;
using FluentValidation;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Core.Validators.Account
{
    public class AccountRegisterValidator : AbstractValidator<RegisterModel>
    {
        public AccountRegisterValidator(AppDbTransferContext db) 
        {


            RuleFor(x => x.FirstName)
            .NotEmpty().WithMessage("Ім'я не може бути порожнім")
            .MaximumLength(100).WithMessage("Ім'я не може перевищувати 100 символів");

            RuleFor(x => x.LastName)
                .NotEmpty().WithMessage("Прізвище не може бути порожнім")
                .MaximumLength(10).WithMessage("Прізвище не може перевищувати 10 символів");

            RuleFor(x => x.Email)
                .NotEmpty().WithMessage("Пошта не може бути порожньою")
                .MaximumLength(100).WithMessage("Пошта не може перевищувати 100 символів")
                .DependentRules(() =>
                {
                    RuleFor(x => x)
                        .MustAsync(async (email, cancellation) =>
                            !await db.Users.AnyAsync(c => c.Email == email.Email, cancellation))
                        .WithMessage("Користувач з такою поштою вже зареєстрований");
                });

            RuleFor(x => x.Password)
                .NotEmpty().WithMessage("Пароль не може бути порожнім")
                .MaximumLength(100).WithMessage("Пароль не може перевищувати 100 символів");

            RuleFor(x => x.RepeatPassword)
               .NotEmpty().WithMessage("Підтвердження паролю не може бути порожнім")
               .MaximumLength(100).WithMessage("Підтвердження паролю не може перевищувати 100 символів")
               .Equal(x => x.Password).WithMessage("Паролі не співпадають");

            RuleFor(x => x.Image)
                .NotEmpty().WithMessage("Файл зображення є обов'язковим");
        }
    }
}
