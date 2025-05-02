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
}