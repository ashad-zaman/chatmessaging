import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuthStore } from '@/app/chat/store';
import { MessageSquare, Settings, LogOut, User } from 'lucide-react';

export function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuthStore();

  return (
    <div className="w-64 bg-gray-900 text-white h-screen flex flex-col">
      <div className="p-4 border-b border-gray-800">
        <h1 className="text-xl font-bold flex items-center gap-2">
          <MessageSquare className="w-6 h-6" />
          ChatApp
        </h1>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        <Link
          href="/chat"
          className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
            pathname === '/chat' ? 'bg-blue-600' : 'hover:bg-gray-800'
          }`}
        >
          <MessageSquare className="w-5 h-5" />
          Conversations
        </Link>

        <Link
          href="/chat/profile"
          className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
            pathname === '/chat/profile' ? 'bg-blue-600' : 'hover:bg-gray-800'
          }`}
        >
          <User className="w-5 h-5" />
          Profile
        </Link>

        <Link
          href="/chat/settings"
          className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
            pathname === '/chat/settings' ? 'bg-blue-600' : 'hover:bg-gray-800'
          }`}
        >
          <Settings className="w-5 h-5" />
          Settings
        </Link>
      </nav>

      <div className="p-4 border-t border-gray-800">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center">
            {user?.avatarUrl ? (
              <img src={user.avatarUrl} alt="" className="w-10 h-10 rounded-full" />
            ) : (
              <span className="text-lg font-medium">
                {user?.displayName?.[0] || user?.username?.[0] || 'U'}
              </span>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium truncate">{user?.displayName || user?.username}</p>
            <p className="text-sm text-gray-400 truncate">{user?.email}</p>
          </div>
        </div>
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-red-600 transition-colors text-red-400 hover:text-white"
        >
          <LogOut className="w-5 h-5" />
          Logout
        </button>
      </div>
    </div>
  );
}
