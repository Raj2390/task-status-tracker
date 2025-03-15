
// Types for chat API
export interface ChatRequest {
  question: string;
}

export interface ChatResponse {
  answer: string;
  sources?: string[];
}

// Mock chat API service
export class ChatAPI {
  static async sendMessage(question: string): Promise<ChatResponse> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Sample responses for demo
    const responses: Record<string, string> = {
      "hello": "Hello! How can I help you with your data extraction today?",
      "hi": "Hi there! How can I assist you with your data needs?",
      "how are you": "I'm doing well, thanks for asking! How can I help you with data extraction?",
      "help": "I can help you with data extraction flows, view extraction results, or answer questions about the system. What would you like to know?",
      "what is this": "This is a Data Extraction Manager that helps you configure, trigger, and monitor your data extraction flows. You can extract data from various sources using the flows available in the system.",
      "how do i extract data": "To extract data, go to the Home page, select a flow that matches your needs, fill in the required parameters, and click the 'Extract Data' button. You can monitor the progress on the Recent Activity tab.",
      "where can i see my data": "You can view your extracted data in the Data Viewer tab. There you can apply filters to find specific information within your extracted datasets."
    };
    
    // Default response for unknown questions
    let answer = "I don't have specific information on that. Would you like to know about data extraction flows or how to view your data?";
    
    // Check for keyword matches
    const lowercaseQuestion = question.toLowerCase();
    for (const [keyword, response] of Object.entries(responses)) {
      if (lowercaseQuestion.includes(keyword)) {
        answer = response;
        break;
      }
    }
    
    // In a real app, you would call an actual API endpoint here
    // const response = await fetch('/api/chat', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ question })
    // });
    // const data = await response.json();
    // return data;
    
    return {
      answer,
      sources: ["Data Extraction Documentation"]
    };
  }
}
