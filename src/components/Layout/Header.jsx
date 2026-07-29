import React from 'react';
import { HiOutlineBars3, HiOutlineSignal } from 'react-icons/hi2';
import useChatStore from '../../store/chatStore';

const Header = () => {
  const { sidebarOpen, setSidebarOpen, ragMode, sessionId } = useChatStore();

  return (
    <header className="h-14 border-b border-border bg-white flex items-center px-4 gap-3 flex-shrink-0">
      {!sidebarOpen && (
        <button
          onClick={() => setSidebarOpen(true)}
          className="p-2 rounded-lg hover:bg-surface-darker text-text-secondary transition-colors"
        >
          <HiOutlineBars3 className="w-5 h-5" />
        </button>
      )}

      <div className="flex items-center gap-2">
        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-odia-primary to-odia-dark flex items-center justify-center lg:hidden">
          <span className="text-white text-xs font-bold odia-text">ଓ</span>
        </div>
        <div>
          <h1 className="text-sm font-semibold text-text-primary">
            <span className="odia-text">ଓଡ଼ିଆ AI ଚାଟବଟ</span>
          </h1>
        </div>
      </div>

      <div className="ml-auto flex items-center gap-2">
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-surface-darker text-xs">
          <HiOutlineSignal className="w-3.5 h-3.5 text-success" />
          <span className="text-text-secondary capitalize">
            {ragMode === 'multiquery' ? 'Multi-Query' : 'Simple'} RAG
          </span>
        </div>
        {sessionId && (
          <div className="hidden sm:flex items-center px-2.5 py-1 rounded-lg bg-surface-darker text-xs text-text-muted">
            {sessionId.slice(0, 8)}...
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
