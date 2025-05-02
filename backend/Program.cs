using System.Security.Authentication;
using System.Text;
using backend.Auth;
using backend.Data;
using backend.Interfaces;
using backend.Interfaces.Services;
using backend.Models.Entities;
using backend.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Serilog;

namespace backend
{
    public class Program
    {
        public static async Task Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            // Konfiguracja ustawień aplikacji
            ConfigureConfiguration(builder.Configuration);

            // Konfiguracja Serilog
            ConfigureLogging();

            try
            {
                // Rejestracja usług
                ConfigureServices(builder.Services, builder.Configuration);

                // Ustawienie domyślnego protokołu na HTTPS
                builder.WebHost.ConfigureKestrel(options =>
                {
                    options.ConfigureHttpsDefaults(httpsOptions =>
                    {
                        httpsOptions.SslProtocols = SslProtocols.Tls12 | SslProtocols.Tls13;
                    });
                });

                var app = builder.Build();

                // Middleware
                ConfigureMiddleware(app);

                Log.Information("Application is starting");

                // Uruchom aplikację
                await app.RunAsync();

            }
            catch (Exception ex)
            {
                Log.Fatal(ex, "Application startup failed: {Message}, {StackTrace}", ex.Message, ex.StackTrace);
                throw;
            }

            finally
            {
                Log.CloseAndFlush();
            }
        }

        private static void ConfigureConfiguration(IConfigurationBuilder configurationBuilder)
        {
            configurationBuilder
                .SetBasePath(Directory.GetCurrentDirectory())
                .AddJsonFile("appsettings.json", optional: false, reloadOnChange: true)
                .AddEnvironmentVariables();
        }

        private static void ConfigureLogging()
        {
            Log.Logger = new LoggerConfiguration()
                .MinimumLevel.Information()
                //.Filter.ByExcluding(logEvent => logEvent.MessageTemplate.Text.Contains("DbCommand"))
                .WriteTo.Console()
                .WriteTo.File("logs/log-.txt", rollingInterval: RollingInterval.Day)
                .CreateLogger();

        }

        private static void ConfigureServices(IServiceCollection services, IConfiguration configuration)
        {
            // Dodanie kontrolerów
            services.AddSerilog();
            services.AddControllers();
            services.AddEndpointsApiExplorer();
            services.AddSwaggerGen();
            services.AddSignalR();
            services.AddAutoMapper(AppDomain.CurrentDomain.GetAssemblies());


            ConfigureDatabase(services, configuration);
            ConfigureIdentity(services);
            ConfigureHttpClient(services);
            ConfigureCors(services);
            ConfigureAuthentication(services, configuration);
            RegisterServices(services);
        }

        private static void ConfigureDatabase(IServiceCollection services, IConfiguration configuration)
        {
            // Konfiguracja bazy danych
            services.AddDbContext<AppDbContext>(options =>
            {
                options.UseSqlServer(configuration.GetConnectionString("sigid_db"));
            });
        }

        private static void ConfigureIdentity(IServiceCollection services)
        {
            services.AddIdentity<User, IdentityRole>(options =>
            {
                // Ustawienia hasła
                options.Password.RequireDigit = false;
                options.Password.RequiredLength = 6;
                options.Password.RequireNonAlphanumeric = false;
                options.Password.RequireLowercase = false;
                options.Password.RequireUppercase = false;

                // Konfiguracja tokenów 2FA
                options.Tokens.AuthenticatorTokenProvider = TokenOptions.DefaultAuthenticatorProvider;

                // Ustawienia blokady konta, np. po zbyt wielu nieudanych próbach logowania
                options.Lockout.DefaultLockoutTimeSpan = TimeSpan.FromMinutes(5);
                options.Lockout.MaxFailedAccessAttempts = 5;
                options.Lockout.AllowedForNewUsers = true;

                // Opcje związane z użytkownikami
                options.User.RequireUniqueEmail = false;
            })
            .AddEntityFrameworkStores<AppDbContext>()
            .AddDefaultTokenProviders(); // Dodanie domyślnych providerów tokenów (np. dla 2FA)
        }

        private static void ConfigureHttpClient(IServiceCollection services)
        {
            // Dodanie HttpClient
            services.AddHttpClient();
            services.AddHttpContextAccessor();
        }

        private static void ConfigureCors(IServiceCollection services)
        {
            // Dodanie konfiguracji CORS
            services.AddCors(options =>
            {
                options.AddPolicy("AllowSpecificOrigin",
                    builder => builder.WithOrigins(
                        "http://localhost:4200")
                        .AllowAnyHeader()
                        .AllowAnyMethod()
                        .WithMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                        .AllowCredentials());
            });
        }

        private static void ConfigureAuthentication(IServiceCollection services, IConfiguration configuration)
        {
            var jwtKey = configuration["Jwt:Key"];
            if (string.IsNullOrEmpty(jwtKey))
            {
                throw new InvalidOperationException("JWT Key is not set in the configuration.");
            }

            var jwtIssuer = configuration["Jwt:Issuer"];
            if (string.IsNullOrEmpty(jwtIssuer))
            {
                throw new InvalidOperationException("JWT Issuer is not set in the configuration.");
            }

            var jwtAudience = configuration["Jwt:Audience"];
            if (string.IsNullOrEmpty(jwtAudience))
            {
                throw new InvalidOperationException("JWT Audience is not set in the configuration.");
            }

            services.AddAuthentication(options =>
            {
                options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            })
            .AddJwtBearer(options =>
            {
                options.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuer = true,
                    ValidateAudience = true,
                    ValidateLifetime = true,
                    ValidateIssuerSigningKey = true,
                    ValidIssuer = jwtIssuer,
                    ValidAudience = jwtAudience,
                    IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey))
                };
            });
        }

        // Dodanie serwisów
        private static void RegisterServices(IServiceCollection services)
        {
            services.AddScoped<IClassService, ClassService>();
            services.AddScoped<IStudentService, StudentService>();
            services.AddScoped<ITeacherService, TeacherService>();
            services.AddScoped<ITokenService, TokenService>();
            services.AddScoped<IUserService, UserService>();
        }

        private static void ConfigureMiddleware(WebApplication app)
        {
            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI();

                // Inicjalizacja ról odbywa się tylko raz podczas pierwszego uruchomienia aplikacji.
                // Aby zainicjalozować role, należy ustawić wartość "InitializeRoles" na true w pliku appsettings.json.
                var initializeRoles = app.Configuration.GetValue<bool>("Configuration:InitializeRoles");
                if (initializeRoles)
                {
                    using (var scope = app.Services.CreateScope())
                    {
                        var services = scope.ServiceProvider;
                        RoleInitializer.CreateRoles(services).Wait();
                    }
                }
            }

            app.UseHttpsRedirection();
            app.UseStaticFiles();

            app.UseRouting();

            app.UseCors("AllowSpecificOrigin");

            app.UseAuthentication();
            app.UseAuthorization();

            app.MapControllers();

            //app.MapHub<PatientHub>("/patientHub");
        }
    }
}