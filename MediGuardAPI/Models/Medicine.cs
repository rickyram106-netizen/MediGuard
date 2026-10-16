using System.ComponentModel.DataAnnotations;

namespace MediGuardAPI.Models;

public class Medicine
{
    [Key]
    public int MedicineId { get; set; }


    [Required]
    public int UserId { get; set; }


    [Required]
    [MaxLength(200)]
    public string MedicineName { get; set; } = string.Empty;


    [MaxLength(200)]
    public string? GenericName { get; set; }


    [MaxLength(200)]
    public string? BrandName { get; set; }


    [Required]
    [MaxLength(100)]
    public string Dosage { get; set; } = string.Empty;


    [MaxLength(50)]
    public string? Unit { get; set; }


    [Required]
    [MaxLength(100)]
    public string Frequency { get; set; } = string.Empty;


    public bool BeforeFood { get; set; }


    public DateTime StartDate { get; set; }


    public DateTime? EndDate { get; set; }


    public string? Notes { get; set; }


    public bool IsActive { get; set; } = true;


    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;


    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}