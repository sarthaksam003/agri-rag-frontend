import React, { useState, useRef, useEffect } from 'react';
import {
  HiOutlinePaperAirplane,
  HiOutlineMicrophone,
  HiOutlineStopCircle,
  HiOutlineXCircle,
} from 'react-icons/hi2';
import { useAudioRecorder } from '../../hooks/useAudioRecorder';
import { useConversationStore } from '../../features/conversation/store/conversation.store';
import LanguagePicker from './LanguagePicker';
import {
  sendChatMessage,
  sendMultiqueryChatMessage,
  sendVoiceChatMessage,
} from '../../services/api';
import { useSettingsStore } from '@/features/settings/store/settings.store';

const ChatInput = () => {
  const [input, setInput] = useState('');
  const textareaRef = useRef(null);
  const { isRecording, duration, startRecording, stopRecording, cancelRecording } =
    useAudioRecorder();

  const {
    isLoading,
    setLoading,
    addUserMessage,
    addBotMessage,
    addVoiceUserMessage,
    sessionId,
    ragMode,
    sourceLanguage,  // ← use from store
    setError,
  } = useConversationStore();
  const { tenantId, maxQueries } = useSettingsStore();

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 150)}px`;
    }
  }, [input]);

  const handleSendText = async () => {
    const text = input.trim();
    if (!text || isLoading) return;

    setInput('');
    addUserMessage(text);
    setLoading(true);

    try {
      let data;
      if (ragMode === 'Multi-query') {
        data = await sendMultiqueryChatMessage(text, sessionId, tenantId, true, maxQueries);
      } else {
        data = await sendChatMessage(text, sessionId, tenantId);
      }
      addBotMessage(data);
    } catch (err) {
      const errMsg =
        err.response?.data?.error || err.response?.data?.detail || 'Failed to send message';
      setError(errMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleVoiceSend = async () => {
    if (isRecording) {
      const audioBlob = await stopRecording();
      if (!audioBlob) return;

      setLoading(true);
      try {
        const data = await sendVoiceChatMessage(
          audioBlob,
          sourceLanguage,  // ← dynamic language
          sessionId,
          ragMode,
          tenantId
        );
        addVoiceUserMessage(data);
        addBotMessage(data);
      } catch (err) {
        const errMsg =
          err.response?.data?.error || 'Voice processing failed';
        setError(errMsg);
      } finally {
        setLoading(false);
      }
    } else {
      const started = await startRecording();
      if (!started) {
        setError('Microphone access is required for voice input');
      }
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendText();
    }
  };

  const formatDuration = (sec) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="border-t border-border bg-white p-3 lg:p-4">
      {/* Recording indicator */}
      {isRecording && (
        <div className="flex items-center gap-3 mb-3 px-3 py-2 bg-error/5 rounded-xl animate-fade-in">
          <div className="relative">
            <div className="w-3 h-3 rounded-full bg-error" />
            <div className="absolute inset-0 w-3 h-3 rounded-full bg-error recording-pulse" />
          </div>
          <span className="text-sm font-medium text-error">Recording</span>
          <span className="text-sm text-text-secondary font-mono">{formatDuration(duration)}</span>
          <button
            onClick={cancelRecording}
            className="ml-auto p-1.5 rounded-lg hover:bg-error/10 text-error transition-colors"
            title="Cancel"
          >
            <HiOutlineXCircle className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Input area */}
      <div className="flex items-end gap-2">
        {/* Language picker */}
        <LanguagePicker />

        <div className="flex-1 relative">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={
              sourceLanguage === 'or'
                ? 'ଏଠାରେ ଟାଇପ୍ କରନ୍ତୁ... (Type here...)'
                : sourceLanguage === 'hi'
                  ? 'यहाँ टाइप करें... (Type here...)'
                  : 'Type your message here...'
            }
            disabled={isLoading || isRecording}
            rows={1}
            className="w-full px-4 py-3 text-sm bg-surface-darker border border-border rounded-2xl
              resize-none focus:outline-none focus:ring-2 focus:ring-odia-primary/30 focus:border-odia-primary
              disabled:opacity-50 disabled:cursor-not-allowed placeholder:text-text-muted"
          />
        </div>

        {/* Voice button */}
        <button
          onClick={handleVoiceSend}
          disabled={isLoading && !isRecording}
          className={`p-3 rounded-2xl transition-all duration-200 flex-shrink-0
            ${isRecording
              ? 'bg-error text-white hover:bg-error/90 shadow-lg shadow-error/25'
              : 'bg-surface-darker text-text-secondary hover:bg-surface-dark hover:text-odia-dark border border-border'
            }
            disabled:opacity-50 disabled:cursor-not-allowed`}
          title={isRecording ? 'Stop & Send' : 'Start Voice Recording'}
        >
          {isRecording ? (
            <HiOutlineStopCircle className="w-5 h-5" />
          ) : (
            <HiOutlineMicrophone className="w-5 h-5" />
          )}
        </button>

        {/* Send button */}
        <button
          onClick={handleSendText}
          disabled={!input.trim() || isLoading}
          className="p-3 rounded-2xl bg-odia-primary text-white hover:bg-odia-dark transition-all
            duration-200 shadow-lg shadow-odia-primary/25 disabled:opacity-50
            disabled:cursor-not-allowed disabled:shadow-none flex-shrink-0"
          title="Send Message"
        >
          <HiOutlinePaperAirplane className="w-5 h-5" />
        </button>
      </div>

      {/* Mode indicator */}
      <div className="flex items-center justify-between mt-2 px-2">
        <p className="text-xs text-text-muted">
          {ragMode === 'multiquery' ? '🔍 Multiquery RAG' : '💬 Simple RAG'} •
          Text chat works in any language • Voice/TTS uses selected language
        </p>
        {sessionId && (
          <p className="text-xs text-text-muted truncate max-w-[200px]">
            Session: {sessionId.slice(0, 12)}...
          </p>
        )}
      </div>
    </div>
  );
};

export default ChatInput;
