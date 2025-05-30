using System.Security.Claims;
using backend.DTOs;
using backend.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Serilog;

namespace backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ScheduleController(IScheduleService schedule) : ControllerBase
{
    private readonly IScheduleService _schedule = schedule;

    [Authorize(Roles = "Teacher,Admin")]
    [HttpPost("add-entry")]
    public async Task<IActionResult> AddEntry([FromBody] ScheduleEntryDto dto)
    {
        try
        {
            var entryDto = await _schedule.AddEntryAsync(dto);
            return Ok(entryDto);
        }
        catch (Exception ex)
        {
            var message = $"Wystąpił błąd podczas dodawania wpisu: {ex.Message}";
            Log.Error(message);
            return BadRequest(new { message });
        }
    }

    [Authorize(Roles = "Teacher,Admin")]
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

    [Authorize(Roles = "Teacher,Admin,Student")]
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

    [Authorize(Roles = "Student")]
    [HttpGet("student")]
    public async Task<IActionResult> GetScheduleForStudent()
    {
        try
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (string.IsNullOrEmpty(userId))
                return Unauthorized();

            var schedule = await _schedule.GetScheduleForStudentAsync(userId);
            return Ok(schedule);
        }
        catch (Exception ex)
        {
            var message = $"Wystąpił błąd podczas pobierania harmonogramu dla ucznia: {ex.Message}";
            Log.Error(message);
            return BadRequest(new { message });
        }
    }

    [Authorize(Roles = "Admin,Teacher,Student")]
    [HttpGet("teacher/{userId}")]
    public async Task<IActionResult> GetScheduleForTeacher(string userId)
    {
        try
        {
            var schedule = await _schedule.GetScheduleForTeacherAsync(userId);
            return Ok(schedule);
        }
        catch (Exception ex)
        {
            var message = $"Wystąpił błąd podczas pobierania harmonogramu dla nauczyciela o ID {userId}: {ex.Message}";
            Log.Error(message);
            return BadRequest(new { message });
        }
    }

    [Authorize(Roles = "Admin,Teacher,Student")]
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