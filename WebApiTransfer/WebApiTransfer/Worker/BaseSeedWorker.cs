using AutoMapper;
using Core.Interfaces;
using Core.Models.Location.Country;
using Domain;
using Domain.Entities.Location;
using Microsoft.EntityFrameworkCore;
using System.Text.Json;

namespace WebApiTransfer.Worker
{
    public class BaseSeedWorker<TSeedModel, TEntity> : ISeedWorker 
        where TEntity : class
    {

        private readonly IMapper _mapper;
        private readonly AppDbTransferContext _context;

        public BaseSeedWorker(IMapper mapper, AppDbTransferContext context)
        {
            _mapper = mapper;
            _context = context;
        }

        public async Task SeedAsync(string helper)
        {
            var path = Path.Combine(Directory.GetCurrentDirectory(), "Helpers/JsonData", helper + ".json");

            if (!File.Exists(path))
                throw new Exception("Такого файлу не знайдено. Seed неможливий");

            var json = await File.ReadAllTextAsync(path);
            var models = JsonSerializer.Deserialize<List<TSeedModel>>(json);
            if(models == null || !models.Any())
            {
                throw new Exception("Моделі відсутні");
            }
            var entities = _mapper.Map<List<TEntity>>(models);
            if (!await _context.Set<TEntity>().AnyAsync())
            {
                await _context.Set<TEntity>().AddRangeAsync(entities);
                await _context.SaveChangesAsync();
            }
        }
    }
}
