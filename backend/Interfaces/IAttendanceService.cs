using backend.DTOs;

namespace backend.Interfaces.Services;

public interface IAttendanceService
{
    Task<List<LessonForAttendanceDto>> GetTodayLessonsForTeacherAsync(int teacherId);
}
