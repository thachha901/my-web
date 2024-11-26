"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

const ProjectResult = () => {
  const searchParams = useSearchParams();
  const datasetId = searchParams.get("datasetId");
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const imagesPerPage = 12;

  // Load dataset images
  useEffect(() => {
    const fetchDataset = () => {
      if (datasetId) {
        const datasets = JSON.parse(localStorage.getItem("datasets")) || [];
        const selectedDataset = datasets.find((d) => d.id === datasetId);

        if (selectedDataset) {
          setImages(selectedDataset.file || []);
        }
        setLoading(false);
      }
    };

    fetchDataset();
  }, [datasetId]);

  // Calculate pagination
  const totalPages = Math.ceil(images.length / imagesPerPage);
  const startIndex = (currentPage - 1) * imagesPerPage;
  const currentImages = images.slice(startIndex, startIndex + imagesPerPage);

  // Handle page change
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <h1 className="text-3xl font-semibold text-black">Project Results:</h1>
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {currentImages.length === 0 ? (
          <p className="text-black text-center col-span-full">
            No images available for this dataset.
          </p>
        ) : (
          currentImages.map((url, index) => (
            <div key={index} className="border rounded overflow-hidden shadow-md">
              <img
                src={url}
                alt={`Image ${index}`}
                className="w-full h-auto"
              />
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-8 flex justify-center items-center space-x-2">
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index}
              onClick={() => handlePageChange(index + 1)}
              className={`px-4 py-2 rounded-lg border ${
                currentPage === index + 1
                  ? "bg-blue-500 text-white"
                  : "bg-white text-black"
              }`}
            >
              {index + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProjectResult;