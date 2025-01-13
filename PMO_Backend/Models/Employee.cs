public class Employee
{
    public string EmployeeId { get; set; }
    public string Resource { get; set; }
    public string PrimarySkill { get; set; }
    public decimal Experience { get; set; }
    public string Designation { get; set; }
    public string Department { get; set; }
    public string Status { get; set; }
    public string Projects { get; set; }
    public string Allocation { get; set; }
    public DateOnly AllocationEndDate { get; set; }  // Changed to DateOnly
    public string ProjectManager { get; set; }
    public string Reporting { get; set; }

    public string FutureProjects { get; set; }
}
