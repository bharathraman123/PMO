import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"; // Import React Router components
import Login from "./Login"; // Import LoginPage component
import HomePage from "./HomePage";
import UpcomingProject from "./UpcomingProject";
import ProjectList from "./ProjectList";

function App() {
  return (
    <Router>
      <Routes>
        {/* Route for Login Page */}
        <Route path="/login" element={<Login />} />
        <Route path="/homepage" element={<HomePage />} />
        <Route path="/upcoming_project" element={<UpcomingProject />} />
        <Route path="/project_list" element={<ProjectList />} />
        {/* Add other routes here as needed */}
        <Route path="*" element={<h1>404 - Page Not Found</h1>} />
      </Routes>
    </Router>
  );
}

export default App;
