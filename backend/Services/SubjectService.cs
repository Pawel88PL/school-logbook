using backend.Data;
using backend.DTOs;
using backend.Models.Entities;

namespace backend.Services;

public class SubjectService(AppDbContext context)
{
    private readonly AppDbContext _context = context;

    public async Task AddSubjectWithAssignmentsAsync(SubjectDto dto)
    {
        var subject = new Subject
        {
            Name = dto.Name
        };

        await _context.Subjects.AddAsync(subject);
        await _context.SaveChangesAsync();

        foreach (var assignment in dto.Assignments)
        {
            var classSubject = new ClassSubject
            {
                ClassId = assignment.ClassId,
                TeacherId = assignment.TeacherId,
                SubjectId = subject.Id
            };
            await _context.ClassSubjects.AddAsync(classSubject);
        }

        await _context.SaveChangesAsync();
    }
}