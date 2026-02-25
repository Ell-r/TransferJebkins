using AutoMapper;
using Core.Models.Account;
using Domain;
using Domain.Entities.Identity;
using Domain.Entities.Location;
using Microsoft.EntityFrameworkCore;

namespace WebApiTransfer.Worker
{
    public class UserSeedWorker : BaseSeedWorker<AccountSeedModel, UserEntity>
    {
        public UserSeedWorker(IMapper mapper, AppDbTransferContext context) : base(mapper, context)
        {
        }
    }
}
