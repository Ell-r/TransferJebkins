using AutoMapper;
using AutoMapper.QueryableExtensions;
using Core.Interfaces;
using Core.Models.Account;
using Core.Models.Search;
using Core.Models.User;
using Core.SMTP;
using Domain;
using Domain.Entities.Identity;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Quartz.Util;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Mail;
using System.Text;
using System.Threading.Tasks;

namespace Core.Services
{
    public class UserService(IAuthService authService,
        AppDbTransferContext transferContext,
        IMapper mapper,
        UserManager<UserEntity> userManager,
        IConfiguration configuration,
        ISmtpService smtpService) : IUserService
    {
        public async Task<bool> ForgotPasswordAsync(ForgotPasswordModel model)
        {
            var user = await userManager.FindByEmailAsync(model.Email);
            Console.WriteLine(user.Email);

            if (user.Email.IsNullOrWhiteSpace())
            {
                return false;
            }

            string token = await userManager.GeneratePasswordResetTokenAsync(user);
            var resetLink = $"{configuration["ClientUrl"]}/reset-password?token={Uri.EscapeDataString(token)}&email={Uri.EscapeDataString(model.Email)}";

            var emailModel = new EmailMessage
            {
                To = model.Email,
                Subject = "Password Reset",
                Body = $"<p>Click the link below to reset your password:</p><a href='{resetLink}'>Reset Password</a>"
            };

            var result = await smtpService.SendEmailAsync(emailModel);

            return result;
        }

        public async Task<UserProfileModel> GetUserProfileAsync()
        {
            var userId = await authService.GetUserIdAsync();

            var profile = await transferContext.Users
                .ProjectTo<UserProfileModel>(mapper.ConfigurationProvider)
                .SingleOrDefaultAsync(u => u.Id == userId!);

            return profile!;
        }

        public async Task<bool> ResetPasswordAsync(ResetPasswordModel model)
        {
            var user = await userManager.FindByEmailAsync(model.Email);

            if (user != null)
            {
                var result = await userManager.ResetPasswordAsync(user, model.Token, model.NewPassword);
                if (!result.Succeeded)
                {
                    return false;
                }
            }
            else
                return false;

            return true;
        }

        public async Task<SearchResult<UserItemModel>> SearchAsync(UserSearchModel model)
        {
            var query = transferContext.Users.AsQueryable();
            if (!string.IsNullOrWhiteSpace(model.Name))
            {
                string nameFilter = model.Name.Trim().ToLower().Normalize();
                query = query.Where(u =>
                    (u.FirstName + " " + u.LastName).ToLower().Contains(nameFilter)
                    || u.FirstName.ToLower().Contains(nameFilter)
                    || u.LastName.ToLower().Contains(nameFilter));
            }

            if (model?.StartDate != null)
            {
                query = query.Where(u => u.DateCreated >= model.StartDate);
            }
            if (model?.EndDate != null)
            {
                query = query.Where(u => u.DateCreated <= model.EndDate);
            }
            var totalItems = await query.CountAsync();
            var safeItemsPerPage = model.ItemPerPAge < 1 ? 10 : model.ItemPerPAge;
            var totalPages = (int)Math.Ceiling((double)totalItems / safeItemsPerPage);
            var safePage = Math.Min(Math.Max(1, model.Page), Math.Max(1, totalPages));
            var users = await query
                .OrderBy(u => u.Id)
                .Skip((safePage - 1) * safeItemsPerPage) 
                .Take(safeItemsPerPage) 
                .ProjectTo<UserItemModel>(mapper.ConfigurationProvider)
                .ToListAsync();
            var result = new SearchResult<UserItemModel>
            {
                Items = users,
                Pagination = new PaginationModel
                {
                    TotalCount = totalItems,
                    TotalPages = totalPages,
                    ItemsPerPage = safeItemsPerPage,
                    CurrentPage = safePage
                }
            };
            return result;
        }
    }
}
