import React, { useState, useRef, useCallback, useEffect } from "react";
import { RxCross2 } from "react-icons/rx";
import upload from "../../assets/icons/upload.png";
import recipe from "../../assets/images/recipe/recipe1.webp";

const FileUpload = ({
  onFileSelect,
  accept = "image/*",
  maxSize = 5 * 1024 * 1024, // 5MB default
  className = "",
  label = "Drop your image here or ",
  subLabel = "Click to upload",
  fileTypes = "JPG, PNG, SVG, GIF",
  reset = false,
  defaultImage = null,
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [error, setError] = useState("");
  const [defaultImageRemoved, setDefaultImageRemoved] = useState(false);
  const fileInputRef = useRef(null);

  // Reset file when reset prop is true
  useEffect(() => {
    if (reset) {
      setUploadedFile(null);
      setError("");
      setDefaultImageRemoved(false);
      onFileSelect(null);
    }
  }, [reset, onFileSelect]);

  const validateFile = (file) => {
    // Check file size
    if (file.size > maxSize) {
      return `File ${file.name} is too large. Maximum size is ${
        maxSize / (1024 * 1024)
      }MB`;
    }

    // Check file type
    if (accept !== "image/*" && !accept.includes(file.type)) {
      return `File ${file.name} is not a supported file type`;
    }

    return null;
  };

  const processFiles = useCallback(
    (files) => {
      // Handle null/undefined files (for clearing)
      if (!files || files === null) {
        setUploadedFile(null);
        setError("");
        onFileSelect(null);
        return;
      }

      const file = files[0]; // Only take the first file
      const error = validateFile(file);

      if (error) {
        setError(error);
        return;
      }

      setError("");
      setUploadedFile(file);
      onFileSelect(file);
    },
    [maxSize, accept, onFileSelect]
  );

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      setIsDragOver(false);
      const files = e.dataTransfer.files;
      processFiles(files);
    },
    [processFiles]
  );

  const handleFileInput = useCallback(
    (e) => {
      const files = e.target.files;
      processFiles(files);
    },
    [processFiles]
  );

  const removeFile = useCallback(() => {
    setUploadedFile(null);
    onFileSelect(null);
  }, [onFileSelect]);

  const handleClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  return (
    <div className={`w-full ${className}`}>
      {!uploadedFile && defaultImage && !defaultImageRemoved ? (
        // Show default image preview
        <div className="relative border rounded-lg p-4 bg-white">
          <img
            src={defaultImage}
            alt="Default"
            className="w-full h-48 object-cover rounded"
          />
          <button
            onClick={() => {
              setDefaultImageRemoved(true);
              onFileSelect(null);
            }}
            className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2 hover:bg-red-600"
          >
            <RxCross2 className="text-sm" />
          </button>
        </div>
      ) : !uploadedFile ? (
        /* Drag and Drop Area - Only show when no file is uploaded */
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            isDragOver
              ? "border-blue-500 bg-blue-50"
              : "border-gray-300 bg-gray-50 hover:border-gray-400"
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={handleClick}
        >
          <div className="w-12 h-12 flex items-center justify-center mb-4 mx-auto">
            <img src={upload} alt="upload" />
          </div>

          <p className="text-sm text-gray-600 mb-2">
            {label}
            <span className="text-blue-500 cursor-pointer hover:underline">
              {subLabel}
            </span>
          </p>

          <p className="text-xs text-gray-400">
            {fileTypes} (Max {maxSize / (1024 * 1024)}MB)
          </p>

          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            onChange={handleFileInput}
            accept={accept}
          />
        </div>
      ) : (
        /* Image Preview - Show when file is uploaded */
        <div className="relative border rounded-lg p-4 bg-white">
          <img
            src={URL.createObjectURL(uploadedFile) || recipe}
            alt={uploadedFile.name}
            className="w-full h-48 object-cover rounded"
          />

          <p className="text-sm text-gray-600 mt-2 truncate">
            {uploadedFile.name}
          </p>

          <button
            onClick={removeFile}
            className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2 hover:bg-red-600"
          >
            <RxCross2 className="text-sm" />
          </button>
        </div>
      )}

      {/* Error Message */}
      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
    </div>
  );
};

export default FileUpload;
