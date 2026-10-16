using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MediGuardAPI.Models
{
    [Table("user_sessions")]
    public class UserSession
    {
        [Key]
        [Column("session_id")]
        public int SessionId { get; set; }

        [Column("user_id")]
        public int UserId { get; set; }

        [Column("jwt_token")]
        public string? JwtToken { get; set; }

        [Column("device_name")]
        public string? DeviceName { get; set; }

        [Column("login_time")]
        public DateTime LoginTime { get; set; }

        [Column("expiry_time")]
        public DateTime? ExpiryTime { get; set; }
    }
}