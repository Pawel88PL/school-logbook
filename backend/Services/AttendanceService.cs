using backend.Data;
using backend.DTOs;
using backend.Interfaces.Services;
using backend.Models;
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

    public async Task<PagedAttendance> GetAttendanceForStudentPaged(PagedRequest request, int studentId)
    {
        var query = _context.Attendances
            .AsNoTracking()
            .Where(a => a.StudentId == studentId)
            .Include(a => a.Schedule).ThenInclude(l => l.Subject)
            .Include(a => a.Schedule).ThenInclude(l => l.Teacher)
            .Select(a => new AttendancePreviewDto
            {
                Date = a.Date,
                SubjectName = a.Schedule.Subject.Name,
                TeacherName = a.Schedule.Teacher.FirstName + " " + a.Schedule.Teacher.LastName,
                Status = a.Status
            });

        if (!string.IsNullOrEmpty(request.SearchQuery))
        {
            query = query.Where(c => c.SubjectName!.Contains(request.SearchQuery));
        }

        // Dynamiczne sortowanie
        if (!string.IsNullOrEmpty(request.SortColumn))
        {
            query = request.SortColumn switch
            {
                "teacherName" => request.SortDirection == "desc"
                    ? query.OrderByDescending(c => c.TeacherName)
                    : query.OrderBy(c => c.TeacherName),

                "subjectName" => request.SortDirection == "desc"
                    ? query.OrderByDescending(c => c.SubjectName)
                    : query.OrderBy(c => c.SubjectName),

                "status" => request.SortDirection == "desc"
                    ? query.OrderByDescending(c => c.Status)
                    : query.OrderBy(c => c.Status),

                "date" => request.SortDirection == "desc"
                    ? query.OrderByDescending(c => c.Date)
                    : query.OrderBy(c => c.Date),

                _ => throw new ArgumentException($"Nieprawidłowa kolumna sortowania: {request.SortColumn}")
            };
        }
        else
        {
            query = query.OrderBy(c => c.Date);
        }

        int totalRecords = await query.CountAsync();

        var result = await query
            .Skip((request.PageNumber - 1) * request.PageSize)
            .Take(request.PageSize)
            .ToListAsync();

        var attendance = result.Select(g => new AttendancePreviewDto
        {
            TeacherName = g.TeacherName,
            SubjectName = g.SubjectName,
            Status = g.Status,
            Date = g.Date
        }).ToList();

        return new PagedAttendance
        {
            TotalRecords = totalRecords,
            Data = attendance
        };
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
                    .Where(a => a.ScheduleId == scheduleId && a.StudentId == s.Id && a.Date.Date == today)
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
                StartTime = s.StartTime.ToString(@"hh\:mm"),
                HasAttendance = _context.Attendances
                    .Any(a => a.ScheduleId == s.Id && a.Date.Date == DateTime.Today)
            })
            .ToListAsync();

        return lessons;
    }

    public async Task SaveAttendanceAsync(int scheduleId, List<AttendanceCreateDto> attendanceList)
    {
        if (!attendanceList.Any())
            throw new ArgumentException("Lista obecności jest pusta");

        var today = DateOnly.FromDateTime(DateTime.Today);

        var existingAttendances = await _context.Attendances
            .Where(a => a.ScheduleId == scheduleId && DateOnly.FromDateTime(a.Date) == today)
            .ToListAsync();

        if (existingAttendances.Any())
        {
            _context.Attendances.RemoveRange(existingAttendances);
            await _context.SaveChangesAsync();
        }

        var newAttendances = attendanceList.Select(a => new Attendance
        {
            ScheduleId = scheduleId,
            StudentId = a.StudentId,
            Date = DateTime.Now,
            Status = a.Status
        }).ToList();

        await _context.Attendances.AddRangeAsync(newAttendances);
        await _context.SaveChangesAsync();
    }

}