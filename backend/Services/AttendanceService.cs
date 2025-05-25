using backend.Data;
using backend.DTOs;
using backend.Interfaces.Services;
using Microsoft.EntityFrameworkCore;

namespace backend.Services;

public class AttendanceService : IAttendanceService
{
    private readonly AppDbContext _context;

    public AttendanceService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<List<LessonForAttendanceDto>> GetTodayLessonsForTeacherAsync(int teacherId)
    {
        var today = DateTime.Now.DayOfWeek;

        var lessons = await _context.Schedules
            .Include(s => s.Subject)
            .Include(s => s.Class)
            .Where(s => s.TeacherId == teacherId && s.DayOfWeek == today)
            .OrderBy(s => s.StartTime)
            .Select(s => new LessonForAttendanceDto
            {
                ScheduleId = s.Id,
                SubjectName = s.Subject.Name,
                ClassName = s.Class.Name,
                StartTime = s.StartTime
            })
            .ToListAsync();

        return lessons;
    }
}