import React, { useState, useEffect } from "react";
import { Table, Button, Modal, Input, Select, DatePicker, message } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import axios from "axios";
import dayjs from "dayjs";

const { Option } = Select;

const ProjectListPage = () => {
  const [projects, setProjects] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://your-backend-url/api/projects");
      setProjects(response.data);
    } catch (error) {
      console.error("Error fetching projects:", error);
      message.error("Failed to fetch projects.");
    }
    setLoading(false);
  };

  const handleEdit = (project) => {
    setEditingProject(project);
    setIsEditing(true);
  };

  const handleSaveEdit = async () => {
    try {
      const response = await axios.put(
        `http://your-backend-url/api/projects/${editingProject.id}`,
        editingProject
      );

      if (response.status === 200) {
        message.success("Project updated successfully!");
        setIsEditing(false);
        fetchProjects(); // Refresh project list
      } else {
        message.error("Failed to update project.");
      }
    } catch (error) {
      console.error("Error updating project:", error);
      message.error("Failed to update project.");
    }
  };

  const handleDisable = async (id) => {
    try {
      const response = await axios.put(
        `http://your-backend-url/api/projects/${id}/disable`
      );

      if (response.status === 200) {
        message.success("Project disabled successfully!");
        fetchProjects(); // Refresh project list
      } else {
        message.error("Failed to disable project.");
      }
    } catch (error) {
      console.error("Error disabling project:", error);
      message.error("Failed to disable project.");
    }
  };

  const columns = [
    {
      title: "Project Name",
      dataIndex: "projectName",
      key: "projectName",
    },
    {
      title: "Project Manager",
      dataIndex: "projectManager",
      key: "projectManager",
    },
    {
      title: "Start Date",
      dataIndex: "startDate",
      key: "startDate",
      render: (date) => (date ? dayjs(date).format("YYYY-MM-DD") : "N/A"),
    },
    {
      title: "End Date",
      dataIndex: "endDate",
      key: "endDate",
      render: (date) => (date ? dayjs(date).format("YYYY-MM-DD") : "N/A"),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, project) => (
        <div style={{ display: "flex", gap: "10px" }}>
          <Button
            icon={<EditOutlined />}
            onClick={() => handleEdit(project)}
            disabled={project.isDisabled}
          >
            Edit
          </Button>
          <Button
            icon={<DeleteOutlined />}
            danger
            onClick={() => handleDisable(project.id)}
            disabled={project.isDisabled}
          >
            Disable
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div style={{ padding: "20px" }}>
      <h2>Project List</h2>
      <Table
        dataSource={projects}
        columns={columns}
        rowKey="id"
        loading={loading}
        pagination={{ pageSize: 10 }}
      />

      {/* Edit Modal */}
      {isEditing && (
        <Modal
          title="Edit Project"
          visible={isEditing}
          onCancel={() => setIsEditing(false)}
          onOk={handleSaveEdit}
        >
          <div style={{ marginBottom: "10px" }}>
            <label>Project Name</label>
            <Input
              value={editingProject.projectName}
              onChange={(e) =>
                setEditingProject((prev) => ({
                  ...prev,
                  projectName: e.target.value,
                }))
              }
            />
          </div>
          <div style={{ marginBottom: "10px" }}>
            <label>Project Manager</label>
            <Select
              style={{ width: "100%" }}
              value={editingProject.projectManager}
              onChange={(value) =>
                setEditingProject((prev) => ({
                  ...prev,
                  projectManager: value,
                }))
              }
            >
              <Option value="manager1">Manager 1</Option>
              <Option value="manager2">Manager 2</Option>
            </Select>
          </div>
          <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
            <DatePicker
              placeholder="Start Date"
              style={{ width: "50%" }}
              value={
                editingProject.startDate
                  ? dayjs(editingProject.startDate)
                  : null
              }
              onChange={(date) =>
                setEditingProject((prev) => ({
                  ...prev,
                  startDate: date ? date.toISOString() : null,
                }))
              }
            />
            <DatePicker
              placeholder="End Date"
              style={{ width: "50%" }}
              value={
                editingProject.endDate ? dayjs(editingProject.endDate) : null
              }
              onChange={(date) =>
                setEditingProject((prev) => ({
                  ...prev,
                  endDate: date ? date.toISOString() : null,
                }))
              }
            />
          </div>
        </Modal>
      )}
    </div>
  );
};

export default ProjectListPage;
