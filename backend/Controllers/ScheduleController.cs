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
}