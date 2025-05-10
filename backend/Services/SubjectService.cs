using backend.Data;
using backend.DTOs;
using backend.Interfaces;
using backend.Models;
using backend.Models.Entities;
using Microsoft.EntityFrameworkCore;
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
                Name = dto.Name,
                CreatedAt = DateTime.Now,
                UpdatedAt = DateTime.Now
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

    public async Task DeleteSubjectAsync(int subjectId)
    {
        await using var transaction = await _context.Database.BeginTransactionAsync();

        try
        {
            var subject = await _context.Subjects
                .Include(s => s.ClassSubjects)
                .FirstOrDefaultAsync(s => s.Id == subjectId);

            if (subject == null)
            {
                throw new Exception($"Nie znaleziono przedmiotu o ID {subjectId}");
            }

            // Usuń powiązania w tabeli ClassSubjects
            if (subject.ClassSubjects.Any())
            {
                _context.ClassSubjects.RemoveRange(subject.ClassSubjects);
            }

            // Usuń sam przedmiot
            _context.Subjects.Remove(subject);

            await _context.SaveChangesAsync();
            await transaction.CommitAsync();
        }
        catch (Exception ex)
        {
            await transaction.RollbackAsync();
            Log.Error(ex, $"Błąd podczas usuwania przedmiotu ID {subjectId}");
            throw new Exception("Wystąpił błąd podczas usuwania przedmiotu.", ex);
        }
    }

    public async Task<SubjectDto> GetSubjectByIdAsync(int id)
    {
        var subject = await _context.Subjects
            .AsNoTracking()
            .Where(s => s.Id == id)
            .Select(s => new SubjectDto
            {
                Id = s.Id,
                Name = s.Name,
                Assignments = s.ClassSubjects.Select(cs => new SubjectAssignmentDto
                {
                    ClassId = cs.ClassId,
                    TeacherId = cs.TeacherId
                }).ToList()
            })
            .FirstOrDefaultAsync();

        if (subject == null)
            throw new Exception("Przedmiot nie został znaleziony");

        return subject;
    }


    public async Task<PagedSubjects> GetSubjectsPaged(PagedRequest request)
    {
        var query = _context.Subjects
            .AsNoTracking()
            .Select(s => new
            {
                s.Id,
                s.Name,
                s.CreatedAt,
                s.UpdatedAt,
                Assignments = s.ClassSubjects.Select(cs => new
                {
                    ClassName = cs.Class.Name,
                    TeacherFullName = cs.Teacher.FirstName + " " + cs.Teacher.LastName
                }).ToList()
            });

        // Sortowanie
        if (!string.IsNullOrEmpty(request.SortColumn))
        {
            var isDescending = request.SortDirection?.ToLower() == "desc";

            query = request.SortColumn.ToLower() switch
            {
                "name" => isDescending
                    ? query.OrderByDescending(e => e.Name)
                    : query.OrderBy(e => e.Name),

                "createdat" => isDescending
                    ? query.OrderByDescending(e => e.CreatedAt)
                    : query.OrderBy(e => e.CreatedAt),

                "updatedat" => isDescending
                    ? query.OrderByDescending(e => e.UpdatedAt)
                    : query.OrderBy(e => e.UpdatedAt),

                _ => throw new ArgumentException($"Nieprawidłowa kolumna sortowania: {request.SortColumn}")
            };
        }
        else
        {
            query = query.OrderByDescending(s => s.CreatedAt);
        }

        var totalRecords = await query.CountAsync();

        var subjects = await query
            .Skip((request.PageNumber - 1) * request.PageSize)
            .Take(request.PageSize)
            .ToListAsync();

        var subjectDtos = subjects.Select(item => new SubjectDto
        {
            Id = item.Id,
            Name = item.Name,
            CreatedAt = item.CreatedAt,
            UpdatedAt = item.UpdatedAt,
            AssignmentsDto = item.Assignments.Select(a => $"{a.ClassName} ({a.TeacherFullName})").ToList()
        }).ToList();

        return new PagedSubjects
        {
            TotalRecords = totalRecords,
            Data = subjectDtos
        };
    }

    public async Task UpdateSubjectWithAssignmentsAsync(SubjectDto dto)
    {
        await using var transaction = await _context.Database.BeginTransactionAsync();

        try
        {
            var subject = await _context.Subjects
                .FirstOrDefaultAsync(s => s.Id == dto.Id);

            if (subject == null)
            {
                throw new Exception($"Nie znaleziono przedmiotu o ID {dto.Id}");
            }

            // 1. Aktualizacja danych podstawowych
            subject.Name = dto.Name;
            subject.UpdatedAt = DateTime.Now;
            _context.Subjects.Update(subject);

            // 2. Usunięcie istniejących przypisań
            var existingAssignments = await _context.ClassSubjects
                .Where(cs => cs.SubjectId == dto.Id)
                .ToListAsync();

            _context.ClassSubjects.RemoveRange(existingAssignments);

            // 3. Dodanie nowych przypisań
            var newAssignments = dto.Assignments.Select(a => new ClassSubject
            {
                ClassId = a.ClassId,
                TeacherId = a.TeacherId,
                SubjectId = dto.Id
            }).ToList();

            await _context.ClassSubjects.AddRangeAsync(newAssignments);

            // 4. Zapisanie zmian
            await _context.SaveChangesAsync();
            await transaction.CommitAsync();
        }
        catch (Exception ex)
        {
            await transaction.RollbackAsync();
            Log.Error(ex, "Błąd podczas edycji przedmiotu z przypisaniami");
            throw new Exception("Błąd podczas edycji przedmiotu", ex);
        }
    }
}