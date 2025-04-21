using backend.Models.Entities;

namespace backend.Interfaces.Repositories;

public interface IAttendanceRepository
{
    Task AddAsync(Attendance attendance);
    Task<List<Attendance>> GetByStudentIdAsync(int studentId);
}
