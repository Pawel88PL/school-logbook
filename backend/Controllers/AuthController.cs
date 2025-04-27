using backend.DTOs;
using backend.Interfaces.Services;
using backend.Models.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : Controller
    {
        private readonly SignInManager<User> _signInManager;
        private readonly ITokenService _tokenService;
        private readonly UserManager<User> _userManager;

        public AuthController(
            SignInManager<User> signInManager,
            ITokenService tokenService,
            UserManager<User> userManager)
        {
            _signInManager = signInManager;
            _tokenService = tokenService;
            _userManager = userManager;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] Login userLoginData)
        {
            if (!ModelState.IsValid || userLoginData.UserName == null || userLoginData.Password == null)
            {
                return BadRequest(ModelState);
            }

            var signInResult = await _signInManager.PasswordSignInAsync(userLoginData.UserName, userLoginData.Password, isPersistent: true, lockoutOnFailure: true);
            
            var user = await _userManager.FindByNameAsync(userLoginData.UserName);

            if (user == null)
            {
                var message = "Nie znaleziono użytkownika o podanym identyfikatorze.";
                return NotFound(new { message });
            }

            if (!user.IsActive)
            {
                var message = "Konto jest zablokowane. Skontaktuj się z administratorem.";
                return Unauthorized(new { message });
            }

            if (!signInResult.Succeeded)
            {
                var message = "Podany identyfikator lub hasło są nieprawidłowe.";
                return Unauthorized(new { message });
            }

            var token = _tokenService.GenerateJwtTokenForUser(user);
            return Ok(new { Token = token });
        }

        [HttpPost("logout")]
        public async Task<IActionResult> Logout()
        {
            await _signInManager.SignOutAsync();
            return Ok();
        }
    }
}