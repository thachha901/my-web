import React from "react";

const GuidePage = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-10">
      {/* Page Title */}
      <h1 className="text-4xl font-bold text-gray-800 mb-6">User Guide</h1>
      <p className="text-gray-600 text-center max-w-2xl mb-12">
        Follow these simple steps to create your project, select datasets, and get results.
      </p>

      {/* Steps Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 px-6 max-w-6xl">
        {/* Step 1 */}
        <div className="bg-white shadow-md rounded-lg p-6 text-center">
          <img
            src="/start.png" // Replace with your own icon
            alt="Start"
            className="w-16 h-16 mx-auto mb-4"
          />
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Step 1: Getting Start</h3>
          <p className="text-gray-600">
            Begin by clicking the "Create Dataset" button to initiate your journey.
          </p>
        </div>

        {/* Step 2 */}
        <div className="bg-white shadow-md rounded-lg p-6 text-center">
          <img
            src="/create.png" // Replace with your own icon
            alt="Fill Form"
            className="w-16 h-16 mx-auto mb-4"
          />
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Step 2: Create a new project</h3>
          <p className="text-gray-600">
            Enter the required details to define your project preferences and goals.
          </p>
        </div>

        {/* Step 3 */}
        <div className="bg-white shadow-md rounded-lg p-6 text-center">
          <img
            src="/select.png" // Replace with your own icon
            alt="Select Dataset"
            className="w-16 h-16 mx-auto mb-4"
          />
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Step 3: Select Dataset</h3>
          <p className="text-gray-600">
            Choose a dataset from the list or upload your own for analysis.
          </p>
        </div>

        {/* Step 4 */}
        <div className="bg-white shadow-md rounded-lg p-6 text-center">
          <img
            src="/result.png" // Replace with your own icon
            alt="Get Result"
            className="w-16 h-16 mx-auto mb-4"
          />
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Step 4: Get Results</h3>
          <p className="text-gray-600">
            View detailed results and insights based on your selected dataset.
          </p>
        </div>
      </div>
    </div>
  );
};

export default GuidePage;