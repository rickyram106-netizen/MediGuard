using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MediGuardAPI.Data;
using MediGuardAPI.Models;
using MediGuardAPI.DTOs;
using MediGuardAPI.Services;

namespace MediGuardAPI.Controllers
{
    [ApiController]
    [Route("api/auth")]
    public class AuthController : ControllerBase
    {
        private readonly ApplicationDbContext _db;
        private readonly JwtService _jwtService;

        public AuthController(
            ApplicationDbContext db,
            JwtService jwtService)
        {
            _db = db;
            _jwtService = jwtService;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register(RegisterRequest request)
        {
            var email = request.Email.Trim().ToLowerInvariant();

            var existingUser = await _db.Users
                .AsNoTracking()
                .FirstOrDefaultAsync(x => x.Email == email);

            if (existingUser != null)
            {
                return Conflict(new
                {
                    message = "Email already exists"
                });
            }

            var now = DateTime.UtcNow;

            var user = new User
            {
                FullName = request.FullName.Trim(),
                Email = email,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password),
                PhoneNumber = string.Empty,
                Language = "en",
                IsVerified = false,
                CreatedAt = now,
                UpdatedAt = now
            };

            _db.Users.Add(user);
            await _db.SaveChangesAsync();

            return Ok(new
            {
                message = "User registered successfully"
            });
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginRequest request)
        {
            var email = request.Email.Trim().ToLowerInvariant();

            var user = await _db.Users
                .FirstOrDefaultAsync(x => x.Email == email);

            if (user == null)
            {
                return Unauthorized(new
                {
                    message = "Invalid email or password"
                });
            }

            var isValid = BCrypt.Net.BCrypt.Verify(
                request.Password,
                user.PasswordHash);

            if (!isValid)
            {
                return Unauthorized(new
                {
                    message = "Invalid email or password"
                });
            }

            var token = _jwtService.GenerateToken(user);

            return Ok(new
            {
                message = "Login successful",
                accessToken = token,
                tokenType = "Bearer",
                expiresInMinutes = 60,
                user = new
                {
                    id = user.UserId,
                    fullName = user.FullName,
                    email = user.Email
                }
            });
        }
    }
}