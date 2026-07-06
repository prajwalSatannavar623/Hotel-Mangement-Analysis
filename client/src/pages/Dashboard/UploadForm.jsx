import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MdAddPhotoAlternate, MdClose } from "react-icons/md";

import Button from "../../components/Button";
import ErrorMessage from "../../components/ErrorMessage";
import LodingState from "../../components/LodingState";

import { apiClient } from "../../api/axios.client.js";

const UploadForm = () => {
  const [review, setReview] = useState("");
  const [selectedFiles, setSelectedfiles] = useState([]);
  const [isAnalyzing, setIsanalyzing] = useState(false);
  const [error, setError] = useState(null);

  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    console.log("form submited");

    setError(null);

    if (!review) {
      setError("* Paste the review");
      return;
    }

    setIsanalyzing(true);
    try {
      const formData = new FormData();
      formData.append("review", review);

      selectedFiles.forEach((file) => {
        formData.append("photos", file);
      });

      const response = await apiClient.post(
        "/users/get-review-analysis",
        formData,
      );

      if (response.data.success) {
        console.log(response.data);
        navigate("/dashboard/results");
      }
    } catch (error) {
      if (error.response) {
        const backendErrorMessage =
          error.response?.data?.message || "Internal server error";

        setError(backendErrorMessage);
      } else if (error.request) {
        setError("No response from server. Check your internet connection.");
      } else {
        setError("Request setup failed");
      }
    } finally {
      setIsanalyzing(false);
    }
  };

  const handlePhotoUpload = (e) => {
    const newFiles = Array.from(e.target.files || []);
    if (newFiles.length > 0 && selectedFiles.length + newFiles.length <= 5) {
      setSelectedfiles((prevFiles) => [...prevFiles, ...newFiles]);
    } else if (newFiles.length + selectedFiles.length > 5) {
      setError("Max * 5 images can be uploaded");
    } else {
      setError(null);
    }

    e.target.value = null;
  };

  const removeFile = (indexToRemove) => {
    setSelectedfiles((prev) => prev.filter((_, idx) => idx !== indexToRemove));

    if (selectedFiles.length <= 5) {
      setError(null);
    }
  };

  return (
    <div className="flex flex-col justify-start gap-3 text-text-main">
      <h1 className="text-heading">Upload review and photos</h1>
      {error && <ErrorMessage>{error}</ErrorMessage>}
      {isAnalyzing && <LodingState>Analyzing</LodingState>}
      <form
        onSubmit={handleFormSubmit}
        className="flex flex-col justify-between items-center gap-10"
      >
        <div className="flex justify-around items-center gap-4">
          <div className="mr-auto">
            <label htmlFor="review"></label>
            <textarea
              value={review}
              onChange={(e) => setReview(e.target.value)}
              id="review"
              className="w-100 h-50 border border-border-subtle rounded bg-surface text-tiny text-text-main outline-none p-2"
              placeholder="Paste review here"
              disabled={isAnalyzing}
            ></textarea>
          </div>
          <div className="flex flex-col justify-center items-center">
            <Button
              variant="primary"
              onClick={() => fileInputRef.current?.click()}
              className="w-40 h-40 rounded-full"
              disabled={isAnalyzing}
            >
              <div className="flex flex-col justify-center items-center">
                <MdAddPhotoAlternate />
                <span>Add photos</span>
              </div>
            </Button>
            <input
              ref={fileInputRef}
              name="photos"
              type="file"
              multiple
              className="hidden"
              accept="image/*"
              onChange={handlePhotoUpload}
              disabled={isAnalyzing}
            />

            {selectedFiles.length > 0 && (
              <span className="text-tiny font-medium text-success">
                * {selectedFiles.length} file
                {selectedFiles.length > 1 ? "s" : ""} selected
              </span>
            )}
          </div>
        </div>

        {/* selected Preview */}
        {selectedFiles.length > 0 && (
          <>
            <div className="w-full flex flex-wrap gap-2 p-3 bg-surface border border-border-subtle rounded-lg max-h-32 overflow-y-auto">
              {selectedFiles.map((file, index) => (
                <div
                  key={`${file.name}-${index}`}
                  className="flex items-center gap-2 px-2.5 py-1 rounded-md bg-elevated border border-border-subtle text-tiny"
                >
                  <span className="truncate max-w-37.5 font-medium">
                    {file.name}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeFile(index)}
                    className="text-text-muted hover:text-error transition-colors font-bold text-sm"
                  >
                    <MdClose className="hover:cursor-pointer" />
                  </button>
                </div>
              ))}
            </div>
          </>
        )}
        <Button
          type="submit"
          variant="secondary"
          className="w-full"
          disabled={isAnalyzing}
        >
          Analyse
        </Button>
      </form>
    </div>
  );
};

export default UploadForm;
