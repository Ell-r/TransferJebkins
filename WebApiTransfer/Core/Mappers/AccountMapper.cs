using AutoMapper;
using Core.Models.Account;
using Core.Models.User;
using Domain.Entities.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Core.Mappers
{
    public class AccountMapper : Profile
    {

        public AccountMapper()
        {
           CreateMap<GoogleAccountModel, UserEntity>()
                .ForMember(dest => dest.UserName, 
                opt => opt.MapFrom(src => src.Email))
                .ForMember(dest => dest.Email, 
                opt => opt.MapFrom(src => src.Email))
                .ForMember(dest => dest.FirstName, 
                opt => opt.MapFrom(src => src.FirstName))
                .ForMember(dest => dest.LastName, 
                opt => opt.MapFrom(src => src.LastName))
                .ForMember(dest => dest.Image, 
                opt => opt.MapFrom(src => src.Picture));

            CreateMap<RegisterModel, UserEntity>()
                .ForMember(x => x.Image, opt =>
                    opt.Ignore())
                .ForMember(x => x.UserName, opt =>
                    opt.MapFrom(x => x.Email));

            CreateMap<UserEntity, UserItemModel>()
            .ForMember(dest => dest.Roles,
                opt => opt.MapFrom(src => src.UserRoles.Select(ur => ur.Role.Name)));
        }
    }
}
