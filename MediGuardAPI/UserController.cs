using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MediGuardAPI.Data;

namespace MediGuardAPI.Controllers
{
    [ApiController]
    [Route("api/user")]
    public class UserController : ControllerBase
    {
        private readonly ApplicationDbContext _db;

        public UserController(ApplicationDbContext db)
        {
            _db = db;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllUsers()
        {
            return Ok(await _db.Users.ToListAsync());
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetUserById(int id)
        {
            var user = await _db.Users.FirstOrDefaultAsync(x => x.UserId == id);

            if (user == null)
                return NotFound(new { message = "User not found" });

            return Ok(user);
        }
    }
}