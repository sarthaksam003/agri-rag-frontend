import React from 'react';

const TypingIndicator = () => (
  <div className="flex justify-start animate-slide-up">
    <div className="max-w-[60%]">
      <div className="flex items-center gap-2 mb-1.5">
        <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-odia-primary to-odia-dark flex items-center justify-center">
          <span className="text-white text-xs font-bold odia-text">ଓ</span>
        </div>
        <span className="text-xs font-medium text-text-secondary">ଓଡ଼ିଆ AI</span>
      </div>
      <div className="bg-surface-darker px-5 py-4 rounded-2xl rounded-tl-md">
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-text-muted typing-dot" />
          <div className="w-2 h-2 rounded-full bg-text-muted typing-dot" />
          <div className="w-2 h-2 rounded-full bg-text-muted typing-dot" />
        </div>
      </div>
      <p className="text-xs text-text-muted mt-1 px-1 odia-text">ଚିନ୍ତା କରୁଛି... (Thinking...)</p>
    </div>
  </div>
);

export default TypingIndicator;
