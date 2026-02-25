using Core.Models.Account;
using Core.Models.Location.Country;
using Core.Models.User;
using Domain.Entities.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Core.Interfaces
{
    public interface IAccountService
    {
        Task<List<UserItemModel>> GetListAsync();
        Task<UserItemModel> CreateAsync(RegisterModel model);
    }
}
