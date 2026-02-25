using AutoMapper;
using Core.Interfaces;
using Core.Models.Account;
using Domain.Entities.Identity;
using Google.Apis.Auth;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using SixLabors.ImageSharp;

namespace WebApiTransfer.Controllers
{
    [ApiController]
    [Route("api/auth")]
    public class AuthController(UserManager<UserEntity> userManager, IJwtTokenService jwtTokenService, IGoogleAuthService googleAuthService, IMapper mapper) : ControllerBase
    {
        [HttpPost("GoogleLogin")]

        public async Task<IActionResult> GoogleLogin([FromBody] GoogleLoginRequest request)
        {
            var model = await googleAuthService.VerifyTokenAsync(request.IdToken);


            var user = await userManager.FindByEmailAsync(model.Email);
            if (user == null)
            {
                user = mapper.Map<UserEntity>(model);
                var result = await userManager.CreateAsync(user);
                if (!result.Succeeded)
                {
                    return BadRequest("Виникла помилка при реєструванні користувача");
                }
            }

            var token = await jwtTokenService.CreateAsync(user);

            return Ok(new { token });
        }
    }
}
