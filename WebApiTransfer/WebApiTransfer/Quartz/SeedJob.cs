using Core.Interfaces;
using Microsoft.Extensions.DependencyInjection;
using Quartz;
using Quartz.Impl.AdoJobStore.Common;
using WebApiTransfer.Worker;

namespace Core.Quartz
{
    public class SeedJob : IJob
    {

        private readonly IServiceProvider _seedService;

        public SeedJob(IServiceProvider seedService)
        {
            _seedService = seedService;
        }

        public async Task Execute(IJobExecutionContext context)
        {
            var file = context.MergedJobDataMap.GetString("file");

            using var scope = _seedService.CreateScope();

            ISeedWorker worker = file switch
            {
                "countries" => scope.ServiceProvider.GetRequiredService<CountrySeedWorker>(),
                "cities" => scope.ServiceProvider.GetRequiredService<CitySeedWorker>(),
                "users" => scope.ServiceProvider.GetRequiredService<UserSeedWorker>(),
                "transportations" => scope.ServiceProvider.GetRequiredService<TransportationSeedWorker>(),
                "transportationStatuses" => scope.ServiceProvider.GetRequiredService<TransportationStatusSeedWorker>(),
                _ => throw new Exception("Unknown seed type")
            };

            await worker.SeedAsync(file);
        }
    }
}
