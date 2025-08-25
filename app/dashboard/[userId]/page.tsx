/* eslint-disable @typescript-eslint/no-explicit-any */
// src/app/page.tsx
"use client";

import { useState, useEffect } from "react";

// Keep all the interfaces the same
interface ClarifierQuestion {
  question: string;
  answer?: string;
}

interface StartConversationResponse {
  session_id: string;
  clarifier_questions: ClarifierQuestion[];
  status: string;
}

interface ClarifyResponse {
  session_id: string;
  clarifier_questions: ClarifierQuestion[];
  status: string;
}

interface GenerateProductResponse {
  session_id: string;
  product_data: {
    name: string;
    description: string;
    features: Array<{
      name: string;
      description: string;
    }>;
  };
  diagram_url?: string;
  status: string;
}

interface CompleteWorkflowResponse {
  session_id: string;
  final_data: {
    customer?: any;
    engineer?: any;
    risk?: any;
    diagram_url?: string;
  };
  summary: string;
  tts_file?: string;
  status: string;
}

export default function ProductConversationPage() {
  // State management
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [textInput, setTextInput] = useState<string>("");
  const [clarifierQuestions, setClarifierQuestions] = useState<
    ClarifierQuestion[]
  >([]);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [productData, setProductData] = useState<any>(null);
  const [finalData, setFinalData] = useState<any>(null);
  const [summary, setSummary] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [currentStep, setCurrentStep] = useState<
    "start" | "clarifying" | "product" | "complete"
  >("start");
  const [progress, setProgress] = useState<string>("");
  const [apiStatus, setApiStatus] = useState<"checking" | "online" | "offline">(
    "checking"
  );

  // Use the proxy API route
  const API_BASE_URL = "/api/proxy";

  // Check API health
  const checkApiHealth = async () => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);

      const response = await fetch(`${API_BASE_URL}/health`, {
        method: "GET",
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        setApiStatus("online");
        return true;
      }
      setApiStatus("offline");
      return false;
    } catch (error) {
      console.error("API health check failed:", error);
      setApiStatus("offline");
      return false;
    }
  };

  // Check API health on component mount
  useEffect(() => {
    const checkHealth = async () => {
      setApiStatus("checking");
      await checkApiHealth();
    };

    checkHealth();

    // Set up periodic health checks
    const intervalId = setInterval(checkHealth, 30000); // Check every 30 seconds

    return () => clearInterval(intervalId);
  }, []);

  // Start a new conversation
  const startConversation = async () => {
    if (!textInput.trim()) {
      setError("Please enter a product idea");
      return;
    }

    setLoading(true);
    setError("");
    setProgress("Starting conversation...");

    try {
      // First check if API is available
      const isHealthy = await checkApiHealth();
      if (!isHealthy) {
        throw new Error(
          "API server is not responding. Please check if the server is running."
        );
      }

      const response = await fetch(`${API_BASE_URL}/start-conversation`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text_input: textInput }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.error ||
            errorData.detail ||
            `Failed to start conversation: ${response.status}`
        );
      }

      const data: StartConversationResponse = await response.json();
      setSessionId(data.session_id);
      setClarifierQuestions(data.clarifier_questions);
      setCurrentStep("clarifying");
      setProgress("");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unknown error occurred"
      );
      setProgress("");
    } finally {
      setLoading(false);
    }
  };

  // Submit answers to clarifier questions
  const submitAnswers = async () => {
    if (!sessionId) return;

    setLoading(true);
    setError("");
    setProgress("Processing your answers...");

    try {
      const response = await fetch(`${API_BASE_URL}/clarify`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          session_id: sessionId,
          answers: clarifierQuestions.map((q) => ({
            question: q.question,
            answer: answers[q.question] || "",
          })),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.error ||
            errorData.detail ||
            `Failed to submit answers: ${response.status}`
        );
      }

      const data: ClarifyResponse = await response.json();

      if (data.status === "clarification_complete") {
        generateProduct();
      } else {
        setClarifierQuestions(data.clarifier_questions);
        setAnswers({});
        setProgress("");
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unknown error occurred"
      );
      setProgress("");
    } finally {
      setLoading(false);
    }
  };

  // Generate product specifications
  const generateProduct = async () => {
    if (!sessionId) return;

    setLoading(true);
    setError("");
    setProgress("Generating product specifications...");

    try {
      const response = await fetch(`${API_BASE_URL}/generate-product`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ session_id: sessionId }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.error ||
            errorData.detail ||
            `Failed to generate product: ${response.status}`
        );
      }

      const data: GenerateProductResponse = await response.json();
      setProductData(data.product_data);
      setCurrentStep("product");
      setProgress("");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unknown error occurred"
      );
      setProgress("");
    } finally {
      setLoading(false);
    }
  };

  // Complete the workflow
  const completeWorkflow = async () => {
    if (!sessionId) return;

    setLoading(true);
    setError("");
    setProgress("Completing workflow...");

    try {
      const response = await fetch(`${API_BASE_URL}/complete-workflow`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          session_id: sessionId,
          generate_audio: true,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.error ||
            errorData.detail ||
            `Failed to complete workflow: ${response.status}`
        );
      }

      const data: CompleteWorkflowResponse = await response.json();
      setFinalData(data.final_data);
      setSummary(data.summary);
      setCurrentStep("complete");
      setProgress("");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unknown error occurred"
      );
      setProgress("");
    } finally {
      setLoading(false);
    }
  };

  // Handle answer input changes
  const handleAnswerChange = (question: string, answer: string) => {
    setAnswers((prev) => ({
      ...prev,
      [question]: answer,
    }));
  };

  // Reset the conversation
  const resetConversation = () => {
    setSessionId(null);
    setTextInput("");
    setClarifierQuestions([]);
    setAnswers({});
    setProductData(null);
    setFinalData(null);
    setSummary("");
    setError("");
    setCurrentStep("start");
    setProgress("");
  };

  // Render the current step
  const renderStep = () => {
    switch (currentStep) {
      case "start":
        return (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">
              Describe Your Product Idea
            </h2>
            <textarea
              className="w-full p-3 border border-gray-300 rounded-md mb-4 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              rows={4}
              placeholder="Enter your product idea here..."
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
            />
            <button
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:bg-blue-300 transition-colors"
              onClick={startConversation}
              disabled={loading || apiStatus !== "online"}
            >
              Start Conversation
            </button>
          </div>
        );

      case "clarifying":
        return (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">
              Clarify Your Requirements
            </h2>
            <p className="text-gray-600 mb-4">
              Please answer the following questions to help us understand your
              needs better:
            </p>

            <div className="space-y-4 mb-6">
              {clarifierQuestions.map((q, index) => (
                <div key={index} className="border-b pb-4">
                  <p className="font-medium mb-2">{q.question}</p>
                  <input
                    type="text"
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Your answer..."
                    value={answers[q.question] || ""}
                    onChange={(e) =>
                      handleAnswerChange(q.question, e.target.value)
                    }
                  />
                </div>
              ))}
            </div>

            <div className="flex space-x-3">
              <button
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:bg-blue-300 transition-colors"
                onClick={submitAnswers}
                disabled={loading || apiStatus !== "online"}
              >
                Submit Answers
              </button>
              <button
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 transition-colors"
                onClick={resetConversation}
              >
                Start Over
              </button>
            </div>
          </div>
        );

      case "product":
        return (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">
              Product Specifications
            </h2>

            {productData && (
              <div className="mb-6">
                <h3 className="text-lg font-medium mb-2">{productData.name}</h3>
                <p className="text-gray-700 mb-4">{productData.description}</p>

                <h4 className="font-medium mb-2">Features:</h4>
                <ul className="list-disc pl-5 mb-4 space-y-2">
                  {productData.features.map((feature: any, index: number) => (
                    <li key={index} className="mb-2">
                      <span className="font-medium">{feature.name}:</span>{" "}
                      {feature.description}
                    </li>
                  ))}
                </ul>

                {productData.diagram_url && (
                  <div className="mb-4">
                    <h4 className="font-medium mb-2">Product Diagram:</h4>
                    <div className="border rounded-md overflow-hidden">
                      <img
                        src={productData.diagram_url}
                        alt="Product Diagram"
                        className="max-w-full h-auto"
                      />
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className="flex space-x-3">
              <button
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:bg-blue-300 transition-colors"
                onClick={completeWorkflow}
                disabled={loading || apiStatus !== "online"}
              >
                Complete Analysis
              </button>
              <button
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 transition-colors"
                onClick={resetConversation}
              >
                Start Over
              </button>
            </div>
          </div>
        );

      case "complete":
        return (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">
              Product Analysis Complete
            </h2>

            <div className="mb-6">
              <h3 className="text-lg font-medium mb-2">Summary</h3>
              <div className="bg-blue-50 p-4 rounded-md">
                <p className="text-gray-700">{summary}</p>
              </div>
            </div>

            {finalData && (
              <div className="space-y-6">
                {finalData.customer && (
                  <div>
                    <h3 className="text-lg font-medium mb-2">
                      Customer Analysis
                    </h3>
                    <div className="bg-gray-50 p-4 rounded-md overflow-x-auto">
                      <pre className="whitespace-pre-wrap text-sm">
                        {JSON.stringify(finalData.customer, null, 2)}
                      </pre>
                    </div>
                  </div>
                )}

                {finalData.engineer && (
                  <div>
                    <h3 className="text-lg font-medium mb-2">
                      Technical Analysis
                    </h3>
                    <div className="bg-gray-50 p-4 rounded-md overflow-x-auto">
                      <pre className="whitespace-pre-wrap text-sm">
                        {JSON.stringify(finalData.engineer, null, 2)}
                      </pre>
                    </div>
                  </div>
                )}

                {finalData.risk && (
                  <div>
                    <h3 className="text-lg font-medium mb-2">
                      Risk Assessment
                    </h3>
                    <div className="bg-gray-50 p-4 rounded-md overflow-x-auto">
                      <pre className="whitespace-pre-wrap text-sm">
                        {JSON.stringify(finalData.risk, null, 2)}
                      </pre>
                    </div>
                  </div>
                )}

                {finalData.diagram_url && (
                  <div>
                    <h3 className="text-lg font-medium mb-2">
                      Product Diagram
                    </h3>
                    <div className="border rounded-md overflow-hidden">
                      <img
                        src={finalData.diagram_url}
                        alt="Product Diagram"
                        className="max-w-full h-auto"
                      />
                    </div>
                  </div>
                )}

                {finalData.tts_file && (
                  <div>
                    <h3 className="text-lg font-medium mb-2">Audio Summary</h3>
                    <div className="bg-gray-50 p-4 rounded-md">
                      <audio controls className="w-full">
                        <source src={finalData.tts_file} type="audio/mpeg" />
                        Your browser does not support the audio element.
                      </audio>
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className="mt-6">
              <button
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                onClick={resetConversation}
              >
                Start New Conversation
              </button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  // Render API status indicator
  const renderApiStatus = () => {
    switch (apiStatus) {
      case "checking":
        return (
          <div className="flex items-center text-sm text-gray-500">
            <div className="h-2 w-2 rounded-full bg-gray-400 mr-2 animate-pulse"></div>
            Checking API status...
          </div>
        );
      case "online":
        return (
          <div className="flex items-center text-sm text-green-600">
            <div className="h-2 w-2 rounded-full bg-green-500 mr-2"></div>
            API is online
          </div>
        );
      case "offline":
        return (
          <div className="flex items-center text-sm text-red-600">
            <div className="h-2 w-2 rounded-full bg-red-500 mr-2"></div>
            API is offline
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Product Conversation
          </h1>
          <p className="text-gray-600">
            Describe your product idea and get a comprehensive analysis
          </p>
          <div className="mt-2 flex justify-center">{renderApiStatus()}</div>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-red-400"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
                <div className="mt-2">
                  <button
                    onClick={() => setError("")}
                    className="text-sm text-red-700 hover:text-red-900 underline"
                  >
                    Dismiss
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {progress && (
          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-blue-400"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-blue-700">{progress}</p>
              </div>
            </div>
          </div>
        )}

        {loading && (
          <div className="flex justify-center mb-6">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
          </div>
        )}

        {renderStep()}

        {/* Add a troubleshooting section for API issues */}
        {apiStatus === "offline" && (
          <div className="mt-8 bg-yellow-50 p-4 rounded-md">
            <h3 className="text-lg font-medium text-yellow-800 mb-2">
              Troubleshooting
            </h3>
            <p className="text-yellow-700 mb-2">
              If you're seeing this error, it means the application couldn't
              connect to the API server.
            </p>
            <ul className="list-disc pl-5 text-yellow-700 space-y-1">
              <li>Make sure the API server is running on port 8000</li>
              <li>
                Check that there are no firewall issues blocking the connection
              </li>
              <li>Verify the API server URL is correct</li>
              <li>Try refreshing the page after starting the API server</li>
            </ul>
          </div>
        )}

        <footer className="mt-12 text-center text-gray-500 text-sm">
          <p>Product Conversation App &copy; {new Date().getFullYear()}</p>
        </footer>
      </div>
    </div>
  );
}
