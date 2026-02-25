using Core.Interfaces;
using Core.Models.Account;
using Core.Validators.Account;
using Domain;
using Domain.Entities.Identity;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System.Diagnostics;

namespace WebApiTransfer.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class AccountController(
        UserManager<UserEntity> userManager,
        IJwtTokenService jwtTokenService,
        IAccountService accountService,
        AppDbTransferContext context,
        IUserService userService) : ControllerBase
    {
        [HttpPost]
        public async Task<IActionResult> Login([FromBody] LoginModel model)
        {

            var validator = new AccountLoginValidator(userManager);
            var validationResult = await validator.ValidateAsync(model);

            if (!validationResult.IsValid)
            {
                var errors = validationResult.Errors.Select(e => e.ErrorMessage).ToArray();
                return BadRequest(new { errors });
            }

            var user = await userManager.FindByEmailAsync(model.Email);

            var token = await jwtTokenService.CreateAsync(user);
            return Ok(new { token });
        }

        [HttpPost]
        public async Task<IActionResult> Register([FromForm] RegisterModel model)
        {
            if(model == null)
                return BadRequest("Виникли помилки при реєстрації");

            var validator = new AccountRegisterValidator(context);
            var validationResult = await validator.ValidateAsync(model);

            if (!validationResult.IsValid)
            {
                var errors = validationResult.Errors.Select(e => e.ErrorMessage).ToArray();
                return BadRequest(new { errors });
            }

            var item = await accountService.CreateAsync(model);

            return Ok(item);
        }

        [HttpGet]
        [Authorize]

        public async Task<IActionResult> GetProfile()
        {
            var model = await userService.GetUserProfileAsync();
            return Ok(model);
        }

        [HttpPost]
        public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordModel model)
        {
            bool res = await userService.ForgotPasswordAsync(model);
            if (res)
                return Ok();
            else
                return BadRequest(new
                {
                    Status = 400,
                    IsValid = false,
                    Errors = new { Email = "Користувача з такою поштою не існує" }
                });
        }

        [HttpPost]
        public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordModel model)
        {
            var isTry = await userService.ResetPasswordAsync(model);
            if (!isTry)
            {
                return BadRequest(new
                {
                    Status = 400,
                    IsValid = false,
                    Errors = new { Email = "Невірні дані для відновлення паролю" }
                });
            }
            return Ok();
        }

        [HttpGet]
        public async Task<IActionResult> Search([FromQuery] UserSearchModel model)
        {
            Stopwatch stopwatch = new Stopwatch();
            stopwatch.Start();

            var result = await userService.SearchAsync(model);

            stopwatch.Stop();

            TimeSpan ts = stopwatch.Elapsed;

            string elapsedTime = String.Format("{0:00}:{1:00}:{2:00}.{3:00}",
                ts.Hours, ts.Minutes, ts.Seconds,
                ts.Milliseconds / 10);
            Console.WriteLine("-----------Elapsed Time------------: " + elapsedTime);
            return Ok(result);
        }

    }
}
