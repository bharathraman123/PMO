using Microsoft.EntityFrameworkCore;

public class EmployeeDbContext : DbContext
{
    public EmployeeDbContext(DbContextOptions<EmployeeDbContext> options) : base(options) { }

    public DbSet<Employee> Employees { get; set; } // Existing DbSet for employees
    public DbSet<Project> Projects { get; set; } // Corrected DbSet for projects
}
