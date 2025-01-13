public class Project
{
    public int Id { get; set; }
    public string ProjectName { get; set; }
    public string ProjectManager { get; set; }
    public DateTime? StartDate { get; set; }
    public DateTime? EndDate { get; set; }
    public bool IsDisabled { get; set; } = false;
}
