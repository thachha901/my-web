"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";

const SelectDataset = ({ projectId }) => {
  const [datasets, setDatasets] = useState([]);
  const [selectedDataset, setSelectedDataset] = useState(null);

  useEffect(() => {
    const storedDatasets = JSON.parse(localStorage.getItem("datasets")) || [];
    setDatasets(storedDatasets);
  }, []);

  const handleSelectDataset = (datasetId) => {
    setSelectedDataset(datasetId);
  };

  const handleGetResult = () => {
    const projects = JSON.parse(localStorage.getItem("projects")) || [];
    
    // Create a new project object
    const newProject = {
      id: Date.now(), // Unique ID
      name: `Project ${new Date().toLocaleString()}`, // You can customize this
      description: "Description of the project", // You can customize this
      project_type: "IMAGE_CLASSIFICATION", // You can customize this
      datasetId: selectedDataset,
      createdAt: new Date().toISOString(),
    };
  
    // Add the new projecat to the existing projects array
    const updatedProjects = [newProject, ...projects];
    localStorage.setItem("projects", JSON.stringify(updatedProjects));
  
    // Navigate to the results page
    router.push({
      pathname: "/project_result",
      query: { datasetId: selectedDataset, projectId: projectId },
    });
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <h1 className="text-3xl font-semibold text-black">Choose Dataset</h1>
      <div className="mt-6">
        {datasets.length === 0 ? (
          <p>No datasets available.</p>
        ) : (
          <ul>
            {datasets.map((dataset) => (
              <li key={dataset.id} className="mb-2">
                <button
                  onClick={() => handleSelectDataset(dataset.id)}
                  className={`border p-2 rounded ${selectedDataset === dataset.id ? 'bg-blue-500 text-white' : 'bg-white'}`}
                >
                  {dataset.name}
                </button>
                {dataset.image && (
                  <img src={dataset.image} alt={dataset.name} className="mt-2 w-full h-auto" />
                )}
              </li>
            ))}
          </ul>
        )}
      </div>

      {selectedDataset && (
        <div className="fixed bottom-0 left-0 right-0 bg-white shadow-md p-4 flex justify-center">
          <Link
            href={{
              pathname: "/project_result",
              query: { datasetId: selectedDataset, projectId: projectId },
            }}
            onClick={handleGetResult} // Save the selected dataset ID before navigating
          >
            <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
              Get Result
            </button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default SelectDataset;
