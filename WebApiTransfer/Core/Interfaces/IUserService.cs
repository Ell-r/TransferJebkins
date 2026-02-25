using Core.Models.Account;
using Core.Models.Search;
using Core.Models.User;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Core.Interfaces
{
    public interface IUserService
    {
        Task<UserProfileModel> GetUserProfileAsync();
        public Task<bool> ForgotPasswordAsync(ForgotPasswordModel model);
        public Task<bool> ResetPasswordAsync(ResetPasswordModel model);
        public Task<SearchResult<UserItemModel>> SearchAsync(UserSearchModel model);
    }
}
