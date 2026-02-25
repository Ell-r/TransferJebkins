using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Core.Models.Account
{
    public class LoginModel
    {
        /// <summary>
        /// Електронна пошта користувача
        /// </summary>
        /// <example>admin@gmail.com</example>
        public string Email { get; set; } = null!;

        /// <summary>
        /// Пароль користувача
        /// </summary>
        /// <example>Admin123</example>
        public string Password { get; set; } = null!;
    }
}
