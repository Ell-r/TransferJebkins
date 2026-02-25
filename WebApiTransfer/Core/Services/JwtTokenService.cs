using Core.Interfaces;
using Domain.Entities.Identity;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace Core.Services
{
    public class JwtTokenService(
        IConfiguration configuration,
        UserManager<UserEntity> userManager
        ) : IJwtTokenService
    {
        public async Task<string> CreateAsync(UserEntity user)
        {
            //Ключ для шифрування токена
            var key = configuration["Jwt:Key"];

            var claims = new List<Claim>
            {
                new Claim("email", user.Email ?? "noemail@gmail.com"),
                new Claim("name", $"{user.LastName} {user.LastName}"),
                new Claim("image", user.Image ?? "default.webp")
            };

            foreach (var role in await userManager.GetRolesAsync(user))
            {
                claims.Add(new Claim("roles", role));
            }             
            var keyBytes = System.Text.Encoding.UTF8.GetBytes(key);

            var symmetricSecurityKey = new SymmetricSecurityKey(keyBytes);

            var signingCredentials = new SigningCredentials(
                symmetricSecurityKey,
                SecurityAlgorithms.HmacSha256); 

            var jwtSecurityToken = new JwtSecurityToken(
                claims: claims, 
                expires: DateTime.UtcNow.AddDays(7), 
                signingCredentials: signingCredentials);

            string token = new JwtSecurityTokenHandler().WriteToken(jwtSecurityToken);

            return token;
        }
    }
}
