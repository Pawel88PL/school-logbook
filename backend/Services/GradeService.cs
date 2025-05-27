using backend.Data;
using backend.DTOs;
using backend.Interfaces;
using backend.Models.Entities;
using Microsoft.EntityFrameworkCore;

namespace backend.Services;

public class GradeService : IGradeService
{
    private readonly AppDbContext _context;

    public GradeService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<GradeDto> AddGradeAsync(GradeCreateDto dto)
    {
        var grade = new Grade
        {
            StudentId = dto.StudentId,
            SubjectId = dto.SubjectId,
            TeacherId = dto.TeacherId,
            Value = dto.Value,
            Comment = dto.Comment,
            CreatedAt = DateTime.Now
        };

        _context.Grades.Add(grade);
        await _context.SaveChangesAsync();

        return new GradeDto
        {
            Id = grade.Id,
            StudentId = grade.StudentId,
            SubjectId = grade.SubjectId,
            TeacherId = grade.TeacherId,
            Value = grade.Value,
            Comment = grade.Comment ?? string.Empty,
            CreatedAt = grade.CreatedAt,
        };
    }

    public async Task<List<SubjectWithTeachersDto>> GetSubjectsForCurrentTeacherAsync(int teacherId)
    {
        var assignments = await _context.ClassSubjects
            .Where(cs => cs.TeacherId == teacherId)
            .Include(cs => cs.Subject)
            .Include(cs => cs.Class)
            .ToListAsync();

        var grouped = assignments
            .GroupBy(cs => cs.SubjectId)
            .Select(g => new SubjectWithTeachersDto
            {
                SubjectId = g.Key,
                SubjectName = g.First().Subject.Name
            })
            .ToList();

        return grouped;
    }

}
