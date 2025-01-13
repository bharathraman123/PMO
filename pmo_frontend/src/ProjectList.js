import React, { useState, useEffect } from "react";
import { Table, Button, Modal, Input, Select, DatePicker, message } from "antd";
import { EditOutlined, DeleteOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import axios from "axios";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";


const { Option } = Select;
const { confirm } = Modal;

const ProjectListPage = () => {
  const [projects, setProjects] = useState([]);
  const [projectManagers, setProjectManagers] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProjects();
    fetchProjectManagers();
  }, []);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:5228/api/employees/projects"); // Corrected URL
      setProjects(response.data);
    } catch (error) {
      console.error("Error fetching projects:", error);
      message.error("Failed to fetch projects. Please try again later.");
    }
    setLoading(false);
  };

  const fetchProjectManagers = async () => {
    try {
      const response = await axios.get("http://localhost:5228/api/employees"); // Corrected URL
      setProjectManagers(response.data);
    } catch (error) {
      console.error("Error fetching project managers:", error);
      message.error("Failed to fetch project managers.");
    }
  };

  const handleEdit = (project) => {
    setEditingProject({ ...project }); // Make a copy to avoid directly mutating state
    setIsEditing(true);
  };

  const handleSaveEdit = async () => {
    try {
      const response = await axios.put(
        `http://localhost:5228/api/employees/projects/${editingProject.id}`, // Corrected URL
        editingProject
      );

      if (response.status === 200) {
        message.success("Project updated successfully!");
        setIsEditing(false);
        setEditingProject(null);
        fetchProjects(); // Refresh project list
      } else {
        message.error("Failed to update project.");
      }
    } catch (error) {
      console.error("Error updating project:", error);
      message.error("Failed to update project. Please check your input and try again.");
    }
  };

  const handleDisable = (id) => {
    confirm({
      title: "Are you sure you want to disable this project?",
      icon: <ExclamationCircleOutlined />,
      onOk: async () => {
        try {
          const response = await axios.put(
            `http://localhost:5228/api/employees/projects/${id}/disable` // Corrected URL
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
      },
    });
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
      <Button onClick={() => navigate(-1)}>Back</Button>
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
          onCancel={() => {
            setIsEditing(false);
            setEditingProject(null); // Reset editing state
          }}
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
              {projectManagers.map((manager) => (
                <Option key={manager.id} value={manager.name}>
                  {manager.name}
                </Option>
              ))}
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
