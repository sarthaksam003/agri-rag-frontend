import React from 'react';
import Sidebar from './components/Layout/Sidebar';
import Header from './components/Layout/Header';
import ChatArea from './components/Chat/ChatArea';
import ChatInput from './components/Chat/ChatInput';
import DocumentsPanel from './components/Documents/DocumentsPanel';
import useChatStore from './store/chatStore';

const App = () => {
  const { activeTab } = useChatStore();

  return (
    <div className="h-full flex bg-white">
      {/* Sidebar */}
      <Sidebar />

      {/* Main content */}
      <main className="flex-1 flex flex-col min-w-0 h-full">
        <Header />

        {activeTab === 'chat' && (
          <>
            <ChatArea />
            <ChatInput />
          </>
        )}

        {activeTab === 'documents' && <DocumentsPanel />}

        {activeTab === 'sessions' && (
          <div className="flex-1 flex items-center justify-center p-8 text-center">
            <div>
              <p className="text-text-secondary text-sm">
                ← Select a session from the sidebar to view its history
              </p>
              <p className="text-text-muted text-xs mt-2">
                Or start a new chat
              </p>
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="flex-1 flex items-center justify-center p-8 text-center">
            <div>
              <p className="text-text-secondary text-sm">
                ← Configure settings in the sidebar
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
