namespace MediGuardAPI.DTOs
{
    public class MedicineRequest
    {
        public int UserId { get; set; }

        public string MedicineName { get; set; } = string.Empty;

        public string? GenericName { get; set; }

        public string? BrandName { get; set; }

        public string? Dosage { get; set; }

        public string? Unit { get; set; }

        public string? Frequency { get; set; }

        public bool BeforeFood { get; set; }

        public DateTime StartDate { get; set; }

        public DateTime? EndDate { get; set; }

        public string? Notes { get; set; }

        public bool IsActive { get; set; } = true;
    }
}