using MediGuardAPI.Data;
using MediGuardAPI.Models;
using MediGuardAPI.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace MediGuardAPI.Repositories
{
    public class MedicineRepository : IMedicineRepository
    {
        private readonly ApplicationDbContext _db;

        public MedicineRepository(ApplicationDbContext db)
        {
            _db = db;
        }


        public async Task<IEnumerable<Medicine>> GetAllAsync()
        {
            return await _db.Medicines
                .OrderByDescending(x => x.CreatedAt)
                .ToListAsync();
        }


        public async Task<Medicine?> GetByIdAsync(int id)
        {
            return await _db.Medicines
                .FirstOrDefaultAsync(x => x.MedicineId == id);
        }


        public async Task<Medicine> AddAsync(Medicine medicine)
        {
            await _db.Medicines.AddAsync(medicine);
            await _db.SaveChangesAsync();

            return medicine;
        }


        public async Task UpdateAsync(Medicine medicine)
        {
            _db.Medicines.Update(medicine);
            await _db.SaveChangesAsync();
        }


        public async Task DeleteAsync(Medicine medicine)
        {
            _db.Medicines.Remove(medicine);
            await _db.SaveChangesAsync();
        }
    }
}