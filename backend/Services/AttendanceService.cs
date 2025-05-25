using backend.Data;
using backend.DTOs;
using backend.Interfaces.Services;
using backend.Models.Entities;
using Microsoft.EntityFrameworkCore;

namespace backend.Services;

public class AttendanceService : IAttendanceService
{
    private readonly AppDbContext _context;

    public AttendanceService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<List<StudentForAttendanceDto>> GetStudentsForScheduleAsync(int scheduleId)
    {
        // Znajdź harmonogram z klasą
        var schedule = await _context.Schedules
            .Include(s => s.Class)
            .FirstOrDefaultAsync(s => s.Id == scheduleId);

        if (schedule == null)
            throw new Exception("Nie znaleziono planu lekcji o podanym ID.");

        var today = DateTime.Today;

        // Pobierz uczniów przypisanych do klasy
        var students = await _context.Students
            .Where(s => s.ClassId == schedule.ClassId)
            .Select(s => new StudentForAttendanceDto
            {
                StudentId = s.Id,
                FullName = s.FirstName + " " + s.LastName,
                // Pobierz status obecności jeśli istnieje
                Status = _context.Attendances
                    .Where(a => a.ScheduleId == scheduleId && a.StudentId == s.Id && a.Date == today)
                    .Select(a => a.Status)
                    .FirstOrDefault()
            })
            .ToListAsync();

        return students;
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