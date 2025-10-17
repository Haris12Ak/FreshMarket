using DotNetEnv;
using Fresh.Model.Settings;
using Fresh.Services;
using Fresh.Services.Helper;
using Fresh.Services.Interfaces;
using Fresh.Services.Services;
using Fresh.Services.SignalR;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using System.Security.Claims;
using System.Text.Json;
using System.Text.Json.Serialization;

var builder = WebApplication.CreateBuilder(args);

Env.Load(Path.Combine(Directory.GetParent(Directory.GetCurrentDirectory())!.FullName, ".env"));

builder.Configuration.AddEnvironmentVariables();

builder.Services.Configure<RabbitMQSettings>(options =>
{
    options.RABBITMQ_HOST = Environment.GetEnvironmentVariable("RABBITMQ_HOST")!;
    options.RABBITMQ_USERNAME = Environment.GetEnvironmentVariable("RABBITMQ_USERNAME")!;
    options.RABBITMQ_PASSWORD = Environment.GetEnvironmentVariable("RABBITMQ_PASSWORD")!;
    options.RABBITMQ_VIRTUALHOST = Environment.GetEnvironmentVariable("RABBITMQ_VIRTUALHOST")!;
});

// Add services
builder.Services.AddScoped<ICompanyService, CompanyService>();
builder.Services.AddScoped<IClientService, ClientService>();
builder.Services.AddScoped<IProductService, ProductService>();
builder.Services.AddScoped<IProductTypeService, ProductTypeService>();
builder.Services.AddScoped<IAuthorizationService, AuthorizationService>();
builder.Services.AddScoped<IProductPriceService, ProductPriceService>();
builder.Services.AddScoped<IPurchaseService, PurchaseService>();
builder.Services.AddScoped<INotificationServcie, NotificationService>();
builder.Services.AddSingleton<IMessageProducer, MessageProducer>();
builder.Services.AddScoped<IDashboardService, DashboardService>();
builder.Services.AddScoped<IPdfReportService, PdfReportService>();

builder.Services.AddControllers()
    .AddJsonOptions(options =>
{
    options.JsonSerializerOptions.ReferenceHandler = System.Text.Json.Serialization.ReferenceHandler.IgnoreCycles;
    options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
});

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddHttpClient();
builder.Services.AddScoped<KeycloakAuthService>();
builder.Services.AddHttpContextAccessor();
builder.Services.AddScoped<ICurrentUserService, CurrentUserService>();
builder.Services.AddSignalR();

var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(connectionString));

// CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowOrigin", policy =>
        policy.WithOrigins("http://localhost:4200")
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials());
});

// Swagger + OAuth
builder.Services.AddSwaggerGen(o =>
{
    o.CustomSchemaIds(id => id.FullName!.Replace('+', '-'));

    o.AddSecurityDefinition("Keycloak", new OpenApiSecurityScheme
    {
        Type = SecuritySchemeType.OAuth2,
        Flows = new OpenApiOAuthFlows
        {
            Implicit = new OpenApiOAuthFlow
            {
                AuthorizationUrl = new Uri($"{builder.Configuration["Keycloak:HostBaseUrl"]}/realms/{builder.Configuration["Keycloak:Realm"]}/protocol/openid-connect/auth"),
                TokenUrl = new Uri($"{builder.Configuration["Keycloak:HostBaseUrl"]}/realms/{builder.Configuration["Keycloak:Realm"]}/protocol/openid-connect/token"),
                Scopes = new Dictionary<string, string>
                {
                    { "openid", "OpenID" },
                    { "profile", "Profile" }
                }
            }
        }
    });

    o.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference { Type = ReferenceType.SecurityScheme, Id = "Keycloak" },
                Scheme = "Bearer",
                Name = "Bearer",
                In = ParameterLocation.Header
            },
            new string[]{}
        }
    });
});

// Authentication
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.RequireHttpsMetadata = false; // Only for development
    options.SaveToken = true;

    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true, // optional, use if you have a fixed audience
        ValidAudiences = new[]
        {
            "angular-client",
            "api-client",
            "account"
        },
        ValidateLifetime = true,
        ClockSkew = TimeSpan.FromSeconds(30),
        ValidateIssuerSigningKey = true,

        // Dynamic key resolution from JWKS
        IssuerSigningKeyResolver = (token, securityToken, kid, parameters) =>
        {
            using var client = new HttpClient();
            // Use internal container URL to fetch JWKS
            var keyUri = $"{builder.Configuration["Keycloak:BaseUrl"]}/realms/{builder.Configuration["Keycloak:Realm"]}/protocol/openid-connect/certs";
            var response = client.GetAsync(keyUri).Result;
            var keys = new JsonWebKeySet(response.Content.ReadAsStringAsync().Result);
            return keys.GetSigningKeys();
        },

        // Accept both internal (container) and external (host) issuers
        IssuerValidator = (issuer, token, parameters) =>
        {
            var validIssuers = new[]
            {
                $"{builder.Configuration["Keycloak:HostBaseUrl"]}/realms/{builder.Configuration["Keycloak:Realm"]}",
                $"{builder.Configuration["Keycloak:BaseUrl"]}/realms/{builder.Configuration["Keycloak:Realm"]}"
            };
            if (validIssuers.Contains(issuer)) return issuer;
            throw new SecurityTokenInvalidIssuerException($"Invalid issuer: {issuer}");
        }
    };

    // Add roles from Keycloak token
    options.Events = new JwtBearerEvents
    {
        OnTokenValidated = context =>
        {
            var identity = context.Principal.Identity as ClaimsIdentity;
            if (identity == null) return Task.CompletedTask;

            var realmAccess = context.Principal.FindFirst("realm_access");
            if (realmAccess != null)
            {
                using var doc = JsonDocument.Parse(realmAccess.Value);
                if (doc.RootElement.TryGetProperty("roles", out var roles))
                {
                    foreach (var role in roles.EnumerateArray())
                    {
                        var roleName = role.GetString();
                        if (!string.IsNullOrWhiteSpace(roleName))
                            identity.AddClaim(new Claim(ClaimTypes.Role, roleName));
                    }
                }
            }

            return Task.CompletedTask;
        },

        OnAuthenticationFailed = context =>
        {
            Console.WriteLine("JWT Validation failed: " + context.Exception);
            return Task.CompletedTask;
        }
    };
});

builder.Services.AddAutoMapper(typeof(ICompanyService));
builder.Services.AddControllersWithViews();

var app = builder.Build();

// Swagger UI
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "Fresh API V1");
        c.OAuthClientId(builder.Configuration["Keycloak:ClientId"]);
        c.OAuthClientSecret(builder.Configuration["Keycloak:ClientSecret"]);
        c.OAuthUsePkce();
        c.OAuthAppName("Swagger API");
        c.OAuthScopes("openid", "profile");
        c.OAuth2RedirectUrl(builder.Configuration["Swagger:OAuth2RedirectUrl"]);
    });
}

app.UseHttpsRedirection();
app.UseCors("AllowOrigin");


app.UseAuthentication();
app.UseAuthorization();

// DB migration
using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
    context.Database.Migrate();

    await SeedData.InitializeAsync(scope.ServiceProvider);
}

app.MapControllers();

app.MapHub<NotificationHub>("/notificationHub");

app.Run();
