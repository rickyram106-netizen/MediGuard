
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MediGuardAPI.Models
{
    [Table("users_info")]
    public class User
    {
        [Key]
        [Column("user_id")]
        public int UserId { get; set; }

        [Column("full_name")]
        public string FullName { get; set; } = null!;

        [Column("phone_number")]
        public string PhoneNumber { get; set; } = null!;

        [Column("email")]
        public string Email { get; set; } = null!;

        [Column("password_hash")]
        public string PasswordHash { get; set; } = null!;

        [Column("profile_image")]
        public string? ProfileImage { get; set; }

        [Column("age_group")]
        public string? AgeGroup { get; set; }

        [Column("language")]
        public string Language { get; set; } = null!;

        [Column("is_verified")]
        public bool IsVerified { get; set; }

        [Column("created_at")]
        public DateTime CreatedAt { get; set; }

        [Column("updated_at")]
        public DateTime UpdatedAt { get; set; }
    }
}