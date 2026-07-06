import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import { apiClient } from "../../api/axios.client.js";
import { setActiveResult } from "../../slices/activeResultSlice.js";

import LodingState from "../../components/LodingState.jsx";
import ErrorMessage from "../../components/ErrorMessage.jsx";
import Button from "../../components/Button.jsx";

const Results = () => {
  const { resultId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const results = useSelector((state) => state.results.results);

  const [isLoading, setIsloading] = useState(false);
  const [error, setError] = useState(null);
  const [activeEvidence, setActiveEvidence] = useState(null);

  const handleBackButton = () => {
    dispatch(setActiveResult(null));

    navigate("/dashboard/", { replace: true });
  };

  useEffect(() => {
    if (!results || results._id !== resultId) {
      const fetchResultById = async () => {
        setIsloading(true);
        setError(null);
        console.log("retry fetching");
        try {
          const response = await apiClient.get(`/users/results/${resultId}`);
          if (response.data?.success) {
            console.log(response.data.data);
            dispatch(setActiveResult(response.data.data));
          }
        } catch (error) {
          if (error.response) {
            const backendErrorMessage =
              error.response?.data?.message ||
              "Could not load analysis report.";
            setError(backendErrorMessage);
          } else if (error.request) {
            setError(
              "No response from server. Check your internet connection.",
            );
          } else {
            setError("Request setup failed");
          }
          console.error("Failed to fetch result", error);
        } finally {
          setIsloading(false);
        }
      };

      fetchResultById();
    }
  }, [resultId, results, dispatch]);

  if (isLoading) {
    return (
      <LodingState>
        Loading <br /> Analysis
      </LodingState>
    );
  }

  if (error) {
    return (
      <div className="w-full h-full flex flex-col justify-around">
        <ErrorMessage>{error}</ErrorMessage>
        <Button to={"/dashboard"} variant="primary" className="text-center">
          Back
        </Button>
      </div>
    );
  }

  if (!results) return null;

  const aspects = results?.aspects || [];
  const reviewText = results.input?.review;

  // calculate
  const totalAspects = aspects.length;
  const positiveCount = aspects.filter(
    (a) => a.sentiment === "positive",
  ).length;
  const negativeCount = aspects.filter(
    (a) => a.sentiment === "negative",
  ).length;

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-8 text-text-main">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border-subtle">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Review Analysis Report
          </h1>
        </div>
        <button
          onClick={handleBackButton}
          type="button"
          className="px-4 py-2 bg-surface hover:bg-border-subtle text-sm font-medium rounded-md border border-border-subtle transition-colors text-center cursor-pointer"
        >
          Back to Analyze
        </button>
      </div>

      {/* Overview */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 w-full p-4 bg-surface rounded-lg border border-border-subtle flex flex-col justify-between">
          <span className="text-xs font-semibold text-text-muted uppercase tracking-wider">
            Total Aspects Detected
          </span>
          <span className="text-3xl font-extrabold mt-2">{totalAspects}</span>
        </div>
        <div className="flex-1 w-full p-4 bg-success-subtle/20 rounded-lg border border-success/30 flex flex-col justify-between">
          <span className="text-xs font-semibold text-success uppercase tracking-wider">
            Positive Highlights
          </span>
          <span className="text-3xl font-extrabold text-success mt-2">
            {positiveCount}
          </span>
        </div>
        <div className="flex-1 w-full p-4 bg-error-subtle/20 rounded-lg border border-error/30 flex flex-col justify-between">
          <span className="text-xs font-semibold text-error uppercase tracking-wider">
            Negative Issues
          </span>
          <span className="text-3xl font-extrabold text-error mt-2">
            {negativeCount}
          </span>
        </div>
      </div>

      {/* Review */}
      {reviewText && (
        <div className="p-4 bg-surface rounded-lg border border-border-subtle space-y-2">
          <h3 className="text-xs font-semibold text-text-muted uppercase tracking-wider">
            Analyzed Review Text
          </h3>
          <p className="text-sm leading-relaxed italic text-text-main/90">
            "{reviewText}"
          </p>
        </div>
      )}

      {/* Detailed Aspects */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold">
          Detailed Findings ({totalAspects})
        </h2>

        {aspects.length === 0 ? (
          <p className="text-text-muted text-sm italic">
            No specific aspects were detected in this review.
          </p>
        ) : (
          <div className="flex flex-wrap gap-4">
            {aspects.map((item, index) => {
              const isPositive = item.sentiment === "positive";

              return (
                <div
                  key={index}
                  className={`w-full md:w-[calc(50%-0.5rem)] p-5 rounded-lg border flex flex-col justify-between transition-all bg-surface ${
                    isPositive
                      ? "border-success/30 hover:border-success/60"
                      : "border-error/30 hover:border-error/60"
                  }`}
                >
                  <div className="space-y-3">
                    {/* Category Tag & Sentiment Badge */}
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-semibold uppercase px-2.5 py-1 rounded bg-app border border-border-subtle text-text-muted tracking-wide">
                        {item.category?.replace(/_/g, " ")}
                      </span>
                      <span
                        className={`text-xs font-bold uppercase px-2.5 py-1 rounded-full ${
                          isPositive
                            ? "bg-success-subtle text-success border border-success/20"
                            : "bg-error-subtle text-error border border-error/20"
                        }`}
                      >
                        {item.sentiment}
                      </span>
                    </div>

                    {/* Claim Text */}
                    <p className="text-sm font-medium leading-snug">
                      "{item.claim}"
                    </p>
                  </div>

                  {/* Visual Evidence Footer */}
                  {item.evidence && (
                    <div className="mt-4 pt-3 border-t border-border-subtle/50 flex items-center justify-between text-xs text-text-muted">
                      <span>📸 Visual evidence attached</span>
                      <button
                        type="button"
                        onClick={() => setActiveEvidence(item.evidence)}
                        className="underline cursor-pointer hover:text-text-main font-semibold text-primary transition-colors focus:outline-none"
                      >
                        View Bounding Box
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Bounding Box Modal Overlay */}
      {activeEvidence && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fadeIn"
          onClick={() => setActiveEvidence(null)}
        >
          <div
            className="relative max-w-3xl w-full bg-surface border border-border-subtle rounded-lg p-4 overflow-hidden shadow-2xl flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="w-full flex items-center justify-between pb-3 mb-3 border-b border-border-subtle">
              <span className="text-sm font-bold tracking-wide text-text-main">
                Visual Evidence Verification
              </span>
              <button
                type="button"
                onClick={() => setActiveEvidence(null)}
                className="text-text-muted hover:text-text-main px-2 py-1 text-xs font-bold uppercase rounded bg-app border border-border-subtle transition-colors"
              >
                ✕ Close
              </button>
            </div>

            {/* Image & Bounding Box */}
            <div className="relative inline-block max-h-[70vh] overflow-hidden rounded bg-app border border-border-subtle">
              <img
                src={activeEvidence.photo_url}
                alt="Review evidence snapshot"
                className="max-h-[70vh] w-auto block object-contain"
              />

              {/* Bounding Box Overlay using 0-1000 scale */}
              {activeEvidence.bbox_2d &&
                Array.isArray(activeEvidence.bbox_2d) && (
                  <div
                    className="absolute border-2 border-error bg-error/20 pointer-events-none transition-all duration-200"
                    style={{
                      top: `${activeEvidence.bbox_2d[0] / 10}%`,
                      left: `${activeEvidence.bbox_2d[1] / 10}%`,
                      height: `${(activeEvidence.bbox_2d[2] - activeEvidence.bbox_2d[0]) / 10}%`,
                      width: `${(activeEvidence.bbox_2d[3] - activeEvidence.bbox_2d[1]) / 10}%`,
                    }}
                  >
                    <span className="absolute -top-6 left-0 bg-error text-white text-[10px] font-extrabold tracking-wider uppercase px-1.5 py-0.5 rounded shadow whitespace-nowrap">
                      Detected Evidence
                    </span>
                  </div>
                )}
            </div>

            <p className="text-xs text-text-muted mt-3 italic text-center">
              AI detection model highlighted spatial coordinates [ymin:{" "}
              {activeEvidence.bbox_2d?.[0]}, xmin: {activeEvidence.bbox_2d?.[1]}
              ] mapping directly to the physical claim.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Results;
