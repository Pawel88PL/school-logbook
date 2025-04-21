using backend.DTOs;

namespace backend.Interfaces.Services;

public interface IAttendanceService
{
    Task AddAttendanceAsync(AttendanceDto dto);
    Task<List<AttendanceDto>> GetAttendanceForStudentAsync(int studentId);
}
