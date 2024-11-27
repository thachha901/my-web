"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { v4 as uuidv4 } from 'uuid';

const Page = () => {
  const [datasets, setDatasets] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newDataset, setNewDataset] = useState({
    name: "",
    type: "user-private-dataset",
    datasetType: "",
    file: [],
    link: "",
  });
  const [selectedDataset, setSelectedDataset] = useState(null);
  const [activeTab, setActiveTab] = useState("view");
  const [currentPage, setCurrentPage] = useState(1);
  const [datasetsPerPage] = useState(6); // Number of datasets per page
  const [sidebarPosition, setSidebarPosition] = useState({ top: 0, left: 0 }); // State for sidebar position
  const sidebarRef = useRef(null);

  useEffect(() => {
    const storedDatasets = JSON.parse(localStorage.getItem("datasets")) || [];
    console.log("Loaded datasets:", storedDatasets);
    const sortedDatasets = storedDatasets.sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );
    setDatasets(sortedDatasets);

    // Close sidebar when clicking outside
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setSelectedDataset(null); // Close sidebar
      }
    };

    // Attach event listener
    document.addEventListener("mousedown", handleClickOutside);

    // Clean up event listener on unmount
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const indexOfLastDataset = currentPage * datasetsPerPage;
  const indexOfFirstDataset = indexOfLastDataset - datasetsPerPage;
  const currentDatasets = datasets.slice(indexOfFirstDataset, indexOfLastDataset);
  const totalPages = Math.ceil(datasets.length / datasetsPerPage);

  const handleSelectDataset = (event, dataset) => {
    setSelectedDataset(dataset);
    // Get the dataset element to calculate its center position
    const datasetElement = event.currentTarget;
    const rect = datasetElement.getBoundingClientRect();
    const sidebarPosition = {
      top: rect.top + window.scrollY + rect.height / 2, // Center vertically
      left: rect.left + window.scrollX + rect.width / 2, // Center horizontally
    };
    setSidebarPosition(sidebarPosition);
  };

  const openModal = () => {
    setIsModalOpen(true);
    setNewDataset({
      name: "",
      type: "user-private-dataset",
      datasetType: "",
      file: [],
      link: "",
    });
  };

  const handleSaveDataset = async () => {
    const uploadFileToCloudStorage = async (file) => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(URL.createObjectURL(file)); // Mocking file upload
        }, 1000);
      });
    };

    const uploadedFileUrls = await Promise.all(newDataset.file.map(file => uploadFileToCloudStorage(file)));

    const datasetToSave = {
      ...newDataset,
      id: uuidv4(),
      createdAt: new Date().toISOString(),
      file: uploadedFileUrls,
    };

    const updatedDatasets = [datasetToSave, ...datasets];
    
    console.log("Saving datasets to localStorage:", updatedDatasets);
    
    localStorage.setItem("datasets", JSON.stringify(updatedDatasets));
    setDatasets(updatedDatasets);
    setIsModalOpen(false);
  };

  const handleDeleteDataset = (datasetId) => {
    const updatedDatasets = datasets.filter((dataset) => dataset.id !== datasetId);
    localStorage.setItem("datasets", JSON.stringify(updatedDatasets));
    setDatasets(updatedDatasets);
  };

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto flex">
      <div className="flex-1">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-semibold text-black">Datasets</h1>
          <button
            onClick={openModal}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
          >
            + New Dataset
          </button>
        </div>

        <p className="text-l text-black">Recent Datasets:</p>

        {datasets.length === 0 ? (
          <div className="flex justify-center items-center h-96">
            <p className="text-lg text-gray-500">No dataset created yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentDatasets.map((dataset) => (
              <div
                key={dataset.id}
                className="bg-white shadow-md rounded-lg p-4 hover:shadow-lg transition-shadow flex flex-col cursor-pointer"
                onClick={(event) => handleSelectDataset(event, dataset)}
              >
                <div className="flex items-center justify-center h-32 bg-gray-100 rounded-md mb-4">
                  <img
                    src="/dataset.png"
                    alt="Dataset icon"
                    className="h-16 w-16"
                  />
                </div>
                <div className="flex-1">
                  <h2 className="text-lg font-semibold text-gray-700">{dataset.name}</h2>
                  <p className="text-sm text-gray-500">
                    Created: {new Date(dataset.createdAt).toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-500">{dataset.type}</p>
                </div>
                <div className="flex justify-end mt-4">
                  <button
                    className="text-red-500 hover:text-red-600"
                    onClick={(event) => {
                      event.stopPropagation();
                      handleDeleteDataset(dataset.id);
                    }}
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination Controls */}
        {datasets.length > datasetsPerPage && (
          <div className="flex justify-between mt-4">
            <button
              onClick={prevPage}
              disabled={currentPage === 1}
              className="bg-gray-300 text-black px-4 py-2 rounded-lg hover:bg-gray-400"
            >
              Previous
            </button>
            <span className="self-center">{`Page ${currentPage} of ${totalPages}`}</span>
            <button
              onClick={nextPage}
              disabled={currentPage === totalPages}
              className="bg-gray-300 text-black px-4 py-2 rounded-lg hover:bg-gray-400"
            >
              Next
            </button>
          </div>
        )}

        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white w-1/2 max-h-[90vh] overflow-y-auto p-8 shadow-lg rounded-lg">
              <h2 className="text-xl font-semibold mb-4 text-black">Create New Dataset</h2>
              <input
                type="text"
                name="title"
                value={newDataset.name}
                onChange={(e) => setNewDataset({ ...newDataset, name: e.target.value })}
                className="border border-gray-300 p-2 w-full mb-4 rounded text-black"
                placeholder="Enter dataset title"
              />
              <select
                name="type"
                value={newDataset.type}
                onChange={(e) => setNewDataset({ ...newDataset, type: e.target.value })}
                className="border border-gray-300 p-2 w-full mb-4 rounded text-black"
              >
                <option value="user-private-dataset">User Private Dataset</option>
                <option value="public-dataset">Public Dataset</option>
              </select>
              <label className="block mb-3 text-sm font-medium text-gray-900">Choose Images</label>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={(e) =>
                  setNewDataset({ ...newDataset, file: Array.from(e.target.files) })
                }
                className="border border-gray-300 p-2 w-full mb-4 rounded"
              />
              <input
                type="text"
                name="link"
                value={newDataset.link || ""}
                onChange={(e) => setNewDataset({ ...newDataset, link: e.target.value })}
                className="border border-gray-300 p-2 w-full mb-4 rounded text-black"
                placeholder="Dataset link"
              />
              <div className="flex justify-between mt-6">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="bg-gray-300 text-black px-4 py-2 rounded-lg hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveDataset}
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                >
                  Save Dataset
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Navigation Button */}
      {selectedDataset && (
        <div
          ref={sidebarRef}
          className="absolute bg-white border border-gray-300 p-4 rounded shadow-lg"
          style={{
            top: `${sidebarPosition.top}px`, // Use the new position
            left: `${sidebarPosition.left}px`,  // Use the new position
            transform: "translate(-50%, -50%)", // Center the sidebar
            zIndex: 1000, // Ensure it appears above other elements
          }}
        >
          {/* Navigation Tabs */}
          <div className="flex flex-col">
            <Link
              href={{
                pathname: "/view", // Adjust to the actual route
                query: { datasetId: selectedDataset.id.toString() },
              }}
            >
              <button
                className={`py-2 px-4 rounded-lg transition duration-200 ${
                  activeTab === "view" ? "bg-blue-500 text-white" : "bg-gray-300 text-black"
                } hover:bg-blue-600`}
                onClick={() => setActiveTab("view")}
              >
                View
              </button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default Page;