import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ModelSelector } from "./model-selector";
import { chatCompletion, type Message, availableModels } from "@/lib/openrouter";
import { useToast } from "@/hooks/use-toast";
import { Send, Loader2, Code } from "lucide-react";
import { ApiKeySetup } from "./api-key-setup";

export function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [selectedModel, setSelectedModel] = useState("deepseek/deepseek-r1-distill-llama-70b");
  const [isLoading, setIsLoading] = useState(false);
  const [hasApiKey, setHasApiKey] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Check if API key is in localStorage
    const storedApiKey = localStorage.getItem("openrouter_api_key");
    if (storedApiKey) {
      setHasApiKey(true);
    } else {
      // We have a default key set now
      setHasApiKey(true);
    }
  }, []);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      console.log("Sending chat request with model:", selectedModel);
      console.log("Messages being sent:", JSON.stringify([...messages, userMessage], null, 2));

      const aiResponse = await chatCompletion([...messages, userMessage], selectedModel);
      console.log("Received AI response:", aiResponse.substring(0, 100) + (aiResponse.length > 100 ? "..." : ""));

      const assistantMessage: Message = { role: "assistant", content: aiResponse };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Chat error:", error);
      console.error("Error details:", JSON.stringify(error, Object.getOwnPropertyNames(error)));
      let errorMessage = "Failed to get response from AI";

      if (error instanceof Error) {
        errorMessage = error.message;
      }

      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!hasApiKey) {
    return <ApiKeySetup onApiKeySet={() => setHasApiKey(true)} />;
  }

  return (
    <div className="flex flex-col h-[calc(100vh-160px)] max-w-4xl mx-auto">
      <Card className="flex-1 mb-4 overflow-hidden">
        <ScrollArea className="h-full p-4">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
              <Code size={40} className="mb-2" />
              <p>Start a conversation with the AI assistant</p>
              <p className="text-sm mt-2">
                Using {availableModels.find(m => m.id === selectedModel)?.name || selectedModel}
              </p>
            </div>
          ) : (
            <div className="space-y-4 pb-4">
              {messages.map((message, i) => (
                <div
                  key={i}
                  className={`flex ${
                    message.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg p-3 ${
                      message.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted"
                    }`}
                  >
                    <pre className="whitespace-pre-wrap font-sans">{message.content}</pre>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </Card>
      <div className="flex space-x-2">
        <ModelSelector
          value={selectedModel}
          onValueChange={setSelectedModel}
        />
        <div className="flex-1 flex">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            disabled={isLoading}
          />
          <Button 
            onClick={handleSend} 
            className="ml-2" 
            disabled={isLoading || !input.trim()}
          >
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          </Button>
        </div>
      </div>
    </div>
  );
}