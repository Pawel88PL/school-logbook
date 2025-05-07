using backend.Data;
using backend.DTOs;
using backend.Interfaces;
using backend.Models.Entities;
using Serilog;

namespace backend.Services;

public class SubjectService(AppDbContext context) : ISubjectService
{
    private readonly AppDbContext _context = context;

    public async Task AddSubjectWithAssignmentsAsync(SubjectDto dto)
    {
        await using var transaction = await _context.Database.BeginTransactionAsync();

        try
        {
            var subject = new Subject
            {
                Name = dto.Name
            };

            await _context.Subjects.AddAsync(subject);
            await _context.SaveChangesAsync(); // potrzebne, by uzyskać subject.Id

            var classSubjects = dto.Assignments.Select(a => new ClassSubject
            {
                ClassId = a.ClassId,
                TeacherId = a.TeacherId,
                SubjectId = subject.Id
            }).ToList();

            await _context.ClassSubjects.AddRangeAsync(classSubjects);
            await _context.SaveChangesAsync();

            await transaction.CommitAsync();
        }
        catch (Exception ex)
        {
            await transaction.RollbackAsync();
            Log.Error(ex, "Błąd podczas dodawania przedmiotu z przypisaniami");
            throw new Exception("Błąd podczas dodawania przedmiotu z przypisaniami", ex);
        }
    }
}