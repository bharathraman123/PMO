import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import {
  Checkbox,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Grid,
  Box,
  CircularProgress,
  TablePagination,
} from "@mui/material";

const EmployeeList = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: "",
    primarySkill: "",
    experience: "",
    designation: "",
    department: "",
    status: "",
    projects: "",
    projectManager: "",
    reportingOfficer: "",
    allocationEndDate: "",
  });
  const navigate = useNavigate();
  const location = useLocation();
  const { role } = location.state || {}; // Get role from navigation state
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedRows, setSelectedRows] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:5228/api/employees");
        setData(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Apply role as a filter when the component loads
  useEffect(() => {
    if (role) {
      setFilters((prevFilters) => ({
        ...prevFilters,
        designation: role, // Set the role as the designation filter
      }));
    }
  }, [role]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({
      ...filters,
      [name]: value,
    });
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleCheckboxChange = (row) => {
    setSelectedRows((prev) => {
      if (prev.includes(row)) {
        return prev.filter((selectedRow) => selectedRow !== row);
      } else {
        return [...prev, row];
      }
    });
  };

  const handleAllocate = () => {
    const selectedDesignation = filters.designation; // Get the selected designation filter
    navigate("/upcoming_project", {
      state: { selectedRows, designation: selectedDesignation },
    });
  };

  const filteredData = data.filter((row) => {
    return (
      (!filters.search ||
        row.resource.toLowerCase().includes(filters.search.toLowerCase()) ||
        row.employeeId.toLowerCase().includes(filters.search.toLowerCase())) &&
      (!filters.primarySkill || row.primarySkill === filters.primarySkill) &&
      (!filters.experience || row.experience === filters.experience) &&
      (!filters.designation || row.designation === filters.designation) &&
      (!filters.department || row.department === filters.department) &&
      (!filters.status || row.status === filters.status) &&
      (!filters.projects || row.projects === filters.projects) &&
      (!filters.projectManager || row.projectManager === filters.projectManager) &&
      (!filters.reportingOfficer || row.reportingOfficer === filters.reportingOfficer) &&
      (!filters.allocationEndDate || row.allocationEndDate === filters.allocationEndDate)
    );
  });

  const paginatedData = filteredData.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const columns = [
    "Select",
    "Resource",
    "Employee ID",
    "Primary Skill",
    "Experience",
    "Designation",
    "Department",
    "Status",
    "Projects",
    "Allocation",
    "Allocation End Date",
    "Project Manager",
    "Future Projects",
  ];

  return (
    <div style={{ padding: 20 }}>
      <Typography variant="h4" gutterBottom>
        Employee List {role && `- Role: ${role}`}
      </Typography>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mb: 3 }}>
        <TextField
          label="Search by name, email, or employee ID"
          variant="outlined"
          fullWidth
          name="search"
          value={filters.search}
          onChange={handleFilterChange}
          sx={{ backgroundColor: "#f1f1f1", borderRadius: 1 }}
        />

        <Grid container spacing={2} sx={{ alignItems: "flex-end" }}>
          {["primarySkill", "experience", "designation", "department", "status", "projects", "projectManager", "reportingOfficer"].map((filterName) => (
            <Grid item xs={12} sm={6} md={4} key={filterName}>
              <FormControl fullWidth>
                <InputLabel>{filterName.split(/(?=[A-Z])/).join(" ")}</InputLabel>
                <Select
                  name={filterName}
                  value={filters[filterName]}
                  onChange={handleFilterChange}
                >
                  <MenuItem value="">All</MenuItem>
                  {[...new Set(data.map((row) => row[filterName]))].map((value) => (
                    <MenuItem key={value} value={value}>
                      {value}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          ))}

          <Grid item xs={12} sm={6} md={4}>
            <TextField
              label="Allocation End Date"
              type="date"
              InputLabelProps={{ shrink: true }}
              fullWidth
              name="allocationEndDate"
              value={filters.allocationEndDate}
              onChange={handleFilterChange}
            />
          </Grid>
        </Grid>
      </Box>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  {columns.map((column) => (
                    <TableCell key={column}>{column}</TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedData.map((row) => (
                  <TableRow key={row.key}>
                    <TableCell>
                      <Checkbox
                        checked={selectedRows.includes(row)}
                        onChange={() => handleCheckboxChange(row)}
                      />
                    </TableCell>
                    <TableCell>{row.resource}</TableCell>
                    <TableCell>{row.employeeId}</TableCell>
                    <TableCell>{row.primarySkill}</TableCell>
                    <TableCell>{row.experience}</TableCell>
                    <TableCell>{row.designation}</TableCell>
                    <TableCell>{row.department}</TableCell>
                    <TableCell>{row.status}</TableCell>
                    <TableCell>{row.projects}</TableCell>
                    <TableCell>{row.allocation}</TableCell>
                    <TableCell>{row.allocationEndDate}</TableCell>
                    <TableCell>{row.projectManager}</TableCell>
                    <TableCell>{row.futureProjects}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <Box sx={{ mt: 2, textAlign: "center" }}>
            <TablePagination
              component="div"
              count={filteredData.length}
              page={page}
              onPageChange={handlePageChange}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={handleRowsPerPageChange}
            />
          </Box>

          <Box
            sx={{
              mt: 2,
              display: "flex",
              justifyContent: "flex-end",
              gap: 2,
            }}
          >
            <Button variant="contained" color="primary" onClick={handleAllocate}>
              Allocate
            </Button>
            <Button variant="contained" color="secondary">
              Deallocate
            </Button>
            {/* New Buttons */}
            <Button
              variant="contained"
              color="success"
              onClick={() => navigate("/upcoming_project")}
            >
              Upcoming Project
            </Button>
            <Button
              variant="contained"
              color="info"
              onClick={() => navigate("/project_list")}
            >
              Project List
            </Button>
          </Box>
        </>
      )}
    </div>
  );
};

export default EmployeeList;
