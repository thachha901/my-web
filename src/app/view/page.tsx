"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

const ViewDataset = () => {
  const searchParams = useSearchParams();
  const datasetId = searchParams.get("datasetId");
  const [dataset, setDataset] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;
  const [loading, setLoading] = useState(true);
  const [imageUrls, setImageUrls] = useState([]);

  useEffect(() => {
    const fetchDataset = () => {
      if (datasetId) {
        const datasets = JSON.parse(localStorage.getItem("datasets")) || [];
        console.log("Datasets from localStorage:", datasets);

        const foundDataset = datasets.find((d) => d.id === datasetId);

        if (foundDataset) {
          setDataset(foundDataset);
          console.log("Found Dataset:", foundDataset);
        } else {
          console.log("Dataset not found for ID:", datasetId);
        }
        setLoading(false);
      }
    };

    fetchDataset();
  }, [datasetId]);

  useEffect(() => {
    if (dataset?.file) {
      setImageUrls(dataset.file); // Assuming dataset.file contains URLs now

      // No need to revoke URLs here since we are not creating object URLs anymore
    }
  }, [dataset]);

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, Math.ceil(imageUrls.length / itemsPerPage)));
  };

  const handlePreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  if (loading) return <p>Loading...</p>;

  const totalImages = imageUrls.length;
  const totalPages = Math.ceil(totalImages / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentImages = imageUrls.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <h1 className="text-3xl font-semibold mb-4 text-gray-600">{dataset?.name} images:</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {currentImages.length > 0 ? (
          currentImages.map((url, index) => (
            <div key={index} className="bg-white shadow-md rounded-lg p-4">
              <img
                src={url}
                alt={`Image ${index}`}
                className="w-full h-48 object-cover rounded-md"
              />
            </div>
          ))
        ) : (
          <p>No images found in this dataset.</p>
        )}
      </div>
      
      {imageUrls.length > itemsPerPage && (
        <div className="flex justify-between mt-4">
          <button
            onClick={handlePreviousPage}
            disabled={currentPage === 1}
            className="bg-gray-300 text-black px-4 py-2 rounded-lg hover:bg-gray-400"
          >
            Previous
          </button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className="bg-gray-300 text-black px-4 py-2 rounded-lg hover:bg-gray-400"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default ViewDataset;
