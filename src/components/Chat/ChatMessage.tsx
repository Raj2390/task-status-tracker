
import { FC } from 'react';
import { cn } from '@/lib/utils';
import { Avatar } from '@/components/ui/avatar';
import { User, Bot } from 'lucide-react';

export type MessageType = 'user' | 'bot';

export interface ChatMessageProps {
  content: string;
  type: MessageType;
  timestamp: Date;
}

const ChatMessage: FC<ChatMessageProps> = ({ content, type, timestamp }) => {
  const isUser = type === 'user';
  
  return (
    <div className={cn(
      "flex w-full mb-4",
      isUser ? "justify-end" : "justify-start"
    )}>
      <div className={cn(
        "flex max-w-[80%]",
        isUser ? "flex-row-reverse" : "flex-row"
      )}>
        <div className={cn(
          "flex items-center justify-center rounded-full w-8 h-8",
          isUser ? "ml-2 bg-primary/10" : "mr-2 bg-muted/50"
        )}>
          {isUser ? <User className="h-4 w-4 text-primary" /> : <Bot className="h-4 w-4" />}
        </div>
        
        <div className={cn(
          "rounded-lg px-4 py-2 shadow-sm",
          isUser ? "bg-primary text-primary-foreground" : "bg-muted"
        )}>
          <div className="whitespace-pre-wrap">{content}</div>
          <div className="text-xs opacity-70 mt-1">
            {timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
