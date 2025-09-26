using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using CateringApi.Models;
using CateringApi.DTOs;
using CateringApi.Data;
using Microsoft.EntityFrameworkCore;
using Google.Apis.Auth;

namespace CateringApi.Controllers
{
    [ApiController]
    [Route("api/v1/auth")]
    public class AuthController : ControllerBase
    {
        private readonly UserManager<User> _userManager;
        private readonly SignInManager<User> _signInManager;
        private readonly IConfiguration _configuration;
        private readonly CateringDbContext _context;

        public AuthController(
            UserManager<User> userManager,
            SignInManager<User> signInManager,
            IConfiguration configuration,
            CateringDbContext context)
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _configuration = configuration;
            _context = context;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterRequest request)
        {
            try
            {
                var existingUser = await _userManager.FindByEmailAsync(request.Email);
                if (existingUser != null)
                {
                    return BadRequest(new { error = "User with this email already exists" });
                }

                Tenant tenant;
                if (!string.IsNullOrEmpty(request.TenantId))
                {
                    tenant = await _context.Tenants.FindAsync(request.TenantId);
                    if (tenant == null)
                    {
                        return BadRequest(new { error = "Invalid tenant ID" });
                    }
                }
                else
                {
                    if (string.IsNullOrEmpty(request.TenantName))
                    {
                        return BadRequest(new { error = "Either TenantId or TenantName must be provided" });
                    }

                    tenant = new Tenant
                    {
                        Name = request.TenantName,
                        Domain = request.Email.Split('@')[1]
                    };
                    _context.Tenants.Add(tenant);
                    await _context.SaveChangesAsync();
                }

                var user = new User
                {
                    UserName = request.Email,
                    Email = request.Email,
                    FirstName = request.FirstName,
                    LastName = request.LastName,
                    TenantId = tenant.Id,
                    EmailConfirmed = true
                };

                var result = await _userManager.CreateAsync(user, request.Password);
                if (!result.Succeeded)
                {
                    return BadRequest(new { error = string.Join(", ", result.Errors.Select(e => e.Description)) });
                }

                var token = GenerateJwtToken(user, tenant);
                var response = new LoginResponse
                {
                    Token = token,
                    User = new UserResponse
                    {
                        Id = user.Id,
                        Email = user.Email,
                        FirstName = user.FirstName,
                        LastName = user.LastName,
                        Role = user.Role,
                        TenantId = user.TenantId
                    },
                    Tenant = new TenantResponse
                    {
                        Id = tenant.Id,
                        Name = tenant.Name,
                        Domain = tenant.Domain
                    }
                };

                return Ok(response);
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            try
            {
                var user = await _userManager.FindByEmailAsync(request.Email);
                if (user == null)
                {
                    return Unauthorized(new { error = "Invalid email or password" });
                }

                var result = await _signInManager.CheckPasswordSignInAsync(user, request.Password, false);
                if (!result.Succeeded)
                {
                    return Unauthorized(new { error = "Invalid email or password" });
                }

                var tenant = await _context.Tenants.FindAsync(user.TenantId);
                if (tenant == null)
                {
                    return BadRequest(new { error = "User tenant not found" });
                }

                var token = GenerateJwtToken(user, tenant);
                var response = new LoginResponse
                {
                    Token = token,
                    User = new UserResponse
                    {
                        Id = user.Id,
                        Email = user.Email,
                        FirstName = user.FirstName,
                        LastName = user.LastName,
                        Role = user.Role,
                        TenantId = user.TenantId
                    },
                    Tenant = new TenantResponse
                    {
                        Id = tenant.Id,
                        Name = tenant.Name,
                        Domain = tenant.Domain
                    }
                };

                return Ok(response);
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }

        [HttpPost("google")]
        public async Task<IActionResult> GoogleAuth([FromBody] GoogleAuthRequest request)
        {
            try
            {
                var payload = await GoogleJsonWebSignature.ValidateAsync(request.IdToken);
                
                var user = await _userManager.FindByEmailAsync(payload.Email);
                if (user == null)
                {
                    Tenant tenant;
                    if (!string.IsNullOrEmpty(request.TenantId))
                    {
                        tenant = await _context.Tenants.FindAsync(request.TenantId);
                        if (tenant == null)
                        {
                            return BadRequest(new { error = "Invalid tenant ID" });
                        }
                    }
                    else
                    {
                        var tenantName = request.TenantName ?? payload.Email.Split('@')[1];
                        tenant = new Tenant
                        {
                            Name = tenantName,
                            Domain = payload.Email.Split('@')[1]
                        };
                        _context.Tenants.Add(tenant);
                        await _context.SaveChangesAsync();
                    }

                    user = new User
                    {
                        UserName = payload.Email,
                        Email = payload.Email,
                        FirstName = payload.GivenName ?? "",
                        LastName = payload.FamilyName ?? "",
                        TenantId = tenant.Id,
                        ExternalProvider = "Google",
                        ExternalId = payload.Subject,
                        EmailConfirmed = true
                    };

                    var result = await _userManager.CreateAsync(user);
                    if (!result.Succeeded)
                    {
                        return BadRequest(new { error = string.Join(", ", result.Errors.Select(e => e.Description)) });
                    }
                }

                var userTenant = await _context.Tenants.FindAsync(user.TenantId);
                if (userTenant == null)
                {
                    return BadRequest(new { error = "User tenant not found" });
                }

                var token = GenerateJwtToken(user, userTenant);
                var response = new LoginResponse
                {
                    Token = token,
                    User = new UserResponse
                    {
                        Id = user.Id,
                        Email = user.Email,
                        FirstName = user.FirstName,
                        LastName = user.LastName,
                        Role = user.Role,
                        TenantId = user.TenantId
                    },
                    Tenant = new TenantResponse
                    {
                        Id = userTenant.Id,
                        Name = userTenant.Name,
                        Domain = userTenant.Domain
                    }
                };

                return Ok(response);
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }

        private string GenerateJwtToken(User user, Tenant tenant)
        {
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"] ?? "your-super-secret-key-that-is-at-least-32-characters-long"));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id),
                new Claim(ClaimTypes.Email, user.Email),
                new Claim(ClaimTypes.GivenName, user.FirstName),
                new Claim(ClaimTypes.Surname, user.LastName),
                new Claim("TenantId", user.TenantId),
                new Claim("TenantName", tenant.Name),
                new Claim(ClaimTypes.Role, user.Role ?? "User")
            };

            var token = new JwtSecurityToken(
                issuer: _configuration["Jwt:Issuer"] ?? "CateringApi",
                audience: _configuration["Jwt:Audience"] ?? "CateringApi",
                claims: claims,
                expires: DateTime.Now.AddDays(7),
                signingCredentials: creds);

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}
