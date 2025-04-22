using Microsoft.AspNetCore.Identity;

namespace backend.Models.Entities;

public class User : IdentityUser
{
    public int? TeacherId { get; set; }
    public Teacher? Teacher { get; set; }

    public int? StudentId { get; set; }
    public Student? Student { get; set; }
}
