/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { useState, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Bot,
  Users,
  Zap,
  Import,
  Send,
  AlertCircle,
  Calendar,
  Tag,
  Wifi,
  WifiOff,
  RefreshCw,
} from "lucide-react";

interface ClarifierQuestion {
  question: string;
  answer?: string;
}

interface WorkflowResponse {
  step:
    | "start"
    | "clarifier"
    | "product"
    | "customer"
    | "engineer"
    | "risk"
    | "summary"
    | "tts";
  status?: string;
  data?: any;
  error?: any;
  thread_id?: string;
  timestamp?: number;
}

interface Answer {
  question: string;
  answer: string;
}

export default function DashboardContent() {
  const [activeTab, setActiveTab] = useState("agents");
  const [prompt, setPrompt] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState<string | null>(null);
  const [finalSummary, setFinalSummary] = useState<string | null>(null);
  const [currentStatus, setCurrentStatus] = useState<string>("");
  const [questions, setQuestions] = useState<string[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(-1);
  const [threadId, setThreadId] = useState<string | null>(null);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [backendStatus, setBackendStatus] = useState<
    "unknown" | "online" | "offline"
  >("unknown");
  const [debugInfo, setDebugInfo] = useState<string>("");
  const isSubmittingRef = useRef(false);

  // Track completion of each workflow step
  const [completedSteps, setCompletedSteps] = useState({
    clarifier: false,
    product: false,
    customer: false,
    engineer: false,
    risk: false,
    summary: false,
  });

  const projects = [
    { id: 1, name: "UX Project", date: "2023-06-15", category: "Design" },
    {
      id: 2,
      name: "Landing Design",
      date: "2023-06-18",
      category: "Marketing",
    },
    { id: 3, name: "SEO", date: "2023-06-20", category: "Optimization" },
    { id: 4, name: "Brainstorm", date: "2023-06-22", category: "Ideation" },
  ];

  // Check backend status - use an existing endpoint instead of the root endpoint
  const checkBackendStatus = useCallback(async () => {
    try {
      // Try to access the start_conversation endpoint with a minimal request
      const response = await fetch("http://localhost:8000/start_conversation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        mode: "cors",
        body: JSON.stringify({ text_input: "test" }),
      });

      // We expect this to fail (probably with a validation error), but if it's a 404,
      // it means the endpoint doesn't exist, which indicates the backend is not properly set up
      if (response.status === 404) {
        setBackendStatus("offline");
        setDebugInfo(
          `Backend endpoint not found (404). Is the FastAPI server running with the correct routes?`
        );
      } else {
        // Any other response (even errors) means the backend is accessible
        setBackendStatus("online");
        setDebugInfo("");
      }
    } catch (err: any) {
      setBackendStatus("offline");
      setDebugInfo(
        `Backend connection error: ${err.message || err.toString()}`
      );
    }
  }, []);

  // Initialize backend status check
  useState(() => {
    checkBackendStatus();
    const interval = setInterval(checkBackendStatus, 30000); // Check every 30 seconds
    return () => clearInterval(interval);
  });

  // Process workflow stream
  const processWorkflowStream = async (response: Response) => {
    const reader = response.body?.getReader();
    if (!reader) throw new Error("No stream reader available");

    // Initialize a summary object to collect data from all steps
    const summaryData: any = {
      clarifier: null,
      product: null,
      customer: null,
      engineer: null,
      risk: null,
      summary: null,
    };

    // Reset completion tracking
    setCompletedSteps({
      clarifier: false,
      product: false,
      customer: false,
      engineer: false,
      risk: false,
      summary: false,
    });

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const text = new TextDecoder().decode(value);
      const lines = text.split("\n").filter(Boolean);

      for (const line of lines) {
        try {
          const data = JSON.parse(line) as WorkflowResponse;
          console.log("Processing workflow step:", data.step);

          switch (data.step) {
            case "start":
              setCurrentStatus("Starting workflow...");
              if (data.thread_id) {
                setThreadId(data.thread_id);
              }
              break;
            case "clarifier":
              setCurrentStatus("Analyzing requirements...");
              if (data.data?.resp) {
                summaryData.clarifier = data.data.resp;
                setCompletedSteps((prev) => ({ ...prev, clarifier: true }));

                const newQuestions = data.data.resp.map((q: any) => q.question);
                if (newQuestions.length > 0) {
                  setQuestions(newQuestions);
                  setCurrentQuestionIndex(0);
                  setCurrentQuestion(newQuestions[0]);
                  setCurrentStatus("Clarifying requirements...");
                }
              }
              break;
            case "product":
              setCurrentStatus("Processing product analysis...");
              if (data.data) {
                summaryData.product = data.data.product;
                setCompletedSteps((prev) => ({ ...prev, product: true }));
              }
              break;
            case "customer":
              setCurrentStatus("Processing customer analysis...");
              if (data.data) {
                summaryData.customer = data.data;
                setCompletedSteps((prev) => ({ ...prev, customer: true }));
              }
              break;
            case "engineer":
              setCurrentStatus("Processing engineering analysis...");
              if (data.data) {
                summaryData.engineer = data.data;
                setCompletedSteps((prev) => ({ ...prev, engineer: true }));
              }
              break;
            case "risk":
              setCurrentStatus("Processing risk analysis...");
              if (data.data) {
                summaryData.risk = data.data;
                setCompletedSteps((prev) => ({ ...prev, risk: true }));
              }
              break;
            case "summary":
              setCurrentStatus("Completing analysis...");
              if (data.data?.summary) {
                summaryData.summary = data.data.summary;
                setCompletedSteps((prev) => ({ ...prev, summary: true }));
              }
              break;
            case "tts":
              setCurrentStatus("Generating audio summary...");
              // Handle TTS if needed
              break;
          }

          // Check if all 5 steps are completed
          if (
            completedSteps.clarifier &&
            completedSteps.product &&
            completedSteps.customer &&
            completedSteps.engineer &&
            completedSteps.risk
          ) {
            // Create a comprehensive summary from all the collected data
            let formattedSummary = "";

            if (summaryData.clarifier) {
              formattedSummary += "## Clarifier Questions & Answers\n\n";
              summaryData.clarifier.forEach((item: any) => {
                formattedSummary += `**Question:** ${item.question}\n`;
                formattedSummary += `**Answer:** ${
                  item.answer || "Not answered"
                }\n\n`;
              });
            }

            if (summaryData.product) {
              formattedSummary += "## Product Analysis\n\n";
              formattedSummary += `**Name:** ${
                summaryData.product.name || "N/A"
              }\n\n`;
              formattedSummary += "**Features:**\n";
              if (
                summaryData.product.features &&
                summaryData.product.features.length > 0
              ) {
                summaryData.product.features.forEach((feature: string) => {
                  formattedSummary += `- ${feature}\n`;
                });
              } else {
                formattedSummary += "- No features specified\n";
              }
              formattedSummary += "\n";
            }

            if (summaryData.customer) {
              formattedSummary += "## Customer Analysis\n\n";
              formattedSummary += `**Segment:** ${
                summaryData.customer.segment || "N/A"
              }\n\n`;
              formattedSummary += "**Needs:**\n";
              if (
                summaryData.customer.needs &&
                summaryData.customer.needs.length > 0
              ) {
                summaryData.customer.needs.forEach((need: string) => {
                  formattedSummary += `- ${need}\n`;
                });
              } else {
                formattedSummary += "- No needs specified\n";
              }
              formattedSummary += "\n";
            }

            if (summaryData.engineer) {
              formattedSummary += "## Engineering Analysis\n\n";
              formattedSummary += `**Feasibility:** ${
                summaryData.engineer.feasibility || "N/A"
              }\n`;
              formattedSummary += `**Timeline:** ${
                summaryData.engineer.timeline || "N/A"
              }\n`;
              if (
                summaryData.engineer.tech_stack &&
                summaryData.engineer.tech_stack.length > 0
              ) {
                formattedSummary += `**Tech Stack:** ${summaryData.engineer.tech_stack.join(
                  ", "
                )}\n`;
              }
              formattedSummary += "\n";
            }

            if (summaryData.risk) {
              formattedSummary += "## Risk Analysis\n\n";
              formattedSummary += `**Risk Level:** ${
                summaryData.risk.level || "N/A"
              }\n\n`;
              formattedSummary += "**Mitigations:**\n";
              if (
                summaryData.risk.mitigations &&
                summaryData.risk.mitigations.length > 0
              ) {
                summaryData.risk.mitigations.forEach((mitigation: string) => {
                  formattedSummary += `- ${mitigation}\n`;
                });
              } else {
                formattedSummary += "- No mitigations specified\n";
              }
              formattedSummary += "\n";
            }

            if (summaryData.summary) {
              formattedSummary += "## Overall Summary\n\n";
              formattedSummary += summaryData.summary;
            }

            setFinalSummary(formattedSummary);
            setCurrentStatus("Completed");
          }
        } catch (e) {
          console.error("Error parsing stream data:", e);
          setDebugInfo(
            `Stream parsing error: ${
              e instanceof Error ? e.message : String(e)
            }`
          );
        }
      }
    }
  };

  const handlePromptSubmit = useCallback(async () => {
    if (isSubmittingRef.current || isProcessing) return;
    if (!prompt.trim()) return;

    // Check backend status before making requests
    if (backendStatus === "offline") {
      setError(
        "Backend server is not accessible. Please ensure the FastAPI server is running on port 8000."
      );
      return;
    }

    isSubmittingRef.current = true;
    setIsProcessing(true);
    setError(null);
    setDebugInfo("");

    try {
      // If there's a current question, this is an answer in the clarification flow
      if (currentQuestion && currentQuestionIndex >= 0) {
        // Continue existing conversation
        try {
          console.log("Sending continue request with:", {
            thread_id: threadId,
            answers: [...answers.map((a) => a.answer), prompt.trim()],
          });

          const continueResponse = await fetch(
            "http://localhost:8000/continue_clarifier",
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              mode: "cors",
              body: JSON.stringify({
                thread_id: threadId,
                answers: [...answers.map((a) => a.answer), prompt.trim()],
              }),
            }
          );

          if (!continueResponse.ok) {
            const errorText = await continueResponse.text();
            console.error("Continue response error:", errorText);
            setDebugInfo(
              `Continue request failed: ${continueResponse.status} - ${errorText}`
            );
            throw new Error(`Failed to continue conversation: ${errorText}`);
          }

          const continueData = await continueResponse.json();
          console.log("Continue response:", continueData);

          // Check if content exists and is not undefined before parsing
          if (!continueData || typeof continueData !== "object") {
            console.error("Invalid continue response structure:", continueData);
            setDebugInfo(
              `Invalid response structure: ${JSON.stringify(continueData)}`
            );
            throw new Error(
              "Invalid response from server: response is not an object"
            );
          }

          if (!continueData.content) {
            console.error(
              "Content is missing in continue response:",
              continueData
            );
            setDebugInfo(
              `Content is missing in response: ${JSON.stringify(continueData)}`
            );
            throw new Error(
              "Invalid response from server: content field is missing"
            );
          }

          if (typeof continueData.content !== "string") {
            console.error("Content is not a string:", continueData.content);
            setDebugInfo(
              `Content is not a string: ${typeof continueData.content} - ${
                continueData.content
              }`
            );
            throw new Error(
              "Invalid response from server: content is not a string"
            );
          }

          // Parse the content field which contains JSON string
          let clarifierData;
          try {
            clarifierData = JSON.parse(continueData.content);
          } catch (parseError) {
            console.error(
              "Failed to parse content as JSON:",
              continueData.content
            );
            setDebugInfo(
              `Failed to parse content as JSON: ${
                parseError instanceof Error
                  ? parseError.message
                  : String(parseError)
              }`
            );
            throw new Error(
              `Invalid JSON in response content: ${continueData.content}`
            );
          }

          console.log("Parsed clarifier data:", clarifierData);

          // Store the current answer
          setAnswers((prev) => [
            ...prev,
            { question: currentQuestion, answer: prompt.trim() },
          ]);

          if (clarifierData.done) {
            // All questions are answered, proceed with workflow stream
            setQuestions([]);
            setCurrentQuestionIndex(-1);
            setCurrentQuestion(null);
            setCurrentStatus("Processing workflow...");
            setPrompt("");

            // Start workflow stream
            console.log("Starting workflow stream...");
            const streamResponse = await fetch(
              "http://localhost:8000/run_workflow_stream",
              {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                mode: "cors",
                body: JSON.stringify({
                  text_input: prompt.trim(),
                }),
              }
            );

            if (!streamResponse.ok) {
              const errorText = await streamResponse.text();
              console.error("Stream response error:", errorText);
              setDebugInfo(
                `Stream request failed: ${streamResponse.status} - ${errorText}`
              );
              throw new Error(`Failed to start workflow stream: ${errorText}`);
            }

            // Process the stream
            await processWorkflowStream(streamResponse);
          } else {
            // More questions to ask
            if (!clarifierData.resp || !Array.isArray(clarifierData.resp)) {
              console.error("Invalid clarifier data structure:", clarifierData);
              setDebugInfo(
                `Invalid clarifier data structure: ${JSON.stringify(
                  clarifierData
                )}`
              );
              throw new Error("Invalid clarifier data structure from server");
            }

            const newQuestions = clarifierData.resp
              .filter((q: ClarifierQuestion) => !q.answer)
              .map((q: ClarifierQuestion) => q.question);

            if (newQuestions.length > 0) {
              setQuestions(newQuestions);
              setCurrentQuestionIndex(0);
              setCurrentQuestion(newQuestions[0]);
              setCurrentStatus("Please answer the next question...");
              setPrompt("");
            }
          }
        } catch (err) {
          console.error("Error in continue conversation flow:", err);
          throw err;
        }
      } else {
        // Start new conversation
        try {
          console.log("Starting new conversation with:", prompt.trim());

          const startResponse = await fetch(
            "http://localhost:8000/start_conversation",
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              mode: "cors",
              body: JSON.stringify({
                text_input: prompt.trim(),
              }),
            }
          );

          if (!startResponse.ok) {
            const errorText = await startResponse.text();
            console.error("Start response error:", errorText);
            setDebugInfo(
              `Start request failed: ${startResponse.status} - ${errorText}`
            );
            throw new Error(`Failed to start conversation: ${errorText}`);
          }

          const { thread_id } = await startResponse.json();
          console.log("Received thread_id:", thread_id);
          setThreadId(thread_id);
          setPrompt("");

          // Start workflow stream immediately
          console.log("Starting workflow stream...");
          const streamResponse = await fetch(
            "http://localhost:8000/run_workflow_stream",
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              mode: "cors",
              body: JSON.stringify({
                text_input: prompt.trim(),
              }),
            }
          );

          if (!streamResponse.ok) {
            const errorText = await streamResponse.text();
            console.error("Stream response error:", errorText);
            setDebugInfo(
              `Stream request failed: ${streamResponse.status} - ${errorText}`
            );
            throw new Error(`Failed to start workflow stream: ${errorText}`);
          }

          // Process the stream
          await processWorkflowStream(streamResponse);
        } catch (err) {
          console.error("Error in start conversation flow:", err);
          throw err;
        }
      }
    } catch (err) {
      console.error("Error:", err);
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsProcessing(false);
      isSubmittingRef.current = false;
    }
  }, [
    prompt,
    currentQuestion,
    currentQuestionIndex,
    questions,
    threadId,
    answers,
    backendStatus,
  ]);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handlePromptSubmit();
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
            Workspace Name 1
          </h1>
          <div className="flex items-center space-x-2">
            <div className="flex items-center text-sm">
              {backendStatus === "online" ? (
                <>
                  <Wifi className="w-4 h-4 text-green-500 mr-1" />
                  <span className="text-green-600">Backend Online</span>
                </>
              ) : backendStatus === "offline" ? (
                <>
                  <WifiOff className="w-4 h-4 text-red-500 mr-1" />
                  <span className="text-red-600">Backend Offline</span>
                </>
              ) : (
                <>
                  <Wifi className="w-4 h-4 text-gray-500 mr-1" />
                  <span className="text-gray-600">Checking Backend...</span>
                </>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={checkBackendStatus}
                className="ml-2 h-6 w-6 p-0"
              >
                <RefreshCw className="w-3 h-3" />
              </Button>
            </div>
            <Badge
              variant="default"
              className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
            >
              🟢 Ready
            </Badge>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-4">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="agents" className="flex items-center gap-1">
                <Bot className="w-4 h-4" />
                <span className="hidden sm:inline">My Agents</span>
              </TabsTrigger>
              <TabsTrigger value="teams" className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                <span className="hidden sm:inline">AI Teams</span>
              </TabsTrigger>
              <TabsTrigger
                value="automations"
                className="flex items-center gap-1"
              >
                <Zap className="w-4 h-4" />
                <span className="hidden sm:inline">Automations</span>
              </TabsTrigger>
              <TabsTrigger value="import" className="flex items-center gap-1">
                <Import className="w-4 h-4" />
                <span className="hidden sm:inline">Import</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="agents" className="mt-4">
              {/* Backend Status Alert */}
              {backendStatus === "offline" && (
                <Alert className="mb-4 bg-yellow-50 border-yellow-200 dark:bg-yellow-900/30 dark:border-yellow-800">
                  <AlertCircle className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
                  <AlertDescription className="text-yellow-800 dark:text-yellow-300">
                    Backend server is not accessible. Please ensure the FastAPI
                    server is running on port 8000.
                    {debugInfo && (
                      <div className="mt-2 text-xs font-mono">
                        Debug: {debugInfo}
                      </div>
                    )}
                  </AlertDescription>
                </Alert>
              )}

              {/* Error Display */}
              {error && (
                <Alert className="mb-4 bg-red-50 border-red-200 dark:bg-red-900/30 dark:border-red-800">
                  <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
                  <AlertDescription className="text-red-800 dark:text-red-300">
                    {error}
                    {debugInfo && (
                      <div className="mt-2 text-xs font-mono">
                        Debug: {debugInfo}
                      </div>
                    )}
                  </AlertDescription>
                </Alert>
              )}

              {/* Current Question - Only show if there's an active question */}
              {currentQuestion && (
                <Card className="border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/30 mb-4">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg text-green-800 dark:text-green-300">
                      🤔 Current Question
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-green-700 dark:text-green-300 mb-4">
                      {currentQuestion}
                    </p>
                    <p className="text-sm text-green-600 dark:text-green-400">
                      Type your answer in the prompt input below
                    </p>
                  </CardContent>
                </Card>
              )}

              {/* Processing Indicator */}
              {isProcessing && (
                <Card className="border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-900/30 mb-4">
                  <CardContent className="p-4">
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                      <p className="text-blue-700 dark:text-blue-300">
                        {currentStatus || "Processing your request..."}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Final Summary */}
              {finalSummary && (
                <Card className="border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/30 mb-4">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg text-green-800 dark:text-green-300">
                      ✅ Summary
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-green-700 dark:text-green-300 whitespace-pre-wrap overflow-auto max-h-96">
                      {finalSummary}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Empty state when no question is active */}
              {!currentQuestion && !isProcessing && !finalSummary && (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  <Bot className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                  <p>Start a conversation by typing a prompt below</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="teams" className="mt-4">
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                <Users className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                <p>Your AI teams will appear here</p>
              </div>
            </TabsContent>

            <TabsContent value="automations" className="mt-4">
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                <Zap className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                <p>Your automations will appear here</p>
              </div>
            </TabsContent>

            <TabsContent value="import" className="mt-4">
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                <Import className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                <p>Import options will appear here</p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Projects List */}
      <div className="flex-1 overflow-y-auto p-4">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
          Projects
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {projects.map((project) => (
            <Card
              key={project.id}
              className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow"
            >
              <CardContent className="p-4">
                <h3 className="font-medium text-gray-800 dark:text-white mb-2">
                  {project.name}
                </h3>
                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-1">
                  <Calendar className="w-4 h-4 mr-1" />
                  <span>{project.date}</span>
                </div>
                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                  <Tag className="w-4 h-4 mr-1" />
                  <span>{project.category}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Prompt Input - Main Input Area */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
        <div className="flex flex-col">
          {currentQuestion && (
            <div className="mb-2 text-sm text-gray-600 dark:text-gray-400">
              Responding to: &quot;{currentQuestion}&quot;
            </div>
          )}
          <div className="flex items-center bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 px-4 py-3">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={
                currentQuestion ? "Type your answer..." : "Enter your Prompt..."
              }
              className="flex-1 bg-transparent border-none focus:outline-none text-gray-800 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 resize-none min-h-[60px] max-h-32"
              rows={1}
              disabled={isProcessing || backendStatus === "offline"}
            />
            <Button
              onClick={handlePromptSubmit}
              disabled={
                !prompt.trim() || isProcessing || backendStatus === "offline"
              }
              className="ml-2 bg-blue-500 hover:bg-blue-600 text-white rounded-full p-2 disabled:opacity-50"
            >
              {isProcessing ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              ) : (
                <Send className="w-5 h-5" />
              )}
            </Button>
          </div>
          <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
            Type your prompt and press Enter to submit
          </div>
        </div>
      </div>
    </div>
  );
}
