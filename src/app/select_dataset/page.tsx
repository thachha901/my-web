"use client"; // Khai báo đây là Client Component

import React, { useEffect, useState, useRef } from "react";

const SelectDataset = () => {
  const [datasets, setDatasets] = useState([]);
  const [selectedDataset, setSelectedDataset] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [imageSrc, setImageSrc] = useState(null); // Ảnh gốc
  const canvasRef = useRef(null); // Tham chiếu tới canvas

  useEffect(() => {
    const storedDatasets = JSON.parse(localStorage.getItem("datasets")) || [];
    setDatasets(storedDatasets);
  }, []);

  const handleSelectDataset = (datasetId) => {
    setSelectedDataset(datasetId);
  };

  const handleGetResult = async () => {
    if (!selectedDataset) {
      alert("Please select a dataset before proceeding.");
      return;
    }

    const selectedDatasetDetails = datasets.find(
      (dataset) => dataset.id === selectedDataset
    );

    if (!selectedDatasetDetails || !selectedDatasetDetails.file.length) {
      alert("Selected dataset does not contain any files.");
      return;
    }

    const imageFileUrl = selectedDatasetDetails.file[0]; // Lấy ảnh đầu tiên
    setImageSrc(imageFileUrl); // Lưu đường dẫn ảnh gốc

    const formData = new FormData();
    try {
      setIsLoading(true);

      // Upload ảnh đầu tiên tới backend
      const res = await fetch(imageFileUrl);
      if (!res.ok) {
        throw new Error("Failed to fetch image");
      }
      const blob = await res.blob();
      formData.append("image", blob);

      const response = await fetch(
        "https://3000-01jbhdb2dnqezstzwxjpj3a286.cloudspaces.litng.ai/predict",
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error(Backend error: ${response.statusText});
      }

      const data = await response.json();
      setResult(data); // Lưu dữ liệu predictions

      drawBoundingBoxes(imageFileUrl, data.predictions); // Vẽ bounding box
    } catch (error) {
      console.error("Error occurred:", error);
      alert(Error: ${error.message});
    } finally {
      setIsLoading(false);
    }
  };

  const drawBoundingBoxes = (imageUrl, predictions) => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    const image = new Image();

    // Màu sắc cố định cho 4 class
    const colors = {
      0: "red", // Class 0
      1: "blue", // Class 1
      2: "green", // Class 2
      3: "orange", // Class 3
    };

    image.src = imageUrl;
    image.onload = () => {
      // Thiết lập canvas với kích thước ảnh
      canvas.width = image.width;
      canvas.height = image.height;

      // Vẽ ảnh gốc lên canvas
      context.drawImage(image, 0, 0);

      // Vẽ bounding boxes
      predictions.forEach((pred) => {
        const { x_center, y_center, width, height, label } = pred;

        // Tính toán tọa độ pixel
        const xMin = (x_center - width / 2) * image.width;
        const yMin = (y_center - height / 2) * image.height;
        const boxWidth = width * image.width;
        const boxHeight = height * image.height;

        // Kiểm tra nếu label nằm trong danh sách
        const color = colors[label] || "gray"; // Nếu label không hợp lệ, dùng màu "gray"
        context.strokeStyle = color;
        context.lineWidth = 2;

        // Vẽ khung hình chữ nhật
        context.strokeRect(xMin, yMin, boxWidth, boxHeight);

        // Vẽ nhãn (label)
        context.fillStyle = color;
        context.font = "16px Arial";
        context.fillText(Class ${label}, xMin, yMin - 5);
      });
    };
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
                  className={`border p-2 rounded ${
                    selectedDataset === dataset.id
                      ? "bg-blue-500 text-gray-600"
                      : "bg-gray-600"
                  }`}
                >
                  {dataset.name}
                </button>
                {dataset.image && (
                  <img
                    src={dataset.image}
                    alt={dataset.name}
                    className="mt-2 w-full h-auto"
                  />
                )}
              </li>
            ))}
          </ul>
        )}
      </div>

      {selectedDataset && (
        <div className="fixed bottom-0 left-0 right-0 bg-white shadow-md p-4 flex justify-center">
          <button
            onClick={handleGetResult}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
          >
            {isLoading ? "Loading..." : "Get Result"}
          </button>
        </div>
      )}

      {/* Hiển thị canvas */}
      <div className="mt-8">
        <canvas ref={canvasRef} className="border" />
      </div>
    </div>
  );
};

export default SelectDataset;