using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Core.SMTP
{
    public class EmailConfiguration
    {
        /// <summary>
        /// Хто відправляє листа
        /// </summary>
        public const string From = "sendercategoryapp@gmail.com";
        /// <summary>
        /// Адреса SMTP сервера
        /// </summary>
        public const string SmtpServer = "smtp.gmail.com";
        /// <summary>
        /// Порт на якому працює сервер
        /// </summary>
        public const int Port = 465;
        /// <summary>
        /// Імя користувача для авторизації
        /// </summary>
        public const string UserName = "sendercategoryapp@gmail.com";
        /// <summary>
        /// Пароль, який видав сервер
        /// </summary>
        public const string Password = "qpccvscplvmzvyxz";
    }
}
