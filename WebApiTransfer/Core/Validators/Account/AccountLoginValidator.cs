using Core.Models.Account;
using Domain;
using Domain.Entities.Identity;
using FluentValidation;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Core.Validators.Account
{
    public class AccountLoginValidator : AbstractValidator<LoginModel>
    {
        public AccountLoginValidator(UserManager<UserEntity> userManager) 
        {
            RuleFor(x => x.Email)
               .NotEmpty().WithMessage("Пошта не може бути порожньою")
               .MaximumLength(100).WithMessage("Пошта не може перевищувати 100 символів");

            RuleFor(x => x.Password)
                .NotEmpty().WithMessage("Пароль не може бути порожнім")
                .MaximumLength(100).WithMessage("Пароль не може перевищувати 100 символів");

            RuleFor(x => new { x.Email, x.Password })
                .MustAsync(async (x, cancellation) =>
                {
                    var user = await userManager.FindByEmailAsync(x.Email);
                    if (user == null) return false;
                    return await userManager.CheckPasswordAsync(user, x.Password);
                })
                .WithMessage("Пароль або пошта не співпадають");
                }
    }
}
