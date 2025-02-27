
// Model definitions and API interface for OpenRouter
export interface Message {
  role: "user" | "assistant";
  content: string;
}

export interface ModelOption {
  id: string;
  name: string;
  provider: string;
}

export const availableModels: ModelOption[] = [
  { id: "anthropic/claude-3-5-sonnet-20241022", name: "Claude 3 Sonnet", provider: "Anthropic" },
  { id: "deepseek/deepseek-r1-distill-llama-70b", name: "DeepSeek R1 Distill", provider: "DeepSeek" },
  { id: "deepseek/deepseek-coder", name: "DeepSeek Coder", provider: "DeepSeek" },
  { id: "meta-llama/codellama-70b", name: "Code Llama 70B", provider: "Meta" },
];

export async function chatCompletion(
  messages: Message[],
  model: string
): Promise<string> {
  // Get API key from localStorage if available
  const apiKey = localStorage.getItem("openrouter_api_key") || undefined;
  
  console.log("Client: Using model:", model);
  console.log("Client: Messages being sent:", JSON.stringify(messages, null, 2));

  try {
    // Call our backend API instead of OpenRouter directly
    const response = await fetch("/api/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messages,
        model,
        apiKey
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Client: Chat API error:", response.status, errorText);
      throw new Error(`API request failed (${response.status}): ${errorText}`);
    }

    const data = await response.json();
    console.log("Client: Response received:", data);

    if (!data.completion) {
      throw new Error("Invalid response format from API");
    }

    return data.completion;
  } catch (error) {
    console.error("Client: Chat completion error:", error);
    throw error;
  }
}
