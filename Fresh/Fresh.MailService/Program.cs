using DotNetEnv;
using Fresh.MailService;
using Fresh.MailService.Interface;
using Fresh.MailService.Service;
using Fresh.Model.Settings;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllersWithViews();

Env.Load(Path.Combine(Directory.GetParent(Directory.GetCurrentDirectory())!.FullName, ".env"));

builder.Configuration.AddEnvironmentVariables();

builder.Services.Configure<SendGridSettings>(options =>
{
    options.ApiKey = Environment.GetEnvironmentVariable("SENDGRID_API_KEY")!;
    options.FromEmail = Environment.GetEnvironmentVariable("SENDGRID_FROM_EMAIL")!;
    options.FromName = Environment.GetEnvironmentVariable("SENDGRID_FROM_NAME")!;
});

builder.Services.Configure<RabbitMQSettings>(options =>
{
    options.RABBITMQ_HOST = Environment.GetEnvironmentVariable("RABBITMQ_HOST")!;
    options.RABBITMQ_USERNAME = Environment.GetEnvironmentVariable("RABBITMQ_USERNAME")!;
    options.RABBITMQ_PASSWORD = Environment.GetEnvironmentVariable("RABBITMQ_PASSWORD")!;
    options.RABBITMQ_VIRTUALHOST = Environment.GetEnvironmentVariable("RABBITMQ_VIRTUALHOST")!;
});

builder.Services.AddSingleton<IEmailService, EmailService>();

builder.Services.AddHostedService<BackgroundWorkerService>();

builder.Logging.ClearProviders();
builder.Logging.AddConsole();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Home/Error");
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseStaticFiles();

app.UseRouting();

app.UseAuthorization();

app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}");

app.Run();
