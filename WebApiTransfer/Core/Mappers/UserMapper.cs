using AutoMapper;
using Core.Models.Account;
using Core.Models.User;
using Domain.Entities.Identity;

namespace Core.Mappers
{
    public class UserMapper : Profile
    {
        public UserMapper() 
        {
            CreateMap<RegisterModel, UserItemModel>()
                .ForMember(x => x.Image, opt => opt.Ignore());

            CreateMap<UserEntity, UserProfileModel>()
                .ForMember(x => x.FullName, opt => opt.MapFrom(x => $"{x.LastName} ${x.FirstName}"))
                .ForMember(x => x.Phone, opt => opt.MapFrom(x => $"${x.PhoneNumber}"));
        }
    }
}
