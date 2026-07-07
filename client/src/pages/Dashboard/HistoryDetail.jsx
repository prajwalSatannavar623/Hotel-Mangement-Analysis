import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

import ErrorMessage from "../../components/ErrorMessage.jsx";
import LodingState from "../../components/LodingState.jsx";

import { apiClient } from "../../api/axios.client.js";

const HistoryDetail = () => {
  const [historyDetails, setHistorydetails] = useState(null);
  const [isLoading, setIsloading] = useState(false);
  const [error, setError] = useState(null);
  const [activeEvidence, setActiveEvidence] = useState(null);

  const { inputId } = useParams();

  useEffect(() => {
    const fetchHistory = async () => {
      setError(null);
      setIsloading(true);

      try {
        const response = await apiClient.get(`/users/history/${inputId}`);

        if (response.data?.success) {
          const data = Array.isArray(response.data.data)
            ? response.data.data[0]
            : response.data.data;
          setHistorydetails(data);
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
        setIsloading(false);
      }
    };
    fetchHistory();
  }, [inputId]);

  if (isLoading) {
    return <LodingState>Fetching details</LodingState>;
  }

  if (error) {
    return (
      <div className="w-full h-full flex flex-col justify-center items-center p-6">
        <ErrorMessage>{error}</ErrorMessage>
        <Link
          to="/dashboard/history"
          className="mt-4 px-4 py-2 bg-surface border border-border-subtle rounded-lg font-medium"
        >
          Back to History
        </Link>
      </div>
    );
  }

  if (!historyDetails) return null;

  const aspects = historyDetails.aspects || [];
  const reviewText = historyDetails.input?.review;
  const inputImages = historyDetails.input?.images || [];
  const dateStr = historyDetails.createdAt
    ? new Date(historyDetails.createdAt).toLocaleString()
    : "Unknown Date";

  // Calculate
  const totalAspects = aspects.length;
  const positiveCount = aspects.filter(
    (a) => a.sentiment === "positive",
  ).length;
  const negativeCount = aspects.filter(
    (a) => a.sentiment === "negative",
  ).length;

  return (
    <div className="max-w-6xl mx-auto space-y-8 text-text-main bg-app w-full overflow-y-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border-subtle">
        <div>
          <h1 className="text-heading font-bold tracking-tight">
            Historical Analysis Report
          </h1>
          <p className="text-tiny text-error mt-1 ">Analyzed on {dateStr}</p>
        </div>
        <Link
          to="/dashboard/history"
          className="px-4 py-2 bg-surface hover:bg-border-subtle text-sm font-medium rounded-md border border-border-subtle transition-colors text-center"
        >
          Back to History
        </Link>
      </div>

      {/* input */}
      <div className="space-y-4">
        <h2 className="text-large font-bold uppercase">Input :</h2>

        <div className="flex flex-col lg:flex-row gap-6">
          <div className="w-full lg:w-[calc(55%-0.75rem)] p-5 bg-surface rounded-xl border border-border-subtle flex flex-col">
            <h3 className="text-tiny font-bold text-text-muted uppercase tracking-wider mb-3">
              Submitted Review
            </h3>
            <p className="text-tiny leading-relaxed text-text-main/90 whitespace-pre-wrap">
              {reviewText}
            </p>
          </div>

          {/* Submitted Images */}
          <div className="w-full lg:w-[calc(45%-0.75rem)] p-5 bg-surface rounded-xl border border-border-subtle flex flex-col">
            <h3 className="text-tiny font-bold text-text-muted uppercase tracking-wider mb-3">
              Submitted Photos ({inputImages.length})
            </h3>
            {inputImages.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {inputImages.map((img) => (
                  <a
                    key={img._id}
                    href={img.imageUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-[calc(50%-0.25rem)] block aspect-square overflow-hidden rounded-md border border-border-subtle"
                  >
                    <img
                      src={img.imageUrl}
                      alt="User submitted"
                      className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                    />
                  </a>
                ))}
              </div>
            ) : (
              <p className="text-sm text-text-muted italic">
                No images submitted.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Summary */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 w-full p-4 bg-surface rounded-lg border border-border-subtle flex flex-col justify-between">
          <span className="text-xs font-semibold text-text-muted uppercase tracking-wider">
            Total Aspects
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

      {/* findings */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold">Extracted Claims & Evidence</h2>

        {aspects.length === 0 ? (
          <p className="text-text-muted text-sm italic">
            No specific aspects were detected in this review.
          </p>
        ) : (
          <div className="flex flex-wrap gap-4">
            {aspects.map((item) => {
              const isPositive = item.sentiment === "positive";

              return (
                <div
                  key={item._id}
                  className={`w-full md:w-[calc((100%-1rem)/2)] p-5 rounded-lg border flex flex-col justify-between transition-all bg-surface ${
                    isPositive
                      ? "border-success/30 hover:border-success/60"
                      : "border-error/30 hover:border-error/60"
                  }`}
                >
                  <div className="space-y-3">
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

                    <p className="text-sm font-medium leading-snug">
                      "{item.claim}"
                    </p>
                  </div>

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

      {/* bounding box */}
      {activeEvidence && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fadeIn"
          onClick={() => setActiveEvidence(null)}
        >
          <div
            className="relative max-w-3xl w-full bg-surface border border-border-subtle rounded-lg p-4 overflow-hidden shadow-2xl flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
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

            <div className="relative inline-block max-h-[70vh] overflow-hidden rounded bg-app border border-border-subtle">
              <img
                src={activeEvidence.photo_url}
                alt="Review evidence snapshot"
                className="max-h-[70vh] w-auto block object-contain"
              />

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

export default HistoryDetail;
