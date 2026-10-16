using MediGuardAPI.Models;
using MediGuardAPI.Repositories.Interfaces;

namespace MediGuardAPI.Services
{
    public class MedicineService
    {
        private readonly IMedicineRepository _repository;

        public MedicineService(IMedicineRepository repository)
        {
            _repository = repository;
        }


        public async Task<IEnumerable<Medicine>> GetAllMedicinesAsync()
        {
            return await _repository.GetAllAsync();
        }


        public async Task<Medicine?> GetMedicineByIdAsync(int id)
        {
            return await _repository.GetByIdAsync(id);
        }


        public async Task<Medicine> CreateMedicineAsync(Medicine medicine)
        {
            return await _repository.AddAsync(medicine);
        }


        public async Task UpdateMedicineAsync(Medicine medicine)
        {
            await _repository.UpdateAsync(medicine);
        }


        public async Task DeleteMedicineAsync(Medicine medicine)
        {
            await _repository.DeleteAsync(medicine);
        }
    }
}