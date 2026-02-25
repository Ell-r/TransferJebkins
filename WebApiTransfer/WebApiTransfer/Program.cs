using Bogus;
using Core.Interfaces;
using Core.Models.Account;
using Core.Quartz;
using Core.Services;
using Core.SMTP;
using Domain;
using Domain.Entities.Identity;
using FluentValidation;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.FileProviders;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using Quartz;
using Quartz.Spi;
using System;
using System.Text;
using WebApiTransfer.Filters;
using WebApiTransfer.Quartz;
using WebApiTransfer.Worker;
using static Org.BouncyCastle.Crypto.Engines.SM2Engine;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDbContext<AppDbTransferContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddIdentity<UserEntity, RoleEntity>(options =>
{
    options.Password.RequireDigit = false;
    options.Password.RequireLowercase = false;
    options.Password.RequireUppercase = false;
    options.Password.RequiredLength = 6;
    options.Password.RequireNonAlphanumeric = false;
})
    .AddEntityFrameworkStores<AppDbTransferContext>()
    .AddDefaultTokenProviders();

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.RequireHttpsMetadata = false;
    options.SaveToken = true;
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = false,
        ValidateAudience = false,
        ValidateIssuerSigningKey = true,
        ValidateLifetime = true,
        ClockSkew = TimeSpan.Zero,
        IssuerSigningKey = new SymmetricSecurityKey(
            Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]))
    };
});

builder.Services.AddControllers();

builder.Services.AddAutoMapper(AppDomain.CurrentDomain.GetAssemblies());

builder.Services.AddScoped<ICountryService, CountryService>();
builder.Services.AddScoped<ICityService, CityService>();
builder.Services.AddScoped<IImageService, ImageService>();
builder.Services.AddSingleton<IJobFactory, JobFactory>();
builder.Services.AddSingleton<SeedJob>();


builder.Services.AddScoped<IJwtTokenService, JwtTokenService>();
builder.Services.AddScoped<IGoogleAuthService, GoogleAuthService>();
builder.Services.AddScoped<IAccountService, AccountService>();
builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<ISmtpService, SmtpService>();
builder.Services.AddScoped<ICartService, CartService>();
builder.Services.AddScoped<ITransportationService, TransportationService>();

builder.Services.AddScoped<CountrySeedWorker>();
builder.Services.AddScoped<CitySeedWorker>();
builder.Services.AddScoped<TransportationSeedWorker>();
builder.Services.AddScoped<TransportationStatusSeedWorker>();
builder.Services.AddScoped<UserSeedWorker>();



var assemblyName = typeof(GoogleAccountModel).Assembly.GetName().Name;

builder.Services.AddSwaggerGen(opt =>
{
    var fileDoc = $"{assemblyName}.xml";
    var filePath = Path.Combine(AppContext.BaseDirectory, fileDoc);
    opt.IncludeXmlComments(filePath);

    opt.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Description = "JWT Authorization header using the Bearer scheme.",
        Name = "Authorization",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.Http, //Передається по протоколу HTTP
        Scheme = "bearer"
    });

    opt.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type=ReferenceType.SecurityScheme,
                    Id="Bearer"
                }
            },
            new string[]{}
        }
    });
});

builder.Services.Configure<ApiBehaviorOptions>(options =>
{
    options.SuppressModelStateInvalidFilter = true;
});
builder.Services.AddValidatorsFromAssemblies(AppDomain.CurrentDomain.GetAssemblies());

builder.Services.AddMvc(options =>
{
    options.Filters.Add<ValidationFilter>();
});

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowTwoDomains", policy =>
    {
        policy.WithOrigins("http://localhost:5173",
            "http://mysimplesuperultrasitefont.somee.com",
            "http://3.123.20.53:3987",
            "http://3.123.20.53:5898")
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});

var app = builder.Build();


app.UseCors("AllowTwoDomains");

app.UseSwagger();
app.UseSwaggerUI();

app.UseAuthentication();
app.UseAuthorization();


app.MapControllers();

var dirImageName = builder.Configuration.GetValue<string>("DirImageName") ?? "images";

var path = Path.Combine(Directory.GetCurrentDirectory(), dirImageName);
Directory.CreateDirectory(dirImageName);

app.UseStaticFiles(new StaticFileOptions
{
    FileProvider = new PhysicalFileProvider(path),
    RequestPath = $"/{dirImageName}"
});

using (var scoped = app.Services.CreateScope())
{
    var myAppDbContext = scoped.ServiceProvider.GetRequiredService<AppDbTransferContext>();
    var roleManager = scoped.ServiceProvider.GetRequiredService<RoleManager<RoleEntity>>();
    myAppDbContext.Database.Migrate(); //якщо ми не робили міграціії

    var roles = new[] { "User", "Admin" };
    foreach (var role in roles)
    {
        if (!await roleManager.RoleExistsAsync(role))
        {
            await roleManager.CreateAsync(new RoleEntity { Name = role });
        }
    }

    if (!myAppDbContext.Countries.Any())
    {
        await DataSchelduler.Start(app.Services, "countries", "countries");
    }
    if (!myAppDbContext.Cities.Any())
    {
        await DataSchelduler.Start(app.Services, "cities", "cities");
    }
    if (!myAppDbContext.TransportationStatuses.Any())
    {
        await DataSchelduler.Start(app.Services, "transportationStatuses", "transportationStatuses");
    }
    if (!myAppDbContext.Transportations.Any())
    {
        await DataSchelduler.Start(app.Services, "transportations", "transportations");
    }

    if (myAppDbContext.Users.Any(u => u.UserRoles.Any(r => r.RoleId == 2)))
    {
        var adminUsers = await myAppDbContext.Users
            .Include(u => u.UserRoles)
            .Where(u => u.UserRoles.Any(r => r.RoleId == 2))
            .ToListAsync();
        var emailSenderService = scoped.ServiceProvider
       .GetRequiredService<ISmtpService>();

        foreach (var admin in adminUsers)
        {
            var message = new EmailMessage();
            message.Subject = "Server Started";
            message.Body = $"Сервер {builder.Configuration.GetSection("Server").GetValue<string>("SiteUrl")} успішно запущений";
            message.To = admin.Email;
            await emailSenderService.SendEmailAsync(message);
        }
    }

}

app.Run();
