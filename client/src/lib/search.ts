const SERPER_API_KEY = import.meta.env.VITE_SERPER_API_KEY || "";

export interface SearchResult {
  title: string;
  link: string;
  snippet: string;
}

export async function searchInternet(query: string): Promise<SearchResult[]> {
  try {
    const response = await fetch("https://google.serper.dev/search", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-KEY": SERPER_API_KEY,
      },
      body: JSON.stringify({
        q: query,
        num: 5,
      }),
    });

    if (!response.ok) {
      throw new Error(`Search request failed: ${response.statusText}`);
    }

    const data = await response.json();
    return data.organic.map((result: any) => ({
      title: result.title,
      link: result.link,
      snippet: result.snippet,
    }));
  } catch (error) {
    console.error("Search error:", error);
    throw error;
  }
}
