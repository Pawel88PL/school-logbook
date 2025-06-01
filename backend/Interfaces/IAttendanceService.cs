using backend.DTOs;
using backend.Models;

namespace backend.Interfaces.Services;

public interface IAttendanceService
{
    Task<PagedAttendance> GetAttendanceForStudentPaged(PagedRequest request, int studentId);
    Task<List<StudentForAttendanceDto>> GetStudentsForScheduleAsync(int scheduleId);
    Task<List<LessonForAttendanceDto>> GetTodayLessonsForTeacherAsync(int teacherId);
    Task SaveAttendanceAsync(int scheduleId, List<AttendanceCreateDto> attendanceList);
}
