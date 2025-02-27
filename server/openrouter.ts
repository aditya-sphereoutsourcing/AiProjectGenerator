
import fetch from 'node-fetch';

// Default API key
const DEFAULT_API_KEY = process.env.OPENROUTER_API_KEY || "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";

export interface Message {
  role: "user" | "assistant";
  content: string;
}

export async function chatCompletion(
  messages: Message[],
  model: string,
  apiKey?: string
): Promise<string> {
  const OPENROUTER_API_KEY = apiKey || DEFAULT_API_KEY;

  console.log("Server: Using OpenRouter API with model:", model);
  console.log("Server: Messages being sent:", JSON.stringify(messages, null, 2));

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
        "HTTP-Referer": "https://replit.com",
        "X-Title": "AI Code Generator"
      },
      body: JSON.stringify({
        model: model,
        messages: messages
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Server: OpenRouter API error:", response.status, errorText);
      throw new Error(`API request failed (${response.status}): ${errorText}`);
    }

    const data = await response.json();
    console.log("Server: Response received:", JSON.stringify(data, null, 2));

    if (!data.choices?.[0]?.message?.content) {
      throw new Error("Invalid response format from OpenRouter API");
    }

    return data.choices[0].message.content;
  } catch (error) {
    console.error("Server: Chat completion error:", error);
    throw error;
  }
}
