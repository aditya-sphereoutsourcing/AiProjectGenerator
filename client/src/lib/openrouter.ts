// Default API key and user-provided API key handling
const DEFAULT_API_KEY = "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";
const OPENROUTER_API_KEY = localStorage.getItem("openrouter_api_key") || 
                           DEFAULT_API_KEY;

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
    throw new Error("OPENROUTER_API_KEY is not set. Please set it in your environment variables.");
  }

  console.log("OpenRouter API Key length:", OPENROUTER_API_KEY.length);
  console.log("Using model:", model);

  try {
    console.log("Making API request to OpenRouter");
    const requestBody = {
      model: model,
      messages: messages,
    };
    console.log("Request payload:", JSON.stringify(requestBody, null, 2));

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
        "HTTP-Referer": window.location.origin,
        "X-Title": "AI Code Generator"
      },
      body: JSON.stringify(requestBody),
    });

    console.log("Response status:", response.status);
    console.log("Response status text:", response.statusText);

    if (!response.ok) {
      const responseText = await response.text();
      console.error("Error response body:", responseText);

      try {
        const errorData = JSON.parse(responseText);
        throw new Error(`API request failed: ${errorData.error?.message || response.statusText}`);
      } catch (parseError) {
        throw new Error(`API request failed (${response.status}): ${responseText || response.statusText}`);
      }
    }

    const rawData = await response.text();
    console.log("Raw response data:", rawData.substring(0, 200) + (rawData.length > 200 ? "..." : ""));

    const data = JSON.parse(rawData) as OpenRouterResponse;
    console.log("Parsed response data:", JSON.stringify(data, null, 2).substring(0, 200) + "...");

    if (!data.choices?.[0]?.message?.content) {
      console.error("Invalid response format:", JSON.stringify(data, null, 2));
      throw new Error("Invalid response format from OpenRouter API");
    }

    return data.choices[0].message.content;
  } catch (error) {
    console.error("Chat completion error:", error);
    throw error;
  }
}