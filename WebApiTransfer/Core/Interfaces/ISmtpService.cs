using Core.SMTP;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Core.Interfaces
{
    public interface ISmtpService
    {
        Task<bool> SendEmailAsync(EmailMessage message);
    }
}
