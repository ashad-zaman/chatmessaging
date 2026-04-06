import { ConversationWithMeta, User } from '@/types';
import { format } from 'date-fns';
import { MessageCircle, Check, CheckCheck } from 'lucide-react';

interface ConversationItemProps {
  conversation: ConversationWithMeta;
  isActive: boolean;
  onClick: () => void;
  currentUserId: string;
}

export function ConversationItem({
  conversation,
  isActive,
  onClick,
  currentUserId,
}: ConversationItemProps) {
  const otherParticipants = conversation.participants.filter(
    (p) => p.id !== currentUserId
  );
  const displayName = conversation.conversation.name || otherParticipants.map((p) => p.displayName || p.username).join(', ');
  const avatarUrl = conversation.conversation.avatarUrl || otherParticipants[0]?.avatarUrl;
  const lastMessage = conversation.lastMessage;

  const getStatusIcon = (status: string) => {
    if (status === 'read') {
      return <CheckCheck className="w-4 h-4 text-blue-500" />;
    }
    if (status === 'delivered' || status === 'sent') {
      return <CheckCheck className="w-4 h-4 text-gray-400" />;
    }
    return <Check className="w-4 h-4 text-gray-400" />;
  };

  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 p-4 text-left transition-colors ${
        isActive ? 'bg-blue-50 border-r-4 border-blue-600' : 'hover:bg-gray-50'
      }`}
    >
      <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center flex-shrink-0">
        {avatarUrl ? (
          <img src={avatarUrl} alt="" className="w-12 h-12 rounded-full" />
        ) : (
          <span className="text-lg font-medium text-gray-600">
            {displayName[0]?.toUpperCase()}
          </span>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <p className={`font-medium truncate ${isActive ? 'text-blue-900' : ''}`}>
            {displayName}
          </p>
          {lastMessage && (
            <span className="text-xs text-gray-400">
              {format(new Date(lastMessage.createdAt), 'HH:mm')}
            </span>
          )}
        </div>

        <div className="flex items-center justify-between mt-1">
          <p className="text-sm text-gray-500 truncate flex items-center gap-1">
            {lastMessage && (
              <>
                {lastMessage.senderId === currentUserId && getStatusIcon(lastMessage.status)}
              </>
            )}
            {lastMessage?.content || 'No messages yet'}
          </p>
          {conversation.unreadCount > 0 && (
            <span className="bg-blue-600 text-white text-xs font-medium px-2 py-0.5 rounded-full">
              {conversation.unreadCount}
            </span>
          )}
        </div>
      </div>
    </button>
  );
}
