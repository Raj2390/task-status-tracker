
import { useState, useRef, useEffect } from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';
import { SendIcon, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import PageTransition from '@/components/layout/PageTransition';
import ChatMessage, { ChatMessageProps } from '@/components/Chat/ChatMessage';
import { ChatAPI } from '@/services/chatApi';

const Chat = () => {
  const [messages, setMessages] = useState<ChatMessageProps[]>([
    {
      content: "Hello! I'm your Data Extraction Assistant. How can I help you today?",
      type: 'bot',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  
  // Auto scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, [messages]);
  
  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return;
    
    const userMessage: ChatMessageProps = {
      content: input.trim(),
      type: 'user',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    
    try {
      const response = await ChatAPI.sendMessage(userMessage.content);
      
      const botMessage: ChatMessageProps = {
        content: response.answer,
        type: 'bot',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to get a response. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <PageTransition>
      <div className="container py-8 px-4 w-full max-w-6xl mx-auto">
        <header className="mb-8">
          <h1 className="text-4xl font-bold tracking-tight">Chat Assistant</h1>
          <p className="text-lg text-muted-foreground mt-2">
            Ask questions about your data and extractions
          </p>
        </header>
        
        <GlassCard className="min-h-[600px] flex flex-col">
          <div className="flex-1 flex flex-col h-full">
            <ScrollArea className="flex-1 pr-4 mb-4" ref={scrollAreaRef}>
              <div className="py-4 space-y-4">
                {messages.map((message, index) => (
                  <ChatMessage 
                    key={index}
                    content={message.content}
                    type={message.type}
                    timestamp={message.timestamp}
                  />
                ))}
                {isLoading && (
                  <div className="flex items-center space-x-2 text-muted-foreground ml-10">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Thinking...</span>
                  </div>
                )}
              </div>
            </ScrollArea>
            
            <div className="pt-4 border-t">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="flex space-x-2"
              >
                <Input
                  placeholder="Type your question here..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className="flex-1"
                  disabled={isLoading}
                />
                <Button 
                  type="submit"
                  disabled={isLoading || !input.trim()}
                >
                  <SendIcon className="h-4 w-4 mr-2" />
                  Send
                </Button>
              </form>
            </div>
          </div>
        </GlassCard>
      </div>
    </PageTransition>
  );
};

export default Chat;
