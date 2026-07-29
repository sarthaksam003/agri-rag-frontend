import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import {
  HiOutlineSpeakerWave,
  HiOutlineStopCircle,
  HiOutlineDocumentText,
  HiOutlineChevronDown,
  HiOutlineChevronUp,
  HiOutlineClipboard,
  HiOutlineCheck,
  HiOutlineMicrophone,
  HiOutlineMagnifyingGlass,
} from 'react-icons/hi2';
import { synthesizeSpeech } from '../../services/api';
import { useAudioPlayer } from '../../hooks/useAudioPlayer';
import useChatStore from '../../store/chatStore';

const ChatMessage = ({ message }) => {
  const isUser = message.role === 'user';
  const [showSources, setShowSources] = useState(false);
  const [showQueries, setShowQueries] = useState(false);
  const [copied, setCopied] = useState(false);
  const [ttsLoading, setTtsLoading] = useState(false);

  const { playAudio, stopAudio } = useAudioPlayer();
  const { isPlayingAudio, currentAudioId, tenantId, sourceLanguage } = useChatStore();

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleTTS = async () => {
    if (isPlayingAudio && currentAudioId === message.id) {
      stopAudio();
      return;
    }

    setTtsLoading(true);
    try {
      const textToSpeak = message.translatedResponse || message.content;
      const lang = message.sourceLanguage || sourceLanguage || 'or';
      const blob = await synthesizeSpeech(textToSpeak, lang, 'female', tenantId);
      playAudio(blob, message.id);
    } catch (err) {
      console.error('TTS failed:', err);
    } finally {
      setTtsLoading(false);
    }
  };

  const isPlaying = isPlayingAudio && currentAudioId === message.id;

  // Render hallucination-aware content
  const renderContent = () => {
    if (message.hallucinationSpans && message.content) {
      // Simple approach: just render markdown with a warning badge
      return (
        <div>
          <div className="markdown-content">
            <ReactMarkdown>{message.content}</ReactMarkdown>
          </div>
          {Object.keys(message.hallucinationSpans).length > 0 && (
            <div className="mt-2 flex items-center gap-1.5 text-xs text-warning">
              <span className="w-1.5 h-1.5 rounded-full bg-warning" />
              Possible hallucinations detected
            </div>
          )}
        </div>
      );
    }
    return (
      <div className="markdown-content">
        <ReactMarkdown>{message.content}</ReactMarkdown>
      </div>
    );
  };

  if (isUser) {
    return (
      <div className="flex justify-end animate-slide-up">
        <div className="max-w-[75%] lg:max-w-[60%]">
          <div className="bg-odia-primary text-white px-4 py-3 rounded-2xl rounded-br-md shadow-sm">
            <p className="text-sm leading-relaxed odia-text">{message.content}</p>
            {message.isVoice && (
              <div className="flex items-center gap-1 mt-1.5 text-white/70 text-xs">
                <HiOutlineMicrophone className="w-3 h-3" />
                <span>Voice message</span>
              </div>
            )}
            {message.translatedMessage && message.translatedMessage !== message.content && (
              <div className="mt-2 pt-2 border-t border-white/20 text-xs text-white/80">
                <span className="font-medium">EN: </span>
                {message.translatedMessage}
              </div>
            )}
          </div>
          <p className="text-xs text-text-muted mt-1 text-right px-1">
            {new Date(message.timestamp).toLocaleTimeString('en-IN', {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-start animate-slide-up">
      <div className="max-w-[80%] lg:max-w-[70%]">
        {/* Bot avatar */}
        <div className="flex items-center gap-2 mb-1.5">
          <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-odia-primary to-odia-dark flex items-center justify-center">
            <span className="text-white text-xs font-bold odia-text">ଓ</span>
          </div>
          <span className="text-xs font-medium text-text-secondary">ଓଡ଼ିଆ AI</span>
          {message.retrievalStrategy && message.retrievalStrategy !== 'simple' && (
            <span className="text-xs px-1.5 py-0.5 rounded bg-primary/10 text-primary font-medium">
              {message.retrievalStrategy}
            </span>
          )}
        </div>

        {/* Message body */}
        <div className="bg-surface-darker px-4 py-3 rounded-2xl rounded-tl-md shadow-sm">
          <div className="text-sm text-text-primary leading-relaxed">
            {renderContent()}
          </div>

          {/* Translated response (for voice) */}
          {message.translatedResponse && (
            <div className="mt-3 pt-3 border-t border-border">
              <p className="text-xs font-medium text-text-muted mb-1">ଓଡ଼ିଆ ଅନୁବାଦ:</p>
              <p className="text-sm odia-text text-text-primary">{message.translatedResponse}</p>
            </div>
          )}

          {/* Metadata bar */}
          {message.retrievedCount > 0 && (
            <div className="mt-2 pt-2 border-t border-border/50 flex items-center gap-3 text-xs text-text-muted">
              <span className="flex items-center gap-1">
                <HiOutlineDocumentText className="w-3.5 h-3.5" />
                {message.retrievedCount} sources
              </span>
              {message.chunks?.length > 0 && (
                <span>{message.chunks.length} chunks</span>
              )}
            </div>
          )}
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-1 mt-1.5 px-1">
          <p className="text-xs text-text-muted mr-2">
            {new Date(message.timestamp).toLocaleTimeString('en-IN', {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </p>

          <button
            onClick={handleTTS}
            disabled={ttsLoading}
            className={`p-1.5 rounded-lg transition-colors ${
              isPlaying
                ? 'bg-odia-primary text-white'
                : 'hover:bg-surface-darker text-text-muted hover:text-text-secondary'
            }`}
            title={isPlaying ? 'Stop' : 'Listen'}
          >
            {ttsLoading ? (
              <div className="w-4 h-4 border-2 border-text-muted border-t-transparent rounded-full animate-spin" />
            ) : isPlaying ? (
              <HiOutlineStopCircle className="w-4 h-4" />
            ) : (
              <HiOutlineSpeakerWave className="w-4 h-4" />
            )}
          </button>

          <button
            onClick={handleCopy}
            className="p-1.5 rounded-lg hover:bg-surface-darker text-text-muted hover:text-text-secondary transition-colors"
            title="Copy"
          >
            {copied ? (
              <HiOutlineCheck className="w-4 h-4 text-success" />
            ) : (
              <HiOutlineClipboard className="w-4 h-4" />
            )}
          </button>

          {message.chunks?.length > 0 && (
            <button
              onClick={() => setShowSources(!showSources)}
              className="flex items-center gap-1 p-1.5 rounded-lg hover:bg-surface-darker
                text-text-muted hover:text-text-secondary transition-colors text-xs"
            >
              <HiOutlineDocumentText className="w-4 h-4" />
              Sources
              {showSources ? (
                <HiOutlineChevronUp className="w-3 h-3" />
              ) : (
                <HiOutlineChevronDown className="w-3 h-3" />
              )}
            </button>
          )}

          {message.generatedQueries?.length > 0 && (
            <button
              onClick={() => setShowQueries(!showQueries)}
              className="flex items-center gap-1 p-1.5 rounded-lg hover:bg-surface-darker
                text-text-muted hover:text-text-secondary transition-colors text-xs"
            >
              <HiOutlineMagnifyingGlass className="w-4 h-4" />
              Queries
              {showQueries ? (
                <HiOutlineChevronUp className="w-3 h-3" />
              ) : (
                <HiOutlineChevronDown className="w-3 h-3" />
              )}
            </button>
          )}
        </div>

        {/* Sources panel */}
        {showSources && message.chunks?.length > 0 && (
          <div className="mt-2 mx-1 space-y-2 animate-fade-in">
            {message.chunks.map((chunk, idx) => (
              <div
                key={idx}
                className="bg-white border border-border rounded-xl p-3 text-xs text-text-secondary leading-relaxed"
              >
                <div className="flex items-center gap-1.5 mb-1.5 text-text-muted">
                  <HiOutlineDocumentText className="w-3.5 h-3.5" />
                  <span className="font-medium">Chunk {idx + 1}</span>
                  {message.chunkRetrievalInfo?.[idx]?.retrieval_score && (
                    <span className="ml-auto text-odia-dark">
                      Score: {message.chunkRetrievalInfo[idx].retrieval_score.toFixed(3)}
                    </span>
                  )}
                </div>
                <p className="line-clamp-4">{chunk}</p>
              </div>
            ))}
          </div>
        )}

        {/* Generated queries panel */}
        {showQueries && message.generatedQueries?.length > 0 && (
          <div className="mt-2 mx-1 bg-white border border-border rounded-xl p-3 animate-fade-in">
            <p className="text-xs font-medium text-text-muted mb-2 flex items-center gap-1.5">
              <HiOutlineMagnifyingGlass className="w-3.5 h-3.5" />
              Generated Sub-queries
            </p>
            <ul className="space-y-1">
              {message.generatedQueries.map((q, idx) => (
                <li key={idx} className="text-xs text-text-secondary flex items-start gap-2">
                  <span className="text-odia-primary font-medium mt-0.5">{idx + 1}.</span>
                  <span>{q}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatMessage;