using backend.Data;
using backend.DTOs;
using backend.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace backend.Services;

public class ScheduleService(AppDbContext context) : IScheduleService
{
    private readonly AppDbContext _context = context;

    public async Task<List<ClassWithScheduleDto>> GetClassesWithScheduleAsync()
    {
        var result = await _context.Classes
            .Select(c => new ClassWithScheduleDto
            {
                Id = c.Id,
                Name = c.Name,
                EntryCount = c.Schedules.Count()
            })
            .OrderBy(c => c.Name)
            .ToListAsync();

        return result;
    }

    public async Task<ScheduleForClassDto?> GetScheduleForClassAsync(int classId)
    {
        var classEntity = await _context.Classes
            .Include(c => c.Schedules)
                .ThenInclude(s => s.Subject)
            .Include(c => c.Schedules)
                .ThenInclude(s => s.Teacher)
            .FirstOrDefaultAsync(c => c.Id == classId);

        if (classEntity == null)
            return null;

        var entries = classEntity.Schedules
            .OrderBy(e => e.DayOfWeek)
            .ThenBy(e => e.StartTime)
            .Select(e => new ScheduleEntryDto
            {
                Id = e.Id,
                DayOfWeek = e.DayOfWeek,
                StartTime = e.StartTime,
                SubjectName = e.Subject.Name,
                TeacherFullName = $"{e.Teacher.FirstName} {e.Teacher.LastName}"
            })
            .ToList();

        return new ScheduleForClassDto
        {
            ClassId = classEntity.Id,
            ClassName = classEntity.Name,
            Entries = entries
        };
    }
}