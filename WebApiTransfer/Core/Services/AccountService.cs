using AutoMapper;
using AutoMapper.QueryableExtensions;
using Core.Interfaces;
using Core.Models.Account;
using Core.Models.Location.City;
using Core.Models.User;
using Domain;
using Domain.Entities.Identity;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace Core.Services
{
    public class AccountService(AppDbTransferContext context, IMapper mapper, IImageService imageService, UserManager<UserEntity> userManager) : IAccountService
    {
        public async Task<UserItemModel> CreateAsync(RegisterModel model)
        {
            var entity = mapper.Map<UserEntity>(model);
            if (model.Image != null)
            {
                entity.Image = await imageService.UploadImageAsync(model.Image);
            }

            var result = await userManager.CreateAsync(entity, model.Password);
           
            var user = mapper.Map<UserItemModel>(entity);
            return user;
        }

        public async Task<List<UserItemModel>> GetListAsync()
        {
            var list = await context.Users
                .ProjectTo<UserItemModel>(mapper.ConfigurationProvider)
                .ToListAsync();
            return list;
        }
    }
}
