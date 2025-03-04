
/**
 * Utility functions for interacting with the Google Gemini 1.5 Flash API
 */

export interface GeminiResponse {
  text: string;
  error?: string;
}

/**
 * Call the Gemini-1.5-flash model with the given prompt
 */
export const generateGeminiResponse = async (
  apiKey: string,
  prompt: string,
  persona: string,
  history: { role: 'user' | 'model', content: string }[] = []
): Promise<GeminiResponse> => {
  try {
    // Prepare system prompt based on the persona details
    const systemPrompt = `You are roleplaying as ${persona}. Respond to the user as this character would. Keep responses concise (under 3 sentences).`;
    
    const response = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" + apiKey, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            role: "user",
            parts: [{ text: systemPrompt }]
          },
          ...history.map(msg => ({
            role: msg.role === 'user' ? 'user' : 'model',
            parts: [{ text: msg.content }]
          })),
          {
            role: "user",
            parts: [{ text: prompt }]
          }
        ],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 250,
        }
      }),
    });

    const data = await response.json();
    
    if (data.error) {
      console.error("Gemini API error:", data.error);
      return { text: "Sorry, I encountered an error while processing your request.", error: data.error.message };
    }

    // Extract the generated text from the response
    const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text || "I'm not sure how to respond to that.";
    return { text: generatedText };
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    return { 
      text: "I'm having trouble connecting right now. Please try again later.",
      error: error instanceof Error ? error.message : String(error)
    };
  }
};
