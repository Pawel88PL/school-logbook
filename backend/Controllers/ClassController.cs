using backend.DTOs;
using backend.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Serilog;

namespace backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ClassController(IClassService classService) : ControllerBase
{    
    private readonly IClassService _classService = classService;

    [HttpPost("add")]
    public async Task<IActionResult> AddClass([FromBody] ClassDto classDto)
    {
        try
        {
            await _classService.AddClass(classDto);
            return Ok(new { message = "Klasa została dodana pomyślnie." });
        }
        catch (Exception e)
        {
            var message = $"Wystąpił błąd podczas dodawania klasy: {e.Message}";
            Log.Error(message);
            return BadRequest(new { message });
        }
    }
}