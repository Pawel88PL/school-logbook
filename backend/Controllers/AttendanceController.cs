using System.Security.Claims;
using backend.DTOs;
using backend.Interfaces;
using backend.Interfaces.Services;
using backend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Serilog;

namespace backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AttendanceController : ControllerBase
{
    private readonly IAttendanceService _attendanceService;
    private readonly IStudentService _studentService;
    private readonly ITeacherService _teacherService;

    public AttendanceController(
        IAttendanceService attendanceService,
        IStudentService studentService,
        ITeacherService teacherService)
    {
        _attendanceService = attendanceService;
        _studentService = studentService;
        _teacherService = teacherService;
    }

    [Authorize(Roles = "Student")]
    [HttpGet("student/paged")]
    public async Task<IActionResult> GetAttendanceForStudentPaged([FromQuery] PagedRequest request)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

        if (string.IsNullOrEmpty(userId))
            return Unauthorized();

        try
        {
            var student = await _studentService.GetStudentByIdAsync(userId);
            if (student == null)
                return NotFound(new { message = "Nie znaleziono ucznia." });

            var result = await _attendanceService.GetAttendanceForStudentPaged(request, student.Id);
            return Ok(result);
        }
        catch (Exception ex)
        {
            Log.Error(ex, "Błąd podczas pobierania obecności dla studenta");
            return BadRequest(new { message = "Wystąpił błąd podczas pobierania obecności." });
        }
    }

    [Authorize(Roles = "Teacher")]
    [HttpGet("students/{scheduleId}")]
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

    [Authorize(Roles = "Teacher")]
    [HttpGet("today-lessons")]
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

    [Authorize(Roles = "Teacher")]
    [HttpPost("save/{scheduleId}")]
    public async Task<IActionResult> SaveAttendance(int scheduleId, [FromBody] List<AttendanceCreateDto> attendanceList)
    {
        try
        {
            await _attendanceService.SaveAttendanceAsync(scheduleId, attendanceList);
            return Ok(new { message = "Obecność została zapisana." });
        }
        catch (Exception ex)
        {
            Log.Error(ex, "Błąd podczas zapisu obecności");
            return BadRequest(new { message = "Wystąpił błąd podczas zapisu obecności." });
        }
    }

}