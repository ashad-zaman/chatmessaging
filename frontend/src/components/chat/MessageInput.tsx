import { useState, useRef, useEffect, KeyboardEvent } from 'react';
import { Send, Paperclip, Smile } from 'lucide-react';
import { useChatStore } from '@/app/chat/store';

interface MessageInputProps {
  conversationId: string;
}

export function MessageInput({ conversationId }: MessageInputProps) {
  const [content, setContent] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const { sendMessage, startTyping, stopTyping } = useChatStore();

  const handleTyping = () => {
    if (!isTyping) {
      setIsTyping(true);
      startTyping(conversationId);
    }

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
      stopTyping(conversationId);
    }, 2000);
  };

  const handleSend = () => {
    if (!content.trim()) return;

    const clientMessageId = `temp-${Date.now()}-${Math.random()}`;
    sendMessage(conversationId, content.trim(), clientMessageId);
    setContent('');
    
    if (isTyping) {
      setIsTyping(false);
      stopTyping(conversationId);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="border-t border-gray-200 p-4 bg-white">
      <div className="flex items-end gap-2">
        <button className="p-2 text-gray-500 hover:text-gray-700 transition-colors">
          <Paperclip className="w-5 h-5" />
        </button>
        
        <div className="flex-1">
          <textarea
            value={content}
            onChange={(e) => {
              setContent(e.target.value);
              handleTyping();
            }}
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
            rows={1}
            className="w-full px-4 py-2 border border-gray-300 rounded-2xl resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            style={{ maxHeight: '120px', minHeight: '42px' }}
          />
        </div>
        
        <button className="p-2 text-gray-500 hover:text-gray-700 transition-colors">
          <Smile className="w-5 h-5" />
        </button>
        
        <button
          onClick={handleSend}
          disabled={!content.trim()}
          className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Send className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
