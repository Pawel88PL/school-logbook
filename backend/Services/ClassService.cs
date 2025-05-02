using backend.Data;
using backend.DTOs;
using backend.Interfaces;
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
}