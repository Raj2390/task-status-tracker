
// Types for chat API
export interface ChatRequest {
  question: string;
}

export interface ChatResponse {
  answer: string;
  sources?: string[];
}

// Chat API service
export class ChatAPI {
  static async sendMessage(question: string): Promise<ChatResponse> {
    try {
      const response = await fetch('http://localhost:9999/query', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question: question
        }),
      });
      
      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }
      
      const data = await response.json();
      return {
        answer: data.answer || data.response || data.content || data.text || 'No response content found',
        sources: data.sources || []
      };
    } catch (error) {
      console.error('Error calling API:', error);
      throw error;
    }
  }
}
