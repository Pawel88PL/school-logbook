using backend.Data;
using backend.DTOs;
using backend.Interfaces;
using backend.Models;
using backend.Models.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System.Linq.Dynamic.Core; // <-- Konieczne do dynamicznej zmiany sortowania
using Serilog;

namespace backend.Services
{
    public class UserService : IUserService
    {
        private readonly AppDbContext _context;
        private readonly UserManager<User> _userManager;

        public UserService(
            AppDbContext context,
            UserManager<User> userManager)
        {
            _context = context;
            _userManager = userManager;
        }

        public async Task<IdentityResult> AddNewUserAsync(AddUserModel addUserModel)
        {
            await using var transaction = await _context.Database.BeginTransactionAsync();
            try
            {
                var userExists = await _userManager.FindByNameAsync(addUserModel.Email!);

                if (userExists != null)
                {
                    return IdentityResult.Failed(new IdentityError { Description = "Użytkownik o podanym adresie e-mail już istnieje." });
                }

                var newUser = new User
                {
                    UserName = addUserModel.Email!,
                    Email = addUserModel.Email!,
                    DateAdded = DateTime.Now,
                    IsActive = true,
                };

                var createResult = await _userManager.CreateAsync(newUser, addUserModel.Password);
                if (!createResult.Succeeded)
                {
                    await transaction.RollbackAsync();
                    return createResult;
                }

                await _userManager.AddToRoleAsync(newUser, addUserModel.Role);

                var userEntity = CreateUserEntity(addUserModel.Role, newUser.Id, addUserModel.FirstName, addUserModel.LastName);
                await _context.AddAsync(userEntity);

                await _context.SaveChangesAsync();
                await transaction.CommitAsync();

                return createResult;
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                Log.Error(ex, "Błąd podczas dodawania nowego użytkownika");
                return IdentityResult.Failed(new IdentityError { Description = "Wystąpił błąd podczas dodawania użytkownika." });
            }
        }

        private static IUserEntity CreateUserEntity(string role, string userId, string firstName, string lastName)
        {
            return role switch
            {
                "Student" => new Student { UserId = userId, FirstName = firstName, LastName = lastName },
                "Teacher" => new Teacher { UserId = userId, FirstName = firstName, LastName = lastName },
                "Administrator" => new Admin { UserId = userId, FirstName = firstName, LastName = lastName },
                _ => throw new ArgumentException($"Nieznana rola: {role}")
            };
        }

        public async Task<IdentityResult> DeleteUserAsync(string userId)
        {
            await using var transaction = await _context.Database.BeginTransactionAsync();

            try
            {
                var user = await _userManager.FindByIdAsync(userId);
                if (user == null)
                {
                    return IdentityResult.Failed(new IdentityError { Description = "Nie znaleziono użytkownika." });
                }

                var roles = await _userManager.GetRolesAsync(user);
                var role = roles.FirstOrDefault();

                if (role == "Administrator")
                {
                    var admin = await _context.Admins.FirstOrDefaultAsync(a => a.UserId == userId);
                    if (admin != null)
                        _context.Admins.Remove(admin);
                }
                else if (role == "Teacher")
                {
                    var teacher = await _context.Teachers.FirstOrDefaultAsync(t => t.UserId == userId);
                    if (teacher != null)
                        _context.Teachers.Remove(teacher);
                }
                else if (role == "Student")
                {
                    var student = await _context.Students.FirstOrDefaultAsync(s => s.UserId == userId);
                    if (student != null)
                        _context.Students.Remove(student);
                }

                await _context.SaveChangesAsync();

                var result = await _userManager.DeleteAsync(user);
                if (!result.Succeeded)
                {
                    await transaction.RollbackAsync();
                    return result;
                }

                await transaction.CommitAsync();
                return result;
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                Log.Error(ex, "Błąd podczas usuwania użytkownika");
                return IdentityResult.Failed(new IdentityError { Description = "Wystąpił błąd podczas usuwania użytkownika." });
            }
        }

        public async Task<SimpleUserDto?> GetUserByIdAsync(string id)
        {
            var user = await _context.Users
                .AsNoTracking()
                .FirstOrDefaultAsync(u => u.Id == id);

            if (user == null)
                return null;

            var roles = await _userManager.GetRolesAsync(user);

            if (roles.Contains("Student"))
            {
                return await GetSimpleUserInfoAsync<Student>(user.Id);
            }

            if (roles.Contains("Teacher"))
            {
                return await GetSimpleUserInfoAsync<Teacher>(user.Id);
            }

            if (roles.Contains("Administrator"))
            {
                return await GetSimpleUserInfoAsync<Admin>(user.Id);
            }

            return null;
        }

        private async Task<SimpleUserDto?> GetSimpleUserInfoAsync<TEntity>(string userId) where TEntity : class, IUserEntity
        {
            var entity = await _context.Set<TEntity>()
                .AsNoTracking()
                .FirstOrDefaultAsync(e => EF.Property<string>(e, "UserId") == userId);

            if (entity == null)
                return null;

            return new SimpleUserDto
            {
                FirstName = entity.FirstName,
                LastName = entity.LastName
            };
        }

        public async Task<PagedUsers> GetUsersPaged(PagedRequest request)
        {
            var query = from user in _context.Users.AsNoTracking()
                        join userRole in _context.UserRoles on user.Id equals userRole.UserId
                        join role in _context.Roles on userRole.RoleId equals role.Id
                        // LEFT JOIN do Admin
                        join admin in _context.Admins on user.Id equals admin.UserId into adminJoin
                        from admin in adminJoin.DefaultIfEmpty()
                            // LEFT JOIN do Teacher
                        join teacher in _context.Teachers on user.Id equals teacher.UserId into teacherJoin
                        from teacher in teacherJoin.DefaultIfEmpty()
                            // LEFT JOIN do Student
                        join student in _context.Students on user.Id equals student.UserId into studentJoin
                        from student in studentJoin.DefaultIfEmpty()
                        select new
                        {
                            User = user,
                            RoleName = role.Name,
                            Admin = admin,
                            Teacher = teacher,
                            Student = student
                        };

            if (!string.IsNullOrEmpty(request.SearchQuery))
            {
                query = query.Where(c => c.User.Email!.Contains(request.SearchQuery));
            }

            if (!string.IsNullOrEmpty(request.SortColumn) && request.SortColumn == "role")
            {
                var sortExpression = $"RoleName {(request.SortDirection == "desc" ? "descending" : "ascending")}";
                query = query.OrderBy(sortExpression);
            }
            else if (!string.IsNullOrEmpty(request.SortColumn))
            {
                var sortExpression = $"User.{request.SortColumn} {(request.SortDirection == "desc" ? "descending" : "ascending")}";
                query = query.OrderBy(sortExpression);
            }

            int totalRecords = await query.CountAsync();

            var usersWithRoles = await query
                .Skip((request.PageNumber - 1) * request.PageSize)
                .Take(request.PageSize)
                .ToListAsync();

            var usersDto = usersWithRoles.Select(item => new UserDto
            {
                Id = item.User.Id.ToString(),
                FirstName = item.Admin?.FirstName ?? item.Teacher?.FirstName ?? item.Student?.FirstName ?? string.Empty,
                LastName = item.Admin?.LastName ?? item.Teacher?.LastName ?? item.Student?.LastName ?? string.Empty,
                Email = item.User.Email ?? string.Empty,
                Role = item.RoleName,
                IsActive = item.User.IsActive,
                DateAdded = item.User.DateAdded,
                LastSuccessfulLogin = item.User.LastSuccessfulLogin
            }).ToList();

            return new PagedUsers
            {
                TotalRecords = totalRecords,
                Data = usersDto
            };
        }

        public async Task<List<Role>> GeRolesAsync()
        {
            var roles = await _context.Roles
                .AsNoTracking()
                .Select(r => new Role
                {
                    Name = r.Name ?? string.Empty
                })
                .ToListAsync();

            return roles;
        }

        public async Task<bool> UpdateUserAsync(UpdateUser updateUser)
        {
            await using var transaction = await _context.Database.BeginTransactionAsync();
            try
            {
                var user = await _userManager.FindByIdAsync(updateUser.Id);
                if (user == null) return false;

                user.UserName = updateUser.Email;
                user.Email = updateUser.Email;
                user.IsActive = updateUser.IsActive;

                if (!string.IsNullOrEmpty(updateUser.NewPassword))
                {
                    var token = await _userManager.GeneratePasswordResetTokenAsync(user);
                    var resetPassResult = await _userManager.ResetPasswordAsync(user, token, updateUser.NewPassword);
                    if (!resetPassResult.Succeeded)
                    {
                        foreach (var error in resetPassResult.Errors)
                        {
                            Log.Error($"Error resetting password for user with ID {user.Id}: {error.Description}");
                        }
                        await transaction.RollbackAsync();
                        return false;
                    }
                }

                var roles = await _userManager.GetRolesAsync(user);
                var role = roles.FirstOrDefault();

                if (role == "Student")
                {
                    var student = await _context.Students.FirstOrDefaultAsync(s => s.UserId == user.Id);
                    if (student != null)
                    {
                        student.FirstName = updateUser.FirstName;
                        student.LastName = updateUser.LastName;
                    }
                }
                else if (role == "Teacher")
                {
                    var teacher = await _context.Teachers.FirstOrDefaultAsync(t => t.UserId == user.Id);
                    if (teacher != null)
                    {
                        teacher.FirstName = updateUser.FirstName;
                        teacher.LastName = updateUser.LastName;
                    }
                }
                else if (role == "Administrator")
                {
                    var admin = await _context.Admins.FirstOrDefaultAsync(a => a.UserId == user.Id);
                    if (admin != null)
                    {
                        admin.FirstName = updateUser.FirstName;
                        admin.LastName = updateUser.LastName;
                    }
                }

                await _context.SaveChangesAsync();
                await transaction.CommitAsync();
                return true;
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                Log.Error(ex, $"Error updating user with ID {updateUser.Id}");
                return false;
            }
        }
    }
}