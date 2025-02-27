const OPENROUTER_API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY || "";

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

export async function chatCompletion(
  messages: Message[],
  model: string
): Promise<string> {
  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENROUTER_API_KEY}`,
      },
      body: JSON.stringify({
        model,
        messages,
      }),
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error("Chat completion error:", error);
    throw error;
  }
}
