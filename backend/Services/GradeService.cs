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

    public async Task<GradeDto> AddGradeAsync(GradeCreateDto dto, int teacherId)
    {
        var grade = new Grade
        {
            StudentId = dto.StudentId,
            SubjectId = dto.SubjectId,
            TeacherId = teacherId,
            Value = dto.Value,
            Comment = dto.Comment,
            Date = DateTime.Now
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
            Date = grade.Date,
        };
    }

    public async Task<List<StudentDto>> GetStudentsForSubjectAndClassAsync(int teacherId, int subjectId, int classId)
    {
        var isAuthorized = await _context.ClassSubjects.AnyAsync(cs =>
            cs.TeacherId == teacherId && cs.SubjectId == subjectId && cs.ClassId == classId);

        if (!isAuthorized)
            throw new Exception("Nie masz uprawnień do tej klasy i przedmiotu.");

        var students = await _context.Students
            .Where(s => s.ClassId == classId)
            .OrderBy(s => s.LastName)
            .Select(s => new StudentDto
            {
                Id = s.Id,
                FullName = s.FirstName + " " + s.LastName
            })
            .ToListAsync();

        return students;
    }

    public async Task<List<SubjectWithClassDto>> GetSubjectsForCurrentTeacherAsync(int teacherId)
    {
        var subjects = await _context.ClassSubjects
            .Where(cs => cs.TeacherId == teacherId)
            .Include(cs => cs.Subject)
            .Include(cs => cs.Class)
            .Select(cs => new SubjectWithClassDto
            {
                SubjectId = cs.SubjectId,
                SubjectName = cs.Subject.Name,
                ClassId = cs.ClassId,
                ClassName = cs.Class.Name
            })
            .Distinct()
            .OrderBy(cs => cs.SubjectName)
            .ToListAsync();

        return subjects;
    }
}