using Azure.Core;
using Core.Interfaces;
using Core.Models.Account;
using Google.Apis.Auth;
using Microsoft.Extensions.Configuration;

namespace Core.Services
{
    public class GoogleAuthService(IConfiguration configuration) : IGoogleAuthService
    {
        public async Task<GoogleAccountModel> VerifyTokenAsync(string idToken)
        {
            GoogleJsonWebSignature.Payload payload;

            try
            {
                payload = await GoogleJsonWebSignature.ValidateAsync(
                    idToken,
                    new GoogleJsonWebSignature.ValidationSettings
                    {
                        Audience = new[] { configuration["GoogleAuth:ClientId"] }
                    });
            }
            catch
            {
                throw new UnauthorizedAccessException();
            }

            GoogleAccountModel model = new()
            {
                GoogleId = payload.Subject,
                Email = payload.Email,
                FirstName = payload.GivenName,
                LastName = payload.FamilyName,
                Picture = payload.Picture
            };

            return model;
        }
    }
}
