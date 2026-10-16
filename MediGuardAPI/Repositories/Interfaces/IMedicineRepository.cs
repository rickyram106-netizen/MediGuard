using MediGuardAPI.Models;

namespace MediGuardAPI.Repositories.Interfaces
{
    public interface IMedicineRepository
    {
        Task<IEnumerable<Medicine>> GetAllAsync();

        Task<Medicine?> GetByIdAsync(int id);

        Task<Medicine> AddAsync(Medicine medicine);

        Task UpdateAsync(Medicine medicine);

        Task DeleteAsync(Medicine medicine);
    }
}