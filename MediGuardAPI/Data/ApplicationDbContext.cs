using Microsoft.EntityFrameworkCore;
using MediGuardAPI.Models;

namespace MediGuardAPI.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        // ==========================
        // Authentication Tables
        // ==========================

        public DbSet<User> Users { get; set; } = null!;

        public DbSet<OtpVerification> OtpVerification { get; set; } = null!;

        public DbSet<UserSession> UserSessions { get; set; } = null!;


        // ==========================
        // Medicine Module
        // ==========================

        public DbSet<Medicine> Medicines { get; set; } = null!;
    }
}