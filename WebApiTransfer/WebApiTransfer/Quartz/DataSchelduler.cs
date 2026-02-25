using Core.Interfaces;
using Core.Quartz;
using Quartz;
using Quartz.Impl;
using Quartz.Spi;

namespace WebApiTransfer.Quartz
{
    public static class DataSchelduler
    {
        public static async Task Start(IServiceProvider serviceProvider, string jobName, string file)
        {
            var job = JobBuilder.Create<SeedJob>()
                .WithIdentity(jobName)
                .UsingJobData("file", file)
                .Build();

            var trigger = TriggerBuilder.Create()
                .StartNow()
                .WithIdentity(jobName + "Trigger")
                .Build();

            var scheduler = await StdSchedulerFactory.GetDefaultScheduler();
            scheduler.JobFactory = serviceProvider.GetRequiredService<IJobFactory>();
            await scheduler.ScheduleJob(job, trigger);
            await scheduler.Start();
        }
    }
}