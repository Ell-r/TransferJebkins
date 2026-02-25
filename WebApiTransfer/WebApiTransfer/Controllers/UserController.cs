using AutoMapper;
using AutoMapper.QueryableExtensions;
using Core.Models.User;
using Domain;
using Domain.Entities.Identity;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace WebApiTransfer.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController(UserManager<UserEntity> userManager,
        IMapper mapper) : ControllerBase
    {
        [HttpGet]
        public async Task<IActionResult> GetUsers()
        {
            var list = await userManager.Users
                .ProjectTo<UserItemModel>(mapper.ConfigurationProvider)
                .ToListAsync();
            return Ok(list);
        }

        [HttpGet("get/{id}")]
        public async Task<IActionResult> GetById(string id)
        {
            var user = await userManager.FindByIdAsync(id);
            if (user == null)
                return NotFound("Такого користувача не знайдено");

            var model = mapper.Map<UserItemModel>(user);
            return Ok(model);
        }
    }
}
