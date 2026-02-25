using Microsoft.Extensions.DependencyInjection;
using Quartz;
using Quartz.Spi;

namespace WebApiTransfer.Quartz
{
    public class JobFactory : IJobFactory
    {
        private readonly IServiceScopeFactory _serviceScopeFactory;

        public JobFactory(IServiceScopeFactory serviceScopeFactory)
        {
            this._serviceScopeFactory = serviceScopeFactory;
        }

        public IJob NewJob(TriggerFiredBundle bundle, IScheduler scheduler)
        {
            var scope = _serviceScopeFactory.CreateScope();
            var job = scope.ServiceProvider.GetRequiredService(bundle.JobDetail.JobType) as IJob;

            return job!;

        }

        public void ReturnJob(IJob job) 
        {
            if (job is IDisposable disposableJob)
            {
                disposableJob.Dispose();
            }
        }
    }
}
