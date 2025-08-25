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
} from "lucide-react";

interface ClarifierQuestion {
  question: string;
  answer?: string;
}

interface Answer {
  question: string;
  answer: string;
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

interface FinalResult {
  clarifier: any;
  product: any;
  customer: any;
  engineer: any;
  risk: any;
  summary: string;
  tts_file: string;
}

export default function DashboardContent() {
  const [activeTab, setActiveTab] = useState("agents");
  const [prompt, setPrompt] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState<string | null>(null);
  const [finalSummary, setFinalSummary] = useState<string | null>(null);
  const [currentStatus, setCurrentStatus] = useState<string>("");
  const [threadId, setThreadId] = useState<string | null>(null);
  const [questions, setQuestions] = useState<string[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(-1);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const isSubmittingRef = useRef(false);

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

  const handlePromptSubmit = useCallback(async () => {
    if (isSubmittingRef.current || isProcessing) {
      return;
    }
    if (!prompt.trim()) {
      return;
    }
    isSubmittingRef.current = true;
    setIsProcessing(true);
    setError(null);

    try {
      // If there's a current question, this is an answer in the clarification flow
      if (currentQuestion && currentQuestionIndex >= 0) {
        // Continue existing conversation
        const continueResponse = await fetch("/continue_clarifier", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            thread_id: threadId,
            answers: [...answers.map((a) => a.answer), prompt.trim()],
          }),
        });

        if (!continueResponse.ok) {
          throw new Error("Failed to continue conversation");
        }

        const continueData = await continueResponse.json();
        console.log("Continue response:", continueData);

        // Parse the content field which contains JSON string
        const clarifierData = JSON.parse(continueData.content);
        console.log("Parsed clarifier data:", clarifierData);

        // Store the current answer
        setAnswers((prev) => [
          ...prev,
          { question: currentQuestion, answer: prompt.trim() },
        ]);

        if (clarifierData.done) {
          // All questions are answered, run workflow
          setCurrentStatus("Running workflow...");

          // Option 1: Run workflow and get result
          const workflowResponse = await fetch("/api/conversation/start", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ thread_id: threadId }),
          });

          if (!workflowResponse.ok) {
            throw new Error("Failed to run workflow");
          }

          // Wait a bit for workflow to complete
          await new Promise((resolve) => setTimeout(resolve, 2000));

          // Get the result
          const resultResponse = await fetch(`/get_result/${threadId}`);
          if (!resultResponse.ok) {
            throw new Error("Failed to get workflow result");
          }

          const resultData = await resultResponse.json();
          console.log("Workflow result:", resultData);

          // Format and display the result
          setFinalSummary(JSON.stringify(resultData, null, 2));

          // Reset question-related state
          setQuestions([]);
          setCurrentQuestionIndex(-1);
          setCurrentQuestion(null);
          setCurrentStatus("Analysis completed");
          setPrompt("");
        } else {
          // More questions to ask
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

        isSubmittingRef.current = false;
        setIsProcessing(false);
        return;
      }

      // Start new conversation with streaming workflow
      setCurrentStatus("Starting workflow...");

      const streamResponse = await fetch("/api/conversation/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text_input: prompt.trim(),
        }),
      });

      if (!streamResponse.ok) {
        throw new Error("Failed to start workflow stream");
      }

      setPrompt("");

      // Process the stream
      await handleWorkflowStream(streamResponse);
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
  ]);

  const handleWorkflowStream = async (response: Response) => {
    console.log("Starting to process workflow stream...");
    const reader = response.body?.getReader();
    if (!reader) throw new Error("No stream reader available");

    try {
      let finalResult = null;

      while (true) {
        const { done, value } = await reader.read();
        console.log("Stream read:", { done, hasValue: !!value });

        if (done) {
          console.log("Stream completed");
          break;
        }

        const text = new TextDecoder().decode(value);
        console.log("Decoded text:", text);

        const lines = text.split("\n").filter(Boolean);
        console.log("Parsed lines:", lines.length, "lines");

        for (const line of lines) {
          try {
            const data = JSON.parse(line);

            // Check if it's a step response
            if ("step" in data) {
              const workflowData = data as WorkflowResponse;
              console.log("Processing workflow step:", workflowData.step);

              switch (workflowData.step) {
                case "start":
                  setCurrentStatus("Starting workflow analysis...");
                  if (workflowData.thread_id) {
                    setThreadId(workflowData.thread_id);
                  }
                  break;

                case "clarifier":
                  setCurrentStatus("Analyzing requirements...");
                  // Process clarifier data if needed
                  break;

                case "product":
                  setCurrentStatus("Analyzing product requirements...");
                  if (workflowData.data?.product) {
                    setFinalSummary((prev) => {
                      const productInfo = JSON.stringify(
                        workflowData.data.product,
                        null,
                        2
                      );
                      return prev
                        ? prev + "\n\nProduct Analysis:\n" + productInfo
                        : "Product Analysis:\n" + productInfo;
                    });
                  }
                  break;

                case "customer":
                  setCurrentStatus("Analyzing customer needs...");
                  if (workflowData.data?.segment || workflowData.data?.needs) {
                    setFinalSummary((prev) => {
                      const customerInfo = JSON.stringify(
                        {
                          segment: workflowData.data.segment,
                          needs: workflowData.data.needs,
                        },
                        null,
                        2
                      );
                      return prev
                        ? prev + "\n\nCustomer Analysis:\n" + customerInfo
                        : "Customer Analysis:\n" + customerInfo;
                    });
                  }
                  break;

                case "engineer":
                  setCurrentStatus("Analyzing technical feasibility...");
                  if (
                    workflowData.data?.feasibility ||
                    workflowData.data?.timeline
                  ) {
                    setFinalSummary((prev) => {
                      const engineerInfo = JSON.stringify(
                        {
                          feasibility: workflowData.data.feasibility,
                          timeline: workflowData.data.timeline,
                        },
                        null,
                        2
                      );
                      return prev
                        ? prev + "\n\nTechnical Analysis:\n" + engineerInfo
                        : "Technical Analysis:\n" + engineerInfo;
                    });
                  }
                  break;

                case "risk":
                  setCurrentStatus("Analyzing potential risks...");
                  if (
                    workflowData.data?.level ||
                    workflowData.data?.mitigations
                  ) {
                    setFinalSummary((prev) => {
                      const riskInfo = JSON.stringify(
                        {
                          level: workflowData.data.level,
                          mitigations: workflowData.data.mitigations,
                        },
                        null,
                        2
                      );
                      return prev
                        ? prev + "\n\nRisk Analysis:\n" + riskInfo
                        : "Risk Analysis:\n" + riskInfo;
                    });
                  }
                  break;

                case "summary":
                  setCurrentStatus("Completing analysis...");
                  if (workflowData.data?.summary) {
                    setFinalSummary((prev) =>
                      prev
                        ? prev +
                          "\n\nFinal Summary:\n" +
                          workflowData.data.summary
                        : workflowData.data.summary
                    );
                  }
                  setCurrentStatus("Analysis completed");
                  break;

                case "tts":
                  setCurrentStatus("Generating audio summary...");
                  // Handle TTS if needed
                  break;
              }
            }
            // Otherwise, check if it's the final result
            else if (
              "clarifier" in data &&
              "product" in data &&
              "customer" in data &&
              "engineer" in data &&
              "risk" in data &&
              "summary" in data
            ) {
              const finalResultData = data as FinalResult;
              setFinalSummary(JSON.stringify(finalResultData, null, 2));
              setCurrentStatus("Analysis completed");
            }
          } catch (e) {
            console.error("Error parsing stream data:", e, "\nRaw line:", line);
          }
        }
      }
    } catch (e) {
      console.error("Error processing stream:", e);
      throw e;
    }
  };

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
          <Badge
            variant="default"
            className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
          >
            🟢 Ready
          </Badge>
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
              {/* Error Display */}
              {error && (
                <Alert className="mb-4 bg-red-50 border-red-200 dark:bg-red-900/30 dark:border-red-800">
                  <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
                  <AlertDescription className="text-red-800 dark:text-red-300">
                    {error}
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

      {/* Bottom Bar */}
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
              disabled={isProcessing}
            />
            <Button
              onClick={handlePromptSubmit}
              disabled={!prompt.trim() || isProcessing}
              className="ml-2 bg-blue-500 hover:bg-blue-600 text-white rounded-full p-2 disabled:opacity-50"
            >
              {isProcessing ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              ) : (
                <Send className="w-5 h-5" />
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
