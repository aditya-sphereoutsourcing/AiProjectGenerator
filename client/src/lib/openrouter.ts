// Try to get API key from localStorage first, then fallback to environment variable
const OPENROUTER_API_KEY = localStorage.getItem("openrouter_api_key") || 
                          import.meta.env.VITE_OPENROUTER_API_KEY || 
                          "";

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
  { id: "deepseek/deepseek-coder", name: "DeepSeek Coder", provider: "DeepSeek" },
  { id: "meta-llama/codellama-70b", name: "Code Llama 70B", provider: "Meta" },
];

export async function chatCompletion(messages: Message[], model: string): Promise<string> {
  if (!OPENROUTER_API_KEY) {
    throw new Error("OPENROUTER_API_KEY is not set. Please set it in your environment variables.");
  }

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
        "HTTP-Referer": window.location.origin,
        "X-Title": "AI Code Generator"
      },
      body: JSON.stringify({
        model: model,
        messages: messages,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`API request failed: ${errorData.error?.message || response.statusText}`);
    }

    const data = await response.json();
    return data.choices[0]?.message?.content || "No response from AI";
  } catch (error) {
    console.error("Chat completion error:", error);
    throw error;
  }
}

interface OpenRouterResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
}

export async function chatCompletion(
  messages: Message[],
  model: string
): Promise<string> {
  if (!OPENROUTER_API_KEY) {
    throw new Error("OpenRouter API key is not configured");
  }

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENROUTER_API_KEY}`,
        "HTTP-Referer": window.location.origin,
        "X-Title": "AI Code Generator",
      },
      body: JSON.stringify({
        model,
        messages,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API request failed (${response.status}): ${errorText}`);
    }

    const data = (await response.json()) as OpenRouterResponse;

    if (!data.choices?.[0]?.message?.content) {
      throw new Error("Invalid response format from OpenRouter API");
    }

    return data.choices[0].message.content;
  } catch (error) {
    console.error("Chat completion error:", error);
    throw error;
  }
}