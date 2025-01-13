using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using System;

public class EmployeeDbContextFactory : IDesignTimeDbContextFactory<EmployeeDbContext>
{
    public EmployeeDbContext CreateDbContext(string[] args)
    {
        var optionsBuilder = new DbContextOptionsBuilder<EmployeeDbContext>();
        optionsBuilder.UseMySql(
            "Server=localhost;Database=employeemanagement;User=root;Password=BhjaBhra@123;",
            new MySqlServerVersion(new Version(8, 0, 33)) // Replace with the MySQL version you're using
        );

        return new EmployeeDbContext(optionsBuilder.Options);
    }
}
