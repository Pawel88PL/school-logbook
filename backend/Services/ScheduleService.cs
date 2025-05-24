using backend.Data;
using backend.DTOs;
using backend.Interfaces;
using backend.Models.Entities;
using Microsoft.EntityFrameworkCore;

namespace backend.Services;

public class ScheduleService(AppDbContext context) : IScheduleService
{
    private readonly AppDbContext _context = context;

    public async Task<ScheduleEntryDto> AddEntryAsync(ScheduleEntryDto dto)
    {
        // Walidacja obecności danych
        var @class = await _context.Classes.FindAsync(dto.ClassId)
            ?? throw new Exception("Nie znaleziono klasy.");

        var subject = await _context.Subjects.FindAsync(dto.SubjectId)
            ?? throw new Exception("Nie znaleziono przedmiotu.");

        var teacher = await _context.Teachers.FindAsync(dto.TeacherId)
            ?? throw new Exception("Nie znaleziono nauczyciela.");

        // Można też dodatkowo sprawdzić, czy taki wpis już istnieje:
        var exists = await _context.Schedules.AnyAsync(s =>
            s.ClassId == dto.ClassId &&
            s.DayOfWeek == dto.DayOfWeek &&
            s.StartTime == dto.StartTime);

        if (exists)
            throw new Exception("W tym dniu i o tej godzinie już istnieje wpis dla tej klasy.");

        // Utwórz nowy wpis
        var entry = new Schedule
        {
            ClassId = dto.ClassId,
            SubjectId = dto.SubjectId,
            TeacherId = dto.TeacherId,
            DayOfWeek = dto.DayOfWeek,
            StartTime = dto.StartTime
        };

        await _context.Schedules.AddAsync(entry);
        await _context.SaveChangesAsync();

        return new ScheduleEntryDto
        {
            Id = entry.Id,
            ClassId = entry.ClassId,
            SubjectId = entry.SubjectId,
            TeacherId = entry.TeacherId,
            SubjectName = subject.Name,
            TeacherFullName = $"{teacher.FirstName} {teacher.LastName}",
            DayOfWeek = entry.DayOfWeek,
            StartTime = entry.StartTime
        };
    }

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

    public async Task<List<TeacherScheduleEntryDto>> GetScheduleForTeacherAsync(string userId)
    {
        var teacher = await _context.Teachers
            .AsNoTracking()
            .FirstOrDefaultAsync(t => t.UserId == userId);

        if (teacher == null)
        {
            throw new Exception("Nie znaleziono nauczyciela powiązanego z tym kontem użytkownika.");
        }

        var schedule = await _context.Schedules
            .Where(s => s.TeacherId == teacher.Id)
            .Include(s => s.Class)
            .Include(s => s.Subject)
            .OrderBy(s => s.DayOfWeek)
            .ThenBy(s => s.StartTime)
            .Select(s => new TeacherScheduleEntryDto
            {
                DayOfWeek = s.DayOfWeek,
                StartTime = s.StartTime,
                ClassName = s.Class.Name,
                SubjectName = s.Subject.Name
            })
            .ToListAsync();

        return schedule;
    }

    public async Task<List<SubjectWithTeachersDto>> GetSubjectsForClassAsync(int classId)
    {
        var assignments = await _context.ClassSubjects
            .Where(cs => cs.ClassId == classId)
            .Include(cs => cs.Subject)
            .Include(cs => cs.Teacher)
            .ToListAsync();

        var grouped = assignments
            .GroupBy(cs => new { cs.SubjectId, cs.Subject.Name })
            .Select(g => new SubjectWithTeachersDto
            {
                SubjectId = g.Key.SubjectId,
                SubjectName = g.Key.Name,
                Teachers = g.Select(t => new TeacherDto
                {
                    Id = t.Teacher.Id,
                    FirstName = t.Teacher.FirstName,
                    LastName = t.Teacher.LastName,
                }).DistinctBy(t => t.Id).ToList()
            })
            .ToList();

        return grouped;
    }
}