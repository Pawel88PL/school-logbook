using backend.Data;
using backend.DTOs;
using backend.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace backend.Services;

public class ScheduleService(AppDbContext context) : IScheduleService
{
    private readonly AppDbContext _context = context;

    public async Task<List<ClassWithScheduleDto>> GetClassesWithScheduleAsync()
    {
        return await _context.Classes
            .Select(c => new ClassWithScheduleDto
            {
                Id = c.Id,
                Name = c.Name,
                EntryCount = c.Schedules.Count()
            })
            .ToListAsync();
    }

}