using backend.Data;
using backend.DTOs;
using backend.Interfaces;
using backend.Models;
using backend.Models.Entities;
using Microsoft.EntityFrameworkCore;

namespace backend.Services;

public class ClassService(AppDbContext context) : IClassService
{
    private readonly AppDbContext _context = context;

    public async Task AddClass(ClassDto classDto)
    {
        var newClass = new Class
        {
            Name = classDto.Name,
            HomeroomTeacherId = classDto.HomeroomTeacherId,
            CreatedAt = DateTime.Now,
            UpdatedAt = DateTime.Now,
        };

        if (classDto.AssignedStudentIds.Any())
        {
            var students = await _context.Students
                .ToListAsync();

            var users = students.Where(u => classDto.AssignedStudentIds.Contains(u.Id)).ToList();

            if (users.Count == 0)
            {
                throw new Exception("Nie ma żadnych uczniów do dodania");
            }

            foreach (var student in users)
            {
                student.Class = newClass;
            }
        }

        await _context.Classes.AddAsync(newClass);
        await _context.SaveChangesAsync();
    }

    public async Task DeleteClass(int id)
    {
        var classToDelete = await _context.Classes
            .Include(c => c.Students)
            .FirstOrDefaultAsync(c => c.Id == id);

        if (classToDelete == null)
        {
            throw new Exception("Nie znaleziono klasy do usunięcia");
        }

        // Odpinanie uczniów (ustawiamy ClassId = null)
        foreach (var student in classToDelete.Students)
        {
            student.ClassId = null;
        }

        _context.Classes.Remove(classToDelete);
        await _context.SaveChangesAsync();
    }

    public async Task<ClassDto> GetClassById(int id)
    {
        var classEntity = await _context.Classes
            .Include(c => c.Students)
            .FirstOrDefaultAsync(c => c.Id == id);

        if (classEntity == null)
        {
            throw new Exception("Nie znaleziono klasy");
        }

        return new ClassDto
        {
            Id = classEntity.Id,
            Name = classEntity.Name,
            CreatedAt = classEntity.CreatedAt,
            UpdatedAt = classEntity.UpdatedAt,
            HomeroomTeacherId = classEntity.HomeroomTeacherId,
            AssignedStudentIds = classEntity.Students.Select(s => s.Id).ToList(),
        };
    }

    public async Task<PagedClasses> GetClassesPaged(PagedRequest request)
    {
        var query = _context.Classes
            .Include(c => c.HomeroomTeacher)
            .AsQueryable();

        if (!string.IsNullOrEmpty(request.SortColumn))
        {
            var isDescending = request.SortDirection?.ToLower() == "desc";

            query = request.SortColumn.ToLower() switch
            {
                "createdat" => isDescending
                    ? query.OrderByDescending(e => e.CreatedAt)
                    : query.OrderBy(e => e.CreatedAt),

                "name" => isDescending
                    ? query.OrderByDescending(e => e.Name)
                    : query.OrderBy(e => e.Name),

                _ => throw new ArgumentException($"Invalid sort column: {request.SortColumn}")
            };
        }
        else
        {
            query = query.OrderByDescending(c => c.CreatedAt);
        }

        int totalRecords = await query.CountAsync();

        var classes = await query
            .Skip((request.PageNumber - 1) * request.PageSize)
            .Take(request.PageSize)
            .ToListAsync();

        var classesDto = classes.Select(item => new ClassDto
        {
            Id = item.Id,
            Name = item.Name,
            CreatedAt = item.CreatedAt,
            UpdatedAt = item.UpdatedAt,
            HomeroomTeacherName = item.HomeroomTeacher != null
                ? $"{item.HomeroomTeacher.FirstName} {item.HomeroomTeacher.LastName}"
                : null,
        }).ToList();

        return new PagedClasses
        {
            TotalRecords = totalRecords,
            Data = classesDto
        };
    }

    public async Task UpdateClass(ClassDto classDto)
    {
        var classToUpdate = await _context.Classes
            .Include(s => s.Students)
            .FirstOrDefaultAsync(m => m.Id == classDto.Id);

        if (classToUpdate == null)
        {
            throw new Exception($"Nie znaleziono klasy o ID {classDto.Id}");
        }

        classToUpdate.Name = classDto.Name;
        classToUpdate.HomeroomTeacherId = classDto.HomeroomTeacherId;
        classToUpdate.UpdatedAt = DateTime.Now;

        var currentStudentIds = classToUpdate.Students.Select(s => s.Id).ToList();

        var targetStudentIds = classDto.AssignedStudentIds;

        var studentsToRemove = await _context.Students
        .Where(s => currentStudentIds.Contains(s.Id) && !targetStudentIds.Contains(s.Id))
        .ToListAsync();

        foreach (var student in studentsToRemove)
        {
            student.ClassId = null;
        }

        var studentsToAdd = await _context.Students
            .Where(s => targetStudentIds.Contains(s.Id) && s.ClassId != classDto.Id)
            .ToListAsync();

        foreach (var student in studentsToAdd)
        {
            student.ClassId = classDto.Id;
        }

        await _context.SaveChangesAsync();
    }
}