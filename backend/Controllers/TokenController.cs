using System.Security.Claims;
using backend.Interfaces.Services;
using backend.Models.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TokenController : ControllerBase
    {
        private readonly ITokenService _tokenService;
        private readonly UserManager<User> _userManager;

        public TokenController(ITokenService tokenService, UserManager<User> userManager)
        {
            _userManager = userManager;
            _tokenService = tokenService;
        }

        [Authorize]
        [HttpGet("refresh")]
        public async Task<IActionResult> RefreshToken()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userId == null)
            {
                return BadRequest("Brak identyfikatora użytkownika w zapytaniu.");
            }

            var user = await _userManager.FindByIdAsync(userId);
            if (user == null)
            {
                return NotFound("Nie znaleziono użytkownika.");
            }

            var token = _tokenService.GenerateJwtTokenForUser(user);

            return Ok(new { Token = token });
        }
    }
}