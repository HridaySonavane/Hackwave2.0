/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/no-unescaped-entities */
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
  id: string;
}

interface Answer {
  question: string;
  answer: string;
}

interface WorkflowResponse {
  step: "start" | "clarifier" | "product" | "customer" | "engineer" | "risk" | "summary";
  data?: {
    resp?: ClarifierQuestion[];
    analysis?: string;
    summary?: string;
  };
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

  const handleWorkflowStream = async (response: Response) => {
    console.log('Starting to process workflow stream...');
    const reader = response.body?.getReader();
    if (!reader) throw new Error("No stream reader available");

    try {
      while (true) {
        const { done, value } = await reader.read();
        console.log('Stream read:', { done, hasValue: !!value });
        
        if (done) {
          console.log('Stream completed');
          break;
        }

        const text = new TextDecoder().decode(value);
        console.log('Decoded text:', text);
        
        const lines = text.split("\n").filter(Boolean);
        console.log('Parsed lines:', lines.length, 'lines');

        for (const line of lines) {
          try {
            const data = JSON.parse(line) as WorkflowResponse;
            console.log('Processing workflow step:', data.step);

            switch (data.step) {
              case "start":
                setCurrentStatus("Starting workflow analysis...");
                break;
              case "product":
                setCurrentStatus("Analyzing product requirements...");
                if (data.data?.analysis) {
                  setFinalSummary(prev => {
                    const analysis = data.data?.analysis;
                    if (!analysis) return prev;
                    return prev ? prev + "\n\nProduct Analysis:\n" + analysis : "Product Analysis:\n" + analysis;
                  });
                }
                break;
              case "customer":
                setCurrentStatus("Analyzing customer needs...");
                if (data.data?.analysis) {
                  setFinalSummary(prev => {
                    const analysis = data.data?.analysis;
                    if (!analysis) return prev;
                    return prev ? prev + "\n\nCustomer Analysis:\n" + analysis : "Customer Analysis:\n" + analysis;
                  });
                }
                break;
              case "engineer":
                setCurrentStatus("Analyzing technical feasibility...");
                if (data.data?.analysis) {
                  setFinalSummary(prev => {
                    const analysis = data.data?.analysis;
                    if (!analysis) return prev;
                    return prev ? prev + "\n\nTechnical Analysis:\n" + analysis : "Technical Analysis:\n" + analysis;
                  });
                }
                break;
              case "risk":
                setCurrentStatus("Analyzing potential risks...");
                if (data.data?.analysis) {
                  setFinalSummary(prev => {
                    const analysis = data.data?.analysis;
                    if (!analysis) return prev;
                    return prev ? prev + "\n\nRisk Analysis:\n" + analysis : "Risk Analysis:\n" + analysis;
                  });
                }
                break;
              case "summary":
                setCurrentStatus("Completing analysis...");
                if (data.data?.summary) {
                  setFinalSummary(prev => {
                    const summary = data.data?.summary;
                    if (!summary) return prev;
                    return prev ? prev + "\n\nFinal Summary:\n" + summary : summary;
                  });
                }
                setCurrentStatus("Analysis completed");
                break;
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
      // Start conversation
      const startResponse = await fetch("/api/conversation/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text_input: prompt.trim(),
        }),
      });

      if (!startResponse.ok) {
        throw new Error("Failed to start conversation");
      }

      await startResponse.json();

      // Start streaming workflow immediately
      const streamResponse = await fetch("/api/workflow/stream", {
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

      // Handle streaming response
      await handleWorkflowStream(streamResponse);
    } catch (err) {
      console.error("Error:", err);
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsProcessing(false);
      isSubmittingRef.current = false;
    }
      }
    } catch (err) {
      console.error("Error:", err);
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsProcessing(false);
      isSubmittingRef.current = false;
    }
  }, [prompt]);

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
                        Processing your request...
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
                    <p className="text-green-700 dark:text-green-300">
                      {finalSummary}
                    </p>
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
              Responding to: "{currentQuestion}"
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
          <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
            Type your prompt and press Enter to submit
          </div>
        </div>
      </div>
    </div>
  );
}
