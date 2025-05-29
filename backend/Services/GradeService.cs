using backend.Data;
using backend.DTOs;
using backend.Interfaces;
using backend.Models;
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
        var student = await _context.Students.FindAsync(dto.StudentId)
            ?? throw new Exception("Nie znaleziono ucznia.");

        var subject = await _context.Subjects.FindAsync(dto.SubjectId)
            ?? throw new Exception("Nie znaleziono przedmiotu.");

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
            StudentName = $"{student.FirstName} {student.LastName}",
            SubjectName = subject.Name,
            Value = grade.Value,
            Comment = grade.Comment ?? string.Empty,
            Date = grade.Date,
        };
    }

    public async Task<PagedGrades> GetGradesForTeacherPaged(PagedRequest request, int teacherId)
    {
        var query = _context.Grades
            .AsNoTracking()
            .Where(g => g.TeacherId == teacherId)
            .Include(g => g.Student).ThenInclude(s => s.Class)
            .Include(g => g.Subject)
            .Select(g => new GradeDto
            {
                StudentName = g.Student.FirstName + " " + g.Student.LastName,
                ClassName = g.Student.Class != null ? g.Student.Class.Name : "Brak klasy",
                SubjectName = g.Subject.Name,
                Value = g.Value,
                Comment = g.Comment ?? string.Empty,
                Date = g.Date
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
                "studentName" => request.SortDirection == "desc"
                    ? query.OrderByDescending(c => c.StudentName)
                    : query.OrderBy(c => c.StudentName),

                "className" => request.SortDirection == "desc"
                    ? query.OrderByDescending(c => c.ClassName)
                    : query.OrderBy(c => c.ClassName),

                "value" => request.SortDirection == "desc"
                    ? query.OrderByDescending(c => c.Value)
                    : query.OrderBy(c => c.Value),

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

        var grades = result.Select(g => new GradeDto
        {
            StudentName = g.StudentName,
            ClassName = g.ClassName,
            SubjectName = g.SubjectName,
            Value = g.Value,
            Comment = g.Comment ?? string.Empty,
            Date = g.Date
        }).ToList();

        return new PagedGrades
        {
            TotalRecords = totalRecords,
            Data = grades
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