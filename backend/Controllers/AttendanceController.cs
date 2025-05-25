using System.Security.Claims;
using backend.Interfaces;
using backend.Interfaces.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AttendanceController : ControllerBase
{
    private readonly IAttendanceService _attendanceService;
    private readonly ITeacherService _teacherService;

    public AttendanceController(IAttendanceService attendanceService, ITeacherService teacherService)
    {
        _attendanceService = attendanceService;
        _teacherService = teacherService;
    }

    [HttpGet("students/{scheduleId}")]
    [Authorize(Roles = "Teacher")]
    public async Task<IActionResult> GetStudentsForSchedule(int scheduleId)
    {
        try
        {
            var result = await _attendanceService.GetStudentsForScheduleAsync(scheduleId);
            return Ok(result);
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpGet("today-lessons")]
    [Authorize(Roles = "Teacher")]
    public async Task<IActionResult> GetTodayLessons()
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

        if (string.IsNullOrEmpty(userId))
            return Unauthorized();

        var teacher = await _teacherService.GetTeacherByIdAsync(userId);
        if (teacher == null)
            return NotFound(new { message = "Nie znaleziono nauczyciela." });

        var result = await _attendanceService.GetTodayLessonsForTeacherAsync(teacher.Id);
        return Ok(result);
    }
}