import React, { useRef, useEffect } from 'react';
import ChatMessage from './ChatMessage';
import TypingIndicator from './TypingIndicator';
import { useConversationStore } from '@/features/conversation/store/conversation.store';

const EmptyState = () => (
  <div className="flex-1 flex items-center justify-center p-8">
    <div className="text-center max-w-md">
      <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-odia-primary to-odia-dark
        flex items-center justify-center mx-auto mb-6 shadow-lg shadow-odia-primary/20">
        <span className="text-white text-3xl font-bold odia-text">ଓ</span>
      </div>
      <h2 className="text-xl font-semibold text-text-primary mb-2 odia-text">
        ଓଡ଼ିଆ AI ଚାଟବଟ
      </h2>
      <p className="text-sm text-text-secondary mb-6">
        Odia RAG Chatbot — Ask questions about your documents in Odia or English
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {[
          { odia: 'ଏହି ଡକ୍ୟୁମେଣ୍ଟ କ\'ଣ ବିଷୟରେ?', en: 'What is this document about?' },
          { odia: 'ମୋତେ ସାରାଂଶ ଦିଅ', en: 'Give me a summary' },
          { odia: 'ମୁଖ୍ୟ ବିଷୟ କ\'ଣ?', en: 'What are the main topics?' },
          { odia: 'ଅଧିକ ବିସ୍ତୃତ ବର୍ଣ୍ଣନା ଦିଅ', en: 'Give more detail' },
        ].map((q, i) => (
          <button
            key={i}
            className="text-left p-3 rounded-xl border border-border hover:border-odia-primary
              hover:bg-odia-bg transition-all group"
            onClick={() => {
              const store = useConversationStore.getState();
              const input = document.querySelector('textarea');
              if (input) {
                const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
                  window.HTMLTextAreaElement.prototype, 'value'
                ).set;
                nativeInputValueSetter.call(input, q.odia);
                input.dispatchEvent(new Event('input', { bubbles: true }));
                input.focus();
              }
            }}
          >
            <p className="text-sm font-medium text-text-primary group-hover:text-odia-dark odia-text">
              {q.odia}
            </p>
            <p className="text-xs text-text-muted mt-0.5">{q.en}</p>
          </button>
        ))}
      </div>
    </div>
  </div>
);

const ChatArea = () => {
  const { messages, isLoading, error, clearError } = useConversationStore();
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  if (messages.length === 0 && !isLoading) {
    return <EmptyState />;
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 lg:p-6 space-y-4">
      {messages.map((msg) => (
        <ChatMessage key={msg.id} message={msg} />
      ))}

      {isLoading && <TypingIndicator />}

      {error && (
        <div className="flex justify-center animate-slide-up">
          <div className="bg-error/10 border border-error/20 text-error px-4 py-3 rounded-xl text-sm max-w-md flex items-center gap-3">
            <span className="flex-1">{error}</span>
            <button onClick={clearError} className="text-error hover:text-error/80 text-xs font-medium">
              Dismiss
            </button>
          </div>
        </div>
      )}

      <div ref={bottomRef} />
    </div>
  );
};

export default ChatArea;
