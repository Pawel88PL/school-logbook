using backend.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Serilog;

namespace backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ScheduleController(IScheduleService schedule) : ControllerBase
{
    private readonly IScheduleService _schedule = schedule;


    [HttpGet("classes-with-schedule")]
    public async Task<IActionResult> GetClassesWithSchedule()
    {
        try
        {
            var classes = await _schedule.GetClassesWithScheduleAsync();
            return Ok(classes);
        }
        catch (Exception ex)
        {
            var message = $"Wystąpił błąd podczas pobierania klas z harmonogramem: {ex.Message}";
            Log.Error(message);
            return BadRequest(new { message });
        }
    }

    [HttpGet("class/{classId}")]
    public async Task<IActionResult> GetScheduleForClass(int classId)
    {
        try
        {
            var schedule = await _schedule.GetScheduleForClassAsync(classId);
            if (schedule == null)
                return NotFound(new { message = "Nie znaleziono harmonogramu dla tej klasy." });

            return Ok(schedule);
        }
        catch (Exception ex)
        {
            var message = $"Wystąpił błąd podczas pobierania harmonogramu dla klasy o ID {classId}: {ex.Message}";
            Log.Error(message);
            return BadRequest(new { message });
        }
    }

    [HttpGet("class/{classId}/subjects")]
    public async Task<IActionResult> GetSubjectsForClass(int classId)
    {
        try
        {
            var subjects = await _schedule.GetSubjectsForClassAsync(classId);
            return Ok(subjects);
        }
        catch (Exception ex)
        {
            var message = $"Wystąpił błąd podczas pobierania przedmiotów dla klasy o ID {classId}: {ex.Message}";
            Log.Error(message);
            return BadRequest(new { message });
        }
    }
}