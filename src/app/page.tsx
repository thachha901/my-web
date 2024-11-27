"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";

const Page = () => {
  const [projects, setProjects] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newProject, setNewProject] = useState({
    name: "",
    description: "",
    project_type: "IMAGE_CLASSIFICATION",
    datasetId: "",
  });

  useEffect(() => {
    const fetchProjects = () => {
      const storedProjects = JSON.parse(localStorage.getItem("projects")) || [];
      const sortedProjects = storedProjects.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
      setProjects(sortedProjects.slice(0, 6));
    };

    fetchProjects();
  }, []); // Runs once when the component mounts

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProject((prevProject) => ({
      ...prevProject,
      [name]: value,
    }));
  };

  const handleSaveProject = () => {
    const projectToSave = {
      ...newProject,
      id: Date.now(),
      createdAt: new Date().toISOString(),
    };

    const existingProjects = JSON.parse(localStorage.getItem("projects")) || [];
    const updatedProjects = [projectToSave, ...existingProjects];
    localStorage.setItem("projects", JSON.stringify(updatedProjects));

    setProjects(updatedProjects.slice(0, 6));
    setIsModalOpen(false);
  };

  const deleteProject = (id) => {
    const updatedProjects = projects.filter((project) => project.id !== id);
    localStorage.setItem("projects", JSON.stringify(updatedProjects));
    setProjects(updatedProjects.slice(0, 6));
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-semibold text-black">Projects</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
        >
          + New Project
        </button>
      </div>
      <p className="text-l text-black">Recent Projects:</p>

      {projects.length === 0 ? (
        <div className="flex justify-center items-center h-96">
          <p className="text-lg text-gray-500">No project created yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <div
              key={project.id}
              className="bg-white shadow-md rounded-lg p-4 hover:shadow-lg transition-shadow flex flex-col"
            >
              <div className="flex items-center justify-center h-32 bg-gray-100 rounded-md mb-4">
                <img src="/project.png" alt="Project icon" className="h-16 w-16" />
              </div>
              <div className="flex-1">
                <h2 className="text-lg font-semibold">{project.name}</h2>
                <p className="text-sm text-gray-500">
                  Created: {new Date(project.createdAt).toLocaleString()}
                </p>
                <p className="text-sm text-gray-500">{project.project_type}</p>
                <p className="text-sm text-gray-500">Dataset ID: {project.datasetId}</p>
              </div>
              <div className="flex justify-end mt-4">
                <button
                  className="text-red-500 hover:text-red-600"
                  onClick={() => deleteProject(project.id)}
                >
                  🗑️
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white w-1/2 h-auto p-8 shadow-lg overflow-y-auto">
            <h2 className="text-xl font-semibold mb-4 text-black">Create New Project</h2>
            <div>
              <label className="block mb-2 text-black">Project Name:</label>
              <input
                type="text"
                name="name"
                value={newProject.name}
                onChange={handleInputChange}
                className="border border-gray-300 p-2 w-full mb-4 rounded text-black"
                placeholder="Enter project name"
              />
            </div>
            <div>
              <label className="block mb-2 text-black">Project Description:</label>
              <input
                type="text"
                name="description"
                value={newProject.description}
                onChange={handleInputChange}
                className="border border-gray-300 p-2 w-full mb-4 rounded text-black"
                placeholder="Enter project description"
              />
            </div>
            <div>
              <label className="block mb-2 text-black">Project Type:</label>
              <select
                name="project_type"
                value={newProject.project_type}
                onChange={handleInputChange}
                className="border border-gray-300 p-2 w-full mb-4 rounded text-black"
              >
                <option value="IMAGE_CLASSIFICATION">Image Classification</option>
                <option value="TEXT_CLASSIFICATION">Text Classification</option>
                <option value="OBJECT_DETECTION">Object Detection</option>
                <option value="SEGMENTATION">Segmentation</option>
              </select>
            </div>
            <div className="flex justify-between mt-6">
              <button
                onClick={() => setIsModalOpen(false)}
                className="bg-gray-300 text-black px-4 py-2 rounded-lg hover:bg-gray-400"
              >
                Cancel
              </button>
              <Link href={`/select_dataset?projectId=${newProject.id}`}>
                <div className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 cursor-pointer">
                  Create
                </div>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Page;
