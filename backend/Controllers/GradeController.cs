using backend.DTOs;
using backend.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Serilog;

namespace backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class GradeController(IGradeService gradeService) : ControllerBase
{
    private readonly IGradeService _gradeService = gradeService;

    [Authorize(Roles = "Teacher,Admin")]
    [HttpPost("add")]
    public async Task<IActionResult> AddGrade([FromBody] GradeCreateDto dto)
    {
        try
        {
            var grade = await _gradeService.AddGradeAsync(dto);
            return Ok(grade);
        }
        catch (Exception ex)
        {
            Log.Error(ex, "Błąd podczas dodawania oceny.");
            return BadRequest(new { message = "Wystąpił błąd podczas dodawania oceny." });
        }
    }
}