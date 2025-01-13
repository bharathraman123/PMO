using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

[ApiController]
[Route("api/[controller]")]
public class EmployeesController : ControllerBase
{
    private readonly EmployeeDbContext _context;

    public EmployeesController(EmployeeDbContext context)
    {
        _context = context;
    }

    // Existing endpoint: Get all employees
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Employee>>> GetEmployees()
    {
        return await _context.Employees.ToListAsync();
    }

    // Get all projects
    [HttpGet("projects")]
    public async Task<IActionResult> GetProjects()
    {
        var projects = await _context.Projects.ToListAsync();
        return Ok(projects);
    }

    // Create a new project
    [HttpPost("projects")]
    public async Task<IActionResult> CreateProject([FromBody] Project project)
    {
        if (project == null)
        {
            return BadRequest(new { message = "Project data is invalid." });
        }

        // Add the new project to the database
        _context.Projects.Add(project);
        await _context.SaveChangesAsync();

        // Return the created project, including the auto-generated Id
        return CreatedAtAction(nameof(GetProjects), new { id = project.Id }, project);
    }

    // Update a project
    [HttpPut("projects/{id}")]
    public async Task<IActionResult> UpdateProject(int id, [FromBody] Project updatedProject)
    {
        var existingProject = await _context.Projects.FindAsync(id);

        if (existingProject == null)
        {
            return NotFound(new { message = "Project not found." });
        }

        // Update fields
        existingProject.ProjectName = updatedProject.ProjectName;
        existingProject.ProjectManager = updatedProject.ProjectManager;
        existingProject.StartDate = updatedProject.StartDate;
        existingProject.EndDate = updatedProject.EndDate;

        _context.Projects.Update(existingProject);
        await _context.SaveChangesAsync();

        return Ok(new { message = "Project updated successfully." });
    }

    // Disable a project
    [HttpPut("projects/{id}/disable")]
    public async Task<IActionResult> DisableProject(int id)
    {
        var project = await _context.Projects.FindAsync(id);

        if (project == null)
        {
            return NotFound(new { message = "Project not found." });
        }

        project.IsDisabled = true;

        _context.Projects.Update(project);
        await _context.SaveChangesAsync();

        return Ok(new { message = "Project disabled successfully." });
    }
}
