
import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
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
    
    // Reload the page to apply the new API key
    window.location.reload();
    
    toast({
      title: "Success",
      description: "API key has been saved",
    });
    
    onApiKeySet();
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Set OpenRouter API Key</CardTitle>
        <CardDescription>
          You need to set your OpenRouter API key to use this application. 
          Visit <a href="https://openrouter.ai" target="_blank" rel="noopener noreferrer" className="text-primary underline">openrouter.ai</a> to get an API key.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Input
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          placeholder="Enter your OpenRouter API key"
          type="password"
        />
      </CardContent>
      <CardFooter>
        <Button onClick={handleSaveApiKey} className="w-full">Save API Key</Button>
      </CardFooter>
    </Card>
  );
}
