using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Core.Models.Account
{
    public class RegisterModel
    {
        /// <summary>
        /// Ім'я користувача
        /// </summary>
        /// <example>Viktor</example>
        public string FirstName { get; set; } = null!;
        /// <summary>
        /// Прізвище користувача
        /// </summary>
        /// <example>Koval</example>
        public string LastName { get; set; } = null!;
        public IFormFile Image { get; set; } = null!;
        /// <summary>
        /// Електронна пошта користувача
        /// </summary>
        /// <example>admin@gmail.com</example>
        public string Email { get; set; } = null!;
        /// <summary>
        /// Пароль користувача
        /// </summary>
        public string Password { get; set; } = null!;
        /// <summary>
        /// Підтвердження пароля користувача
        /// </summary>
        public string RepeatPassword { get; set; } = null!;
    }
}
