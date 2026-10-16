using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MediGuardAPI.DTOs;
using MediGuardAPI.Models;
using MediGuardAPI.Services;
using System.Security.Claims;

namespace MediGuardAPI.Controllers
{
    [ApiController]
    [Route("api/medicine")]
    [Authorize]
    public class MedicineController : ControllerBase
    {
        private readonly MedicineService _medicineService;

        public MedicineController(MedicineService medicineService)
        {
            _medicineService = medicineService;
        }

        private bool TryGetCurrentUserId(out int userId)
        {
            var idClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            return int.TryParse(idClaim, out userId);
        }

        [HttpPost]
        public async Task<IActionResult> AddMedicine(MedicineRequest request)
        {
            if (!TryGetCurrentUserId(out var userId))
            {
                return Unauthorized(new { message = "Invalid or missing user identity." });
            }

            var medicine = new Medicine
            {
                UserId = userId,
                MedicineName = request.MedicineName ?? string.Empty,
                GenericName = request.GenericName,
                BrandName = request.BrandName,
                Dosage = request.Dosage ?? string.Empty,
                Unit = request.Unit,
                Frequency = request.Frequency ?? string.Empty,
                BeforeFood = request.BeforeFood,
                StartDate = request.StartDate,
                EndDate = request.EndDate,
                Notes = request.Notes,
                IsActive = request.IsActive,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            var result = await _medicineService.CreateMedicineAsync(medicine);

            return Ok(new
            {
                message = "Medicine added successfully",
                result
            });
        }

        [HttpGet]
        public async Task<IActionResult> GetAllMedicines()
        {
            var medicines = await _medicineService.GetAllMedicinesAsync();

            return Ok(medicines);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetMedicineById(int id)
        {
            var medicine = await _medicineService.GetMedicineByIdAsync(id);

            if (medicine == null)
            {
                return NotFound(new
                {
                    message = "Medicine not found"
                });
            }

            return Ok(medicine);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateMedicine(
            int id,
            MedicineRequest request)
        {
            var medicine = await _medicineService.GetMedicineByIdAsync(id);

            if (medicine == null)
            {
                return NotFound(new
                {
                    message = "Medicine not found"
                });
            }

            medicine.UserId = request.UserId;
            medicine.MedicineName = request.MedicineName ?? string.Empty;
            medicine.GenericName = request.GenericName;
            medicine.BrandName = request.BrandName;
            medicine.Dosage = request.Dosage ?? string.Empty;
            medicine.Unit = request.Unit;
            medicine.Frequency = request.Frequency ?? string.Empty;
            medicine.BeforeFood = request.BeforeFood;
            medicine.StartDate = request.StartDate;
            medicine.EndDate = request.EndDate;
            medicine.Notes = request.Notes;
            medicine.IsActive = request.IsActive;
            medicine.UpdatedAt = DateTime.UtcNow;

            await _medicineService.UpdateMedicineAsync(medicine);

            return Ok(new
            {
                message = "Medicine updated successfully",
                medicine
            });
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteMedicine(int id)
        {
            var medicine = await _medicineService.GetMedicineByIdAsync(id);

            if (medicine == null)
            {
                return NotFound(new
                {
                    message = "Medicine not found"
                });
            }

            await _medicineService.DeleteMedicineAsync(medicine);

            return Ok(new
            {
                message = "Medicine deleted successfully"
            });
        }
    }
}