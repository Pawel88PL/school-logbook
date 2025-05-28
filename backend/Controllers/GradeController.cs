using System.Security.Claims;
using backend.DTOs;
using backend.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Serilog;

namespace backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class GradeController(IGradeService gradeService, ITeacherService teacherService) : ControllerBase
{
    private readonly IGradeService _gradeService = gradeService;
    private readonly ITeacherService _teacherService = teacherService;

    [Authorize(Roles = "Teacher")]
    [HttpPost("add")]
    public async Task<IActionResult> AddGrade([FromBody] GradeCreateDto dto)
    {
        try
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (string.IsNullOrEmpty(userId))
                return Unauthorized();

            var teacher = await _teacherService.GetTeacherByIdAsync(userId);
            if (teacher == null)
                return NotFound(new { message = "Nie znaleziono nauczyciela." });

            var grade = await _gradeService.AddGradeAsync(dto, teacher.Id);
            return Ok(grade);
        }
        catch (Exception ex)
        {
            Log.Error(ex, "Błąd podczas dodawania oceny.");
            return BadRequest(new { message = "Wystąpił błąd podczas dodawania oceny." });
        }
    }

    [HttpGet("students/{subjectId}/{classId}")]
    [Authorize(Roles = "Teacher")]
    public async Task<IActionResult> GetStudentsForSubjectAndClass(int subjectId, int classId)
    {
        try
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (string.IsNullOrEmpty(userId))
                return Unauthorized();

            var teacher = await _teacherService.GetTeacherByIdAsync(userId);
            if (teacher == null)
                return NotFound(new { message = "Nie znaleziono nauczyciela." });

            var students = await _gradeService.GetStudentsForSubjectAndClassAsync(teacher.Id, subjectId, classId);
            return Ok(students);
        }
        catch (Exception ex)
        {
            Log.Error(ex, "Błąd podczas pobierania uczniów do oceny.");
            return BadRequest(new { message = "Nie udało się pobrać uczniów." });
        }
    }


    [Authorize(Roles = "Teacher")]
    [HttpGet("subjects")]
    public async Task<IActionResult> GetSubjectsForCurrentTeacher()
    {
        try
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (string.IsNullOrEmpty(userId))
                return Unauthorized();

            var teacher = await _teacherService.GetTeacherByIdAsync(userId);
            if (teacher == null)
                return NotFound(new { message = "Nie znaleziono nauczyciela." });

            var subjects = await _gradeService.GetSubjectsForCurrentTeacherAsync(teacher.Id);
            return Ok(subjects);
        }
        catch (Exception ex)
        {
            Log.Error(ex, "Błąd podczas pobierania przedmiotów dla nauczyciela.");
            return BadRequest(new { message = "Wystąpił błąd podczas pobierania przedmiotów." });
        }
    }
}