import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ModelSelector } from "./model-selector";
import { chatCompletion, type Message } from "@/lib/openrouter";
import { useToast } from "@/hooks/use-toast";
import { Send, Loader2, Code, File } from "lucide-react";

export function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [selectedModel, setSelectedModel] = useState("anthropic/claude-3-5-sonnet-20241022");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await chatCompletion([...messages, userMessage], selectedModel);
      const assistantMessage: Message = { role: "assistant", content: response };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      console.error("Chat error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatMessage = (content: string) => {
    // Check if content contains code blocks
    if (content.includes("```")) {
      const parts = content.split(/(```[a-z]*\n[\s\S]*?```)/g);
      return parts.map((part, index) => {
        if (part.startsWith("```")) {
          // Extract language and code
          const [, lang, ...codeLines] = part.split("\n");
          const code = codeLines.slice(0, -1).join("\n");
          return (
            <pre key={index} className="bg-muted p-4 rounded-md my-2 overflow-x-auto">
              {lang && <div className="text-sm text-muted-foreground mb-2">{lang.replace("```", "")}</div>}
              <code className="text-sm font-mono">{code}</code>
            </pre>
          );
        }
        return <p key={index} className="whitespace-pre-wrap">{part}</p>;
      });
    }
    return <p className="whitespace-pre-wrap">{content}</p>;
  };

  return (
    <Card className="w-full h-[600px] flex flex-col">
      <div className="p-4 border-b flex items-center gap-4">
        <ModelSelector selectedModel={selectedModel} onModelChange={setSelectedModel} />
        <div className="flex-1">
          <h2 className="text-lg font-semibold">AI Code Generator</h2>
          <p className="text-sm text-muted-foreground">Build projects and generate code with AI assistance</p>
        </div>
      </div>
      <CardContent className="flex-1 p-4 flex flex-col gap-4">
        <ScrollArea className="flex-1">
          {messages.length === 0 && (
            <div className="text-center p-8 text-muted-foreground">
              <Code className="h-12 w-12 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Start Building Your Project</h3>
              <p>Ask me to help you create any type of application, generate code, or fix issues.</p>
              <div className="mt-4 space-y-2 text-sm">
                <p>"Create a React component for a navigation menu"</p>
                <p>"Help me fix this TypeScript error in my code"</p>
                <p>"Generate an Express API endpoint for user authentication"</p>
              </div>
            </div>
          )}
          {messages.map((message, index) => (
            <div
              key={index}
              className={`mb-4 p-4 rounded-lg ${
                message.role === "user"
                  ? "bg-primary text-primary-foreground ml-12"
                  : "bg-muted mr-12"
              }`}
            >
              {formatMessage(message.content)}
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-center items-center p-4">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          )}
        </ScrollArea>
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Describe what you want to build..."
            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
            disabled={isLoading}
            className="font-mono"
          />
          <Button onClick={handleSend} disabled={isLoading}>
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}