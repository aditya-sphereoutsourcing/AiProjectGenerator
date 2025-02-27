import { OpenAI } from "openai";

// Default API key and user-provided API key handling
const DEFAULT_API_KEY = "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";
const OPENROUTER_API_KEY = localStorage.getItem("openrouter_api_key") || DEFAULT_API_KEY;

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

// Initialize OpenAI client with OpenRouter base URL
const client = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: OPENROUTER_API_KEY,
  defaultHeaders: {
    "HTTP-Referer": window.location.origin,
    "X-Title": "AI Code Generator"
  },
  dangerouslyAllowBrowser: true // Required for client-side use
});

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
    console.log("Making API request to OpenRouter using OpenAI SDK");
    console.log("Messages being sent:", JSON.stringify(messages, null, 2));

    const completion = await client.chat.completions.create({
      model: model,
      messages: messages as any
    });

    console.log("Response received:", completion);

    if (!completion.choices[0]?.message?.content) {
      throw new Error("Invalid response format from OpenRouter API");
    }

    return completion.choices[0].message.content;
  } catch (error) {
    console.error("Chat completion error:", error);
    if (error instanceof Error) {
      console.error("Error details:", JSON.stringify({
        message: error.message,
        stack: error.stack
      }));
    }
    throw error;
  }
}