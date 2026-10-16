using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MediGuardAPI.Models
{
    [Table("otp_verification")]
    public class OtpVerification
    {
        [Key]
        [Column("otp_id")]
        public int OtpId { get; set; }

        [Column("user_id")]
        public int UserId { get; set; }

        [Column("otp_code")]
        public string OtpCode { get; set; } = string.Empty;

        [Column("expires_at")]
        public DateTime ExpiresAt { get; set; }

        [Column("is_verified")]
        public bool IsVerified { get; set; }
    }
}