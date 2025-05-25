using backend.DTOs;

namespace backend.Interfaces.Services;

public interface IAttendanceService
{
    Task<List<StudentForAttendanceDto>> GetStudentsForScheduleAsync(int scheduleId);
    Task<List<LessonForAttendanceDto>> GetTodayLessonsForTeacherAsync(int teacherId);
}
