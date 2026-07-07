import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowAltCircleRight } from "react-icons/fa";

import ErrorMessage from "../../components/ErrorMessage.jsx";
import LodingState from "../../components/LodingState.jsx";
import Button from "../../components/Button.jsx";

import { apiClient } from "../../api/axios.client.js";

const History = () => {
  const [userHistory, setUserhistory] = useState([]);
  const [isLoading, setIsloading] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setError(null);
        setIsloading(true);

        const response = await apiClient.get("/users/me/history");

        if (response.data?.success) {
          const history = Array.from(response.data.data);
          console.log(history);
          setUserhistory(history);
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
  }, []);

  return (
    <div className="bg-app text-text-main w-full h-full flex flex-col space-y-6">
      <div className="border-b border-border-subtle pb-4">
        <h1 className="text-2xl font-bold tracking-tight">Analysis History</h1>
        <p className="text-sm text-text-muted mt-1">
          Review your past AI analysis reports and visual evidence.
        </p>
        <span className="text-error text-tiny">
          <i>**Only recent 20 results will be retained**</i>
        </span>
      </div>

      {error && <ErrorMessage>{error}</ErrorMessage>}

      {isLoading ? (
        <LodingState>Loading History...</LodingState>
      ) : userHistory.length > 0 ? (
        <div className="flex flex-wrap gap-5 pb-8">
          {userHistory.map((history) => {
            const snippet =
              history.review?.length > 120
                ? history.review.slice(0, 120) + "..."
                : history.review;

            const dateStr = history.createdAt
              ? new Date(history.createdAt).toLocaleDateString()
              : "Recent";

            return (
              <div
                key={history._id}
                onClick={() => navigate(`/dashboard/results/${history._id}`)}
                className="w-full md:w-[calc((100%-1.25rem)/2)] lg:w-[calc((100%-2.5rem)/3)] group flex flex-col justify-between p-5 bg-surface border border-border-subtle rounded-xl cursor-pointer transition-all duration-200 hover:shadow-lg hover:border-primary/50 min-h-40"
              >
                <div className="flex justify-between items-center mb-3">
                  <span className="text-xs font-semibold text-error uppercase tracking-wider">
                    {dateStr}
                  </span>
                  {history.images?.length > 0 && (
                    <span className="text-[10px] font-bold bg-primary/10 text-primary px-2 py-1 rounded-md uppercase">
                      {history.images.length} Image
                      {history.images.length > 1 ? "s" : ""}
                    </span>
                  )}
                </div>

                <div className="flex-1">
                  <p className="text-sm leading-relaxed text-text-main/90 italic">
                    "{snippet}"
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-border-subtle/50 flex items-center justify-between text-xs font-semibold text-text-muted group-hover:text-primary transition-colors">
                  <span>View Full Report</span>
                  <span className="text-lg leading-none transform transition-transform">
                    <FaArrowAltCircleRight className="text-success" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="flex flex-col gap-1 items-center justify-center p-12 border-2 border-dashed border-border-subtle rounded-xl bg-surface/50 text-center">
          <div className="w-16 h-16 bg-elevated rounded-full flex items-center justify-center text-text-muted text-2xl mb-4">
            📄
          </div>
          <h3 className="text-lg font-bold">No history found</h3>
          <p className="text-sm text-text-muted mt-1 max-w-sm">
            You haven't analyzed any reviews yet. Head over to the Analyze page
            to get started.
          </p>
          <Button variant="primary" onClick={() => navigate("/dashboard")}>
            Analyse a Review
          </Button>
        </div>
      )}
    </div>
  );
};

export default History;
