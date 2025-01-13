import React, { useState, useEffect } from "react";
import { Input, Select, DatePicker, Button, List, Card } from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import { useNavigate, useLocation } from "react-router-dom";
import dayjs from "dayjs";

const { Option } = Select;

const CreateProjectPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [projectName, setProjectName] = useState(() => {
    return localStorage.getItem("projectName") || "";
  });
  const [projectManager, setProjectManager] = useState(() => {
    return localStorage.getItem("projectManager") || null;
  });
  const [startDate, setStartDate] = useState(() => {
    const savedStartDate = localStorage.getItem("startDate");
    return savedStartDate ? dayjs(savedStartDate) : null;
  });
  const [endDate, setEndDate] = useState(() => {
    const savedEndDate = localStorage.getItem("endDate");
    return savedEndDate ? dayjs(savedEndDate) : null;
  });
  const [teamMembers, setTeamMembers] = useState(() => {
    const savedMembers = localStorage.getItem("teamMembers");
    return savedMembers ? JSON.parse(savedMembers) : [];
  });

  const selectedRows = location.state?.selectedRows || [];

  useEffect(() => {
    if (selectedRows.length > 0) {
      const formattedRows = selectedRows.map((row) => ({
        name: row.resource,
        role: row.designation,
        plannedStartDate: null,
      }));
      setTeamMembers((prev) => {
        const existingNames = prev.map((member) => member.name);
        const uniqueNewMembers = formattedRows.filter(
          (row) => !existingNames.includes(row.name)
        );
        return [...prev, ...uniqueNewMembers];
      });
    }
  }, [selectedRows]);

  useEffect(() => {
    // Save project details to localStorage
    localStorage.setItem("projectName", projectName);
    localStorage.setItem("projectManager", projectManager);
    localStorage.setItem("startDate", startDate ? startDate.toISOString() : "");
    localStorage.setItem("endDate", endDate ? endDate.toISOString() : "");
    localStorage.setItem("teamMembers", JSON.stringify(teamMembers));
  }, [projectName, projectManager, startDate, endDate, teamMembers]);

  const roles = [
    "Sr Software Engineer",
    "Software Engineer",
    "Lead Engineer",
    "QA",
    "Sr QA",
  ];

  const addTeamMember = (role) => {
    navigate("/homepage", {
      state: { role, existingTeamMembers: teamMembers },
    });
  };

  const handleTeamMemberChange = (index, key, value) => {
    const updatedMembers = [...teamMembers];
    if (key === "plannedStartDate") {
      if (value && !dayjs(value).isValid()) {
        console.error("Invalid date selected");
        return;
      }
    }
    updatedMembers[index][key] = value;
    setTeamMembers(updatedMembers);
  };

  const removeTeamMember = (index) => {
    setTeamMembers((prev) => prev.filter((_, i) => i !== index));
  };

  const handleCreateProject = () => {
    const projectData = {
      projectName,
      projectManager,
      startDate: startDate ? startDate.format("YYYY-MM-DD") : null,
      endDate: endDate ? endDate.format("YYYY-MM-DD") : null,
      teamMembers,
    };

    console.log("Project Created:", projectData);
    localStorage.clear(); // Clear localStorage after project creation
    navigate("/project_list", { state: { projectData } });
  };

  const categorizedMembers = roles.map((role) => ({
    role,
    members: teamMembers.filter((member) => member.role === role),
  }));

  return (
    <div style={{ maxWidth: "800px", margin: "auto", padding: "20px" }}>
       <Button onClick={() => navigate(-1)}>Back</Button>
      <h2>Create a New Project</h2>
      <div style={{ marginBottom: "20px" }}>
        <label>Project Name</label>
        <Input
          placeholder="Enter project name"
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
        />
      </div>
      <div style={{ marginBottom: "20px" }}>
        <label>Project Manager</label>
        <Select
          placeholder="Select..."
          style={{ width: "100%" }}
          value={projectManager}
          onChange={(value) => setProjectManager(value)}
        >
          <Option value="manager1">Manager 1</Option>
          <Option value="manager2">Manager 2</Option>
        </Select>
      </div>
      <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
        <div>
          <label>Planned Start Date</label>
          <DatePicker
            style={{ width: "100%" }}
            value={startDate}
            onChange={(date) => setStartDate(date)}
          />
        </div>
        <div>
          <label>Planned End Date</label>
          <DatePicker
            style={{ width: "100%" }}
            value={endDate}
            onChange={(date) => setEndDate(date)}
          />
        </div>
      </div>
      <div style={{ marginBottom: "20px" }}>
        <Card>
          {roles.map((role, index) => (
            <div
              key={index}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "10px",
              }}
            >
              <span>{role}</span>
              <Button
                icon={<PlusOutlined />}
                onClick={() => addTeamMember(role)}
              >
                Add team member
              </Button>
            </div>
          ))}
        </Card>
      </div>
      <div>
        {categorizedMembers.map(({ role, members }) => (
          <div key={role} style={{ marginBottom: "20px" }}>
            <h3>{role}</h3>
            <List
              bordered
              dataSource={members}
              renderItem={(member, index) => {
                const globalIndex = teamMembers.findIndex(
                  (tm) => tm === member
                );
                return (
                  <List.Item>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "5px",
                        width: "100%",
                      }}
                    >
                      <Input
                        placeholder="Enter member name"
                        value={member.name}
                        onChange={(e) =>
                          handleTeamMemberChange(
                            globalIndex,
                            "name",
                            e.target.value
                          )
                        }
                      />
                      <DatePicker
                        placeholder="Planned Start"
                        style={{ width: "100%" }}
                        value={
                          member.plannedStartDate
                            ? dayjs(member.plannedStartDate)
                            : null
                        }
                        onChange={(date) =>
                          handleTeamMemberChange(
                            globalIndex,
                            "plannedStartDate",
                            date ? date.toISOString() : null
                          )
                        }
                      />
                      <Button
                        icon={<DeleteOutlined />}
                        danger
                        onClick={() => removeTeamMember(globalIndex)}
                      >
                        Remove
                      </Button>
                    </div>
                  </List.Item>
                );
              }}
            />
          </div>
        ))}
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: "20px",
        }}
      >
       
        <Button onClick={() => navigate("/homepage")}>Cancel</Button>
        <Button type="primary" onClick={handleCreateProject}>
          Create Project
        </Button>
      </div>
    </div>
  );
};

export default CreateProjectPage;
