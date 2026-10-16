using System.Text;
using MediGuardAPI.Configuration;
using MediGuardAPI.Data;
using MediGuardAPI.Repositories;
using MediGuardAPI.Repositories.Interfaces;
using MediGuardAPI.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi;

var builder = WebApplication.CreateBuilder(args);

var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");

builder.Services.AddDbContextPool<ApplicationDbContext>(options =>
{
options.UseMySql(
connectionString,
new MySqlServerVersion(new Version(8, 0, 0)));
});

builder.Services.Configure<JwtSettings>(
builder.Configuration.GetSection("JwtSettings"));

var jwtSettings = builder.Configuration.GetSection("JwtSettings");

builder.Services
.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
.AddJwtBearer(options =>
{
options.RequireHttpsMetadata = false;
options.SaveToken = true;

    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,

        ValidIssuer = jwtSettings["Issuer"],
        ValidAudience = jwtSettings["Audience"],

        IssuerSigningKey = new SymmetricSecurityKey(
            Encoding.UTF8.GetBytes(jwtSettings["SecretKey"]!)),

        ClockSkew = TimeSpan.Zero
    };
});

builder.Services.AddAuthorization();

builder.Services.AddCors(options =>
{
options.AddPolicy("Frontend", policy =>
{
policy
.WithOrigins("http://localhost:3000")
.AllowAnyHeader()
.AllowAnyMethod();
});
});

builder.Services.AddScoped<JwtService>();

builder.Services.AddScoped<IMedicineRepository, MedicineRepository>();

builder.Services.AddScoped<MedicineService>();

builder.Services.AddControllers();

builder.Services.AddEndpointsApiExplorer();

builder.Services.AddSwaggerGen(options =>
{
options.AddSecurityDefinition("Bearer",
new OpenApiSecurityScheme
{
Name = "Authorization",
Description = "Enter JWT token like: Bearer {token}",
In = ParameterLocation.Header,
Type = SecuritySchemeType.Http,
Scheme = "bearer",
BearerFormat = "JWT"
});

options.AddSecurityRequirement(document =>
    new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecuritySchemeReference(
                "Bearer",
                document),
            new List<string>()
        }
    });

});

var app = builder.Build();

app.UseSwagger();

app.UseSwaggerUI();

app.UseHttpsRedirection();

app.UseCors("Frontend");

app.UseAuthentication();

app.UseAuthorization();

app.MapControllers();

app.MapGet("/health", async (ApplicationDbContext db) =>
{
return Results.Ok(new
{
status = await db.Database.CanConnectAsync()
? "healthy"
: "unhealthy"
});
});

app.Run();
