using Core.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using SixLabors.ImageSharp.Formats.Webp;
using SixLabors.ImageSharp;
using SixLabors.ImageSharp.Processing;

namespace Core.Services
{
    public class ImageService(IConfiguration configuration) : IImageService
    {
        public void DeleteImage(string fileName)
        {
            if (string.IsNullOrEmpty(fileName)) return;

            var dirImageName = configuration["DirImageName"] ?? "images";
            var filePath = Path.Combine(Directory.GetCurrentDirectory(), dirImageName, fileName);
            if (File.Exists(filePath))
            {
                File.Delete(filePath);
            }
        }

        public async Task<string> UploadImageAsync(IFormFile file)
        {
            try
            {
                using var memoryStream = new MemoryStream();
                await file.CopyToAsync(memoryStream);
                var fileName = Path.GetRandomFileName() + ".webp";
                var bytes = memoryStream.ToArray();
                using var image = Image.Load(bytes);
                image.Mutate(imgc =>
                {
                    imgc.Resize(new ResizeOptions
                    {
                        Size = new Size(600, 600),
                        Mode = ResizeMode.Max
                    });
                });
                var dirImageName = configuration["DirImageName"] ?? "images";
                var path = Path.Combine(Directory.GetCurrentDirectory(), dirImageName, fileName);
                await image.SaveAsync(path, new WebpEncoder());
                return fileName;
            }
            catch
            {
                return String.Empty;
            }
        }
    }
}
