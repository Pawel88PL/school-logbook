using backend.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Serilog;

namespace backend.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "Administrator,Teacher")]
public class StudentController(IStudentService studentService) : ControllerBase
{
    private readonly IStudentService _studentService = studentService;

    [HttpGet("all")]
    public async Task<IActionResult> GetStudents()
    {
        try
        {
            var students = await _studentService.GetStudentsAsync();
            return Ok(students);
        }
        catch (Exception ex)
        {
            Log.Error(ex, "Error occurred while fetching students: {Message}, {StackTrace}", ex.Message, ex.StackTrace);
            return StatusCode(500, new { message = "Wystąpił błąd podczas pobierania uczniów.", error = ex.Message });
        }
    }
}