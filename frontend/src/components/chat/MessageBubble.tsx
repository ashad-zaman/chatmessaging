import { Message } from '@/types';
import { format } from 'date-fns';
import { Check, CheckCheck, Clock } from 'lucide-react';
import { useAuthStore } from '@/app/chat/store';

interface MessageBubbleProps {
  message: Message;
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const { user } = useAuthStore();
  const isOwnMessage = message.senderId === user?.id;

  const getStatusIcon = () => {
    switch (message.status) {
      case 'pending':
        return <Clock data-testid="clock-icon" className="w-3 h-3 text-gray-400" />;
      case 'sent':
        return <Check data-testid="check-icon" className="w-3 h-3 text-gray-400" />;
      case 'delivered':
        return <CheckCheck data-testid="checkcheck-icon" className="w-3 h-3 text-gray-400" />;
      case 'read':
        return <CheckCheck data-testid="checkcheck-icon" className="w-3 h-3 text-blue-500" />;
      default:
        return null;
    }
  };

  return (
    <div className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'} mb-4`}>
      <div
        className={`max-w-[70%] px-4 py-2 rounded-2xl ${
          isOwnMessage
            ? 'bg-blue-600 text-white rounded-br-md'
            : 'bg-gray-100 text-gray-900 rounded-bl-md'
        }`}
      >
        <p className="break-words">{message.content}</p>
        
        <div
          className={`flex items-center justify-end gap-1 mt-1 ${
            isOwnMessage ? 'text-blue-100' : 'text-gray-400'
          }`}
        >
          <span className="text-xs">
            {format(new Date(message.createdAt), 'HH:mm')}
          </span>
          {isOwnMessage && getStatusIcon()}
        </div>
      </div>
    </div>
  );
}

interface TypingIndicatorProps {
  userName: string;
}

export function TypingIndicator({ userName }: TypingIndicatorProps) {
  return (
    <div className="flex items-center gap-2 text-gray-500 text-sm">
      <span>{userName}</span>
      <span>is typing</span>
      <div className="flex gap-1">
        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
      </div>
    </div>
  );
}
