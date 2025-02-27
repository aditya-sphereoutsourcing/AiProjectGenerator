
import { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface ApiKeySetupProps {
  onApiKeySet: () => void;
}

export function ApiKeySetup({ onApiKeySet }: ApiKeySetupProps) {
  const [apiKey, setApiKey] = useState("");
  const { toast } = useToast();

  const handleSaveApiKey = () => {
    if (!apiKey.trim()) {
      toast({
        title: "Error",
        description: "Please enter a valid API key",
        variant: "destructive",
      });
      return;
    }

    // Save the API key to localStorage for temporary persistence
    localStorage.setItem("openrouter_api_key", apiKey);
    
    toast({
      title: "Success",
      description: "API key has been saved",
    });
    
    onApiKeySet();
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>OpenRouter API Key</CardTitle>
        <CardDescription>
          You can use the default API key or set your own from 
          <a href="https://openrouter.ai" target="_blank" rel="noopener noreferrer" className="text-primary underline ml-1">
            openrouter.ai
          </a>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Input
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          placeholder="Enter your OpenRouter API key (optional)"
          type="password"
        />
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={onApiKeySet}>
          Use Default Key
        </Button>
        <Button onClick={handleSaveApiKey}>
          Save Custom Key
        </Button>
      </CardFooter>
    </Card>
  );
}
