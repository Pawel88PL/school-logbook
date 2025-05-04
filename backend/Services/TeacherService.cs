using backend.Data;
using backend.DTOs;
using backend.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace backend.Services;

public class TeacherService(AppDbContext context) : ITeacherService
{
    private readonly AppDbContext _context = context;

    public async Task<IEnumerable<TeacherDto>> GetTeachersAsync()
    {
        var teachers = await _context.Teachers
            .AsNoTracking()
            .Where(t => !t.HomeroomClasses.Any())
            .Select(teacher => new TeacherDto
            {
                Id = teacher.Id,
                FirstName = teacher.FirstName,
                LastName = teacher.LastName,
            })
            .ToListAsync();

        return teachers;
    }
}